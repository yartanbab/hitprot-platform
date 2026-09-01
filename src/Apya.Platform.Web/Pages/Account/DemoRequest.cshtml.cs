using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Consents;
using Apya.Platform.Consents.Dtos;
using Apya.Platform.DemoRequests;
using Apya.Platform.DemoRequests.Dtos;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Volo.Abp;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Giriş ekranından ulaşılan demo talep formu. Self-servis kayıt kapalı olduğu için
/// aday müşterinin tek giriş kapısı burasıdır; talep sistem paneline düşer.
/// <para>
/// IP ve tarayıcı bilgisi SUNUCUDA yakalanır — <see cref="IDemoRequestAppService"/>
/// HTTP API olarak açılmadığından bu sayfa tek yazma sınırıdır.
/// </para>
/// </summary>
[AllowAnonymous]
public class DemoRequestModel : PlatformPageModel
{
    private readonly IDemoRequestAppService _demoRequestAppService;
    private readonly IConsentAppService _consentAppService;

    [BindProperty]
    public CreateDemoRequestDto Input { get; set; } = new();

    /// <summary>KVKK aydınlatma onayı — işaretlenmeden form gönderilemez.</summary>
    [BindProperty]
    public bool AcceptKvkk { get; set; }

    /// <summary>
    /// Bal küpü. Gerçek kullanıcıya görünmez, bot doldurur; doluysa istek başarılı
    /// gibi yanıtlanır ama HİÇBİR kayıt oluşmaz (bota "engellendin" sinyali vermeyiz).
    /// </summary>
    [BindProperty]
    public string? Website { get; set; }

    public DemoRequestModel(
        IDemoRequestAppService demoRequestAppService,
        IConsentAppService consentAppService)
    {
        _demoRequestAppService = demoRequestAppService;
        _consentAppService = consentAppService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!AcceptKvkk)
        {
            ModelState.AddModelError(nameof(AcceptKvkk), L["DemoRequest:KvkkRequired"].Value);
        }

        if (!ModelState.IsValid)
        {
            return Page();
        }

        // Bal küpü doluysa botu sessizce başarıya yönlendir.
        if (!Website.IsNullOrWhiteSpace())
        {
            return RedirectToPage("./DemoRequestSent");
        }

        Input.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        Input.UserAgent = Request.Headers.UserAgent.ToString();

        try
        {
            await _demoRequestAppService.CreateAsync(Input);
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.DemoRequestRateLimitExceeded)
        {
            ModelState.AddModelError(string.Empty, L["Platform:DemoRequest:RateLimitExceeded"].Value);
            return Page();
        }

        await TryRecordKvkkConsentAsync();

        return RedirectToPage("./DemoRequestSent");
    }

    /// <summary>
    /// KVKK onayını rıza omurgasına da yazar (ispat kaydı). Hata yutulur: talep
    /// zaten kaydedildi, ikincil bir analiz yazımının düşmesi kullanıcıya hata
    /// göstermeyi haklı çıkarmaz.
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
                SourceRef = DemoRequestConsts.ConsentSourceRef
            });
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "Demo talebinin KVKK rıza kaydı yazılamadı; talebin kendisi kaydedildi.");
        }
    }

    /// <summary>Formdaki modül onay kutuları.</summary>
    public IReadOnlyList<string> ModuleKeys => DemoRequestConsts.ModuleKeys;

    public IEnumerable<DemoRequestOrganizationKind> OrganizationKinds
        => Enum.GetValues<DemoRequestOrganizationKind>();

    public IEnumerable<DemoRequestCompanySize> CompanySizes
        => Enum.GetValues<DemoRequestCompanySize>();
}
