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

    public CreateModalModel(IInvoiceAppService invoiceAppService)
    {
        _invoiceAppService = invoiceAppService;
    }

    public async Task OnGetAsync()
    {
        var projectLookup = await _invoiceAppService.GetProjectLookupAsync();
        Projects = projectLookup.Items.Select(x => new SelectListItem(x.Name, x.Id.ToString())).ToList();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        var dto = new CreateInvoiceDto
        {
            ProjectId = InvoiceInfo.ProjectId,
            InvoiceNumber = InvoiceInfo.InvoiceNumber,
            InvoiceDate = InvoiceInfo.InvoiceDate,
            DueDate = InvoiceInfo.DueDate,
            TaxRate = InvoiceInfo.TaxRate,
            Currency = InvoiceInfo.Currency,
            Items = InvoiceInfo.Items.Select(i => new CreateInvoiceItemDto
            {
                Description = i.Description,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList()
        };

        await _invoiceAppService.CreateAsync(dto);
        return NoContent();
    }

    public class CreateInvoiceViewModel
    {
        public Guid ProjectId { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; } = DateTime.Now;
        public DateTime DueDate { get; set; } = DateTime.Now.AddDays(15);
        public decimal TaxRate { get; set; } = 20;
        public string Currency { get; set; } = "TRY";

        public List<CreateInvoiceItemViewModel> Items { get; set; } = new();
    }

    public class CreateInvoiceItemViewModel
    {
        public string Description { get; set; }
        public decimal Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
    }
}
