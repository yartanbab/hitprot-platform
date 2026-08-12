using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görev &lt;-&gt; şablon dönüşümünün iş kuralı. AppService yalnız yetki + DTO
/// çevirisi yapar (TaskManager ile aynı ayrım).
/// </summary>
public class TaskTemplateManager : DomainService
{
    private readonly IRepository<TaskTemplate, Guid> _templateRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly IRepository<TaskFeatureAssignment, Guid> _featureRepository;
    private readonly IRepository<TaskTagAssignment, Guid> _taskTagRepository;
    private readonly IRepository<Tag, Guid> _tagRepository;
    private readonly TaskManager _taskManager;

    public TaskTemplateManager(
        IRepository<TaskTemplate, Guid> templateRepository,
        IRepository<TaskItem, Guid> taskRepository,
        IRepository<TaskFeatureAssignment, Guid> featureRepository,
        IRepository<TaskTagAssignment, Guid> taskTagRepository,
        IRepository<Tag, Guid> tagRepository,
        TaskManager taskManager)
    {
        _templateRepository = templateRepository;
        _taskRepository = taskRepository;
        _featureRepository = featureRepository;
        _taskTagRepository = taskTagRepository;
        _tagRepository = tagRepository;
        _taskManager = taskManager;
    }

    /// <summary>
    /// Var olan bir görevden şablon çıkarır: iskelet alanlar + alt görev başlıkları
    /// + eklenmiş özellik sekmeleri + etiket adları.
    /// Sorumlu/tarih/durum bilinçli olarak KOPYALANMAZ (bkz. TaskTemplate notu).
    /// </summary>
    public async Task<TaskTemplate> CreateFromTaskAsync(Guid taskId, string name, string? description = null)
    {
        var task = await _taskRepository.GetAsync(taskId);

        var template = new TaskTemplate(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            name,
            task.Title,
            task.Priority,
            description,
            task.Description,
            task.EstimatedHours,
            task.TaskType);

        // Alt görevler — yalnız başlık + sıra. Silinmişler repository filtresiyle zaten dışarıda.
        var subTasks = await _taskRepository.GetListAsync(t => t.ParentTaskId == taskId);
        var order = 0;
        foreach (var sub in subTasks.OrderBy(t => t.Number))
        {
            template.AddItem(GuidGenerator.Create(), sub.Title, order++);
        }

        // Eklenmiş özellik sekmeleri
        var features = await _featureRepository.GetListAsync(f => f.TaskId == taskId);
        foreach (var code in features.Select(f => f.FeatureCode).Distinct())
        {
            template.AddFeature(GuidGenerator.Create(), code);
        }

        // Etiketler — ADA göre saklanır (bkz. TaskTemplateTag notu)
        var assignments = await _taskTagRepository.GetListAsync(a => a.TaskId == taskId);
        if (assignments.Count > 0)
        {
            var tagIds = assignments.Select(a => a.TagId).ToHashSet();
            var tags = await _tagRepository.GetListAsync(t => tagIds.Contains(t.Id));
            foreach (var tagName in tags.Select(t => t.Name).Distinct(StringComparer.OrdinalIgnoreCase))
            {
                template.AddTag(GuidGenerator.Create(), tagName);
            }
        }

        return await _templateRepository.InsertAsync(template, autoSave: true);
    }

    /// <summary>
    /// Şablondan yeni bir görev üretir. Şablon yalnız İSKELET verir; sorumlu, tarih
    /// ve proje çağıran tarafından belirlenir (şablonda tutulmaz).
    /// </summary>
    /// <param name="startDate">Yeni görevin başlangıcı — verilmezse bugün.</param>
    public async Task<TaskItem> ApplyAsync(
        Guid templateId,
        Guid? projectId = null,
        Guid? assigneeId = null,
        DateTime? startDate = null,
        DateTime? dueDate = null)
    {
        var template = await _templateRepository.GetAsync(templateId);

        var task = new TaskItem(
            GuidGenerator.Create(),
            template.TaskTitle,
            projectId: projectId,
            parentTaskId: null,
            description: template.TaskDescription,
            startDate: startDate ?? Clock.Now.Date,
            dueDate: dueDate,
            priority: template.Priority,
            assigneeId: assigneeId,
            isPrivate: false,
            tenantId: CurrentTenant.Id,
            now: Clock.Now);
        task.AssignNumber(await _taskManager.GetNextNumberAsync());
        task.SetPlanningInfo(template.EstimatedHours, template.TaskType, sprint: null);

        // autoSave: sonraki GetNextNumberAsync doğru MAX'ı görsün (TaskManager.Clone deseni)
        await _taskRepository.InsertAsync(task, autoSave: true);

        // Alt görevler — yalnız başlık; sorumlu/tarih üst görevden türetilmez, boş kalır
        foreach (var item in template.Items.OrderBy(i => i.Order))
        {
            var sub = new TaskItem(
                GuidGenerator.Create(),
                item.Title,
                projectId: projectId,
                parentTaskId: task.Id,
                startDate: task.StartDate,
                tenantId: CurrentTenant.Id,
                now: Clock.Now);
            sub.AssignNumber(await _taskManager.GetNextNumberAsync());
            await _taskRepository.InsertAsync(sub, autoSave: true);
        }

        // Özellik sekmeleri — autoSave: aynı UoW içinde hemen okunabilsinler
        // (autoSave'siz ekleme sonrası GetList boş döner; bilinen tuzak).
        foreach (var f in template.Features)
        {
            await _featureRepository.InsertAsync(
                new TaskFeatureAssignment(GuidGenerator.Create(), task.Id, f.FeatureCode), autoSave: true);
        }

        // Etiketler — ada göre bul, yoksa oluştur (TaskAppService.SyncTagsAsync ile aynı
        // case-insensitive in-memory eşleşme; Postgres'te '=' case-sensitive olduğu için şart).
        if (template.Tags.Count > 0)
        {
            var existing = await _tagRepository.GetListAsync();
            foreach (var t in template.Tags)
            {
                var tag = existing.FirstOrDefault(x => string.Equals(x.Name, t.TagName, StringComparison.OrdinalIgnoreCase));
                if (tag == null)
                {
                    tag = new Tag(GuidGenerator.Create(), t.TagName, CurrentTenant.Id);
                    await _tagRepository.InsertAsync(tag);
                    existing.Add(tag);
                }
                await _taskTagRepository.InsertAsync(
                    new TaskTagAssignment(GuidGenerator.Create(), task.Id, tag.Id), autoSave: true);
            }
        }

        return task;
    }
}
