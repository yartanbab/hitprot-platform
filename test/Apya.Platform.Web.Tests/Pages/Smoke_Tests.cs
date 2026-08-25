using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Shouldly;
using Xunit;
using Apya.Platform.Application.Projects;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Customers;
using Apya.Platform.Expenses;
using Apya.Platform.Invoices;

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
    [InlineData("/Documents")]
    [InlineData("/Documents/Scope")]
    [InlineData("/Settings")]
    [InlineData("/Settings/Menu")]
    public async Task Page_ReturnsOkOrRedirect(string url)
    {
        var response = await Client.GetAsync(url);
        var sc = (int)response.StatusCode;
        // 200 (açık) veya 302 (login'e yönlendirme) — 4xx/5xx değil.
        sc.ShouldBeInRange(200, 399, $"{url} beklenenin dışında {sc} döndü");
    }

    // ── API yetkilendirme (host-bağımsız) ──────────────────────────────────
    // Test host'u AddAlwaysAllowAuthorization + FakeCurrentPrincipalAccessor
    // kullandığından HTTP 401 burada hiçbir zaman gözlemlenemez. Bunun yerine
    // AppService sınıflarının [Authorize] taşıdığı doğrulanır — gerçek host'ta
    // anonim isteğin 401 almasını sağlayan koşul budur.
    [Theory]
    [InlineData(typeof(CustomerAppService))]
    [InlineData(typeof(ProjectAppService))]
    [InlineData(typeof(InvoiceAppService))]
    [InlineData(typeof(ExpenseAppService))]
    [InlineData(typeof(CashMovementAppService))]
    [InlineData(typeof(CashAccountAppService))]
    public void AppService_RequiresAuthorization(Type appServiceType)
    {
        appServiceType.IsDefined(typeof(AuthorizeAttribute), inherit: true)
            .ShouldBeTrue($"{appServiceType.Name} [Authorize] taşımıyor — anonim API erişimi açık kalır");
    }
}
