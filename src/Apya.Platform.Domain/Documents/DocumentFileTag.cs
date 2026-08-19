using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Documents;

/// <summary>Belge &lt;-&gt; DocumentTag many-to-many bağlantısı (TaskTagAssignment ile aynı desen).</summary>
public class DocumentFileTag : Entity<Guid>
{
    public Guid DocumentFileId { get; set; }
    public Guid TagId { get; set; }

    public DocumentFileTag() { }

    public DocumentFileTag(Guid id, Guid documentFileId, Guid tagId) : base(id)
    {
        DocumentFileId = documentFileId;
        TagId = tagId;
    }
}
