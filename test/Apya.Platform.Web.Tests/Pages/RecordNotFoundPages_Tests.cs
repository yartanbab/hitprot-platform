using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Shouldly;
using Volo.Abp;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Silinmiş / var olmayan kayda tam sayfa gezinmesi (PRJ-13, TSK-23, GRH-22).
///
/// <para>PlatformPageModel kancası: işleyici istisnası ABP'nin durum bulucusuna göre 404 ise sonuç
/// NotFound() olur (API ile aynı kural). Test host'u ÜRETİM hata hattıyla koşar (UseErrorPage — ölçüldü:
/// yığında ExceptionHandlerMiddleware): kanca istisnayı işler, gövdesiz 404'ü durum sayfası ara katmanı
/// /Error?httpStatusCode=404'e yönlendirir. Kancasız istisna /Error yeniden yürütmesine düşer (404 +
/// G5'in "kayıt bulunamadı" görünümü); Development'ta ise geliştirici hata sayfası (500).</para>
/// </summary>
public class RecordNotFoundPages_Tests : PlatformWebTestBase
{
    [Theory]
    [InlineData("/Projects/ProjectDetails/{0}")]
    [InlineData("/Projects/Edit/{0}?tab=danger")]
    public async Task Olmayan_proje_sayfasi_istisna_degil_404_durumu(string pattern)
    {
        var id = Guid.NewGuid();

        var response = await Client.GetAsync(string.Format(pattern, id));
        var body = await response.Content.ReadAsStringAsync();

        // Kanca istisnayı sayfada işledi: istisna yolu (yeniden yürütme / geliştirici sayfası) değil,
        // gövdesiz 404 → HTML gezinmesinde durum sayfası yönlendirmesi.
        response.StatusCode.ShouldBe(HttpStatusCode.Redirect, $"durum: {(int)response.StatusCode}");
        (response.Headers.Location?.ToString() ?? string.Empty).ShouldContain("httpStatusCode=404");
        body.ShouldNotContain(id.ToString(), customMessage: "istisna yolundaki ham ABP metni eksik kimliği basardı");
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
