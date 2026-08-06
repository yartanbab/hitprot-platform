using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Tasks;

/// <summary>Görev kontrol listesi maddesi — TaskAttachment ile aynı desen (CreationAuditedEntity, IMultiTenant yok, tenant/gizlilik EnsureTaskAccessAllowedAsync guard'ından gelir).</summary>
public class TaskChecklistItem : CreationAuditedEntity<Guid>
{
    public Guid TaskId { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsDone { get; set; }
}
