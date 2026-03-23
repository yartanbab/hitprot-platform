using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;
using Apya.Platform.Invoices;

namespace Apya.Platform.Invoices.Dtos;

public class InvoiceDto : FullAuditedEntityDto<Guid>
{
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; }
    public string InvoiceNumber { get; set; }
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TaxRate { get; set; }
    public string Currency { get; set; }
    public InvoiceStatus Status { get; set; }
    public List<InvoiceItemDto> Items { get; set; } = new();
    public decimal PaidAmount { get; set; }
    public decimal Balance => TotalAmount - PaidAmount;
}

public class InvoiceItemDto : EntityDto<Guid>
{
    public string Description { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CreateInvoiceDto
{
    public Guid ProjectId { get; set; }
    public string InvoiceNumber { get; set; }
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    public decimal TaxRate { get; set; } = 20;
    public string Currency { get; set; } = "TRY";
    public List<CreateInvoiceItemDto> Items { get; set; } = new();
}

public class CreateInvoiceItemDto
{
    public string Description { get; set; }
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class ProjectLookupDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
}
