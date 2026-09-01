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
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Users;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 2c · Host başvuru pipeline konsolu.
///
/// <para>SÜTUNLAR ÇAĞRIDAN GELİR: tek bir çağrı seçiliyse ve programın aşama
/// şablonu varsa sütunlar o şablonun adımlarıdır. Şablon yoksa ya da "tüm
/// çağrılar" görünümündeysek dört değerli <see cref="GrantApplicationStage"/>
/// enum'una düşülür — farklı şablonlardaki başvuruları tek panoda göstermenin
/// tutarlı bir yolu yok.</para>
///
/// <para>🔴 Pano kiracılar arası okur: <c>IDataFilter</c> kapatılır. Katalog
/// satırlarında (<c>Grant</c>/<c>GrantCall</c>) <c>TenantId == null</c> koşulu
/// ELLE konur; başvurular kiracıya aittir ve bilinçli olarak filtresiz okunur.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantPipelineAppService : ApplicationService, IGrantPipelineAppService
{
    /// <summary>Kalan gün bu eşiğin altındaysa kart riskli sayılır (tasarım 2c: 20 gün).</summary>
    public const int RiskyDayThreshold = 20;

    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantApplicationActivity, Guid> _activityRepo;
    private readonly IRepository<GrantApplicationBudgetLine, Guid> _budgetRepo;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepo;
    private readonly IRepository<GrantStageTemplate, Guid> _templateRepo;
    private readonly IRepository<GrantStageTemplateStep, Guid> _stepRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantPipelineAppService(
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantApplicationActivity, Guid> activityRepo,
        IRepository<GrantApplicationBudgetLine, Guid> budgetRepo,
        IRepository<GrantApplicationDocument, Guid> docRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantEligibleCostItem, Guid> costItemRepo,
        IRepository<GrantStageTemplate, Guid> templateRepo,
        IRepository<GrantStageTemplateStep, Guid> stepRepo,
        ITenantRepository tenantRepo,
        IIdentityUserRepository userRepo,
        ICurrentTenant currentTenant,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _appRepo = appRepo;
        _activityRepo = activityRepo;
        _budgetRepo = budgetRepo;
        _docRepo = docRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _costItemRepo = costItemRepo;
        _templateRepo = templateRepo;
        _stepRepo = stepRepo;
        _tenantRepo = tenantRepo;
        _userRepo = userRepo;
        _currentTenant = currentTenant;
        _mtFilter = mtFilter;
    }

    public async Task<GrantPipelineBoardDto> GetBoardAsync(Guid? grantCallId, Guid? assignedUserId)
    {
        EnsureHostContext();
        return await BuildAsync(grantCallId, assignedUserId);
    }

    public async Task<GrantPipelineBoardDto> MoveAsync(MoveGrantApplicationInput input)
    {
        EnsureHostContext();
        var application = await GetApplicationAsync(input.ApplicationId);
        string? movedTo = null;

        if (input.StepId.HasValue)
        {
            // Adım gerçekten bu başvurunun şablonuna ait mi — istemciden gelen
            // kimlikle başka programın adımına taşımak mümkün olmamalı.
            var stepIds = await GetTemplateStepIdsAsync(application);
            if (!stepIds.Contains(input.StepId.Value))
            {
                throw new BusinessException(PlatformDomainErrorCodes.GrantPipelineStepNotInTemplate);
            }
            application.MoveToStep(input.StepId.Value);
            movedTo = (await _stepRepo.FirstOrDefaultAsync(x => x.Id == input.StepId.Value))?.Name;
        }
        else if (input.Stage.HasValue)
        {
            application.AdvanceStage(input.Stage.Value);
            movedTo = input.Stage.Value.ToString();
        }

        await _appRepo.UpdateAsync(application, autoSave: true);
        // 2d'deki süreç akışı bu kaydı okur; taşıma başka yerde iz bırakmıyor.
        await LogAsync(application, GrantActivityKind.StageMoved, movedTo);

        var call = await GetCallAsync(application.GrantCallId);
        return await BuildAsync(call.Id, null);
    }

    public async Task<GrantPipelineBoardDto> AssignAsync(AssignGrantApplicationInput input)
    {
        EnsureHostContext();
        var application = await GetApplicationAsync(input.ApplicationId);

        string? assigneeName = null;

        if (input.UserId.HasValue)
        {
            // Danışman host kullanıcısı olmalı; kiracı kullanıcısı atanamaz.
            var user = await _userRepo.FindAsync(input.UserId.Value)
                       ?? throw new EntityNotFoundException(typeof(IdentityUser), input.UserId.Value);
            if (user.TenantId != null)
            {
                throw new BusinessException(PlatformDomainErrorCodes.GrantPipelineAssigneeNotHost);
            }
            assigneeName = $"{user.Name} {user.Surname}".Trim();
        }

        application.AssignTo(input.UserId);
        await _appRepo.UpdateAsync(application, autoSave: true);
        await LogAsync(application, GrantActivityKind.AssignmentChanged, assigneeName);

        var call = await GetCallAsync(application.GrantCallId);
        return await BuildAsync(call.Id, null);
    }

    // ------------------------------------------------------------------ yardımcılar

    private async Task LogAsync(GrantApplication application, GrantActivityKind kind, string? context)
    {
        await _activityRepo.InsertAsync(new GrantApplicationActivity(
            GuidGenerator.Create(), application.TenantId, application.Id, kind,
            CurrentUser.GetId(),
            CurrentUser.Name.IsNullOrWhiteSpace()
                ? (CurrentUser.UserName ?? "?")
                : $"{CurrentUser.Name} {CurrentUser.SurName}".Trim(),
            GrantPartyRole.Danisman, context), autoSave: true);
    }

    private void EnsureHostContext()
    {
        if (_currentTenant.Id != null)
        {
            // Kiracı bu panoyu görmemeli: başka firmaların başvuruları görünürdü.
            throw new AbpAuthorizationException();
        }
    }

    private async Task<GrantApplication> GetApplicationAsync(Guid id)
    {
        using (_mtFilter.Disable())
        {
            return await _appRepo.FirstOrDefaultAsync(a => a.Id == id)
                   ?? throw new EntityNotFoundException(typeof(GrantApplication), id);
        }
    }

    private async Task<GrantCall> GetCallAsync(Guid id)
    {
        using (_mtFilter.Disable())
        {
            return await _callRepo.FirstOrDefaultAsync(c => c.Id == id && c.TenantId == null)
                   ?? throw new EntityNotFoundException(typeof(GrantCall), id);
        }
    }

    private async Task<List<Guid>> GetTemplateStepIdsAsync(GrantApplication application)
    {
        var call = await GetCallAsync(application.GrantCallId);
        using (_mtFilter.Disable())
        {
            var grant = await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null);
            if (grant?.StageTemplateId == null) { return new List<Guid>(); }

            return (await _stepRepo.GetListAsync(
                    s => s.StageTemplateId == grant.StageTemplateId.Value && s.TenantId == null))
                .Select(s => s.Id).ToList();
        }
    }

    private async Task<GrantPipelineBoardDto> BuildAsync(Guid? grantCallId, Guid? assignedUserId)
    {
        var dto = new GrantPipelineBoardDto
        {
            GrantCallId = grantCallId,
            RiskyDayThreshold = RiskyDayThreshold
        };

        using (_mtFilter.Disable())
        {
            var calls = grantCallId.HasValue
                ? new List<GrantCall> { await GetCallAsync(grantCallId.Value) }
                : (await _callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik && c.TenantId == null));

            if (calls.Count == 0) { return dto; }

            var callIds = calls.Select(c => c.Id).ToList();
            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id) && g.TenantId == null))
                .ToDictionary(g => g.Id);

            // --- Sütunlar ---
            List<GrantStageTemplateStep> steps = new();
            if (grantCallId.HasValue)
            {
                var grant = grants.GetValueOrDefault(calls[0].GrantId);
                dto.GrantCallLabel = grant == null ? calls[0].Period : $"{grant.Name} · {calls[0].Period}";

                if (grant?.StageTemplateId != null)
                {
                    var template = await _templateRepo.FirstOrDefaultAsync(
                        t => t.Id == grant.StageTemplateId.Value && t.TenantId == null);
                    steps = (await _stepRepo.GetListAsync(
                            s => s.StageTemplateId == grant.StageTemplateId.Value && s.TenantId == null))
                        .OrderBy(s => s.Order).ToList();

                    if (steps.Count > 0)
                    {
                        dto.IsTemplateDriven = true;
                        dto.StageTemplateId = template?.Id;
                        dto.StageTemplateName = template?.Name;
                    }
                }
            }

            dto.Columns = dto.IsTemplateDriven
                ? steps.Select(s => new GrantPipelineColumnDto
                {
                    StepId = s.Id, Name = s.Name, Order = s.Order, Owner = s.Owner
                }).ToList()
                : Enum.GetValues<GrantApplicationStage>().Select(s => new GrantPipelineColumnDto
                {
                    Stage = s, Name = s.ToString(), Order = (int)s, Owner = GrantPartyRole.Ortak
                }).ToList();

            // --- Kartlar ---
            var applications = (await _appRepo.GetListAsync(a => callIds.Contains(a.GrantCallId)))
                .Where(a => assignedUserId == null || a.AssignedUserId == assignedUserId)
                .ToList();
            if (applications.Count == 0) { return await WithConsultantsAsync(dto); }

            var appIds = applications.Select(a => a.Id).ToList();
            var tenantIds = applications.Where(a => a.TenantId.HasValue)
                .Select(a => a.TenantId!.Value).Distinct().ToList();
            var tenants = (await _tenantRepo.GetListAsync())
                .Where(t => tenantIds.Contains(t.Id)).ToDictionary(t => t.Id, t => t.Name);

            var budgetLines = (await _budgetRepo.GetListAsync(l => appIds.Contains(l.GrantApplicationId)))
                .GroupBy(l => l.GrantApplicationId).ToDictionary(g => g.Key, g => g.ToList());
            var documents = (await _docRepo.GetListAsync(d => appIds.Contains(d.GrantApplicationId)))
                .GroupBy(d => d.GrantApplicationId).ToDictionary(g => g.Key, g => g.ToList());
            var costItems = (await _costItemRepo.GetListAsync(c => grantIds.Contains(c.GrantId) && c.TenantId == null))
                .GroupBy(c => c.GrantId).ToDictionary(g => g.Key, g => g.ToList());

            var users = (await _userRepo.GetListAsync()).ToDictionary(u => u.Id);
            var today = Clock.Now.Date;

            foreach (var application in applications)
            {
                var call = calls.First(c => c.Id == application.GrantCallId);
                var grant = grants.GetValueOrDefault(call.GrantId);
                var card = new GrantPipelineCardDto
                {
                    ApplicationId = application.Id,
                    TenantId = application.TenantId ?? Guid.Empty,
                    FirmName = application.TenantId.HasValue
                        ? tenants.GetValueOrDefault(application.TenantId.Value, "—")
                        : "—",
                    GrantName = grant?.Name ?? "—",
                    Period = call.Period,
                    ApprovedAmount = application.ApprovedAmount,
                    DaysRemaining = call.Deadline.HasValue
                        ? (int)(call.Deadline.Value.Date - today).TotalDays
                        : null,
                    PendingParty = application.PendingParty,
                    AssignedUserId = application.AssignedUserId,
                    IsSubmitted = application.SubmittedAt.HasValue
                };

                if (application.AssignedUserId.HasValue
                    && users.TryGetValue(application.AssignedUserId.Value, out var assignee))
                {
                    card.AssignedUserName = $"{assignee.Name} {assignee.Surname}".Trim();
                }

                // Talep edilen destek, 2a'daki hesaplayıcının AYNISIYLA bulunur;
                // panoda başka bir rakam çıkmasın.
                if (budgetLines.TryGetValue(application.Id, out var lines) && grant != null)
                {
                    var items = costItems.GetValueOrDefault(grant.Id, new List<GrantEligibleCostItem>());
                    var byKind = lines.ToDictionary(l => l.Kind);
                    var budget = GrantBudgetCalculator.Calculate(
                        items.Select(i => new GrantBudgetCalculator.LineInput(
                            i.Kind, byKind.TryGetValue(i.Kind, out var l) ? l.Amount : 0m, i.LimitPercent)),
                        grant.SupportRatePercent, grant.MaxAmount);
                    card.RequestedSupport = budget.TotalSupport;
                }

                var docs = documents.GetValueOrDefault(application.Id, new List<GrantApplicationDocument>());
                card.MissingDocumentCount = docs.Count(d => d.Obligation == GrantDocumentObligation.Zorunlu
                                                            && d.Status != GrantDocumentStatus.Onaylandi);

                card.Risks = BuildRisks(card);
                Place(dto, application, card);
            }

            // --- Özet şerit ---
            dto.RiskyCount = dto.Columns.SelectMany(c => c.Cards)
                .Count(c => c.Risks.Any(r => r.Kind is GrantPipelineRisk.DeadlineNear or GrantPipelineRisk.DeadlinePassed));
            var waiting = dto.Columns.SelectMany(c => c.Cards).Where(c => c.MissingDocumentCount > 0).ToList();
            dto.WaitingDocumentApplicationCount = waiting.Count;
            dto.WaitingDocumentCount = waiting.Sum(c => c.MissingDocumentCount);
            dto.ReadyForProjectCount = dto.Columns.Count == 0
                ? 0
                : dto.Columns[^1].Cards.Count;
            dto.PipelineAmount = dto.Columns.SelectMany(c => c.Cards)
                .Sum(c => c.ApprovedAmount ?? c.RequestedSupport ?? 0m);
        }

        return await WithConsultantsAsync(dto);
    }

    /// <summary>Kartı doğru sütuna koyar; eşleşme yoksa İLK sütuna düşer.</summary>
    private static void Place(GrantPipelineBoardDto dto, GrantApplication application, GrantPipelineCardDto card)
    {
        GrantPipelineColumnDto? column = null;

        if (dto.IsTemplateDriven && application.CurrentStepId.HasValue)
        {
            column = dto.Columns.FirstOrDefault(c => c.StepId == application.CurrentStepId.Value);
        }
        else if (!dto.IsTemplateDriven)
        {
            column = dto.Columns.FirstOrDefault(c => c.Stage == application.Stage);
        }

        // Şablon yeni bağlandıysa başvurunun adımı henüz yok — ilk sütunda başlar.
        (column ?? dto.Columns.FirstOrDefault())?.Cards.Add(card);
    }

    private static List<GrantPipelineRiskDto> BuildRisks(GrantPipelineCardDto card)
    {
        var risks = new List<GrantPipelineRiskDto>();

        if (card.DaysRemaining is < 0 && !card.IsSubmitted)
        {
            risks.Add(new GrantPipelineRiskDto { Kind = GrantPipelineRisk.DeadlinePassed, Value = -card.DaysRemaining.Value });
        }
        else if (card.DaysRemaining is >= 0 and < RiskyDayThreshold)
        {
            risks.Add(new GrantPipelineRiskDto { Kind = GrantPipelineRisk.DeadlineNear, Value = card.DaysRemaining.Value });
        }

        if (card.MissingDocumentCount > 0)
        {
            risks.Add(new GrantPipelineRiskDto
            {
                Kind = GrantPipelineRisk.MissingDocuments, Value = card.MissingDocumentCount
            });
        }

        if (card.PendingParty == GrantPartyRole.Firma && !card.IsSubmitted)
        {
            risks.Add(new GrantPipelineRiskDto { Kind = GrantPipelineRisk.WaitingOnFirm });
        }

        if (card.AssignedUserId == null)
        {
            risks.Add(new GrantPipelineRiskDto { Kind = GrantPipelineRisk.Unassigned });
        }

        return risks;
    }

    private async Task<GrantPipelineBoardDto> WithConsultantsAsync(GrantPipelineBoardDto dto)
    {
        var users = await _userRepo.GetListAsync();
        var counts = dto.Columns.SelectMany(c => c.Cards)
            .Where(c => c.AssignedUserId.HasValue)
            .GroupBy(c => c.AssignedUserId!.Value)
            .ToDictionary(g => g.Key, g => g.Count());

        dto.Consultants = users
            .Where(u => u.IsActive)
            .Select(u => new GrantPipelineConsultantDto
            {
                UserId = u.Id,
                Name = $"{u.Name} {u.Surname}".Trim(),
                AssignedCount = counts.GetValueOrDefault(u.Id)
            })
            .OrderBy(u => u.Name)
            .ToList();

        return dto;
    }
}
