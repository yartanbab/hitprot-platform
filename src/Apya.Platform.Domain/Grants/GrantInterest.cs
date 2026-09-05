using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Kiracının bir çağrıya bıraktığı ilgi talebi — "İlgileniyorum".
///
/// <para>🔴 Başvurunun KENDİSİ DEĞİLDİR: kiracı artık <c>GrantApplication</c> açamaz,
/// talep bırakır. Host değerlendirip firmayla irtibat kurar; süreci başlatırsa
/// başvuru o an doğar ve <see cref="GrantApplicationId"/> ile buraya bağlanır.
/// Uygun bulmazsa gerekçe <see cref="HostFeedback"/>'e yazılır ve kiracıya aynen
/// gösterilir.</para>
///
/// <para>Kiracıya AİTTİR (<see cref="IMultiTenant"/>): talebi bırakan oturumlu bir
/// firmadır. Oturumsuz ziyaretçinin bıraktığı ön değerlendirme talebi ayrı bir
/// kayıttır (<see cref="GrantLead"/>) ve host kataloğunda yaşar.</para>
///
/// <para>Kapanmış talep yeniden AÇILMAZ: kiracı aynı çağrıya tekrar ilgi bildirirse
/// YENİ satır doğar. Eski gerekçe geçmişte durur — "neden reddedildik, sonra ne
/// değişti" sorusunun cevabı tek satıra ezdirilmez.</para>
/// </summary>
public class GrantInterest : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid GrantCallId { get; private set; }

    /// <summary>Talebi bırakan kullanıcı. Cevap bildirimi ona gider.</summary>
    public Guid? RequestedByUserId { get; private set; }

    /// <summary>Firmanın kendi notu — host'un ön değerlendirmesi buradan başlar.</summary>
    public string? Note { get; private set; }

    public GrantInterestStatus Status { get; private set; }

    /// <summary>Host'un gerekçesi. Red kararında ZORUNLU; kiracıya birebir gösterilir.</summary>
    public string? HostFeedback { get; private set; }

    public Guid? ReviewedByUserId { get; private set; }

    public DateTime? ReviewedAt { get; private set; }

    /// <summary>Süreç başlatıldıysa açılan başvuru. Kiracı sihirbaza buradan geçer.</summary>
    public Guid? GrantApplicationId { get; private set; }

    /// <summary>Karara bağlanmamış talep — host kutusunda bekleyen satır.</summary>
    public bool IsPending => Status is GrantInterestStatus.Yeni or GrantInterestStatus.Inceleniyor;

    protected GrantInterest() { }

    public GrantInterest(Guid id, Guid? tenantId, Guid grantCallId, Guid? requestedByUserId, string? note)
        : base(id)
    {
        TenantId = tenantId;
        GrantCallId = grantCallId;
        RequestedByUserId = requestedByUserId;
        var trimmedNote = note?.Trim();
        Note = Check.Length(string.IsNullOrEmpty(trimmedNote) ? null : trimmedNote, nameof(note), maxLength: 1000);
        Status = GrantInterestStatus.Yeni;
    }

    /// <summary>Danışman kaydı üstlendi; firmayla irtibat başladı.</summary>
    public void StartReview(Guid? userId, DateTime now)
    {
        EnsurePending();
        Status = GrantInterestStatus.Inceleniyor;
        ReviewedByUserId = userId;
        ReviewedAt = now;
    }

    /// <summary>Host başvuru sürecini başlattı; talep açılan başvuruya bağlanır.</summary>
    public void MarkApplicationStarted(Guid applicationId, Guid? userId, DateTime now)
    {
        EnsurePending();
        Status = GrantInterestStatus.BasvuruAcildi;
        GrantApplicationId = applicationId;
        ReviewedByUserId = userId;
        ReviewedAt = now;
    }

    /// <summary>Uygun bulunmadı. Gerekçesiz kapatılamaz — metin firmaya gidiyor.</summary>
    public void Reject(string reason, Guid? userId, DateTime now)
    {
        EnsurePending();

        var trimmed = reason?.Trim();
        if (string.IsNullOrEmpty(trimmed))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInterestReasonRequired);
        }

        Status = GrantInterestStatus.UygunDegil;
        HostFeedback = Check.Length(trimmed, nameof(reason), maxLength: 1000);
        ReviewedByUserId = userId;
        ReviewedAt = now;
    }

    private void EnsurePending()
    {
        if (!IsPending)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInterestAlreadyAnswered);
        }
    }
}
