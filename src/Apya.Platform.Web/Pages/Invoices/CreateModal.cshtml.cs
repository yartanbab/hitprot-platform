using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;

namespace Apya.Platform.Web.Pages.Invoices;

public class CreateModalModel : AbpPageModel
{
    private readonly IInvoiceAppService _invoiceAppService;

    [BindProperty]
    public CreateInvoiceViewModel InvoiceInfo { get; set; } = new();

    public List<SelectListItem> Projects { get; set; } = new();
    public List<SelectListItem> Customers { get; set; } = new();

    public CreateModalModel(IInvoiceAppService invoiceAppService)
    {
        _invoiceAppService = invoiceAppService;
    }

    public async Task OnGetAsync()
    {
        var projectLookup  = await _invoiceAppService.GetProjectLookupAsync();
        var customerLookup = await _invoiceAppService.GetCustomerLookupAsync();

        Projects = projectLookup.Items.Select(x => new SelectListItem(x.Name, x.Id.ToString())).ToList();
        Customers = customerLookup.Items
            .Select(x => new SelectListItem(x.Name, x.Id.ToString()))
            .Prepend(new SelectListItem("-- Müşteri Seç --", ""))
            .ToList();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        var dto = new CreateInvoiceDto
        {
            ProjectId     = InvoiceInfo.ProjectId,
            CustomerId    = InvoiceInfo.CustomerId == Guid.Empty ? null : InvoiceInfo.CustomerId,
            Direction     = InvoiceInfo.Direction,
            InvoiceNumber = InvoiceInfo.InvoiceNumber,
            InvoiceDate   = InvoiceInfo.InvoiceDate,
            DueDate       = InvoiceInfo.DueDate,
            TaxRate       = InvoiceInfo.TaxRate,
            Currency      = InvoiceInfo.Currency,
            Notes         = InvoiceInfo.Notes,
            Items = InvoiceInfo.Items.Select(i => new CreateInvoiceItemDto
            {
                Description = i.Description,
                Quantity    = i.Quantity,
                UnitPrice   = i.UnitPrice
            }).ToList()
        };

        await _invoiceAppService.CreateAsync(dto);
        return NoContent();
    }

    public class CreateInvoiceViewModel
    {
        public Guid ProjectId { get; set; }
        public Guid? CustomerId { get; set; }
        public InvoiceDirection Direction { get; set; } = InvoiceDirection.Sales;
        public string InvoiceNumber { get; set; } = null!;
        public DateTime InvoiceDate { get; set; } = DateTime.Now;
        public DateTime DueDate { get; set; } = DateTime.Now.AddDays(15);
        public decimal TaxRate { get; set; } = 20;
        public string Currency { get; set; } = "TRY";
        public string? Notes { get; set; }

        public List<CreateInvoiceItemViewModel> Items { get; set; } = new();
    }

    public class CreateInvoiceItemViewModel
    {
        public string Description { get; set; } = null!;
        public decimal Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
    }
}
