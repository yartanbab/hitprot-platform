using System.Net;
using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Faz 4–10 UI smoke testi — her sayfa en az 200 veya auth-redirect (302) dönmeli.
/// Senaryo: anonimüs GET; 500/crash değil, sayfa ayakta.
/// </summary>
public class Smoke_Tests : PlatformWebTestBase
{
    // ── Health ──────────────────────────────────────────────────────────────
    [Fact] public async Task Health_Live_Returns200()
        => await GetResponseAsStringAsync("/health/live");

    [Fact] public async Task Health_Ready_Returns200()
        => await GetResponseAsStringAsync("/health/ready");

    // ── CSP violations endpoint ────────────────────────────────────────────
    [Fact]
    public async Task CspViolations_Endpoint_Exists()
    {
        var resp = await Client.PostAsync("/csp-violations",
            new System.Net.Http.StringContent(
                """{"csp-report":{"blocked-uri":"inline","violated-directive":"script-src"}}""",
                System.Text.Encoding.UTF8, "application/csp-report"));
        resp.StatusCode.ShouldBe(HttpStatusCode.NoContent);
    }

    // ── Ana sayfalar (anonimüs → 302 login redirect kabul edilir) ──────────
    [Theory]
    [InlineData("/")]
    [InlineData("/Customers")]
    [InlineData("/Projects")]
    [InlineData("/Invoices")]
    [InlineData("/Expenses")]
    [InlineData("/CashMovements")]
    [InlineData("/ExchangeRates")]
    [InlineData("/Reports/TrialBalance")]
    [InlineData("/Tasks")]
    [InlineData("/Grants")]
    public async Task Page_ReturnsOkOrRedirect(string url)
    {
        var response = await Client.GetAsync(url);
        var sc = (int)response.StatusCode;
        // 200 (açık) veya 302 (login'e yönlendirme) — 4xx/5xx değil.
        sc.ShouldBeInRange(200, 399, $"{url} beklenenin dışında {sc} döndü");
    }

    // ── API smoke (401 kabul edilir; 500 değil) ────────────────────────────
    [Theory]
    [InlineData("/api/app/customer")]
    [InlineData("/api/app/project")]
    [InlineData("/api/app/invoice")]
    [InlineData("/api/app/expense")]
    [InlineData("/api/app/cash-movement")]
    [InlineData("/api/app/cash-account")]
    public async Task Api_Returns401WhenUnauthenticated(string url)
    {
        var response = await Client.GetAsync(url);
        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized,
            $"{url} beklenen 401 yerine {(int)response.StatusCode} döndü");
    }
}
