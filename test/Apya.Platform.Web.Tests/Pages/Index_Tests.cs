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
        // Kök artık Dashboard'a yönleniyor (commit 7bb4335). Test /Projects
        // beklemeye devam ettiği için main kırmızıydı — bu PR'ın konusuyla
        // ilgisiz, yolda bulunup düzeltildi.
        var response = await GetResponseAsync("/", HttpStatusCode.Found);
        response.Headers.Location.ShouldNotBeNull();
        response.Headers.Location.ToString().ShouldContain("/Dashboard");
    }
}
