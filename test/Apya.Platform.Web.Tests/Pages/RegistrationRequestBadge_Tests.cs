using System;
using System.Threading.Tasks;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.RegistrationRequests.Dtos;
using Apya.Platform.Shell;
using Apya.Platform.Tenants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>K-02 · Host kenar çubuğundaki "Kayıt Talepleri" rozeti ele alınmamış ("Yeni") talepleri sayar.</summary>
public class RegistrationRequestBadge_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Yeni_kayit_talebi_rozette_sayilir()
    {
        var shell = GetRequiredService<IShellAppService>();
        await GetRequiredService<IRegistrationRequestAppService>().CreateAsync(new CreateRegistrationRequestDto
        {
            RequestedPlan = SalesPlan.Standard,
            CompanyName = $"Rozet Derneği {Guid.NewGuid():N}",
            CompanyType = CompanyType.Association,
            TaxNumber = Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString(),
            Address = "Adres",
            FullName = "Ayşe Yılmaz",
            AuthorizedTitle = "Başkan",
            Email = $"rozet-{Guid.NewGuid():N}@ornek.com",
            Phone = "05551112233"
        });

        (await shell.GetStateAsync()).Badges.NewRegistrationRequests.ShouldBeGreaterThanOrEqualTo(1);
    }
}
