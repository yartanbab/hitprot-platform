using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görev şablonları. İş kuralı TaskTemplateManager'da; burada yalnız yetki + DTO
/// çevirisi var (TaskAppService/TaskManager ile aynı ayrım).
/// </summary>
[Authorize(PlatformPermissions.Tasks.Default)]
public class TaskTemplateAppService : ApplicationService, ITaskTemplateAppService
{
    private readonly IRepository<TaskTemplate, Guid> _templateRepository;
    private readonly TaskTemplateManager _templateManager;
    private readonly ITaskAppService _taskAppService;

    public TaskTemplateAppService(
        IRepository<TaskTemplate, Guid> templateRepository,
        TaskTemplateManager templateManager,
        ITaskAppService taskAppService)
    {
        _templateRepository = templateRepository;
        _templateManager = templateManager;
        _taskAppService = taskAppService;
    }

    public async Task<List<TaskTemplateListDto>> GetListAsync()
    {
        // Koleksiyonlar sayım için gerekli → navigasyonlarla birlikte çekilir.
        var queryable = await _templateRepository.WithDetailsAsync(x => x.Items, x => x.Features);
        var list = queryable.OrderBy(x => x.Name).ToList();

        return list.Select(t => new TaskTemplateListDto
        {
            Id = t.Id,
            Name = t.Name,
            Description = t.Description,
            TaskTitle = t.TaskTitle,
            ItemCount = t.Items.Count,
            FeatureCount = t.Features.Count,
        }).ToList();
    }

    public async Task<TaskTemplateDto> GetAsync(Guid id)
    {
        var queryable = await _templateRepository.WithDetailsAsync(x => x.Items, x => x.Features, x => x.Tags);
        var t = queryable.FirstOrDefault(x => x.Id == id)
                ?? throw new Volo.Abp.Domain.Entities.EntityNotFoundException(typeof(TaskTemplate), id);

        return new TaskTemplateDto
        {
            Id = t.Id,
            Name = t.Name,
            Description = t.Description,
            TaskTitle = t.TaskTitle,
            TaskDescription = t.TaskDescription,
            Priority = t.Priority,
            EstimatedHours = t.EstimatedHours,
            TaskType = t.TaskType,
            Items = t.Items.OrderBy(i => i.Order).Select(i => i.Title).ToList(),
            Features = t.Features.Select(f => f.FeatureCode).ToList(),
            Tags = t.Tags.Select(x => x.TagName).ToList(),
        };
    }

    [Authorize(PlatformPermissions.Tasks.Create)]
    public async Task<TaskTemplateListDto> CreateFromTaskAsync(CreateTaskTemplateFromTaskDto input)
    {
        var template = await _templateManager.CreateFromTaskAsync(input.TaskId, input.Name, input.Description);

        return new TaskTemplateListDto
        {
            Id = template.Id,
            Name = template.Name,
            Description = template.Description,
            TaskTitle = template.TaskTitle,
            ItemCount = template.Items.Count,
            FeatureCount = template.Features.Count,
        };
    }

    [Authorize(PlatformPermissions.Tasks.Create)]
    public async Task<TaskDto> ApplyAsync(ApplyTaskTemplateDto input)
    {
        var task = await _templateManager.ApplyAsync(
            input.TemplateId,
            input.ProjectId,
            input.AssigneeId,
            input.StartDate,
            input.DueDate);

        // Oluşan görevi mevcut okuma yolundan döneriz — alt görev/etiket gibi
        // türetilmiş alanlar TaskAppService.GetAsync'te zaten dolduruluyor.
        return await _taskAppService.GetAsync(task.Id);
    }

    [Authorize(PlatformPermissions.Tasks.Create)]
    public async Task DeleteAsync(Guid id)
    {
        await _templateRepository.DeleteAsync(id);
    }
}
