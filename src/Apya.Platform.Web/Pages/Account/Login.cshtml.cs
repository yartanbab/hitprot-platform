using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Accounts;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Volo.Abp.Account.Web;
using Volo.Abp.Identity;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Giriş ekranı: kullanıcı kiracı (müşteri) adı yazmadan girebilsin diye ABP'nin
/// stok akışına kiracı bulma adımı ekler.
///
/// Stok ABP davranışı, isteğin başında çözülmüş kiracı bağlamında kullanıcı arar.
/// Kiracı seçici kapalı olduğu için (bkz. PlatformSettings.Account.ShowTenantSwitch)
/// bağlam daima host'tur ve kiracı kullanıcıları şifreleri doğru olsa bile
/// "Kullanıcı adı ya da şifre geçersiz!" alırdı. Burada girilen kullanıcı adı/e-posta
/// hangi kiracıya aitse o bağlama geçilip giriş normal akışına devredilir.
/// </summary>
public class ApyaLoginModel : Volo.Abp.Account.Web.Pages.Account.LoginModel
{
    /// <summary>
    /// Aynı kullanıcı adı birden fazla kiracıda olabilir — ABP her kiracıya "admin"
    /// açtığı için bu istisna değil, kural. Doğru kiracıyı ayırt etmenin tek yolu
    /// şifreyi denemek; ancak şifre doğrulaması kasten pahalıdır (PBKDF2), dolayısıyla
    /// oturumsuz bir uçta sınırsız denenemez. Bu tavan, kiracı sayısı büyüdükçe giriş
    /// ekranının bir CPU tüketim hedefine dönüşmesini engeller.
    /// Tavana takılan kullanıcı e-postasıyla girerek tek eşleşme üretebilir.
    /// </summary>
    private const int MaxTenantProbe = 25;

    private readonly LoginTenantFinder _loginTenantFinder;

    public ApyaLoginModel(
        IAuthenticationSchemeProvider schemeProvider,
        IOptions<AbpAccountOptions> accountOptions,
        IOptions<IdentityOptions> identityOptions,
        IdentityDynamicClaimsPrincipalContributorCache dynamicClaimsPrincipalContributorCache,
        IWebHostEnvironment webHostEnvironment,
        LoginTenantFinder loginTenantFinder)
        : base(schemeProvider, accountOptions, identityOptions, dynamicClaimsPrincipalContributorCache, webHostEnvironment)
    {
        _loginTenantFinder = loginTenantFinder;
    }

    public override async Task<IActionResult> OnPostAsync(string action)
    {
        TrimUserNameInput();

        var tenantId = await ResolveTenantAsync(action);

        if (tenantId == null)
        {
            return await base.OnPostAsync(action);
        }

        using (CurrentTenant.Change(tenantId))
        {
            return await base.OnPostAsync(action);
        }
    }

    /// <summary>
    /// Girişin hangi kiracı bağlamında denenmesi gerektiğini bulur.
    /// <c>null</c> dönerse stok akış (host bağlamı) aynen çalışır.
    /// </summary>
    private async Task<Guid?> ResolveTenantAsync(string action)
    {
        // Kiracı zaten çözülmüşse (querystring/çerez ile) kullanıcının seçimine karışma.
        if (CurrentTenant.Id != null)
        {
            return null;
        }

        if (string.Equals(action, "Cancel", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var userNameOrEmail = LoginInput?.UserNameOrEmailAddress;
        if (string.IsNullOrWhiteSpace(userNameOrEmail) || string.IsNullOrEmpty(LoginInput?.Password))
        {
            return null;
        }

        var candidates = await _loginTenantFinder.FindTenantIdsAsync(userNameOrEmail);

        // Hiç eşleşme yok ya da yalnız host'ta var → stok akış. Kullanıcı bulunamadığında
        // ABP'nin verdiği mesajın aynısı üretilir, böylece "bu kullanıcı sistemde var mı"
        // sorusu dışarıdan yanıt farkıyla anlaşılamaz.
        if (candidates.Count == 0 || (candidates.Count == 1 && candidates[0] == null))
        {
            return null;
        }

        // Tek aday varsa şifreyi burada denemeye gerek yok — doğrudan o bağlama geç,
        // kilitlenme/2FA/"şifre yanlış" mesajlarını ABP'nin kendi akışı üretsin.
        if (candidates.Count == 1)
        {
            return candidates[0];
        }

        return await ProbeTenantsAsync(candidates, userNameOrEmail, LoginInput.Password);
    }

    /// <summary>
    /// Birden fazla kiracıda aynı kullanıcı adı varsa şifresi tutan kiracıyı bulur.
    /// UserManager.CheckPasswordAsync bilerek seçildi: SignInManager'ın aksine başarısız
    /// deneme sayacını artırmaz, yani kiracı arama kullanıcıyı kilitlemez. Kilitlenme ve
    /// 2FA kontrolleri asıl girişte ABP tarafından zaten yapılır.
    /// </summary>
    private async Task<Guid?> ProbeTenantsAsync(
        IReadOnlyList<Guid?> candidates,
        string userNameOrEmail,
        string password)
    {
        var probeCount = Math.Min(candidates.Count, MaxTenantProbe);

        for (var i = 0; i < probeCount; i++)
        {
            using (CurrentTenant.Change(candidates[i]))
            {
                var user = await UserManager.FindByNameAsync(userNameOrEmail)
                           ?? await UserManager.FindByEmailAsync(userNameOrEmail);

                if (user != null && await UserManager.CheckPasswordAsync(user, password))
                {
                    return candidates[i];
                }
            }
        }

        // Hiçbirinde tutmadı → ilk kiracı adayına düş. Şifre yanlış olduğu için sonuç
        // yine başarısız giriş olacak; önemli olan mesajın ve kilitlenme sayacının
        // host'ta değil gerçek bir kiracıda üretilmesi.
        foreach (var candidate in candidates)
        {
            if (candidate != null)
            {
                return candidate;
            }
        }

        return null;
    }

    /// <summary>
    /// Kullanıcı adı / e-posta alanının baş ve sonundaki boşluklarını kırpar.
    /// Şifreye DOKUNULMAZ. Ayrıntı: <see cref="AccountInputTrimmer"/>.
    /// </summary>
    private void TrimUserNameInput()
    {
        if (LoginInput == null)
        {
            return;
        }

        LoginInput.UserNameOrEmailAddress = AccountInputTrimmer.Trim(
            ModelState,
            "LoginInput.UserNameOrEmailAddress",
            LoginInput.UserNameOrEmailAddress);
    }
}
