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

    /// <summary>
    /// Firmanın proje fikri — host'un ön değerlendirmesi buradan başlar. Kolon adı
    /// tarihsel olarak "not"; ekranda "Proje fikrinizi birkaç cümleyle anlatın" diye sorulur.
    /// </summary>
    public string? Note { get; private set; }

    /// <summary>Firmanın öngördüğü toplam proje bütçesi (₺). Zorunlu değil.</summary>
    public decimal? EstimatedBudget { get; private set; }

    /// <summary>Hedeflenen başlangıç — çeyreğin ilk günü olarak saklanır. Null = belli değil.</summary>
    public DateTime? TargetStartDate { get; private set; }

    /// <summary>
    /// Konsorsiyum ortağı durumu. Soru yalnız ortaklık şartı taşıyan çağrıda sorulur:
    /// null = sorulmadı · true = ortak arıyor · false = ortağı belli (<see cref="PartnerName"/>).
    /// </summary>
    public bool? NeedsPartner { get; private set; }

    public string? PartnerName { get; private set; }

    /// <summary>Firmanın ilgisini geri çektiği an; yalnız <see cref="GrantInterestStatus.GeriCekildi"/> durumunda dolu.</summary>
    public DateTime? WithdrawnAt { get; private set; }

    public GrantInterestStatus Status { get; private set; }

    /// <summary>Host'un gerekçesi. Red kararında ZORUNLU; kiracıya birebir gösterilir.</summary>
    public string? HostFeedback { get; private set; }

    public Guid? ReviewedByUserId { get; private set; }

    public DateTime? ReviewedAt { get; private set; }

    /// <summary>Süreç başlatıldıysa açılan başvuru. Kiracı sihirbaza buradan geçer.</summary>
    public Guid? GrantApplicationId { get; private set; }

    /// <summary>
    /// 18a · Danışmanın iç notu. 🔴 FİRMAYA GİTMEZ — firmaya giden metin yalnız
    /// <see cref="HostFeedback"/>'tir. Kiracı DTO'larına bu alan konmaz.
    /// </summary>
    public string? ConsultantNote { get; private set; }

    /// <summary>18a · Talebin sorumlu danışmanı (host kullanıcısı). null = kimseye atanmadı.</summary>
    public Guid? AssignedUserId { get; private set; }

    /// <summary>Karara bağlanmamış talep — host kutusunda bekleyen satır.</summary>
    public bool IsPending => Status is GrantInterestStatus.Yeni or GrantInterestStatus.Inceleniyor;

    protected GrantInterest() { }

    public GrantInterest(
        Guid id,
        Guid? tenantId,
        Guid grantCallId,
        Guid? requestedByUserId,
        string? note,
        decimal? estimatedBudget = null,
        DateTime? targetStartDate = null,
        bool? needsPartner = null,
        string? partnerName = null)
        : base(id)
    {
        TenantId = tenantId;
        GrantCallId = grantCallId;
        RequestedByUserId = requestedByUserId;
        var trimmedNote = note?.Trim();
        Note = Check.Length(string.IsNullOrEmpty(trimmedNote) ? null : trimmedNote, nameof(note), maxLength: 1000);

        if (estimatedBudget < 0)
        {
            throw new ArgumentOutOfRangeException(nameof(estimatedBudget), "Bütçe negatif olamaz.");
        }
        EstimatedBudget = estimatedBudget;
        TargetStartDate = targetStartDate?.Date;

        // Ortağı belli değilse ad tutulmaz: "ortak arıyor" diyen kayıtta eski bir ad kalmasın.
        NeedsPartner = needsPartner;
        var trimmedPartner = partnerName?.Trim();
        PartnerName = needsPartner == false && !string.IsNullOrEmpty(trimmedPartner)
            ? Check.Length(trimmedPartner, nameof(partnerName), maxLength: 200)
            : null;

        Status = GrantInterestStatus.Yeni;
    }

    /// <summary>
    /// Firma ilgisini geri çekti. Yalnız karara bağlanmamış talep çekilebilir —
    /// başvuruya dönmüş ya da gerekçesiyle kapanmış kayıt tarihçedir, değiştirilmez.
    /// </summary>
    public void Withdraw(DateTime now)
    {
        if (!IsPending)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInterestNotWithdrawable);
        }

        Status = GrantInterestStatus.GeriCekildi;
        WithdrawnAt = now;
    }

    /// <summary>Danışman kaydı üstlendi; firmayla irtibat başladı. Sorumlu yoksa üstlenen olur.</summary>
    public void StartReview(Guid? userId, DateTime now)
    {
        EnsurePending();
        Status = GrantInterestStatus.Inceleniyor;
        ReviewedByUserId = userId;
        ReviewedAt = now;
        AssignedUserId ??= userId;
    }

    /// <summary>18a · İç not; her durumda yazılabilir (kapanmış talebe sonradan not düşmek geçmişi bozmaz).</summary>
    public void SetConsultantNote(string? note)
    {
        var trimmed = note?.Trim();
        ConsultantNote = string.IsNullOrEmpty(trimmed) ? null : Check.Length(trimmed, nameof(note), maxLength: 2000);
    }

    /// <summary>18a · Başka danışmana devret. Karara bağlanmış talep devredilmez — yapılacak iş kalmadı.</summary>
    public void AssignTo(Guid? userId)
    {
        EnsurePending();
        AssignedUserId = userId;
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
