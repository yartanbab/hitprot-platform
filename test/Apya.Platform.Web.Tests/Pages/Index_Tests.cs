using System.Net;
using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

public class Index_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Welcome_Page()
    {
        // Açılış ekranı Hızlı İşlemler (2026-11-04 kararı; önceden Genel Bakış).
        var response = await GetResponseAsync("/", HttpStatusCode.Found);
        response.Headers.Location.ShouldNotBeNull();
        response.Headers.Location.ToString().ShouldContain("/Makro");
    }
}
