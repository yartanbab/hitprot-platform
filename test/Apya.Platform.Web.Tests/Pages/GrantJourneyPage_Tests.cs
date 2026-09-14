using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>18d · Hibe Yolculuğum sayfası kiracıya aittir; test host'u host bağlamında koşar.</summary>
public class GrantJourneyPage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Host_Yolculuk_Sayfasinda_Bugune_Yonlenir()
    {
        var response = await Client.GetAsync("/Grants/Journey");

        ((int)response.StatusCode).ShouldBe(302);
        response.Headers.Location!.ToString().ShouldContain("/Grants/Today");
    }
}
