using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Agreements;
using Apya.Platform.Agreements.Dtos;
using Apya.Platform.Billing;
using Apya.Platform.Billing.Dtos;
using Apya.Platform.Tenants;
using Apya.Platform.Web.Billing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Subscription;

/// <summary>
/// "Paketim" — kiracının kendi paketini, süresini ve kullanım hakkını gördüğü ekran.
/// Host'un <c>/PackageManagement</c> ekranından ayrıdır: burada düzenlenebilir hiçbir alan
/// yoktur, paket içeriği değil KİRACININ DURUMU gösterilir.
///
/// <para>Süre bildirimlerinin derin linki buraya düşer; kullanıcı "süreniz doluyor"
/// bildirimine tıkladığında gideceği bir yer olsun diye bu sayfa açıldı.</para>
/// </summary>
[Authorize(PlatformPermissions.TenantSettings.Default)]
public class IndexModel : AbpPageModel
{
    private readonly IMySubscriptionAppService _mySubscriptionAppService;
    private readonly IMyAgreementAppService _myAgreementAppService;
    private readonly IMyBillingAppService _myBillingAppService;
    private readonly BillingFileStorage _fileStorage;

    public IndexModel(
        IMySubscriptionAppService mySubscriptionAppService,
        IMyAgreementAppService myAgreementAppService,
        IMyBillingAppService myBillingAppService,
        BillingFileStorage fileStorage)
    {
        _mySubscriptionAppService = mySubscriptionAppService;
        _myAgreementAppService = myAgreementAppService;
        _myBillingAppService = myBillingAppService;
        _fileStorage = fileStorage;
    }

    /// <summary>Host bağlamında paket kavramı yoktur — ekran bilgi notuna düşer.</summary>
    public bool IsHost { get; private set; }

    public MySubscriptionDto Subscription { get; private set; } = new();

    /// <summary>
    /// Kiracının hizmet protokolü. <c>null</c> = sözleşme YOK; protokol akışı devreye
    /// girmeden önce kurulmuş kiracılar böyledir ve bu bir hata değildir.
    /// </summary>
    public MyAgreementDto? Agreement { get; private set; }

    /// <summary>Kiracının faturaları. Boş liste normaldir — henüz fatura kesilmemiş olabilir.</summary>
    public IReadOnlyList<SubscriptionInvoiceDto> Invoices { get; private set; } = Array.Empty<SubscriptionInvoiceDto>();

    public async Task OnGetAsync()
    {
        if (CurrentTenant.Id == null)
        {
            IsHost = true;
            return;
        }

        await LoadAsync();
    }

    /// <summary>Kendi faturasının belgesini indirir. Sahiplik denetimi servis tarafında.</summary>
    public async Task<IActionResult> OnGetDownloadInvoiceAsync(Guid id)
    {
        var invoice = await _myBillingAppService.GetAsync(id);
        var path = _fileStorage.ResolveExistingPath(await _myBillingAppService.ResolveInvoiceDocumentAsync(id));

        return path == null
            ? NotFound()
            : PhysicalFile(path, BillingFileStorage.ContentType(invoice.FileName), invoice.FileName);
    }

    /// <summary>
    /// "Ödedim" bildirimi. Kayıt ONAYSIZ doğar; host ekstreyle karşılaştırıp onaylayana
    /// kadar faturayı kapatmaz.
    /// <para>
    /// Dekont İSTEĞE BAĞLI: zorunlu tutmak, elinde dekont olmayan (ör. otomatik ödeme
    /// talimatı) müşterinin bildirimini tamamen engellerdi.
    /// </para>
    /// </summary>
    public async Task<IActionResult> OnPostDeclareAsync(
        Guid id,
        DateTime declarePaidAt,
        decimal declareAmount,
        PaymentMethod declareMethod,
        string? declareReference,
        IFormFile? receipt)
    {
        try
        {
            await _myBillingAppService.DeclarePaymentAsync(id, new DeclarePaymentDto
            {
                PaidAt = declarePaidAt,
                Amount = declareAmount,
                Method = declareMethod,
                Reference = declareReference,
                Receipt = receipt is { Length: > 0 } ? await _fileStorage.SaveAsync(receipt) : null
            });

            TempData["BillingSaved"] = L["Subscription:Billing.Saved"].Value;
        }
        catch (BusinessException ex)
        {
            var localized = string.IsNullOrWhiteSpace(ex.Code) ? null : L[ex.Code];
            TempData["BillingError"] = localized is { ResourceNotFound: false } ? localized.Value : ex.Message;
        }

        return RedirectToPage();
    }

    private async Task LoadAsync()
    {
        Subscription = await _mySubscriptionAppService.GetAsync();
        Agreement = await _myAgreementAppService.GetAsync();
        Invoices = await _myBillingAppService.GetListAsync();
    }

    /// <summary>
    /// Satış e-postasının konu/gövdesi kiracı ve paket bilgisiyle doldurulur — host'un
    /// gelen talebi eşleştirmek için ayrıca soru sormasına gerek kalmasın.
    /// </summary>
    public string BuildMailToLink(string email, string targetPackageName)
    {
        var subject = $"Paket yükseltme talebi: {targetPackageName}";
        var body =
            $"Kurum: {CurrentTenant.Name}\n" +
            $"Mevcut paket: {Subscription.PackageName}\n" +
            $"Talep edilen paket: {targetPackageName}\n\n";

        return $"mailto:{email}?subject={Uri.EscapeDataString(subject)}&body={Uri.EscapeDataString(body)}";
    }
}
