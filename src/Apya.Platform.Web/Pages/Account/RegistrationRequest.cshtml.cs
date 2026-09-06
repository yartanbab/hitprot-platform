using System;
using System.Collections.Generic;
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

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!AcceptKvkk)
        {
            ModelState.AddModelError(nameof(AcceptKvkk), L["RegistrationRequest:KvkkRequired"].Value);
        }

        if (!ModelState.IsValid)
        {
            return Page();
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
            return Page();
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

    /// <summary>Sihirbazın 1. adımındaki paket kartları.</summary>
    public IEnumerable<SalesPlan> Plans => Enum.GetValues<SalesPlan>();

    public IEnumerable<CompanyType> CompanyTypes => Enum.GetValues<CompanyType>();

    public IEnumerable<RegistrationRequestCompanySize> CompanySizes
        => Enum.GetValues<RegistrationRequestCompanySize>();
}
