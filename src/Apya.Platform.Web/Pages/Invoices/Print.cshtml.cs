using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;

namespace Apya.Platform.Web.Pages.Invoices;

public class PrintModel : AbpPageModel
{
    private readonly IInvoiceAppService _invoiceAppService;

    public InvoiceDto InvoiceInfo { get; set; } = null!;

    public PrintModel(IInvoiceAppService invoiceAppService)
    {
        _invoiceAppService = invoiceAppService;
    }

    public async Task<IActionResult> OnGetAsync(Guid id)
    {
        InvoiceInfo = await _invoiceAppService.GetAsync(id);
        if (InvoiceInfo == null)
        {
            return NotFound();
        }

        return Page();
    }
}
