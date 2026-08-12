using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Tasks;

/// <summary>
/// Şablona kaydedilmiş özellik sekmesi kodu (TaskFeatureAssignment ile aynı desen).
/// Şablondan görev üretilirken bu kodlar yeni görevin TaskFeatureAssignment'larına
/// çevrilir.
/// </summary>
public class TaskTemplateFeature : Entity<Guid>
{
    public Guid TaskTemplateId { get; private set; }
    public string FeatureCode { get; private set; } = null!;

    protected TaskTemplateFeature() { }

    public TaskTemplateFeature(Guid id, Guid taskTemplateId, string featureCode) : base(id)
    {
        TaskTemplateId = taskTemplateId;
        FeatureCode = Check.NotNullOrWhiteSpace(featureCode, nameof(featureCode), maxLength: TaskTemplateConsts.MaxFeatureCodeLength);
    }
}
