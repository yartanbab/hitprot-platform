using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;
using Apya.Platform.Invoices;

namespace Apya.Platform.Invoices.Dtos;

public class InvoiceDto : FullAuditedEntityDto<Guid>
{
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public Guid? CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public InvoiceDirection Direction { get; set; }
    public Guid? TaskId { get; set; }
    public Guid? BudgetLineId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TaxRate { get; set; }
    public string Currency { get; set; } = "TRY";
    public InvoiceStatus Status { get; set; }

    /// <summary>
    /// FIN-10 · Vadesi geçmiş ve tamamı ödenmemiş (iptal edilmemiş) fatura. Saklanmaz, okunurken
    /// hesaplanır: "Gecikmiş" durumu hiçbir yerde atanmadığı için Faturalar ekranındaki süzgeç
    /// boş kalıyordu. Kural cari ekstresindeki gecikmiş tutarla aynı: hiç ödeme almamış (hâlâ
    /// Taslak görünen) fatura da sayılır.
    /// </summary>
    public bool IsOverdue { get; set; }
    public string? Notes { get; set; }
    public List<InvoiceItemDto> Items { get; set; } = new();
    public decimal PaidAmount { get; set; }
    public decimal Balance => TotalAmount - PaidAmount;
}

/// <summary>
/// F-05 · Fatura listesi süzgeci. Proje süzgeci sunucuda: uç eskiden süzgeç almıyordu, çağıranlar son
/// sayfayı bellekte projeye süzüyordu ve çok faturalı kiracıda projenin eski faturaları hiç görünmüyordu.
/// </summary>
public class GetInvoicesInput : PagedAndSortedResultRequestDto
{
    public Guid? ProjectId { get; set; }
}

public class InvoiceItemDto : EntityDto<Guid>
{
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class CreateInvoiceDto
{
    public Guid ProjectId { get; set; }
    public Guid? CustomerId { get; set; }
    public InvoiceDirection Direction { get; set; } = InvoiceDirection.Sales;
    public Guid? TaskId { get; set; }

    /// <summary>FIN-05 · İsteğe bağlı bütçe kalemi; verilirse faturanın projesine ait olmalıdır.</summary>
    public Guid? BudgetLineId { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    public decimal TaxRate { get; set; } = 20;
    public string Currency { get; set; } = "TRY";
    public string? Notes { get; set; }
    public List<CreateInvoiceItemDto> Items { get; set; } = new();
}

public class CreateInvoiceItemDto
{
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class ProjectLookupDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class CustomerLookupDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}
