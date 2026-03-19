using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Invoices;

public class Invoice : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid ProjectId { get; set; }
    
    public string InvoiceNumber { get; set; }
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    
    public decimal TotalAmount { get; set; }
    public decimal TaxRate { get; set; } = 20; // Default %20 KDV
    
    public string Currency { get; set; } = "TRY";
    
    public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;
    
    public string Notes { get; set; }

    public ICollection<InvoiceItem> Items { get; set; }

    public Invoice()
    {
        Items = new Collection<InvoiceItem>();
    }

    public Invoice(Guid id, Guid projectId, string invoiceNumber, DateTime invoiceDate, DateTime dueDate) : base(id)
    {
        ProjectId = projectId;
        InvoiceNumber = invoiceNumber;
        InvoiceDate = invoiceDate;
        DueDate = dueDate;
        Items = new Collection<InvoiceItem>();
    }
}

public class InvoiceItem : Entity<Guid>
{
    public Guid InvoiceId { get; set; }
    public string Description { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    
    public decimal TotalPrice => Quantity * UnitPrice;

    public InvoiceItem() { }

    public InvoiceItem(Guid id, Guid invoiceId, string description, decimal quantity, decimal unitPrice) : base(id)
    {
        InvoiceId = invoiceId;
        Description = description;
        Quantity = quantity;
        UnitPrice = unitPrice;
    }
}

public enum InvoiceStatus
{
    Draft = 0,
    Sent = 1,
    Paid = 2,
    Cancelled = 3,
    Overdue = 4
}
