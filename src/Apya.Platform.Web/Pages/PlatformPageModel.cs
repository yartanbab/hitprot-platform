using System.Net;
using Apya.Platform.Localization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

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
    /// ORTAK 404 (PRJ-13): silinmiş/var olmayan kayda tam sayfa gezinmesi 500 yerine 404 alır — API ile
    /// aynı kural, aynı bulucu (<see cref="IHttpExceptionStatusCodeFinder"/>: EntityNotFoundException ve
    /// AbpExceptionHttpStatusCodeOptions'ta 404'e eşlenen iş kodları, bkz. PlatformWebModule).
    /// <list type="bullet">
    /// <item>Neden burada: PageModel'in kendi filtre kancası EN DIŞ sayfa filtresidir (PageHandlerPageFilter
    /// Order = int.MinValue). AbpUowPageFilter içeride kalır; istisnayı ExceptionHandled=false iken görüp iş
    /// birimini ZATEN geri almış olur → buradaki sonuç değişimi yarım kaydı commit ETMEZ.</item>
    /// <item>Neden yalnız 404: iş hatasını genel olarak ModelState'e çevirmek güvensiz (sayfa hangi veriyle
    /// yeniden çizileceğini bilemez; iç filtrede yakalanan istisna UoW'ca başarı sayılıp yarım değişikliği
    /// kaydeder). İş hatasını yalnız yeniden çizmeyi bilen sayfa yakalar (örn. Projects/Edit).</item>
    /// <item>AJAX/JSON isteğine dokunulmaz: ABP (AbpExceptionPageFilter) içeride işleyip ExceptionHandled=true yapar.</item>
    /// <item>Görünüm: gövdesiz 404 üretimde yalnız HTML gezinmesinde /Error?httpStatusCode=404'e gider
    /// (PlatformWebModule.IsHtmlNavigation, Views/Error); Development'ta tarayıcının 404'ü.</item>
    /// </list>
    /// Yığın izi loglanmaz: mesaj tür + kimlik taşır, istisna denetim kaydında ayrıca durur.
    /// </summary>
    public override void OnPageHandlerExecuted(PageHandlerExecutedContext context)
    {
        if (context.Exception != null
            && !context.ExceptionHandled
            && HttpContext.RequestServices.GetRequiredService<IHttpExceptionStatusCodeFinder>()
                .GetStatusCode(HttpContext, context.Exception) == HttpStatusCode.NotFound)
        {
            Logger.LogWarning("[404] {Path}: {Message}", Request.Path.Value, context.Exception.Message);
            context.Result = NotFound();
            context.ExceptionHandled = true;
        }

        base.OnPageHandlerExecuted(context);
    }
}
