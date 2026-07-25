using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>Bir başvurunun tahsilat dilimi (Faz C). Host tarafından yönetilir.</summary>
public class GrantDisbursementTranche : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantApplicationId { get; private set; }
    public int SequenceNo { get; private set; }
    public decimal Amount { get; private set; }
    public GrantDisbursementTrancheStatus Status { get; private set; }
    public DateTime? DueDate { get; private set; }

    protected GrantDisbursementTranche() { }

    public GrantDisbursementTranche(Guid id, Guid? tenantId, Guid grantApplicationId, int sequenceNo, decimal amount, DateTime? dueDate) : base(id)
    {
        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        SequenceNo = sequenceNo;
        Amount = amount;
        DueDate = dueDate;
        Status = GrantDisbursementTrancheStatus.Planlandi;
    }

    public void Update(int sequenceNo, decimal amount, GrantDisbursementTrancheStatus status, DateTime? dueDate)
    {
        SequenceNo = sequenceNo;
        Amount = amount;
        Status = status;
        DueDate = dueDate;
    }

    public void MarkPaid() => Status = GrantDisbursementTrancheStatus.Odendi;
}
