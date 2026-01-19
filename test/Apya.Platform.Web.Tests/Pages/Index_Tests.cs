using System.Threading.Tasks;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

public class Index_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Welcome_Page()
    {
        var response = await GetResponseAsStringAsync("/");
        response.ShouldNotBeNull();
    }
}
