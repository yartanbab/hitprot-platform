using System.Threading.Tasks;
using Apya.Platform.Accounts;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Şifre sıfırlama isteği. Stok ABP akışına iki ekleme yapar:
///
/// 1. E-posta alanının baş/son boşlukları kırpılır — ABP'nin <c>[EmailAddress]</c>
///    doğrulaması "ad@x.com " girdisini reddediyor.
/// 2. Kullanıcı hangi kiracıdaysa o bağlama geçilir. Giriş ekranındakiyle aynı sorun:
///    kiracı seçici kapalı olduğu için istek host bağlamında koşar ve kiracı kullanıcısı
///    "bulunamadı" alırdı — bkz. <see cref="ApyaLoginModel"/>.
/// </summary>
public class ApyaForgotPasswordModel : Volo.Abp.Account.Web.Pages.Account.ForgotPasswordModel
{
    private readonly LoginTenantFinder _loginTenantFinder;

    public ApyaForgotPasswordModel(LoginTenantFinder loginTenantFinder)
    {
        _loginTenantFinder = loginTenantFinder;
    }

    public override async Task<IActionResult> OnPostAsync()
    {
        Email = AccountInputTrimmer.Trim(ModelState, "Email", Email);

        // Kiracı zaten çözülmüşse kullanıcının seçimine karışma.
        if (CurrentTenant.Id != null || string.IsNullOrWhiteSpace(Email))
        {
            return await base.OnPostAsync();
        }

        var candidates = await _loginTenantFinder.FindTenantIdsAsync(Email);

        // Eşleşme yok ya da host kullanıcısı → stok akış (host bağlamı) aynen çalışsın.
        // Aynı e-posta birden çok kiracıda varsa ilk aday kullanılır; e-posta kişiye
        // özel olduğu için bu pratikte tek adaydır.
        if (candidates.Count == 0 || candidates[0] == null)
        {
            return await base.OnPostAsync();
        }

        using (CurrentTenant.Change(candidates[0]))
        {
            return await base.OnPostAsync();
        }
    }
}
