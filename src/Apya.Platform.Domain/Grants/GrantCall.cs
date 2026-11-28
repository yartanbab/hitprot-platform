using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Bir hibe programının (Grant) zamana bağlı açılışı: dönem, son başvuru tarihi,
/// bütçe ve durum. Host katalog verisi (IMultiTenant; host'ta TenantId null).
/// </summary>
public class GrantCall : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantId { get; private set; }
    public string Period { get; private set; } = null!;
    public GrantCallStatus Status { get; private set; }
    public DateTime? OpenDate { get; private set; }
    public DateTime? Deadline { get; private set; }
    public decimal? Budget { get; set; }
    public string? Reference { get; set; }

    // --- 1a/3a · taslağın kaynağı ---
    /// <summary>Kazımadan geldiyse kaynağın kimliği. Elle girilen çağrıda null.</summary>
    public Guid? SourceId { get; set; }

    public GrantCallOrigin Origin { get; set; }

    /// <summary>
    /// Bu çağrının resmî duyuru adresi. Boşsa programın adresi (<c>Grant.SourceUrl</c>) geçerlidir; programın
    /// yeni dönemi açılınca eski çağrının duyurusu kaybolmasın diye çağrıda tutulur.
    /// </summary>
    public string? SourceUrl { get; set; }

    /// <summary>Kapanış nedeni. Yalnız kapalı çağrıda dolu olabilir (<see cref="SetClosureReason"/>).</summary>
    public GrantCallClosureReason ClosureReason { get; private set; }

    /// <summary>Çağrı bilgisinin resmî kaynaktan en son kontrol edildiği gün; null = hiç doğrulanmadı.</summary>
    public DateTime? LastVerifiedAt { get; set; }

    public GrantCallVerificationStatus VerificationStatus { get; set; }

    // --- Duyuru görseli: yalnız adres (karar 2026-11-28: indirilmez, ekranda gösterilmez) ---
    // Her dönemin kendi görseli vardır: programın eski çağrısının görseli yeni çağrıya taşınmaz.

    /// <summary>Çağrı duyurusunun görselinin (banner, afiş) adresi.</summary>
    public string? AnnouncementImageUrl { get; set; }

    /// <summary>Görselin bulunduğu resmî sayfa.</summary>
    public string? ImageSourceUrl { get; set; }

    public GrantImageLicense ImageLicense { get; set; }

    public GrantImageStatus ImageStatus { get; set; }

    public DateTime? ImageLastCheckedAt { get; set; }

    protected GrantCall() { }

    public GrantCall(Guid id, Guid grantId, string period, GrantCallStatus status) : base(id)
    {
        GrantId = grantId;
        SetPeriod(period);
        Status = status;
    }

    public void SetPeriod(string period)
    {
        Period = Check.NotNullOrWhiteSpace(period, nameof(period), maxLength: 32).Trim();
    }

    // --- Durum geçişleri (DOM-06) ---
    // Durum yalnız bu üç kapıdan değişir. "Taslak çağrı kiracıya ve kamuya çıkmaz" kuralı
    // tüketici sorgularda durur; buradaki amaç durumu KİMİN, NE NİYETLE değiştirdiğinin
    // çağrı yerinde okunabilmesi ve serbest atamanın derlenmemesi.

    /// <summary>Yayın: çağrı kiracılara ve kamuya açılır.</summary>
    public void Publish() => ChangeStatus(GrantCallStatus.Acik);

    /// <summary>Kapanış: son başvuru tarihi geçti ya da host kapattı.</summary>
    public void Close() => Status = GrantCallStatus.Kapandi;

    /// <summary>Host çağrı düzenleme ekranından elle seçilen durum (ör. Planlandı). Kapanmayan çağrının nedeni boşalır.</summary>
    public void ChangeStatus(GrantCallStatus status)
    {
        Status = status;
        if (status != GrantCallStatus.Kapandi)
        {
            ClosureReason = GrantCallClosureReason.Belirtilmemis;
        }
    }

    /// <summary>Kapanış nedeni yalnız kapalı çağrıya yazılır; açık çağrıda "iptal edildi" çelişki olurdu.</summary>
    public void SetClosureReason(GrantCallClosureReason reason)
    {
        if (reason != GrantCallClosureReason.Belirtilmemis && Status != GrantCallStatus.Kapandi)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantCallClosureReasonNeedsClosed);
        }
        ClosureReason = reason;
    }

    /// <summary>
    /// Son başvuru tarihi <paramref name="today"/> gününden önce mi. Son gün DAHİLDİR (o gün
    /// hâlâ geçmemiştir); tarihi olmayan çağrının süresi dolmaz.
    /// </summary>
    public bool IsPastDeadline(DateTime today)
        => Deadline != null && Deadline.Value.Date < today.Date;

    /// <summary>
    /// Çağrı <paramref name="today"/> günü ilgiye ve başvuruya açık mı: yayında VE son başvuru
    /// tarihi geçmemiş.
    ///
    /// <para>Durum tek başına yetmez: tarihi geçen çağrıyı otomatik kapanış
    /// (<c>GrantDeadlineReminderWorker</c>, aynı sınır) kapatır, ama işçi çalışana kadar çağrı
    /// "Açık" görünür. Kapılar o aralıkta da bu kurala bakar.</para>
    /// </summary>
    public bool IsOpenOn(DateTime today)
        => Status == GrantCallStatus.Acik && !IsPastDeadline(today);

    public void SetSchedule(DateTime? openDate, DateTime? deadline)
    {
        if (openDate.HasValue && deadline.HasValue && deadline.Value < openDate.Value)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantCallScheduleInvalid);
        }
        OpenDate = openDate;
        Deadline = deadline;
    }
}
