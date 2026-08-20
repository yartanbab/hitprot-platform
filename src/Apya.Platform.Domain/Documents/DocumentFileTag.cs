using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Documents;

/// <summary>
/// Belge &lt;-&gt; DocumentTag many-to-many bağlantısı (TaskTagAssignment ile aynı desen).
///
/// SOFT-DELETE: belge çöp kutusuna gittiğinde etiketleri de saklanır; geri
/// alındığında etiketleriyle döner. Sert silinselerdi geri yükleme belgeyi
/// sessizce etiketsiz bırakırdı.
/// </summary>
public class DocumentFileTag : Entity<Guid>, ISoftDelete
{
    public Guid DocumentFileId { get; set; }
    public Guid TagId { get; set; }

    public bool IsDeleted { get; set; }

    public DocumentFileTag() { }

    public DocumentFileTag(Guid id, Guid documentFileId, Guid tagId) : base(id)
    {
        DocumentFileId = documentFileId;
        TagId = tagId;
    }
}
