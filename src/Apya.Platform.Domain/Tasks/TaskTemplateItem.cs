using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Tasks;

/// <summary>
/// Şablondaki alt görev başlığı. Yalnız BAŞLIK ve SIRA tutulur — alt görevin
/// sorumlusu/tarihi şablona girmez (bkz. <see cref="TaskTemplate"/> notu).
/// </summary>
public class TaskTemplateItem : Entity<Guid>
{
    public Guid TaskTemplateId { get; private set; }
    public string Title { get; private set; } = null!;

    /// <summary>Şablon içindeki görüntüleme sırası (0'dan başlar).</summary>
    public int Order { get; private set; }

    protected TaskTemplateItem() { }

    public TaskTemplateItem(Guid id, Guid taskTemplateId, string title, int order) : base(id)
    {
        TaskTemplateId = taskTemplateId;
        Title = Check.NotNullOrWhiteSpace(title, nameof(title), maxLength: TaskTemplateConsts.MaxTitleLength);
        Order = order;
    }
}
