using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.CashMovements;

/// <summary>
/// Kasa hareketi (APYA-134). Bir <c>CashAccount</c>'a giriş/çıkış kaydı.
/// Güncel bakiye = CashAccount.OpeningBalance + Σ(In) − Σ(Out).
/// APYA-136 Invoice ödemelerini otomatik hareket olarak buraya yazacak.
/// </summary>
public class CashMovement : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid CashAccountId { get; set; }
    public CashMovementDirection Direction { get; set; }
    public decimal Amount { get; set; }
    public DateTime MovementDate { get; set; }
    public string? Description { get; set; }
    public CashMovementSource Source { get; set; } = CashMovementSource.Manual;

    /// <summary>Kaynak kayıt (Invoice/Expense) id'si — manuel hareketlerde null.</summary>
    public Guid? ReferenceId { get; set; }

    protected CashMovement() { }

    public CashMovement(
        Guid id,
        Guid cashAccountId,
        CashMovementDirection direction,
        decimal amount,
        DateTime movementDate,
        string? description = null,
        CashMovementSource source = CashMovementSource.Manual,
        Guid? referenceId = null,
        Guid? tenantId = null) : base(id)
    {
        TenantId = tenantId;
        if (cashAccountId == Guid.Empty)
            throw new BusinessException(PlatformDomainErrorCodes.CashMovementAccountRequired);
        CashAccountId = cashAccountId;
        Direction = direction;
        SetAmount(amount);
        MovementDate = movementDate;
        Description = description;
        Source = source;
        ReferenceId = referenceId;
    }

    public void SetAmount(decimal amount)
    {
        if (amount <= 0)
            throw new BusinessException(PlatformDomainErrorCodes.CashMovementAmountInvalid)
                .WithData("Amount", amount);
        Amount = amount;
    }

    /// <summary>İşaretli tutar: giriş +, çıkış −. Bakiye hesabında kullanılır.</summary>
    public decimal SignedAmount => Direction == CashMovementDirection.In ? Amount : -Amount;
}
