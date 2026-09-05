using System;
using System.Threading.Tasks;
using Apya.Platform.Agreements;
using Apya.Platform.Agreements.Dtos;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Protokol onayı — kayıt sürecinin son adımı. Oturumsuzdur; yetkiyi host'un ürettiği
/// tek kullanımlık davet jetonu verir.
///
/// <para>Aday burada üç şey yapar: belgeyi okur, iki onay kutusunu işaretler, kendi
/// şifresini belirler. Onay anında sözleşme yazılır ve kiracı hesabı açılır.</para>
///
/// <para>Şifre BURADA belirlenir çünkü SMTP henüz yapılandırılmadı: "şifre belirleme
/// bağlantısı" gönderilemiyor. Jeton zaten tek kullanımlık bir kimlik doğrulamadır;
/// rastgele şifre üretip host'a diktire etmek, parolayı üçüncü bir kanaldan dolaştırmak
/// olurdu.</para>
/// </summary>
[AllowAnonymous]
public class ProtokolModel : PlatformPageModel
{
    private readonly IProtocolApprovalAppService _protocolApprovalAppService;

    /// <summary>Bağlantıdan gelen jeton. Formda gizli alanla taşınır.</summary>
    [BindProperty(SupportsGet = true)]
    public string? Token { get; set; }

    [BindProperty]
    public ApproveProtocolInput Input { get; set; } = new();

    /// <summary>Onay öncesi belge ve özet bilgiler. Jeton geçersizse null kalır.</summary>
    public ProtocolInviteDto? Invite { get; private set; }

    /// <summary>Jeton çözülemedi — sayfa formu değil, açıklama basar.</summary>
    public string? BlockingError { get; private set; }

    public ProtokolModel(IProtocolApprovalAppService protocolApprovalAppService)
    {
        _protocolApprovalAppService = protocolApprovalAppService;
    }

    public async Task OnGetAsync()
    {
        // Jeton sorgudan gelir ve forma Input.Token olarak basılır; POST'ta bağlama onu
        // okur. Handler içinde atamak GEÇ kalırdı — doğrulama bağlama sırasında yapılır.
        Input.Token = Token ?? string.Empty;

        await LoadInviteAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await LoadInviteAsync();
        if (Invite == null)
        {
            return Page();
        }

        if (!ModelState.IsValid)
        {
            return Page();
        }

        Input.IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        Input.UserAgent = Request.Headers.UserAgent.ToString();

        ProtocolApprovalResultDto result;
        try
        {
            result = await _protocolApprovalAppService.ApproveAsync(Input);
        }
        catch (BusinessException ex)
        {
            // Jeton yarı yolda geçersizleşmiş olabilir (host yenisini üretti, süre doldu)
            // ya da parola politikası tohumlamada reddedilmiş olabilir.
            ModelState.AddModelError(string.Empty, FriendlyMessage(ex));
            return Page();
        }

        TempData["ProtocolTenantName"] = result.TenantName;
        TempData["ProtocolAdminEmail"] = result.AdminEmail;
        TempData["ProtocolAgreementNumber"] = result.AgreementNumber;

        return RedirectToPage("./ProtokolTamam");
    }

    private async Task LoadInviteAsync()
    {
        // GET'te sorgudan, POST'ta gizli alandan gelir.
        var token = Token.IsNullOrWhiteSpace() ? Input.Token : Token!;

        try
        {
            Invite = await _protocolApprovalAppService.GetByTokenAsync(token ?? string.Empty);
        }
        catch (BusinessException ex)
        {
            BlockingError = FriendlyMessage(ex);
        }
    }

    /// <summary>
    /// Hata kodunu Türkçe metne çevirir. Kod → metin eşlemesi yoksa localizer ham kodu
    /// basar; bu sayfa oturumsuz bir müşteri yüzü olduğu için orada "Platform:Agreement:..."
    /// görünmesi kabul edilemez.
    /// </summary>
    private string FriendlyMessage(BusinessException ex) => ex.Code switch
    {
        PlatformDomainErrorCodes.AgreementInviteInvalid => L["Protokol:InviteInvalid"].Value,
        PlatformDomainErrorCodes.AgreementInviteExpired => L["Protokol:InviteExpired"].Value,
        PlatformDomainErrorCodes.AgreementConsentRequired => L["Protokol:ConsentRequired"].Value,
        PlatformDomainErrorCodes.RegistrationRequestAlreadyProvisioned => L["Protokol:AlreadyDone"].Value,

        // Yukarıdakiler bu sayfanın kendi hataları. Geri kalanı hesap açılışından gelir
        // (ör. vergi numarası başka bir müşteride) ve kodunun tr karşılığı sözlükte VARDIR;
        // doğrudan ex.Message'a düşseydik kullanıcı ham "Platform:Error:..." kodunu görürdü.
        _ => LocalizedOrRaw(ex)
    };

    private string LocalizedOrRaw(BusinessException ex)
    {
        if (string.IsNullOrWhiteSpace(ex.Code))
        {
            return ex.Message;
        }

        var localized = L[ex.Code];

        return localized.ResourceNotFound ? ex.Message : localized.Value;
    }
}
