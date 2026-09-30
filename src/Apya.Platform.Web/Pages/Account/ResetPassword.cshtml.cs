using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Validation;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Şifre sıfırlama bağlantısı (ACC-04). Stok ABP akışı kırık bağlantıyı yalnız "geçerli kullanıcı +
/// bozuk jeton" alt durumunda tanıyordu: e-posta istemcisinde kesilmiş (parametresiz) bağlantı
/// AbpValidationException, silinmiş kullanıcı EntityNotFoundException ile hata sayfasına düşüyordu.
/// Anonim ziyaretçi için üçü de aynı şeydir: "bağlantı geçersiz → yeni bağlantı iste".
/// <para>GET salt okur (doğrulama servis çağrısından önce düşer); POST'ta kullanıcı parola
/// değişmeden ÖNCE aranır — yakalamak güvenli. Stok AbpValidationException / AbpIdentityResultException
/// işleyişi POST'ta aynen kalır. Emsal: <see cref="ApyaForgotPasswordModel"/> (görünüm @model ile bağlar).</para>
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
        try
        {
            return await base.OnPostAsync();
        }
        catch (EntityNotFoundException)
        {
            InvalidToken = true;
            return Page();
        }
    }
}
