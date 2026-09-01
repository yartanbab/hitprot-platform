using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 3b · Aşama Şablonu Düzenleyicisi. Şablonlar host kataloğudur (TenantId null);
/// program → şablon bağı <see cref="Grant.StageTemplateId"/> üzerindedir.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantStageTemplateAppService : ApplicationService, IGrantStageTemplateAppService
{
    private readonly IRepository<GrantStageTemplate, Guid> _templateRepo;
    private readonly IRepository<GrantStageTemplateStep, Guid> _stepRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<GrantApplication, Guid> _applicationRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantStageTemplateAppService(
        IRepository<GrantStageTemplate, Guid> templateRepo,
        IRepository<GrantStageTemplateStep, Guid> stepRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<GrantApplication, Guid> applicationRepo,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _templateRepo = templateRepo;
        _stepRepo = stepRepo;
        _grantRepo = grantRepo;
        _callRepo = callRepo;
        _applicationRepo = applicationRepo;
        _mtFilter = mtFilter;
    }

    public async Task<List<GrantStageTemplateDto>> GetListAsync()
    {
        EnsureHostContext();

        var templates = (await _templateRepo.GetListAsync())
            .OrderByDescending(t => t.IsDefault)
            .ThenBy(t => t.Name)
            .ToList();
        if (templates.Count == 0)
        {
            return new List<GrantStageTemplateDto>();
        }

        var ids = templates.Select(t => t.Id).ToList();
        var stepsByTemplate = (await _stepRepo.GetListAsync(s => ids.Contains(s.StageTemplateId)))
            .GroupBy(s => s.StageTemplateId)
            .ToDictionary(g => g.Key, g => g.OrderBy(s => s.Order).ToList());
        var grants = await _grantRepo.GetListAsync(g => g.StageTemplateId != null);
        var openByCall = await CountOpenApplicationsAsync();
        var callsByGrant = (await _callRepo.GetListAsync())
            .GroupBy(c => c.GrantId)
            .ToDictionary(g => g.Key, g => g.ToList());

        return templates
            .Select(t => Map(t, stepsByTemplate, grants, callsByGrant, openByCall))
            .ToList();
    }

    public async Task<GrantStageTemplateDto> GetAsync(Guid id)
    {
        EnsureHostContext();
        var list = await GetListAsync();
        return list.FirstOrDefault(t => t.Id == id)
               ?? throw new EntityNotFoundException(typeof(GrantStageTemplate), id);
    }

    public async Task<GrantStageTemplateDto> CreateAsync(CreateUpdateGrantStageTemplateDto input)
    {
        EnsureHostContext();

        var template = new GrantStageTemplate(GuidGenerator.Create(), input.Name)
        {
            Description = input.Description
        };
        await _templateRepo.InsertAsync(template, autoSave: true);

        await ApplyDefaultFlagAsync(template, input.IsDefault);
        await SyncStepsAsync(template.Id, input.Steps);

        return await GetAsync(template.Id);
    }

    public async Task<GrantStageTemplateDto> UpdateAsync(Guid id, CreateUpdateGrantStageTemplateDto input)
    {
        EnsureHostContext();

        var template = await _templateRepo.GetAsync(id);
        template.SetName(input.Name);
        template.Description = input.Description;
        await _templateRepo.UpdateAsync(template, autoSave: true);

        await ApplyDefaultFlagAsync(template, input.IsDefault);
        await SyncStepsAsync(id, input.Steps);

        return await GetAsync(id);
    }

    public async Task DeleteAsync(Guid id)
    {
        EnsureHostContext();

        var usedBy = (int)await _grantRepo.CountAsync(g => g.StageTemplateId == id);
        if (usedBy > 0)
        {
            // Sessizce bağı koparmak yerine reddet: hangi programın şablonsuz kaldığı
            // host'a görünmez olurdu.
            throw new BusinessException(PlatformDomainErrorCodes.GrantStageTemplateInUse)
                .WithData("GrantCount", usedBy);
        }

        await _stepRepo.DeleteManyAsync(await _stepRepo.GetListAsync(s => s.StageTemplateId == id));
        await _templateRepo.DeleteAsync(id);
    }

    /// <summary>Varsayılan en fazla bir tane olur; yeni varsayılan diğerlerini düşürür.</summary>
    private async Task ApplyDefaultFlagAsync(GrantStageTemplate template, bool isDefault)
    {
        if (!isDefault)
        {
            if (template.IsDefault)
            {
                template.IsDefault = false;
                await _templateRepo.UpdateAsync(template, autoSave: true);
            }
            return;
        }

        foreach (var other in await _templateRepo.GetListAsync(t => t.IsDefault && t.Id != template.Id))
        {
            other.IsDefault = false;
            await _templateRepo.UpdateAsync(other);
        }

        template.IsDefault = true;
        await _templateRepo.UpdateAsync(template, autoSave: true);
    }

    private async Task SyncStepsAsync(Guid templateId, List<GrantStageTemplateStepDto> steps)
    {
        // 🔴 autoSave ŞART: Create/Update aynı UoW içinde hemen GetAsync ile geri okuyor.
        // Flush edilmemiş satırlar o okumada GÖRÜNMEZ ve şablon adımsız dönerdi
        // (FirmProfileAppService'deki aynı tuzak, orada girdiden dönerek çözülmüştü).
        var existing = await _stepRepo.GetListAsync(s => s.StageTemplateId == templateId);
        await _stepRepo.DeleteManyAsync(existing, autoSave: true);

        var order = 0;
        foreach (var step in steps.Where(s => !string.IsNullOrWhiteSpace(s.Name)))
        {
            await _stepRepo.InsertAsync(new GrantStageTemplateStep(
                GuidGenerator.Create(), templateId, order, step.Name)
            {
                Note = step.Note,
                Owner = step.Owner,
                RequiredDocumentsNote = step.RequiredDocumentsNote,
                CompletionCondition = step.CompletionCondition,
                ReminderDays = step.ReminderDays
            }, autoSave: true);
            order++;
        }
    }

    /// <summary>
    /// Çağrı başına AÇIK başvuru sayısı. Başvurular kiracıya aittir; host bu sayıyı
    /// üretmek için multi-tenant filtresini BİLEREK tüm kiracılara açar (TenantId == null
    /// koşulu konursa host'un kendi satırları gelir ve sayaç daima 0 çıkar).
    /// Açık = ödeme aşamasına gelmemiş başvuru.
    /// </summary>
    private async Task<Dictionary<Guid, int>> CountOpenApplicationsAsync()
    {
        using (_mtFilter.Disable())
        {
            return (await _applicationRepo.GetListAsync(a => a.Stage != GrantApplicationStage.Odeme))
                .GroupBy(a => a.GrantCallId)
                .ToDictionary(g => g.Key, g => g.Count());
        }
    }

    private static GrantStageTemplateDto Map(
        GrantStageTemplate template,
        IReadOnlyDictionary<Guid, List<GrantStageTemplateStep>> stepsByTemplate,
        IReadOnlyCollection<Grant> grantsWithTemplate,
        IReadOnlyDictionary<Guid, List<GrantCall>> callsByGrant,
        IReadOnlyDictionary<Guid, int> openByCall)
    {
        var grants = grantsWithTemplate.Where(g => g.StageTemplateId == template.Id).ToList();

        var calls = grants
            .SelectMany(g => callsByGrant.TryGetValue(g.Id, out var cs)
                ? cs.Select(c => new GrantStageTemplateCallDto
                {
                    GrantCallId = c.Id,
                    Label = $"{g.Name} · {c.Period}",
                    OpenApplicationCount = openByCall.TryGetValue(c.Id, out var n) ? n : 0
                })
                : Enumerable.Empty<GrantStageTemplateCallDto>())
            .OrderByDescending(c => c.OpenApplicationCount)
            .ThenBy(c => c.Label)
            .ToList();

        return new GrantStageTemplateDto
        {
            Id = template.Id,
            Name = template.Name,
            Description = template.Description,
            IsDefault = template.IsDefault,
            Steps = (stepsByTemplate.TryGetValue(template.Id, out var steps)
                    ? steps
                    : new List<GrantStageTemplateStep>())
                .Select(s => new GrantStageTemplateStepDto
                {
                    Order = s.Order,
                    Name = s.Name,
                    Note = s.Note,
                    Owner = s.Owner,
                    RequiredDocumentsNote = s.RequiredDocumentsNote,
                    CompletionCondition = s.CompletionCondition,
                    ReminderDays = s.ReminderDays
                })
                .ToList(),
            GrantCount = grants.Count,
            OpenApplicationCount = calls.Sum(c => c.OpenApplicationCount),
            Calls = calls
        };
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Aşama şablonları yalnızca host bağlamında yönetilebilir.");
        }
    }
}
