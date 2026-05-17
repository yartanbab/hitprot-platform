using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;
using Apya.Platform.Invoices;

namespace Apya.Platform.Web.Pages.Invoices;

public class PaymentModalModel : AbpPageModel
{
    private readonly IInvoiceAppService _invoiceAppService;
    private readonly ICashAccountAppService _cashAccountAppService;

    [HiddenInput]
    [BindProperty(SupportsGet = true)]
    public Guid InvoiceId { get; set; }

    [BindProperty]
    public decimal Amount { get; set; }

    [BindProperty]
    public string Method { get; set; } = "Havale";

    [BindProperty]
    public string? Reference { get; set; }

    [BindProperty]
    public Guid? CashAccountId { get; set; }

    public string InvoiceCurrency { get; set; } = "TRY";
    public List<SelectListItem> Accounts { get; set; } = new();

    public PaymentModalModel(
        IInvoiceAppService invoiceAppService,
        ICashAccountAppService cashAccountAppService)
    {
        _invoiceAppService = invoiceAppService;
        _cashAccountAppService = cashAccountAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        var invoice = await _invoiceAppService.GetAsync(InvoiceId);
        InvoiceCurrency = invoice.Currency;
        Amount = invoice.TotalAmount;

        var accounts = await _cashAccountAppService.GetListAsync(
            new GetCashAccountsInput { MaxResultCount = 1000, IsActive = true });
        Accounts = accounts.Items
            .Select(a => new SelectListItem($"{a.Name} ({a.Currency})", a.Id.ToString()))
            .ToList();

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _invoiceAppService.AddPaymentAsync(
            InvoiceId, Amount, Method, Reference ?? string.Empty, CashAccountId);
        return NoContent();
    }
}
