using System;
using System.Threading.Tasks;
using Apya.Platform.Dashboard;
using Microsoft.AspNetCore.Authorization;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// /api/dashboard/* uçlarının gerçekten yönlendirildiği ve çalıştığı smoke testi.
/// Test host'u AddAlwaysAllowAuthorization kullanır; anonim erişimin gerçek host'ta
/// kapalı olduğu <see cref="DashboardAppService"/> üzerindeki [Authorize] ile doğrulanır.
/// </summary>
public class DashboardApi_Tests : PlatformWebTestBase
{
    [Theory]
    [InlineData("/api/dashboard/summary")]
    [InlineData("/api/dashboard/deliveries")]
    [InlineData("/api/dashboard/project-health")]
    [InlineData("/api/dashboard/pending-approvals")]
    [InlineData("/api/dashboard/blocked-tasks")]
    [InlineData("/api/dashboard/statistics")]
    [InlineData("/api/dashboard/income-expense")]
    [InlineData("/api/dashboard/delivery-heatmap")]
    [InlineData("/api/dashboard/layout?viewKey=project-management")]
    public async Task Endpoint_Returns200(string url)
    {
        var response = await Client.GetAsync(url);

        var sc = (int)response.StatusCode;
        sc.ShouldBe(200, $"{url} beklenenin dışında {sc} döndü");
    }

    [Fact]
    public async Task Range_parametresi_kabul_edilir()
    {
        foreach (var range in new[] { "Week", "Month", "Quarter" })
        {
            var response = await Client.GetAsync($"/api/dashboard/summary?range={range}");
            ((int)response.StatusCode).ShouldBe(200, $"range={range} başarısız");
        }
    }

    [Fact]
    public void DashboardAppService_RequiresAuthorization()
    {
        typeof(DashboardAppService).IsDefined(typeof(AuthorizeAttribute), inherit: true)
            .ShouldBeTrue("DashboardAppService [Authorize] taşımıyor — anonim API erişimi açık kalır");
    }
}
