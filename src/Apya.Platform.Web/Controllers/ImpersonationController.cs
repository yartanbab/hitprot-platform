using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Volo.Abp.Identity;
using Volo.Abp.Security.Claims;
using Volo.Abp.SecurityLog;
using Volo.Abp.TenantManagement;
using Volo.Abp.Users;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Apya.Platform.Web.Controllers;

[Authorize]
[Route("Account")]
public class ImpersonationController : AbpController
{
    /// <summary>Güvenlik günlüğü kaynağı — AbpSecurityLogs.Identity sütununa yazılır.</summary>
    private const string SecurityLogIdentity = "Apya.Impersonation";

    private readonly SignInManager<Volo.Abp.Identity.IdentityUser> _signInManager;
    private readonly IdentityUserManager _userManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ISecurityLogManager _securityLogManager;

    public ImpersonationController(
        SignInManager<Volo.Abp.Identity.IdentityUser> signInManager,
        IdentityUserManager userManager,
        ITenantRepository tenantRepository,
        ISecurityLogManager securityLogManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _tenantRepository = tenantRepository;
        _securityLogManager = securityLogManager;
    }

    // SEC-00: Uç noktanın tek kapısı "host bağlamında mıyım" kontrolüydü; izni ne olursa
    // olsun her host oturumu istediği kiracının admin'i olabiliyordu. Tenants.Default
    // seçildi çünkü uca giden İKİ arayüz kapısı da (TenantManagement/Tenants sayfası ve
    // header kiracı rozeti) tam olarak bu izinle çiziliyor — görünür davranış değişmiyor,
    // kapanan tek şey izinsiz kullanıcının ham POST'u.
    [Authorize(TenantManagementPermissions.Tenants.Default)]
    [HttpPost("ImpersonateTenant")]
    public async Task<IActionResult> ImpersonateTenantAsync([FromForm] Guid tenantId)
    {
        if (CurrentUser.TenantId.HasValue)
        {
            throw new UnauthorizedAccessException("Sadece Host yoneticileri Tenant hesabina gecis yapabilir.");
        }

        var impersonatorUserId = CurrentUser.Id!.Value; // Host admin ise Id kesin non-null; TenantId kontrolü üstte yapıldı
        var impersonatorUserName = CurrentUser.UserName;

        // Hedef tenant'a geç
        using (CurrentTenant.Change(tenantId))
        {
            var adminUser = await _userManager.FindByNameAsync("root") ?? await _userManager.FindByNameAsync("admin");
            if (adminUser == null)
            {
                throw new Exception("Platform:Error:AdminUserNotFound");
            }

            var principal = await _signInManager.CreateUserPrincipalAsync(adminUser);
            
            // Impersonator Claim'lerini ekle (ABP'nin otomatik olarak anlaması için)
            var identity = principal.Identities.First();
            identity.AddClaim(new Claim(AbpClaimTypes.ImpersonatorUserId, impersonatorUserId.ToString()));
            
            // Return to my account (Back to Impersonator) bilgisi için
            // Host admin olduğu için impersonatorTenantId NULL olmalıdır.

            await _signInManager.Context.SignInAsync(IdentityConstants.ApplicationScheme, principal);

            // Geçiş hiçbir entity yazmadığı için varlık geçmişi bu akışı kapsamaz;
            // "kim, ne zaman, hangi kiracıya girdi" sorusunun tek kaydı budur.
            await _securityLogManager.SaveAsync(log =>
            {
                log.Identity = SecurityLogIdentity;
                log.Action = "ImpersonateTenant";
                log.UserId = adminUser.Id;
                log.UserName = adminUser.UserName;
                log.ExtraProperties["ImpersonatorUserId"] = impersonatorUserId;
                log.ExtraProperties["ImpersonatorUserName"] = impersonatorUserName;
            });
        }

        return Redirect("~/");
    }

    [HttpPost("BackToImpersonator")]
    public async Task<IActionResult> BackToImpersonatorAsync()
    {
        var impersonatorUserIdOrNull = CurrentUser.FindImpersonatorUserId();
        if (!impersonatorUserIdOrNull.HasValue)
        {
            throw new UnauthorizedAccessException("Zaten kendi hesanizdasiniz.");
        }

        var impersonatorUserId = impersonatorUserIdOrNull.Value;
        
        // Host'a dön (TenantId = null)
        using (CurrentTenant.Change(null))
        {
            var adminUser = await _userManager.FindByIdAsync(impersonatorUserId.ToString());
            if (adminUser == null)
            {
                // Sessizce dönersek kullanıcı kiracı oturumunda kalır ve bunu hiç anlamaz;
                // tek çıkışı oturumu kapatmak olur.
                throw new UnauthorizedAccessException(
                    "Asıl hesabınız bulunamadı. Lütfen oturumu kapatıp yeniden giriş yapın.");
            }

            // Normal oturum aç (impersonation iptal)
            await _signInManager.SignInAsync(adminUser, isPersistent: false);

            await _securityLogManager.SaveAsync(log =>
            {
                log.Identity = SecurityLogIdentity;
                log.Action = "BackToImpersonator";
                log.UserId = adminUser.Id;
                log.UserName = adminUser.UserName;
            });
        }

        return Redirect("~/");
    }
}
