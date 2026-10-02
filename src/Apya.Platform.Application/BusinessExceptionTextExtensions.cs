using Volo.Abp;
using Volo.Abp.AspNetCore.ExceptionHandling;

namespace Apya.Platform;

/// <summary>
/// Bir AppService hatayı YUTUP sonucu DTO içinde döndürüyorsa (probe sonucu, toplu işlem satırı)
/// kullanıcıya gidecek metni verir.
/// <para>Neden var: kodla atılan <see cref="BusinessException"/>'ın <c>ex.Message</c>'ı .NET'in İngilizce
/// varsayılanıdır ("Exception of type 'Volo.Abp.BusinessException' was thrown."); istisna ABP'nin hata
/// zarfından geçmediği için kod da kendiliğinden yerelleşmez. Buradaki metin zarftakiyle AYNI kaynaktan
/// gelir: kod tr/en.json'dan çözülür, {Alan} yer tutucuları <c>exception.Data</c>'dan dolar.</para>
/// <para>Web'deki eşi: <c>Pages/PageModelErrorExtensions.UserMessage</c> (PageModel uzantısı olduğu için
/// Application katmanından çağrılamıyor).</para>
/// </summary>
public static class BusinessExceptionTextExtensions
{
    /// <param name="fallback">Kod çözülemezse ya da kodsuz istisnanın mesajı boşsa dönecek metin.</param>
    public static string UserText(this IExceptionToErrorInfoConverter converter, BusinessException exception, string fallback)
    {
        // 'message:' ile atılan istisna kendi cümlesini taşır.
        if (string.IsNullOrWhiteSpace(exception.Code))
        {
            return string.IsNullOrWhiteSpace(exception.Message) ? fallback : exception.Message;
        }

        var message = converter.Convert(exception, options =>
        {
            options.SendExceptionsDetailsToClients = false;
            options.SendStackTraceToClients = false;
        }).Message;

        return string.IsNullOrWhiteSpace(message) ? fallback : message;
    }
}
