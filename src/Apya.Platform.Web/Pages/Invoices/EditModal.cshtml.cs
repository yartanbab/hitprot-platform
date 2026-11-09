using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Invoices;

/// <summary>
/// Fatura düzenleme. Taslak fatura baştan düzenlenir; ödeme alınmış faturada da tutar, kalemler ve
/// KDV düzeltilir, yalnız cari ve yön kilitlidir (ödemenin kasa ve cari kayıtları onlara yazılmıştır).
/// </summary>
[Authorize(PlatformPermissions.Invoices.Edit)]
public class EditModalModel : AbpPageModel
{
    private readonly IInvoiceAppService _invoiceAppService;

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    [BindProperty]
    public EditInvoiceViewModel InvoiceInfo { get; set; } = new();

    public bool IsDraft { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public List<SelectListItem> Customers { get; set; } = new();

    public EditModalModel(IInvoiceAppService invoiceAppService)
    {
        _invoiceAppService = invoiceAppService;
    }

    public async Task OnGetAsync()
    {
        var dto = await _invoiceAppService.GetAsync(Id);
        IsDraft = dto.Status == InvoiceStatus.Draft;
        ProjectName = dto.ProjectName;
        InvoiceInfo = new EditInvoiceViewModel
        {
            ProjectId = dto.ProjectId,
            CustomerId = dto.CustomerId,
            BudgetLineId = dto.BudgetLineId,
            Direction = dto.Direction,
            InvoiceNumber = dto.InvoiceNumber,
            InvoiceDate = dto.InvoiceDate,
            DueDate = dto.DueDate,
            TaxRate = dto.TaxRate,
            VatExemptionReference = dto.VatExemptionReference,
            Notes = dto.Notes,
            Items = dto.Items.Select(i => new EditInvoiceItemViewModel
            {
                Description = i.Description,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        };

        var customerLookup = await _invoiceAppService.GetCustomerLookupAsync();
        Customers = customerLookup.Items
            .Select(x => new SelectListItem(x.Name, x.Id.ToString()))
            .Prepend(new SelectListItem("-- Müşteri Seç --", ""))
            .ToList();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        var budgetLineId = InvoiceInfo.BudgetLineId == Guid.Empty ? null : InvoiceInfo.BudgetLineId;
        var current = await _invoiceAppService.GetAsync(Id);
        // Ödemeli faturada cari ve yön alanları disabled basılır, tarayıcı göndermez.
        var hasPayments = current.Status != InvoiceStatus.Draft;

        await _invoiceAppService.UpdateAsync(Id, new UpdateInvoiceDto
        {
            CustomerId = hasPayments ? current.CustomerId
                : InvoiceInfo.CustomerId == Guid.Empty ? null : InvoiceInfo.CustomerId,
            BudgetLineId = budgetLineId,
            Direction = hasPayments ? current.Direction : InvoiceInfo.Direction,
            InvoiceNumber = InvoiceInfo.InvoiceNumber,
            InvoiceDate = InvoiceInfo.InvoiceDate,
            DueDate = InvoiceInfo.DueDate,
            TaxRate = InvoiceInfo.TaxRate,
            PricesIncludeTax = InvoiceInfo.PricesIncludeTax,
            VatExemptionReference = InvoiceInfo.VatExemptionReference,
            Notes = InvoiceInfo.Notes,
            Items = InvoiceInfo.Items.Select(i => new CreateInvoiceItemDto
            {
                Description = i.Description,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        });
        return NoContent();
    }

    public class EditInvoiceViewModel
    {
        /// <summary>Yalnız bütçe kalemi seçicisini doldurmak için; proje düzenlenmez.</summary>
        public Guid ProjectId { get; set; }
        public Guid? CustomerId { get; set; }
        public Guid? BudgetLineId { get; set; }
        public InvoiceDirection Direction { get; set; }
        public string InvoiceNumber { get; set; } = null!;
        public DateTime InvoiceDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal TaxRate { get; set; }
        public bool PricesIncludeTax { get; set; }
        public string? VatExemptionReference { get; set; }
        public string? Notes { get; set; }
        public List<EditInvoiceItemViewModel> Items { get; set; } = new();
    }

    public class EditInvoiceItemViewModel
    {
        public string Description { get; set; } = null!;
        public decimal Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
    }
}
