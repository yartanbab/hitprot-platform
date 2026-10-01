using System.Net;
using Apya.Platform.Localization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Views.Error;

namespace Apya.Platform.Web.Pages;

/* Inherit your PageModel classes from this class.
 */
public abstract class PlatformPageModel : AbpPageModel
{
    protected PlatformPageModel()
    {
        LocalizationResourceType = typeof(PlatformResource);
    }

    /// <summary>
    /// ORTAK 404 (PRJ-13): silinmiş/var olmayan kayda tam sayfa gezinmesi, API ile aynı kuralla (aynı bulucu
    /// <see cref="IHttpExceptionStatusCodeFinder"/>: EntityNotFoundException ve AbpExceptionHttpStatusCodeOptions'ta
    /// 404'e eşlenen iş kodları, bkz. PlatformWebModule) hata görünümünü AYNI ADRESTE 404 ile basar.
    /// <list type="bullet">
    /// <item>Görünüm: üretimdeki istisna yeniden yürütmesinin (UseErrorPage → ErrorController) verdiği sayfayla
    /// birebir — istisna onun bıraktığı özellikle (IExceptionHandlerPathFeature) Views/Error/Default.cshtml'e
    /// verilir, G5'in ErrorStates'i "Aradığınız kayıt bulunamadı"yı seçer. Yönlendirme yok (adres korunur),
    /// Development'ta da aynı sayfa (geliştirici hata sayfası değil); "işlenmemiş istisna" yerine Warning log.</item>
    /// <item>Neden burada: PageModel'in kendi filtre kancası EN DIŞ sayfa filtresidir (PageHandlerPageFilter
    /// Order = int.MinValue). AbpUowPageFilter içeride kalır; istisnayı ExceptionHandled=false iken görüp iş
    /// birimini ZATEN geri almış olur → buradaki sonuç değişimi yarım kaydı commit ETMEZ.</item>
    /// <item>Neden yalnız 404: iş hatasını genel olarak ModelState'e çevirmek güvensiz (sayfa hangi veriyle
    /// yeniden çizileceğini bilemez; iç filtrede yakalanan istisna UoW'ca başarı sayılıp yarım değişikliği
    /// kaydeder). İş hatasını yalnız yeniden çizmeyi bilen sayfa yakalar (örn. Projects/Edit).</item>
    /// <item>AJAX/JSON isteğine dokunulmaz: ABP (AbpExceptionPageFilter) içeride işleyip ExceptionHandled=true yapar.</item>
    /// </list>
    /// Yığın izi loglanmaz: mesaj tür + kimlik taşır, istisna denetim kaydında ayrıca durur.
    /// </summary>
    public override void OnPageHandlerExecuted(PageHandlerExecutedContext context)
    {
        var exception = context.Exception;
        var services = HttpContext.RequestServices;
        if (exception != null
            && !context.ExceptionHandled
            && services.GetRequiredService<IHttpExceptionStatusCodeFinder>()
                .GetStatusCode(HttpContext, exception) == HttpStatusCode.NotFound)
        {
            Logger.LogWarning("[404] {Path}: {Message}", Request.Path.Value, exception.Message);

            var handled = new ExceptionHandlerFeature { Error = exception, Path = Request.Path.Value ?? string.Empty };
            HttpContext.Features.Set<IExceptionHandlerFeature>(handled);
            HttpContext.Features.Set<IExceptionHandlerPathFeature>(handled);

            context.Result = new ViewResult
            {
                ViewName = "~/Views/Error/Default.cshtml",
                StatusCode = (int)HttpStatusCode.NotFound,
                ViewData = new ViewDataDictionary<AbpErrorViewModel>(ViewData, new AbpErrorViewModel
                {
                    ErrorInfo = services.GetRequiredService<IExceptionToErrorInfoConverter>().Convert(exception),
                    HttpStatusCode = (int)HttpStatusCode.NotFound
                })
            };
            context.ExceptionHandled = true;
        }

        base.OnPageHandlerExecuted(context);
    }
}
