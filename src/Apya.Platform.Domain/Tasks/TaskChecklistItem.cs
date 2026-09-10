using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Tasks;

/// <summary>
/// Kontrol listesi maddesi — TaskAttachment ile aynı desen (CreationAuditedEntity,
/// IMultiTenant yok; tenant/gizlilik erişim guard'larından gelir).
///
/// Hiyerarşik kapsam (birleşik sekme sistemi PR-3a): madde ya bir GÖREVE
/// (TaskId dolu, ProjectId BOŞ — proje üyeliği görevden türetilir, senkron
/// kopya tutulmaz ki gizlilik süzgeci görev join'inden çalışsın) ya da
/// doğrudan PROJEYE bağlıdır (TaskId boş, ProjectId dolu). İkisi birden dolu
/// ya da boş olmaz — kural TaskAppService yazma uçlarında.
/// Bağımsız madde YOK: kontrol listesi yalnız görev/proje yüzeylerinde yaşar.
/// </summary>
public class TaskChecklistItem : CreationAuditedEntity<Guid>
{
    public Guid? TaskId { get; set; }
    public Guid? ProjectId { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsDone { get; set; }
}
