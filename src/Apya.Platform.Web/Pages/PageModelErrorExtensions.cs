using System;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.AspNetCore.ExceptionHandling;

namespace Apya.Platform.Web.Pages;

/// <summary>
/// Sayfanın yakaladığı istisnayı kullanıcıya gösterilecek TEK metne çevirir — ABP'nin JSON hata
/// zarfındakiyle aynı metin: iş kodu tr.json'dan (MapCodeNamespace Platform/Apya/Project), {Alan}
/// yer tutucuları exception.Data'dan doldurulur; çözülemezse genel sunucu hatası metni. Kodla
/// atılan BusinessException'ın <c>ex.Message</c>'ı ("Exception of type 'Volo.Abp.BusinessException'
/// was thrown.") kullanıcıya ASLA basılmaz.
/// <para>AbpPageModel ve PlatformPageModel türevlerinin ikisinde de çalışsın diye PageModel uzantısı.
/// Aynı işin sayfaya özel kopyaları (Admin/Billing FriendlyMessage, Account/Protokol LocalizedOrRaw,
/// Subscription satır içi) bu işte taşınmadı.</para>
/// </summary>
public static class PageModelErrorExtensions
{
    public static string UserMessage(this PageModel page, Exception exception)
        => page.HttpContext.RequestServices
               .GetRequiredService<IExceptionToErrorInfoConverter>()
               .Convert(exception)
               .Message ?? string.Empty;
}
