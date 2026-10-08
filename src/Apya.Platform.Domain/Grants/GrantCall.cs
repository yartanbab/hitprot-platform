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
    public GrantCallStatus Status { get; set; }
    public DateTime? OpenDate { get; private set; }
    public DateTime? Deadline { get; private set; }
    public decimal? Budget { get; set; }
    public string? Reference { get; set; }

    // --- 1a/3a · taslağın kaynağı ---
    /// <summary>Kazımadan geldiyse kaynağın kimliği. Elle girilen çağrıda null.</summary>
    public Guid? SourceId { get; set; }

    public GrantCallOrigin Origin { get; set; }

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
