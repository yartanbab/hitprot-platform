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

    public DocumentAccessAction Action { get; set; }

    public DocumentAccessLog() { }

    public DocumentAccessLog(Guid id, Guid? tenantId, Guid documentId, Guid? attachmentId, DocumentAccessAction action)
        : base(id)
    {
        TenantId = tenantId;
        DocumentId = documentId;
        AttachmentId = attachmentId;
        Action = action;
    }
}
