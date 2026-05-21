using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Invoices;

public class Invoice : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }
    public Guid ProjectId { get; private set; }
    public Guid? CustomerId { get; private set; }
    public InvoiceDirection Direction { get; private set; } = InvoiceDirection.Sales;
    public Guid? TaskId { get; private set; }

    public string InvoiceNumber { get; private set; } = null!;
    public DateTime InvoiceDate { get; private set; }
    public DateTime DueDate { get; private set; }

    public decimal TotalAmount { get; private set; }
    public decimal TaxRate { get; private set; } = 20;
    public string Currency { get; private set; } = "TRY";
    public InvoiceStatus Status { get; private set; } = InvoiceStatus.Draft;
    public string? Notes { get; private set; }

    public ICollection<InvoiceItem> Items { get; private set; } = new List<InvoiceItem>();

    /// <summary>EF Core için.</summary>
    protected Invoice() { }

    public Invoice(
        Guid id,
        Guid? tenantId,
        Guid projectId,
        string invoiceNumber,
        DateTime invoiceDate,
        DateTime dueDate,
        decimal taxRate,
        string currency,
        InvoiceDirection direction,
        Guid? customerId,
        Guid? taskId) : base(id)
    {
        TenantId = tenantId;
        ProjectId = projectId;
        SetInvoiceNumber(invoiceNumber);
        InvoiceDate = invoiceDate;
        DueDate = dueDate;
        SetTaxRate(taxRate);
        SetCurrency(currency);
        Direction = direction;
        CustomerId = customerId;
        TaskId = taskId;
        Status = InvoiceStatus.Draft;
        Items = new List<InvoiceItem>();
    }

    // ======================== Domain Methods ========================

    /// <summary>
    /// Faturaya kalem ekler. Yalnızca Draft durumundaki faturaya ekleme yapılabilir.
    /// Ekleme sonrası TotalAmount otomatik yeniden hesaplanır.
    /// </summary>
    public void AddItem(Guid itemId, string description, decimal quantity, decimal unitPrice)
    {
        if (Status != InvoiceStatus.Draft)
            throw new BusinessException(PlatformDomainErrorCodes.InvoiceNotEditable)
                .WithData("Status", Status);

        Items.Add(new InvoiceItem(itemId, Id, description, quantity, unitPrice));
        RecalculateTotal();
    }

    /// <summary>
    /// Toplam ödemeye göre fatura durumunu günceller.
    /// İptal edilmiş faturalar bu çağrıdan etkilenmez.
    /// </summary>
    public void UpdateStatus(decimal totalPaid)
    {
        if (Status == InvoiceStatus.Cancelled) return;
        Status = totalPaid >= TotalAmount ? InvoiceStatus.Paid : InvoiceStatus.Sent;
    }

    // ======================== Private Guards ========================

    private void SetInvoiceNumber(string invoiceNumber)
    {
        if (string.IsNullOrWhiteSpace(invoiceNumber))
            throw new BusinessException(PlatformDomainErrorCodes.InvoiceNumberRequired);
        InvoiceNumber = invoiceNumber.Trim();
    }

    private void SetTaxRate(decimal taxRate)
    {
        if (taxRate < 0)
            throw new BusinessException(PlatformDomainErrorCodes.InvoiceTaxRateInvalid)
                .WithData("TaxRate", taxRate);
        TaxRate = taxRate;
    }

    private void SetCurrency(string currency)
    {
        if (string.IsNullOrWhiteSpace(currency) || currency.Trim().Length != 3)
            throw new BusinessException(PlatformDomainErrorCodes.InvoiceCurrencyInvalid)
                .WithData("Currency", currency ?? "<null>");
        Currency = currency.Trim().ToUpperInvariant();
    }

    private void RecalculateTotal()
        => TotalAmount = Items.Sum(x => x.TotalPrice) * (1 + TaxRate / 100);
}

public class InvoiceItem : Entity<Guid>
{
    public Guid InvoiceId { get; private set; }
    public string Description { get; private set; } = null!;
    public decimal Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }

    public decimal TotalPrice => Quantity * UnitPrice;

    /// <summary>EF Core için.</summary>
    protected InvoiceItem() { }

    public InvoiceItem(Guid id, Guid invoiceId, string description, decimal quantity, decimal unitPrice)
        : base(id)
    {
        InvoiceId = invoiceId;
        Description = description;
        Quantity = quantity;
        UnitPrice = unitPrice;
    }
}
