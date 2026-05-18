using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.CustomerLedger;

/// <summary>
/// Cari hareket (APYA-142). Bir müşteriye ait borç/alacak tahakkuku.
/// Faz 8 tahakkuk katmanının çekirdeği — Invoice (Borç) ve tahsilat (Alacak) buraya yazılır.
/// Bakiye AppService'te Σ SignedAmount ile hesaplanır.
/// </summary>
public class CustomerLedgerEntry : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid CustomerId { get; set; }
    public DateTime EntryDate { get; set; }
    public CustomerLedgerDirection Direction { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public CustomerLedgerSource Source { get; set; } = CustomerLedgerSource.Manual;

    /// <summary>İlişkili Invoice/Payment id'si — elle kayıtlarda null.</summary>
    public Guid? ReferenceId { get; set; }

    /// <summary>APYA-142 maliyet boyutu — opsiyonel proje etiketi (Faz 9'da TaskId eklenecek).</summary>
    public Guid? ProjectId { get; set; }

    public string? Description { get; set; }

    protected CustomerLedgerEntry() { }

    public CustomerLedgerEntry(
        Guid id,
        Guid customerId,
        CustomerLedgerDirection direction,
        decimal amount,
        DateTime entryDate,
        CustomerLedgerSource source = CustomerLedgerSource.Manual,
        string currency = "TRY",
        Guid? referenceId = null,
        Guid? projectId = null,
        string? description = null,
        Guid? tenantId = null) : base(id)
    {
        TenantId = tenantId;
        if (customerId == Guid.Empty)
            throw new BusinessException(PlatformDomainErrorCodes.CustomerLedgerCustomerRequired);
        CustomerId = customerId;
        Direction = direction;
        SetAmount(amount);
        EntryDate = entryDate;
        Source = source;
        Currency = string.IsNullOrWhiteSpace(currency) ? "TRY" : currency.Trim().ToUpperInvariant();
        ReferenceId = referenceId;
        ProjectId = projectId;
        Description = description;
    }

    public void SetAmount(decimal amount)
    {
        if (amount <= 0)
            throw new BusinessException(PlatformDomainErrorCodes.CustomerLedgerAmountInvalid)
                .WithData("Amount", amount);
        Amount = amount;
    }

    /// <summary>İşaretli tutar: Borç +, Alacak −. Bakiye = Σ SignedAmount (pozitif → müşteri borçlu).</summary>
    public decimal SignedAmount => Direction == CustomerLedgerDirection.Debit ? Amount : -Amount;
}
