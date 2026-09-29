using Apya.Platform.Web;
using Microsoft.AspNetCore.Http;
using Shouldly;
using Xunit;

namespace Apya.Platform.Middleware;

/// <summary>
/// SÖZLEŞME KİLİDİ — <c>PlatformWebModule.IsHtmlNavigation</c> iki tüketiciye hizmet eder: üretimdeki
/// hata sayfası dalı (<c>UseWhen(IsHtmlNavigation, UseErrorPage)</c>) ve yasak yönlendirmesi
/// (<c>AccessDeniedResultHandler</c> + /AccessDenied). Üretim hattı yerelde (Development) görünmez;
/// davranış burada birebir sabitlenir ki ikisi ayrışmasın ve /Error döngüsü (PUT/DELETE) ya da AJAX'a
/// HTML dönmesi geri gelmesin.
/// </summary>
public class HtmlNavigation_Tests
{
    private static HttpContext Request(string method, string pathAndQuery, string? accept = null, string? requestedWith = null)
    {
        var context = new DefaultHttpContext();
        context.Request.Method = method;

        var queryIndex = pathAndQuery.IndexOf('?');
        context.Request.Path = queryIndex < 0 ? pathAndQuery : pathAndQuery[..queryIndex];
        if (queryIndex >= 0)
        {
            context.Request.QueryString = new QueryString(pathAndQuery[queryIndex..]);
        }

        if (accept != null)
        {
            context.Request.Headers.Accept = accept;
        }

        if (requestedWith != null)
        {
            context.Request.Headers["X-Requested-With"] = requestedWith;
        }

        return context;
    }

    [Theory]
    [InlineData("GET", "/Invoices", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")]
    [InlineData("GET", "/Invoices", null)]
    [InlineData("GET", "/Invoices", "*/*")]
    [InlineData("POST", "/Invoices", "text/html")]
    [InlineData("HEAD", "/Invoices", null)]
    public void Tarayici_gezinmesi_HTML_sayilir(string method, string path, string? accept)
    {
        PlatformWebModule.IsHtmlNavigation(Request(method, path, accept)).ShouldBeTrue();
    }

    [Theory]
    [InlineData("GET", "/Invoices", "application/json", null)]
    [InlineData("GET", "/Invoices", "text/html", "XMLHttpRequest")]
    [InlineData("GET", "/Invoices", null, "xmlhttprequest")]
    [InlineData("GET", "/api/app/project", "text/html", null)]
    [InlineData("GET", "/Error", "text/html", null)]
    [InlineData("GET", "/Error?httpStatusCode=404", "text/html", null)]
    [InlineData("PUT", "/Invoices", "text/html", null)]
    [InlineData("PATCH", "/Invoices", "text/html", null)]
    [InlineData("DELETE", "/Invoices", "text/html", null)]
    public void API_AJAX_hata_sayfasi_ve_yontemi_koruyan_istekler_HTML_sayilmaz(
        string method, string path, string? accept, string? requestedWith)
    {
        PlatformWebModule.IsHtmlNavigation(Request(method, path, accept, requestedWith)).ShouldBeFalse();
    }
}
