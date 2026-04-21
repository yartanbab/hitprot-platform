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
using Volo.Abp.TenantManagement;
using Volo.Abp.Users;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Apya.Platform.Web.Controllers;

[Authorize]
[Route("Account")]
public class ImpersonationController : AbpController
{
    private readonly SignInManager<Volo.Abp.Identity.IdentityUser> _signInManager;
    private readonly IdentityUserManager _userManager;
    private readonly ITenantRepository _tenantRepository;

    public ImpersonationController(
        SignInManager<Volo.Abp.Identity.IdentityUser> signInManager,
        IdentityUserManager userManager,
        ITenantRepository tenantRepository)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _tenantRepository = tenantRepository;
    }

    [HttpPost("ImpersonateTenant")]
    public async Task<IActionResult> ImpersonateTenantAsync([FromForm] Guid tenantId)
    {
        if (CurrentUser.TenantId.HasValue)
        {
            throw new UnauthorizedAccessException("Sadece Host yoneticileri Tenant hesabina gecis yapabilir.");
        }

        var impersonatorUserId = CurrentUser.Id.Value;
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
            if (adminUser != null)
            {
                // Normal oturum aç (impersonation iptal)
                await _signInManager.SignInAsync(adminUser, isPersistent: false);
            }
        }

        return Redirect("~/");
    }
}
