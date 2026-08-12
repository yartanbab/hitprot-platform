using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks;

/// <summary>
/// Tekrar eden iş akışlarını bir kez tanımlayıp yeni görevlerde yeniden kullanmak
/// için görev şablonu. Bir görevden çıkarılır (<see cref="TaskTemplateManager"/>)
/// ve "Yeni Görev" akışında uygulanır.
///
/// KOPYALANMAYANLAR bilinçli: sorumlu, tarihler ve durum şablona GİRMEZ — bunlar
/// her yeni görevde farklıdır, şablona konursa her seferinde temizlenmesi gerekirdi.
/// </summary>
public class TaskTemplate : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    /// <summary>Şablonun kendi adı — listede bunu görürsün ("Yeni müşteri kurulumu").</summary>
    public string Name { get; private set; } = null!;

    /// <summary>Şablonun ne işe yaradığı (opsiyonel, listede alt satır).</summary>
    public string? Description { get; private set; }

    // ── Üretilecek görevin iskeleti ──
    public string TaskTitle { get; private set; } = null!;
    public string? TaskDescription { get; private set; }
    public TaskPriority Priority { get; private set; }
    public decimal? EstimatedHours { get; private set; }
    public string? TaskType { get; private set; }

    public virtual ICollection<TaskTemplateItem> Items { get; private set; } = new List<TaskTemplateItem>();
    public virtual ICollection<TaskTemplateFeature> Features { get; private set; } = new List<TaskTemplateFeature>();
    public virtual ICollection<TaskTemplateTag> Tags { get; private set; } = new List<TaskTemplateTag>();

    protected TaskTemplate() { }

    public TaskTemplate(
        Guid id,
        Guid? tenantId,
        string name,
        string taskTitle,
        TaskPriority priority,
        string? description = null,
        string? taskDescription = null,
        decimal? estimatedHours = null,
        string? taskType = null) : base(id)
    {
        TenantId = tenantId;
        SetName(name);
        SetTaskTitle(taskTitle);
        Priority = priority;
        Description = description;
        TaskDescription = taskDescription;
        EstimatedHours = estimatedHours;
        TaskType = taskType;
    }

    public void SetName(string name)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: TaskTemplateConsts.MaxNameLength);
    }

    public void SetTaskTitle(string taskTitle)
    {
        TaskTitle = Check.NotNullOrWhiteSpace(taskTitle, nameof(taskTitle), maxLength: TaskTemplateConsts.MaxTitleLength);
    }

    public void AddItem(Guid id, string title, int order)
    {
        Items.Add(new TaskTemplateItem(id, Id, title, order));
    }

    public void AddFeature(Guid id, string featureCode)
    {
        Features.Add(new TaskTemplateFeature(id, Id, featureCode));
    }

    public void AddTag(Guid id, string tagName)
    {
        Tags.Add(new TaskTemplateTag(id, Id, tagName));
    }
}

public static class TaskTemplateConsts
{
    public const int MaxNameLength = 128;
    public const int MaxDescriptionLength = 512;
    public const int MaxTitleLength = 256;
    public const int MaxTaskTypeLength = 64;
    public const int MaxFeatureCodeLength = 64;
    public const int MaxTagNameLength = 64;
}
