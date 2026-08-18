using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

/// <summary>
/// Immutable log entry recording a Documents-module access event (upload/download/delete).
/// Each event generates a new record — CreatorId/CreationTime (taban sınıftan) "kim ne zaman" sorusunu yanıtlar.
/// </summary>
public class DocumentAccessLog : CreationAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid DocumentId { get; set; }

    public Guid? AttachmentId { get; set; }

    /// <summary>
    /// Olayın ait olduğu belge. Etkinlik sekmesi klasör değil BELGE bazında okur;
    /// AttachmentId versiyona işaret ettiği için tek başına yeterli değil.
    /// </summary>
    public Guid? DocumentFileId { get; set; }

    public DocumentAccessAction Action { get; set; }

    /// <summary>İnsan-okur kısa açıklama ("Tür: — → Fatura"). Şema değil, serbest metin.</summary>
    public string? Detail { get; set; }

    /// <summary>Olay anındaki rol — sonradan rol değişse bile iz doğru kalsın diye kopyalanır.</summary>
    public string? ActorRole { get; set; }

    public DocumentAccessLog() { }

    public DocumentAccessLog(
        Guid id,
        Guid? tenantId,
        Guid documentId,
        Guid? attachmentId,
        DocumentAccessAction action,
        Guid? documentFileId = null,
        string? detail = null,
        string? actorRole = null)
        : base(id)
    {
        TenantId = tenantId;
        DocumentId = documentId;
        AttachmentId = attachmentId;
        DocumentFileId = documentFileId;
        Action = action;
        Detail = detail;
        ActorRole = actorRole;
    }
}
