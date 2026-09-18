using System;
using Volo.Abp;
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
        EnsureAmountValid(amount);
        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        SequenceNo = sequenceNo;
        Amount = amount;
        DueDate = dueDate;
        Status = GrantDisbursementTrancheStatus.Planlandi;
    }

    /// <summary>
    /// 🔴 Ödendi'ye geçişte rapor kapısını bu metot UYGULAMAZ — çağıran önce
    /// <see cref="GrantTrancheManager.EnsureCanMarkPaidAsync"/>'ten geçmelidir.
    /// </summary>
    public void Update(int sequenceNo, decimal amount, GrantDisbursementTrancheStatus status, DateTime? dueDate)
    {
        EnsureAmountValid(amount);
        SequenceNo = sequenceNo;
        Amount = amount;
        Status = status;
        DueDate = dueDate;
    }

    /// <inheritdoc cref="Update"/>
    public void MarkPaid() => Status = GrantDisbursementTrancheStatus.Odendi;

    private static void EnsureAmountValid(decimal amount)
    {
        if (amount <= 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantTrancheAmountInvalid)
                .WithData("Amount", amount);
        }
    }
}
