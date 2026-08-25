using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.IssueTasks;

/// <summary>
/// Bir sinyal (geri bildirim / istemci hatası / sunucu hatası) ile ondan açılan görev
/// arasındaki bağ. Köprü HOST'a aittir — geri bildirim paneli host-only çalışır ve
/// görev host bağlamında açılır — bu yüzden <c>IMultiTenant</c> DEĞİLDİR; kaynağın
/// tenant'ı <see cref="SourceTenantId"/> alanında taşınır.
/// <para>
/// Bilinçli olarak soft-delete DEĞİL (CreationAuditedAggregateRoot): (SourceType,
/// SourceKey) unique index'i silinmiş satırlarla çakışır ve bağ koptuğunda satırın
/// gerçekten gitmesi gerekir.
/// </para>
/// </summary>
public class IssueTaskLink : CreationAuditedAggregateRoot<Guid>
{
    public IssueSourceType SourceType { get; set; }

    /// <summary>
    /// Kaynak kaydın Id'si. Sunucu hatasında boştur — audit log kalıcı bir aggregate
    /// değildir ve saklama süresiyle temizlenir.
    /// </summary>
    public Guid? SourceId { get; set; }

    /// <summary>Tekilleştirme anahtarı; <see cref="SourceType"/> ile birlikte tekildir.</summary>
    public string SourceKey { get; set; } = string.Empty;

    /// <summary>
    /// Kaynağın tenant'ı. Geri bağ (görev kapanınca geri bildirimi kapatmak, kullanıcıya
    /// bildirim göndermek) bu değer olmadan doğru tenant'a yazamaz.
    /// </summary>
    public Guid? SourceTenantId { get; set; }

    /// <summary>Panelde ve görev açıklamasında gösterilen kısa ad — kaynak silinse de okunur kalır.</summary>
    public string? SourceLabel { get; set; }

    public Guid TaskId { get; set; }

    /// <summary>Bağı otomatik kural mı kurdu, yönetici mi? Panelde ayırt edilir.</summary>
    public bool IsAutomatic { get; set; }

    /// <summary>Görev tamamlandığında kaynağın kapatıldığı an; iki kez kapatmayı önler.</summary>
    public DateTime? SourceClosedAt { get; set; }

    protected IssueTaskLink() { }

    public IssueTaskLink(
        Guid id,
        IssueSourceType sourceType,
        Guid? sourceId,
        string sourceKey,
        Guid? sourceTenantId,
        string? sourceLabel,
        Guid taskId,
        bool isAutomatic)
        : base(id)
    {
        SourceType     = sourceType;
        SourceId       = sourceId;
        SourceKey      = sourceKey;
        SourceTenantId = sourceTenantId;
        SourceLabel    = sourceLabel;
        TaskId         = taskId;
        IsAutomatic    = isAutomatic;
    }

    public void MarkSourceClosed(DateTime now)
    {
        SourceClosedAt = now;
    }
}
