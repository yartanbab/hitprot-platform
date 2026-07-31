using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Geri bildirime eklenen dosya. İçerik diskte (IUploadedFileStorage) tutulur, burada
/// yalnızca referans var. İndirme HER ZAMAN yetki kontrolü yapan endpoint üzerinden —
/// StoredFileName asla doğrudan public URL olarak verilmez.
/// </summary>
public class FeedbackAttachment : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid FeedbackId { get; set; }

    /// <summary>Kullanıcının yüklediği orijinal ad — listede bu gösterilir.</summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>Diskte saklanan (rastgeleleştirilmiş) ad.</summary>
    public string StoredFileName { get; set; } = string.Empty;

    public string? ContentType { get; set; }

    public long SizeBytes { get; set; }

    protected FeedbackAttachment() { }

    public FeedbackAttachment(
        Guid id,
        Guid? tenantId,
        Guid feedbackId,
        string fileName,
        string storedFileName,
        string? contentType,
        long sizeBytes)
        : base(id)
    {
        TenantId       = tenantId;
        FeedbackId     = feedbackId;
        FileName       = fileName;
        StoredFileName = storedFileName;
        ContentType    = contentType;
        SizeBytes      = sizeBytes;
    }
}
