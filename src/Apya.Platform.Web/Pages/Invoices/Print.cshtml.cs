using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;

namespace Apya.Platform.Web.Pages.Invoices;

[Authorize(PlatformPermissions.Invoices.Default)]
public class PrintModel : AbpPageModel
{
    private readonly IInvoiceAppService _invoiceAppService;
    private readonly IMyCompanyProfileAppService _myCompanyProfileAppService;

    public InvoiceDto InvoiceInfo { get; set; } = null!;

    /// <summary>
    /// Faturayı kesen kurum — başlığa unvan, vergi dairesi/no ve adres olarak basılır.
    /// <c>null</c> = host bağlamı; host'un kurum profili yoktur, başlık platformun kendisidir.
    /// </summary>
    public MyCompanyProfileDto? Issuer { get; private set; }

    public PrintModel(
        IInvoiceAppService invoiceAppService,
        IMyCompanyProfileAppService myCompanyProfileAppService)
    {
        _invoiceAppService = invoiceAppService;
        _myCompanyProfileAppService = myCompanyProfileAppService;
    }

    public async Task<IActionResult> OnGetAsync(Guid id)
    {
        InvoiceInfo = await _invoiceAppService.GetAsync(id);
        if (InvoiceInfo == null)
        {
            return NotFound();
        }

        if (CurrentTenant.Id != null)
        {
            Issuer = await _myCompanyProfileAppService.GetAsync();
        }

        return Page();
    }

    /// <summary>Aynı faturanın indirilebilir PDF kopyası (aynı okuma, aynı yetki).</summary>
    public async Task<IActionResult> OnGetPdfAsync(Guid id)
    {
        var invoice = await _invoiceAppService.GetAsync(id);
        var issuer = CurrentTenant.Id != null ? await _myCompanyProfileAppService.GetAsync() : null;
        var bytes = InvoicePdf.Build(invoice, issuer, L, Clock.Now);
        return File(bytes, "application/pdf", $"{L["Invoice:Pdf:FileName"]}_{invoice.InvoiceNumber}.pdf");
    }
}
