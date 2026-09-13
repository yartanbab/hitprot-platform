using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Apya.Platform.Consents;
using Apya.Platform.Consents.Dtos;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.RegistrationRequests.Dtos;
using Apya.Platform.Tenants;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Volo.Abp;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Giriş ekranından ulaşılan kayıt talebi sihirbazı. Self-servis kayıt kapalı olduğu
/// için aday müşterinin tek giriş kapısı burasıdır; talep host paneline düşer ve
/// hesap ancak onaydan ve protokol onayından sonra açılır.
/// <para>
/// Adımlar TEK forma basılır, aralarında istemci tarafında gezinilir: sunucu tarafı
/// çok adımlı bir durum makinesi (TempData / gizli taşıma) kurmak, oturumsuz bir
/// formda yarıda kalan adayın verisini kaybetme riskini ve antiforgery karmaşasını
/// bedavaya getirirdi. JavaScript kapalıysa bütün alanlar görünür kalır ve tek
/// gönderimle çalışır.
/// </para>
/// <para>
/// IP ve tarayıcı bilgisi SUNUCUDA yakalanır — <see cref="IRegistrationRequestAppService"/>
/// HTTP API olarak açılmadığından bu sayfa tek yazma sınırıdır.
/// </para>
/// </summary>
[AllowAnonymous]
public class RegistrationRequestModel : PlatformPageModel
{
    private readonly IRegistrationRequestAppService _registrationRequestAppService;
    private readonly IConsentAppService _consentAppService;

    [BindProperty]
    public CreateRegistrationRequestDto Input { get; set; } = new();

    /// <summary>KVKK aydınlatma onayı — işaretlenmeden form gönderilemez.</summary>
    [BindProperty]
    public bool AcceptKvkk { get; set; }

    /// <summary>
    /// Bal küpü. Gerçek kullanıcıya görünmez, bot doldurur; doluysa istek başarılı
    /// gibi yanıtlanır ama HİÇBİR kayıt oluşmaz (bota "engellendin" sinyali vermeyiz).
    /// </summary>
    [BindProperty]
    public string? Website { get; set; }

    public RegistrationRequestModel(
        IRegistrationRequestAppService registrationRequestAppService,
        IConsentAppService consentAppService)
    {
        _registrationRequestAppService = registrationRequestAppService;
        _consentAppService = consentAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadPlanPricesAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!AcceptKvkk)
        {
            ModelState.AddModelError(nameof(AcceptKvkk), L["RegistrationRequest:KvkkRequired"].Value);
        }

        if (!ModelState.IsValid)
        {
            return await RedisplayAsync();
        }

        // Bal küpü doluysa botu sessizce başarıya yönlendir.
        if (!Website.IsNullOrWhiteSpace())
        {
            return RedirectToPage("./RegistrationRequestSent");
        }

        Input.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        Input.UserAgent = Request.Headers.UserAgent.ToString();

        try
        {
            await _registrationRequestAppService.CreateAsync(Input);
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.RegistrationRequestRateLimitExceeded)
        {
            ModelState.AddModelError(string.Empty, L["Platform:RegistrationRequest:RateLimitExceeded"].Value);
            return await RedisplayAsync();
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.RegistrationRequestEmailAlreadyRegistered)
        {
            // Hata e-posta alanına bağlanır ki aday nereyi düzelteceğini görsün. Mesaj,
            // "hesabınız var" ile "talebiniz işlemde" ayrımını YAPMAZ — bkz.
            // RegistrationRequestManager.EnsureEmailAvailableAsync.
            ModelState.AddModelError(
                $"{nameof(Input)}.{nameof(Input.Email)}",
                L["Platform:RegistrationRequest:EmailAlreadyRegistered"].Value);
            return await RedisplayAsync();
        }

        await TryRecordKvkkConsentAsync();

        return RedirectToPage("./RegistrationRequestSent");
    }

    /// <summary>
    /// KVKK onayını rıza omurgasına da yazar (ispat kaydı). Hata yutulur: talep
    /// zaten kaydedildi, ikincil bir analiz yazımının düşmesi kullanıcıya hata
    /// göstermeyi haklı çıkarmaz.
    /// <para>
    /// Bu, formun AYDINLATMA onayıdır. Protokolün 6. maddesindeki veri işleyen
    /// taahhüdü AYRI bir rızadır ve sözleşme adımında (Faz 2) alınır — ikisi
    /// karıştırılmamalı.
    /// </para>
    /// </summary>
    private async Task TryRecordKvkkConsentAsync()
    {
        try
        {
            await _consentAppService.RecordAsync(new RecordConsentInput
            {
                Type = ConsentType.FormKvkk,
                Granted = true,
                SubjectKind = ConsentSubjectKind.Anonymous,
                SubjectId = Input.Email,
                IpAddress = Input.IpAddress,
                UserAgent = Input.UserAgent,
                SourceRef = RegistrationRequestConsts.ConsentSourceRef
            });
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "Kayıt talebinin KVKK rıza kaydı yazılamadı; talebin kendisi kaydedildi.");
        }
    }

    /// <summary>
    /// Doğrulama hatasıyla form yeniden basılırken bedeller de yeniden yüklenir; aksi
    /// halde kartlar tanımlı bedeli "görüşmede paylaşılır" diye gösterirdi.
    /// </summary>
    private async Task<IActionResult> RedisplayAsync()
    {
        await LoadPlanPricesAsync();
        return Page();
    }

    private async Task LoadPlanPricesAsync()
    {
        PlanPrices = await _registrationRequestAppService.GetPlanPricesAsync();
    }

    /// <summary>Sihirbazın 1. adımındaki paket kartları.</summary>
    public IEnumerable<SalesPlan> Plans => Enum.GetValues<SalesPlan>();

    /// <summary>Tanımlı yıllık bedeller (<c>/PackageManagement</c>); bedeli girilmemiş paket burada yok.</summary>
    public Dictionary<SalesPlan, decimal> PlanPrices { get; private set; } = new();

    /// <summary>
    /// "48.000" / "48.000,50" — kuruşsuz tutarda ondalık basılmaz. Kültür SABİT tr-TR:
    /// tutar TL'dir ve protokoldeki biçimle aynı görünmeli; arayüz dili değişince
    /// "48,000 TL" gibi karma bir yazım çıkmamalı.
    /// </summary>
    public string FormatPrice(decimal price)
        => price.ToString(price == decimal.Truncate(price) ? "N0" : "N2", TrCulture);

    private static readonly CultureInfo TrCulture = CultureInfo.GetCultureInfo("tr-TR");

    public IEnumerable<CompanyType> CompanyTypes => Enum.GetValues<CompanyType>();

    public IEnumerable<RegistrationRequestCompanySize> CompanySizes
        => Enum.GetValues<RegistrationRequestCompanySize>();
}
