using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;
using Apya.Platform.Documents;
using Apya.Platform.Invoices;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Web.Services;

namespace Apya.Platform.Web.Pages.Invoices;

[Authorize]
public class PaymentModalModel : AbpPageModel
{
    private readonly IInvoiceAppService _invoiceAppService;
    private readonly ICashAccountAppService _cashAccountAppService;
    private readonly IFinanceDocumentAppService _financeDocuments;
    private readonly FinanceDocumentUploads _uploads;

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

    /// <summary>"Belge ekle" alanından gelen dekont dosyaları; faturaya bağlanır.</summary>
    [BindProperty]
    public List<IFormFile> DocumentFiles { get; set; } = new();

    public bool CanAttachDocuments { get; set; }

    /// <summary>Tahsilat penceresi yalnız yeni dekont ekler; bağlı belgeler fatura düzenlemede listelenir.</summary>
    public IReadOnlyList<ProjectExpenseDocumentDto> LinkedDocuments { get; } = Array.Empty<ProjectExpenseDocumentDto>();

    public string InvoiceCurrency { get; set; } = "TRY";
    public List<SelectListItem> Accounts { get; set; } = new();

    public PaymentModalModel(
        IInvoiceAppService invoiceAppService,
        ICashAccountAppService cashAccountAppService,
        IFinanceDocumentAppService financeDocuments,
        FinanceDocumentUploads uploads)
    {
        _invoiceAppService = invoiceAppService;
        _cashAccountAppService = cashAccountAppService;
        _financeDocuments = financeDocuments;
        _uploads = uploads;
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
        CanAttachDocuments = await _financeDocuments.CanAttachAsync();

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();

        // Dosyalar tahsilattan ÖNCE doğrulanır: reddedilen dekont tahsilatı yarım bırakmaz.
        var uploads = await _uploads.StoreAsync(DocumentFiles);
        try
        {
            await _invoiceAppService.AddPaymentAsync(
                InvoiceId, Amount, Method, Reference ?? string.Empty, CashAccountId);
            foreach (var upload in uploads)
            {
                await _financeDocuments.AttachToInvoiceAsync(
                    InvoiceId, upload.FileName, upload.StoredFileName, upload.ContentType, upload.FileSize);
            }
        }
        catch
        {
            _uploads.Discard(uploads);
            throw;
        }

        return NoContent();
    }
}
