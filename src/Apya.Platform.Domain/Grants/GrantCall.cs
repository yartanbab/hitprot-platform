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
