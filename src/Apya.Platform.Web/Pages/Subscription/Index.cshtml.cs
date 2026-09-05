using System;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Agreements;
using Apya.Platform.Agreements.Dtos;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Authorization;
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

    public IndexModel(
        IMySubscriptionAppService mySubscriptionAppService,
        IMyAgreementAppService myAgreementAppService)
    {
        _mySubscriptionAppService = mySubscriptionAppService;
        _myAgreementAppService = myAgreementAppService;
    }

    /// <summary>Host bağlamında paket kavramı yoktur — ekran bilgi notuna düşer.</summary>
    public bool IsHost { get; private set; }

    public MySubscriptionDto Subscription { get; private set; } = new();

    /// <summary>
    /// Kiracının hizmet protokolü. <c>null</c> = sözleşme YOK; protokol akışı devreye
    /// girmeden önce kurulmuş kiracılar böyledir ve bu bir hata değildir.
    /// </summary>
    public MyAgreementDto? Agreement { get; private set; }

    public async Task OnGetAsync()
    {
        if (CurrentTenant.Id == null)
        {
            IsHost = true;
            return;
        }

        Subscription = await _mySubscriptionAppService.GetAsync();
        Agreement = await _myAgreementAppService.GetAsync();
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
