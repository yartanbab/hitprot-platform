using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Tasks;

/// <summary>Görev bazlı eklenmiş (core olmayan) feature — TaskTagAssignment ile aynı desen.</summary>
public class TaskFeatureAssignment : Entity<Guid>
{
    public Guid TaskId { get; set; }
    public string FeatureCode { get; set; } = string.Empty;

    public TaskFeatureAssignment() { }

    public TaskFeatureAssignment(Guid id, Guid taskId, string featureCode) : base(id)
    {
        TaskId = taskId;
        FeatureCode = featureCode;
    }
}
