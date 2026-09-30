using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using Apya.Platform.Web.Pages;
using HtmlAgilityPack;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Volo.Abp;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.AspNetCore.Mvc.UI.Theme.Shared.Views.Error;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Silinmiş / var olmayan kayda tam sayfa gezinmesi (PRJ-13, TSK-23, GRH-22).
///
/// <para>PlatformPageModel kancası: işleyici istisnası ABP'nin durum bulucusuna göre 404 ise hata görünümü
/// (Views/Error/Default.cshtml) AYNI ADRESTE 404 ile basılır — üretimdeki istisna yeniden yürütmesinin
/// verdiği "Aradığınız kayıt bulunamadı" sayfasıyla birebir, yönlendirme yok; Development'ta da aynı sayfa.
/// Test host'u üretim hata hattıyla koşuyor (ölçüldü: yığında ExceptionHandlerMiddleware), bu yüzden HTTP
/// düzeyinde kancalı ve kancasız yanıt tasarım gereği aynıdır; kancanın kendisini birim testi kilitler.</para>
/// </summary>
public class RecordNotFoundPages_Tests : PlatformWebTestBase
{
    [Theory]
    [InlineData("/Projects/ProjectDetails/{0}")]
    [InlineData("/Projects/Edit/{0}?tab=danger")]
    public async Task Olmayan_proje_sayfasi_ayni_adreste_404_ve_kayit_bulunamadi(string pattern)
    {
        var id = Guid.NewGuid();

        var response = await Client.GetAsync(string.Format(pattern, id));
        var html = await response.Content.ReadAsStringAsync();

        response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
        response.Headers.Location.ShouldBeNull("yönlendirme yok — adres korunur");

        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var state = doc.DocumentNode.SelectSingleNode("//div[@data-apya-state='error-404-record']");
        state.ShouldNotBeNull("hata görünümünün 'kayıt bulunamadı' durumu basılmalı");
        var text = WebUtility.HtmlDecode(state!.InnerText);
        text.ShouldContain("Aradığınız kayıt bulunamadı");
        text.ShouldNotContain("Project", Case.Sensitive);

        // Sayfa aynı adreste basıldığı için kimlik yalnız adresin kendisinde (dil seçicinin returnUrl'ü,
        // "%2F" + kimlik) geçer; hata metnine ya da ham ABP iletisine sızmaz.
        html.Replace("%2F" + id, string.Empty, StringComparison.OrdinalIgnoreCase)
            .ShouldNotContain(id.ToString(), customMessage: "kimlik hata metnine sızmamalı");
        WebUtility.HtmlDecode(html).ShouldNotContain("türünden bir nesne");
    }

    /// <summary>
    /// Kancanın kendisi: 404'e eşlenen istisna → hata görünümü (aynı adres, 404, istisna yeniden yürütmesinin
    /// özelliği); başka durum kodu (iş kuralı → 403) ve ABP'nin zaten işlediği (AJAX) istisna olduğu gibi kalır.
    /// </summary>
    [Fact]
    public void Kanca_404_istisnasini_ayni_adreste_hata_gorunumune_cevirir_digerlerine_dokunmaz()
    {
        using var scope = GetRequiredService<IServiceScopeFactory>().CreateScope();
        var services = scope.ServiceProvider;

        var (page, notFound) = Probe(services, new EntityNotFoundException(typeof(Project), Guid.NewGuid()));
        page.OnPageHandlerExecuted(notFound);

        notFound.ExceptionHandled.ShouldBeTrue();
        var view = notFound.Result.ShouldBeOfType<ViewResult>();
        view.ViewName.ShouldBe("~/Views/Error/Default.cshtml");
        view.StatusCode.ShouldBe(404);
        view.ViewData!.Model.ShouldBeOfType<AbpErrorViewModel>().HttpStatusCode.ShouldBe(404);
        var feature = page.HttpContext.Features.Get<IExceptionHandlerPathFeature>();
        feature.ShouldNotBeNull("hata görünümü istisnayı yeniden yürütmedeki gibi bu özellikten okur");
        feature!.Error.ShouldBeOfType<EntityNotFoundException>();
        feature.Path.ShouldBe(ProbePath);

        var (businessPage, business) = Probe(services, new BusinessException(PlatformDomainErrorCodes.GrantLeadCallNotOpen));
        businessPage.OnPageHandlerExecuted(business);
        business.ExceptionHandled.ShouldBeFalse("iş kuralı (403) kancaya ait değil");
        business.Result.ShouldBeNull();

        var (ajaxPage, ajax) = Probe(services, new EntityNotFoundException(typeof(Project), Guid.NewGuid()), handledByAbp: true);
        ajaxPage.OnPageHandlerExecuted(ajax);
        ajax.Result.ShouldBeNull("ABP'nin işlediği (AJAX/JSON) istisnaya dokunulmaz");
    }

    private const string ProbePath = "/Projects/Edit/qa-ux";

    private sealed class ProbePage : PlatformPageModel
    {
    }

    private static (ProbePage Page, PageHandlerExecutedContext Executed) Probe(
        IServiceProvider services, Exception exception, bool handledByAbp = false)
    {
        var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext { RequestServices = services };
        httpContext.Request.Path = ProbePath;
        var pageContext = new PageContext(new ActionContext(httpContext, new RouteData(), new CompiledPageActionDescriptor()))
        {
            ViewData = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary())
        };
        var page = new ProbePage
        {
            PageContext = pageContext,
            LazyServiceProvider = services.GetRequiredService<IAbpLazyServiceProvider>()
        };
        var executed = new PageHandlerExecutedContext(pageContext, Array.Empty<IFilterMetadata>(), null, page)
        {
            Exception = exception,
            ExceptionHandled = handledByAbp
        };
        return (page, executed);
    }

    /// <summary>
    /// Kanca AJAX/JSON isteğine dokunmaz: ABP içeride işleyip zarfı döner. Zarfın metni de ham tür
    /// adı ve kimlik taşımaz (EntityNotFound metni tüm uygulamada dostane — Localization/ExceptionHandling).
    /// </summary>
    [Fact]
    public async Task Ajax_isteginde_ABP_zarfi_korunur_ve_tur_adi_ile_kimlik_sizmaz()
    {
        var id = Guid.NewGuid();
        var request = new HttpRequestMessage(HttpMethod.Get, $"/Projects/Edit/{id}");
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");

        var response = await Client.SendAsync(request);
        var json = await response.Content.ReadAsStringAsync();

        response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
        response.Headers.Contains("_AbpErrorFormat").ShouldBeTrue("ABP hata zarfı bekleniyordu");
        json.ShouldContain("\"error\"");
        json.ShouldNotContain(id.ToString());
        json.ShouldNotContain("Project", Case.Sensitive);
    }

    /// <summary>
    /// TSK-23: bildirimden silinmiş göreve giden bağlantı sessizce listeye atmıyor; 404 + ne olduğunu
    /// söyleyen durum + "Görevlere dön". Ada bağlanmaz (API çağrısı ve ABP penceresi olmaz).
    /// </summary>
    [Fact]
    public async Task Olmayan_gorev_sayfasi_sessizce_listeye_atmaz_404_ve_durum_basar()
    {
        var response = await Client.GetAsync($"/Tasks/Detail/{Guid.NewGuid()}");
        var html = await response.Content.ReadAsStringAsync();

        response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
        response.Headers.Location.ShouldBeNull("sessiz yönlendirme olmamalı");

        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var state = doc.DocumentNode.SelectSingleNode("//div[@data-apya-state='task-not-found']");
        state.ShouldNotBeNull("görev bulunamadı durumu basılmalı");
        WebUtility.HtmlDecode(state!.InnerText).ShouldContain("Bu görev bulunamadı");
        state.SelectSingleNode(".//a[@href='/Tasks']").ShouldNotBeNull("Görevlere dön bağlantısı");
        doc.GetElementbyId("task-detail-page-island").ShouldBeNull("ada bağlanmamalı");
    }

    /// <summary>
    /// GRH-22: "İlgi talebi bulunamadı" iş kodu 403 değil 404 (metin tr.json'da aynen). Başka iş kodları
    /// ABP varsayılanında (403) kalır.
    /// </summary>
    [Fact]
    public void Ilgi_talebi_bulunamadi_kodu_404_diger_is_kodlari_403_kalir()
    {
        var finder = GetRequiredService<IHttpExceptionStatusCodeFinder>();
        var httpContext = new Microsoft.AspNetCore.Http.DefaultHttpContext();

        finder.GetStatusCode(httpContext, new BusinessException(PlatformDomainErrorCodes.GrantInterestNotFound))
            .ShouldBe(HttpStatusCode.NotFound);
        finder.GetStatusCode(httpContext, new BusinessException(PlatformDomainErrorCodes.GrantLeadCallNotOpen))
            .ShouldBe(HttpStatusCode.Forbidden, "varsayılan eşleme bozulmamalı");
    }
}
