using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

public class DocumentAttachment : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid DocumentId { get; set; }

    public string FileName { get; set; } = null!;      // Kullanıcının gördüğü isim (örn: Rapor.pdf)
    public string StoredFileName { get; set; } = null!; // Sunucudaki benzersiz isim (örn: guid_Rapor.pdf)
    public string ContentType { get; set; } = null!;   // Dosya türü (application/pdf vb.)
    public long FileSize { get; set; }        // Boyut (Byte)

    /// <summary>
    /// Aynı "dosya kimliği"ni versiyonlar arasında taşır — ilk yüklemede kendi Id'si,
    /// sonraki versiyonlarda aynı değer devralınır.
    /// </summary>
    public Guid VersionGroupId { get; set; }

    public int VersionNumber { get; set; } = 1;

    public bool IsLatest { get; set; } = true;

    public DocumentAttachment() { }

    public DocumentAttachment(Guid id) : base(id) { }
}
