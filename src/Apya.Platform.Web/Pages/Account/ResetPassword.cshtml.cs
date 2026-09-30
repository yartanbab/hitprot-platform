using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Account;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Validation;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Şifre sıfırlama bağlantısı (ACC-04). Stok ABP akışı kırık bağlantıyı yalnız "geçerli kullanıcı +
/// bozuk jeton" alt durumunda tanıyordu: e-posta istemcisinde kesilmiş (parametresiz) bağlantı
/// AbpValidationException, silinmiş kullanıcı EntityNotFoundException ile hata sayfasına düşüyordu.
/// Anonim ziyaretçi için üçü de aynı şeydir: "bağlantı geçersiz → yeni bağlantı iste".
/// <para>GET salt okur (doğrulama servis çağrısından önce düşer). POST'ta jeton parola alanlarından ÖNCE
/// denetlenir (salt okur, mutasyon yok): geçersiz bağlantı GET'teki durumu alır, parola formu basılmaz.
/// Böylece var olan kullanıcı + bozuk jeton ile olmayan kullanıcı AYNI yanıtı görür (formdaki gizli UserId
/// değiştirilerek kullanıcı varlığı öğrenilemez) ve GET ile POST arasında süresi dolan jetonda da "yeni
/// bağlantı iste" yolu görünür. Geçerli jetonda stok akış aynen (parola doğrulaması, AbpIdentityResultException
/// uyarısı). Emsal: <see cref="ApyaForgotPasswordModel"/> (görünüm @model ile bağlar).</para>
/// </summary>
public class ApyaResetPasswordModel : Volo.Abp.Account.Web.Pages.Account.ResetPasswordModel
{
    public override async Task<IActionResult> OnGetAsync()
    {
        try
        {
            return await base.OnGetAsync();
        }
        catch (Exception ex) when (ex is AbpValidationException or EntityNotFoundException)
        {
            InvalidToken = true;
            return Page();
        }
    }

    public override async Task<IActionResult> OnPostAsync()
    {
        if (!await IsLinkValidAsync())
        {
            InvalidToken = true;
            return Page();
        }

        return await base.OnPostAsync();
    }

    /// <summary>Jeton bu kullanıcı için geçerli mi (salt okur). Bozuk jeton false, eksik jeton
    /// AbpValidationException, olmayan kullanıcı EntityNotFoundException — üçü de "geçersiz".</summary>
    private async Task<bool> IsLinkValidAsync()
    {
        try
        {
            return await AccountAppService.VerifyPasswordResetTokenAsync(new VerifyPasswordResetTokenInput
            {
                UserId = UserId,
                ResetToken = ResetToken
            });
        }
        catch (Exception ex) when (ex is AbpValidationException or EntityNotFoundException)
        {
            return false;
        }
    }
}
