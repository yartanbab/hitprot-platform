using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;

namespace Apya.Platform.Projects;

/// <summary>
/// PRJ-08 · Proje göstergeleri (ürün kararı, 2026-10-13). Görme ve yönetme ayrı izinlerdir.
/// Gerçekleşen değer saklanmaz: en son tarihli ölçümden okunur.
/// </summary>
[Authorize(PlatformPermissions.Projects.ViewIndicators)]
public class ProjectIndicatorAppService : ApplicationService, IProjectIndicatorAppService
{
    private readonly IRepository<ProjectIndicator, Guid> _indicatorRepository;
    private readonly IRepository<ProjectIndicatorEntry, Guid> _entryRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectWorkStep, Guid> _workStepRepository;
    private readonly IRepository<DocumentFile, Guid> _documentFileRepository;

    public ProjectIndicatorAppService(
        IRepository<ProjectIndicator, Guid> indicatorRepository,
        IRepository<ProjectIndicatorEntry, Guid> entryRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<ProjectWorkStep, Guid> workStepRepository,
        IRepository<DocumentFile, Guid> documentFileRepository)
    {
        _indicatorRepository = indicatorRepository;
        _entryRepository = entryRepository;
        _projectRepository = projectRepository;
        _workStepRepository = workStepRepository;
        _documentFileRepository = documentFileRepository;
    }

    public virtual async Task<List<ProjectIndicatorDto>> GetListAsync(Guid projectId)
    {
        // Proje bu kiracıda görülebiliyor mu — yoksa EntityNotFoundException.
        await _projectRepository.GetAsync(projectId);

        var indicators = await _indicatorRepository.GetListAsync(i => i.ProjectId == projectId);
        if (indicators.Count == 0)
        {
            return new List<ProjectIndicatorDto>();
        }

        var ids = indicators.Select(i => i.Id).ToList();
        var entries = (await _entryRepository.GetListAsync(e => ids.Contains(e.IndicatorId)))
            .GroupBy(e => e.IndicatorId)
            .ToDictionary(g => g.Key, g => g.ToList());

        var stepIds = indicators.Where(i => i.WorkStepId.HasValue).Select(i => i.WorkStepId!.Value).Distinct().ToList();
        var stepNames = stepIds.Count == 0
            ? new Dictionary<Guid, string>()
            : (await _workStepRepository.GetListAsync(s => stepIds.Contains(s.Id))).ToDictionary(s => s.Id, s => s.Name);

        var today = Clock.Now.Date;
        return indicators
            .OrderBy(i => i.Name, StringComparer.CurrentCulture)
            .Select(i => ToDto(i, entries.GetValueOrDefault(i.Id), stepNames, today))
            .ToList();
    }

    [Authorize(PlatformPermissions.Projects.ManageIndicators)]
    public virtual async Task<ProjectIndicatorDto> CreateAsync(CreateUpdateProjectIndicatorDto input)
    {
        await _projectRepository.GetAsync(input.ProjectId);
        var stepNames = await EnsureWorkStepAsync(input.WorkStepId, input.ProjectId);

        var indicator = new ProjectIndicator(
            GuidGenerator.Create(), CurrentTenant.Id, input.ProjectId,
            input.Name, input.Unit, input.BaselineValue, input.TargetValue, input.TargetDate, input.WorkStepId);
        await _indicatorRepository.InsertAsync(indicator, autoSave: true);

        return ToDto(indicator, null, stepNames, Clock.Now.Date);
    }

    [Authorize(PlatformPermissions.Projects.ManageIndicators)]
    public virtual async Task<ProjectIndicatorDto> UpdateAsync(Guid id, CreateUpdateProjectIndicatorDto input)
    {
        var indicator = await _indicatorRepository.GetAsync(id);
        var stepNames = await EnsureWorkStepAsync(input.WorkStepId, indicator.ProjectId);

        indicator.Update(input.Name, input.Unit, input.BaselineValue, input.TargetValue, input.TargetDate, input.WorkStepId);
        await _indicatorRepository.UpdateAsync(indicator, autoSave: true);

        var entries = await _entryRepository.GetListAsync(e => e.IndicatorId == id);
        return ToDto(indicator, entries, stepNames, Clock.Now.Date);
    }

    [Authorize(PlatformPermissions.Projects.ManageIndicators)]
    public virtual async Task DeleteAsync(Guid id)
    {
        var indicator = await _indicatorRepository.GetAsync(id);

        // Ölçümler göstergeyle birlikte gider (yumuşak silmede FK basamaklaması çalışmaz).
        await _entryRepository.DeleteAsync(e => e.IndicatorId == id);
        await _indicatorRepository.DeleteAsync(indicator);
    }

    public virtual async Task<List<ProjectIndicatorEntryDto>> GetEntriesAsync(Guid indicatorId)
    {
        await _indicatorRepository.GetAsync(indicatorId);

        var entries = (await _entryRepository.GetListAsync(e => e.IndicatorId == indicatorId))
            .OrderByDescending(e => e.EntryDate).ThenByDescending(e => e.CreationTime)
            .ToList();

        var names = new Dictionary<Guid, string>();
        var fileIds = entries.Where(e => e.DocumentFileId.HasValue).Select(e => e.DocumentFileId!.Value).Distinct().ToList();
        if (fileIds.Count > 0 && await AuthorizationService.IsGrantedAsync(PlatformPermissions.Documents.Default))
        {
            names = (await _documentFileRepository.GetListAsync(f => fileIds.Contains(f.Id)))
                .ToDictionary(f => f.Id, f => f.DisplayName);
        }

        return entries.Select(e =>
        {
            var dto = ObjectMapper.Map<ProjectIndicatorEntry, ProjectIndicatorEntryDto>(e);
            dto.DocumentName = e.DocumentFileId.HasValue ? names.GetValueOrDefault(e.DocumentFileId.Value) : null;
            return dto;
        }).ToList();
    }

    [Authorize(PlatformPermissions.Projects.ManageIndicators)]
    public virtual async Task<ProjectIndicatorEntryDto> AddEntryAsync(Guid indicatorId, CreateProjectIndicatorEntryDto input)
    {
        var indicator = await _indicatorRepository.GetAsync(indicatorId);

        string? documentName = null;
        if (input.DocumentFileId.HasValue)
        {
            // Kanıt belgesi: belge görme izni şart, belge aynı kiracıda ve aynı projede olmalı.
            await AuthorizationService.CheckAsync(PlatformPermissions.Documents.Default);
            var file = await _documentFileRepository.GetAsync(input.DocumentFileId.Value);
            if (file.ProjectId.HasValue && file.ProjectId != indicator.ProjectId)
            {
                throw new BusinessException(PlatformDomainErrorCodes.ProjectIndicatorDocumentMismatch)
                    .WithData("DocumentFileId", file.Id)
                    .WithData("ProjectId", indicator.ProjectId);
            }
            documentName = file.DisplayName;
        }

        var entry = new ProjectIndicatorEntry(
            GuidGenerator.Create(), CurrentTenant.Id, indicatorId,
            input.EntryDate, input.Value, input.Note, input.DocumentFileId);
        await _entryRepository.InsertAsync(entry, autoSave: true);

        var dto = ObjectMapper.Map<ProjectIndicatorEntry, ProjectIndicatorEntryDto>(entry);
        dto.DocumentName = documentName;
        return dto;
    }

    [Authorize(PlatformPermissions.Projects.ManageIndicators)]
    public virtual async Task DeleteEntryAsync(Guid entryId)
    {
        var entry = await _entryRepository.GetAsync(entryId);
        await _entryRepository.DeleteAsync(entry);
    }

    /// <summary>İş adımı verilmişse göstergenin projesine ait olmalıdır; adını da döndürür.</summary>
    private async Task<Dictionary<Guid, string>> EnsureWorkStepAsync(Guid? workStepId, Guid projectId)
    {
        var names = new Dictionary<Guid, string>();
        if (!workStepId.HasValue)
        {
            return names;
        }

        var step = await _workStepRepository.GetAsync(workStepId.Value);
        if (step.ProjectId != projectId)
        {
            throw new BusinessException(PlatformDomainErrorCodes.ProjectIndicatorWorkStepMismatch)
                .WithData("WorkStepId", step.Id)
                .WithData("ProjectId", projectId);
        }

        names[step.Id] = step.Name;
        return names;
    }

    private ProjectIndicatorDto ToDto(
        ProjectIndicator indicator,
        List<ProjectIndicatorEntry>? entries,
        IReadOnlyDictionary<Guid, string> stepNames,
        DateTime today)
    {
        var dto = ObjectMapper.Map<ProjectIndicator, ProjectIndicatorDto>(indicator);

        var latest = entries?
            .OrderByDescending(e => e.EntryDate).ThenByDescending(e => e.CreationTime)
            .FirstOrDefault();

        dto.WorkStepName = indicator.WorkStepId.HasValue ? stepNames.GetValueOrDefault(indicator.WorkStepId.Value) : null;
        dto.EntryCount = entries?.Count ?? 0;
        dto.LastEntryDate = latest?.EntryDate;
        dto.CurrentValue = latest?.Value ?? indicator.BaselineValue;
        dto.ProgressPercent = ProjectIndicatorProgress.Percent(indicator.BaselineValue, indicator.TargetValue, dto.CurrentValue);
        dto.Status = ProjectIndicatorProgress.Status(dto.ProgressPercent, indicator.TargetDate, today);
        return dto;
    }
}
