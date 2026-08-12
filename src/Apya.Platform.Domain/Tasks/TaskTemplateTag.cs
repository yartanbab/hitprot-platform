using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Tasks;

/// <summary>
/// Şablona kaydedilmiş etiket — Tag ID'si DEĞİL, etiket ADI tutulur.
/// Sebep: şablon başka bir projede/zamanda uygulanabilir ve o an aynı Tag kaydı
/// silinmiş olabilir. Ada göre saklayınca uygulama sırasında etiket bulunur ya da
/// yeniden oluşturulur; kırık FK riski kalmaz.
/// </summary>
public class TaskTemplateTag : Entity<Guid>
{
    public Guid TaskTemplateId { get; private set; }
    public string TagName { get; private set; } = null!;

    protected TaskTemplateTag() { }

    public TaskTemplateTag(Guid id, Guid taskTemplateId, string tagName) : base(id)
    {
        TaskTemplateId = taskTemplateId;
        TagName = Check.NotNullOrWhiteSpace(tagName, nameof(tagName), maxLength: TaskTemplateConsts.MaxTagNameLength);
    }
}
