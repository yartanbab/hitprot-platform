using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;

namespace Apya.Platform.Projects;

/// <summary>
/// Proje iş adımları. Okuma Projects.Default, yazma Projects.Edit iznine bağlı —
/// iş adımı projenin planı olduğu için doküman izniyle değil proje izniyle yönetilir.
/// </summary>
[Authorize(PlatformPermissions.Projects.Default)]
public class ProjectWorkStepAppService : ApplicationService, IProjectWorkStepAppService
{
    private readonly IRepository<ProjectWorkStep, Guid> _workStepRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<DocumentFile, Guid> _documentFileRepository;

    public ProjectWorkStepAppService(
        IRepository<ProjectWorkStep, Guid> workStepRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<DocumentFile, Guid> documentFileRepository)
    {
        _workStepRepository = workStepRepository;
        _projectRepository = projectRepository;
        _documentFileRepository = documentFileRepository;
    }

    public virtual async Task<List<ProjectWorkStepDto>> GetListAsync(Guid? projectId = null)
    {
        var queryable = await _workStepRepository.GetQueryableAsync();
        queryable = queryable.AsNoTracking();

        if (projectId.HasValue)
        {
            queryable = queryable.Where(x => x.ProjectId == projectId.Value);
        }

        var steps = await AsyncExecuter.ToListAsync(
            queryable.OrderBy(x => x.ProjectId).ThenBy(x => x.Order));

        if (steps.Count == 0)
        {
            return new List<ProjectWorkStepDto>();
        }

        var dtos = ObjectMapper.Map<List<ProjectWorkStep>, List<ProjectWorkStepDto>>(steps);

        // Proje adlarını tek sorguda doldur (N+1 yok).
        var projectIds = steps.Select(x => x.ProjectId).Distinct().ToList();
        var projectQueryable = await _projectRepository.GetQueryableAsync();
        var projectNames = (await AsyncExecuter.ToListAsync(
                projectQueryable.AsNoTracking().Where(p => projectIds.Contains(p.Id)).Select(p => new { p.Id, p.Name })))
            .ToDictionary(k => k.Id, v => v.Name);

        // Ağaçtaki satır sayaçları — tek GROUP BY.
        var stepIds = steps.Select(x => x.Id).ToList();
        var fileQueryable = await _documentFileRepository.GetQueryableAsync();
        var counts = (await AsyncExecuter.ToListAsync(
                fileQueryable.AsNoTracking()
                    .Where(f => f.WorkStepId != null && stepIds.Contains(f.WorkStepId!.Value))
                    .GroupBy(f => f.WorkStepId!.Value)
                    .Select(g => new { StepId = g.Key, Count = g.Count() })))
            .ToDictionary(k => k.StepId, v => v.Count);

        foreach (var dto in dtos)
        {
            dto.ProjectName = projectNames.TryGetValue(dto.ProjectId, out var name) ? name : null;
            dto.DocumentCount = counts.TryGetValue(dto.Id, out var count) ? count : 0;
        }

        return dtos;
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public virtual async Task<ProjectWorkStepDto> CreateAsync(CreateUpdateProjectWorkStepDto input)
    {
        // Proje bu kiracıda görülebiliyor mu — yoksa EntityNotFoundException.
        await _projectRepository.GetAsync(input.ProjectId);

        var step = new ProjectWorkStep(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            input.ProjectId,
            input.Order,
            input.Name,
            input.StartDate,
            input.EndDate);
        step.SetProgress(input.ProgressPercent);

        await _workStepRepository.InsertAsync(step);

        return ObjectMapper.Map<ProjectWorkStep, ProjectWorkStepDto>(step);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public virtual async Task<ProjectWorkStepDto> UpdateAsync(Guid id, CreateUpdateProjectWorkStepDto input)
    {
        var step = await _workStepRepository.GetAsync(id);
        step.Update(input.Order, input.Name, input.StartDate, input.EndDate, input.ProgressPercent);
        await _workStepRepository.UpdateAsync(step);

        return ObjectMapper.Map<ProjectWorkStep, ProjectWorkStepDto>(step);
    }

    [Authorize(PlatformPermissions.Projects.Delete)]
    public virtual async Task DeleteAsync(Guid id)
    {
        var step = await _workStepRepository.GetAsync(id);

        // Adıma bağlı belgeler öksüz kalmasın: bağ koparılır, belge silinmez.
        var fileQueryable = await _documentFileRepository.GetQueryableAsync();
        var linked = await AsyncExecuter.ToListAsync(fileQueryable.Where(f => f.WorkStepId == id));
        foreach (var file in linked)
        {
            file.SetClassification(file.DocumentTypeId, file.ProjectId, null);
        }

        if (linked.Count > 0)
        {
            await _documentFileRepository.UpdateManyAsync(linked);
        }

        await _workStepRepository.DeleteAsync(step);
    }
}
