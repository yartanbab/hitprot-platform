using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// GRH-03 · Dönüştürülmüş talep yeniden dönüştürülemez. Soru (<see cref="GrantLead.EnsureNotConverted"/>)
/// kiracı açılmadan ÖNCE sorulabilsin diye <see cref="GrantLead.MarkConverted"/>'dan ayrıldı.
/// </summary>
public class GrantLead_Tests
{
    private static GrantLead NewLead() => new(Guid.NewGuid(), Guid.NewGuid(), "Mavi Enerji", "Ayşe Kaya", "ayse@mavi.test");

    [Fact]
    public void EnsureNotConverted_donusturulmemis_talepte_sessiz_donusturulmuste_reddeder()
    {
        var lead = NewLead();

        Should.NotThrow(() => lead.EnsureNotConverted());

        lead.MarkConverted(Guid.NewGuid());

        Should.Throw<BusinessException>(() => lead.EnsureNotConverted())
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantLeadAlreadyConverted);
    }

    [Fact]
    public void MarkConverted_ikinci_kez_reddedilir_ve_ilk_kiraci_kalir()
    {
        var lead = NewLead();
        var first = Guid.NewGuid();
        lead.MarkConverted(first);

        Should.Throw<BusinessException>(() => lead.MarkConverted(Guid.NewGuid()))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantLeadAlreadyConverted);

        lead.ConvertedTenantId.ShouldBe(first);
        lead.Status.ShouldBe(GrantLeadStatus.MusteriOldu);
    }
}
