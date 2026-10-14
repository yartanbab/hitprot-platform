using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Kiracı hibe detayının üst afişi. Düzen host ayarından gelir; hangi düzen basılırsa basılsın
/// Detail.js'in boyadığı kimlikler sayfada bulunmalıdır (betik düzeni bilmez).
/// </summary>
public class GrantDetailBanner_Tests : PlatformWebTestBase
{
    private static readonly string[] SharedIds =
    {
        "CallPoster", "CallTitle", "BucketChip", "DaysChip", "CallDescription", "CallMetrics",
        "InterestBtn", "BookmarkBtn", "InterestChip", "InterestAppLink", "InterestFeedback", "InterestWithdrawn"
    };

    private readonly IGrantDetailBannerSettingsAppService _settings;

    public GrantDetailBanner_Tests()
    {
        _settings = GetRequiredService<IGrantDetailBannerSettingsAppService>();
    }

    private async Task<Guid> CallIdAsync()
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var call = (await GetRequiredService<IRepository<GrantCall, Guid>>().GetListAsync()).First();
        await uow.CompleteAsync();
        return call.Id;
    }

    [Fact]
    public async Task Ayar_Yazilmadiysa_Kapak_Duzeni_Basilir()
    {
        (await _settings.GetAsync()).Variant.ShouldBe(GrantDetailBannerVariants.Cover);

        var html = await GetResponseAsStringAsync($"/Grants/Detail?id={await CallIdAsync()}");

        html.ShouldContain("apya-banner--cover");
    }

    [Theory]
    [InlineData(GrantDetailBannerVariants.Cover)]
    [InlineData(GrantDetailBannerVariants.Side)]
    [InlineData(GrantDetailBannerVariants.Overlay)]
    public async Task Secilen_Duzen_Basilir_Ve_Betigin_Kimlikleri_Eksiksizdir(string variant)
    {
        await _settings.UpdateAsync(new GrantDetailBannerSettingsDto { Variant = variant });

        var html = await GetResponseAsStringAsync($"/Grants/Detail?id={await CallIdAsync()}");

        html.ShouldContain("apya-banner--" + variant);
        foreach (var id in SharedIds)
        {
            html.Split($"id=\"{id}\"").Length.ShouldBe(2, $"{variant} düzeninde #{id} tam bir kez basılmalı");
        }
    }

    [Fact]
    public async Task Taninmayan_Deger_Varsayilana_Duser()
    {
        await _settings.UpdateAsync(new GrantDetailBannerSettingsDto { Variant = "karusel" });

        (await _settings.GetAsync()).Variant.ShouldBe(GrantDetailBannerVariants.Default);
    }

    [Fact]
    public async Task Ayar_Sayfasi_Uc_Duzeni_Sunar()
    {
        var html = await GetResponseAsStringAsync("/Grants/BannerSettings");

        foreach (var variant in GrantDetailBannerVariants.All)
        {
            html.ShouldContain($"id=\"Variant_{variant}\"");
        }
    }
}
