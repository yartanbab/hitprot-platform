using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Apya.Platform.Web.Pages.Account;

/// <summary>
/// Giriş / kayıt / şifre sıfırlama formlarındaki kimlik alanlarının baş ve sonundaki
/// boşlukları kırpar. Kopyala-yapıştır ile gelen görünmez boşluk yüzünden doğru bilgi
/// "geçersiz" sayılmasın diye.
/// Şifre alanlarına HİÇ uygulanmaz — boşluk şifrenin geçerli bir parçası olabilir.
/// </summary>
internal static class AccountInputTrimmer
{
    /// <summary>
    /// Kırpılmış değeri döner. Kırpma yapıldıysa alanın ModelState kaydı silinir; bunun
    /// iki etkisi var: (1) doğrulama kırpılmış değer üzerinden koşar — ABP'nin e-posta
    /// biçim kontrolü "ad@x.com " girdisini reddediyor, (2) form yeniden basıldığında
    /// kutuda kırpılmış hâli görünür (etiket yardımcıları model yerine ModelState'e bakar).
    ///
    /// Yalnız boşluktan oluşan girdi KIRPILMAZ: kırpılsa alan boşalır ve ModelState
    /// silindiği için "bu alan zorunludur" uyarısı da kaybolurdu.
    /// </summary>
    public static string? Trim(ModelStateDictionary modelState, string modelStateKey, string? value)
    {
        if (value == null)
        {
            return null;
        }

        var trimmed = value.Trim();
        if (trimmed == value || trimmed.Length == 0)
        {
            return value;
        }

        modelState.Remove(modelStateKey);
        return trimmed;
    }
}
