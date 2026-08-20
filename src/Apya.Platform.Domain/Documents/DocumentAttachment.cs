using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Belgenin bir versiyonu (fiziksel dosya).
///
/// SOFT-DELETE: belge çöp kutusuna gittiğinde ekleri de birlikte gizlenir ve
/// geri alındığında birlikte döner. Sert silinselerdi "geri yükle" açılamayan
/// bir belge üretirdi — kim/ne zaman sildi bilgisi üst satırdaki DocumentFile'da.
/// </summary>
public class DocumentAttachment : CreationAuditedEntity<Guid>, IMultiTenant, ISoftDelete
{
    public bool IsDeleted { get; set; }

    public Guid? TenantId { get; set; }

    public Guid DocumentId { get; set; }

    public string FileName { get; set; } = null!;      // Kullanıcının gördüğü isim (örn: Rapor.pdf)
    public string StoredFileName { get; set; } = null!; // Sunucudaki benzersiz isim (örn: guid_Rapor.pdf)
    public string ContentType { get; set; } = null!;   // Dosya türü (application/pdf vb.)
    public long FileSize { get; set; }        // Boyut (Byte)

    /// <summary>
    /// Bu ekin ait olduğu belge (meta verinin sahibi). Versiyon zinciri buna asılır.
    /// </summary>
    public Guid DocumentFileId { get; set; }

    /// <summary>
    /// Aynı "dosya kimliği"ni versiyonlar arasında taşır — ilk yüklemede kendi Id'si,
    /// sonraki versiyonlarda aynı değer devralınır.
    /// KORUNUYOR: <see cref="DocumentFileId"/>'ye geçişin veri taşıması bu kolondan üretildi;
    /// taşımanın geri alınabilmesi için Faz A'da silinmiyor.
    /// </summary>
    public Guid VersionGroupId { get; set; }

    public int VersionNumber { get; set; } = 1;

    public bool IsLatest { get; set; } = true;

    /// <summary>Dosya içeriğinin SHA-256 özeti (hex). Çift kayıt tespiti — Faz E.</summary>
    public string? ContentHash { get; set; }

    /// <summary>OCR ile çıkarılmış düz metin. Belge içi arama için; OCR altyapısı gelene kadar null.</summary>
    public string? OcrText { get; set; }

    public DocumentAttachment() { }

    public DocumentAttachment(Guid id) : base(id) { }
}
