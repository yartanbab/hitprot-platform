using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Web.Brand;
using Apya.Platform.Web.TagHelpers;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Shouldly;
using Xunit;

namespace Apya.Platform.Brand;

/// <summary>
/// APYA işareti · sunucu tarafı üretici ve &lt;apya-mark&gt; tag helper'ı.
/// Ölçüler marka paketinden: docs/design/brand/kaynak/README.md "İşaret geometrisi".
/// </summary>
public class ApyaMarkSvg_Tests
{
    private static int Count(string html, string token) => Regex.Matches(html, Regex.Escape(token)).Count;

    [Fact]
    public void Standart_isaret_13_isin_ve_ekran_ibresi_basar()
    {
        var svg = ApyaMarkSvg.Render(48);

        Count(svg, "class=\"apya-mark__ray\"").ShouldBe(13);
        svg.ShouldContain("data-state=\"ready\"");
        svg.ShouldContain("viewBox=\"0 0 100 100\"");
        svg.ShouldContain("stroke-width=\"4.5\"");
        svg.ShouldContain($"points=\"{ApyaMarkSvg.NeedleNorth}\"");
        svg.ShouldContain($"points=\"{ApyaMarkSvg.NeedleSouth}\" fill=\"currentColor\" opacity=\".38\"");
        svg.ShouldContain("rotate(332.31 50 50)");
    }

    [Theory]
    [InlineData(20, "ready", "6")]
    [InlineData(31, "ready", "6")]
    [InlineData(32, "ready", "4.5")]
    [InlineData(56, "suggest", "6")]
    public void Cizgi_kalinligi_boyuta_ve_oneri_durumuna_gore(int size, string state, string expected)
    {
        ApyaMarkSvg.Render(size, state).ShouldContain($"stroke=\"currentColor\" stroke-width=\"{expected}\"");
    }

    [Fact]
    public void Onalti_pikselin_altinda_mikro_surume_duser()
    {
        var svg = ApyaMarkSvg.Render(12, "thinking");

        svg.ShouldNotContain("apya-mark__ray");
        Count(svg, "<line ").ShouldBe(3);
        svg.ShouldContain("stroke-width=\"9\"");
        svg.ShouldContain($"points=\"{ApyaMarkSvg.MicroNeedleNorth}\"");
        svg.ShouldContain($"points=\"{ApyaMarkSvg.MicroNeedleSouth}\"");

        ApyaMarkSvg.Render(16).ShouldContain("apya-mark__ray");
        ApyaMarkSvg.Render(48, micro: true).ShouldNotContain("apya-mark__ray");
    }

    [Fact]
    public void Baski_surumu_opakliksiz_kontur_ibre_basar()
    {
        var svg = ApyaMarkSvg.Render(48, print: true);

        svg.ShouldContain($"points=\"{ApyaMarkSvg.PrintNeedleNorth}\"");
        svg.ShouldContain($"points=\"{ApyaMarkSvg.PrintNeedleSouth}\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\"");
        svg.ShouldNotContain("opacity");
    }

    [Fact]
    public void Etiketsiz_isaret_sustur_etiketli_isaret_kodlanmis_ad_tasir()
    {
        var decorative = ApyaMarkSvg.Render();
        decorative.ShouldContain("aria-hidden=\"true\"");
        decorative.ShouldNotContain("role=");

        var named = ApyaMarkSvg.Render(label: "Asistan <düşünüyor> & yazıyor");
        named.ShouldContain("role=\"img\"");
        named.ShouldContain("aria-label=\"Asistan &lt;düşünüyor&gt; &amp; yazıyor\"");
        named.ShouldNotContain("aria-hidden");
    }

    [Theory]
    [InlineData(null, "ready")]
    [InlineData("", "ready")]
    [InlineData("spinning", "ready")]
    [InlineData(" Thinking ", "thinking")]
    [InlineData("off", "off")]
    public void Tanimsiz_durum_hazir_sayilir(string? state, string expected)
    {
        ApyaMarkSvg.Render(24, state).ShouldContain($"data-state=\"{expected}\"");
    }

    [Fact]
    public void Dinleme_suresi_paketteki_formulle_ayni()
    {
        // 0.62 + |((i·5) mod 13) − 6| / 6 × 0.5 — iki basamağa yuvarlanmış (paketteki toFixed(2))
        var expected = Enumerable.Range(0, 13)
            .Select(i => (0.62 + System.Math.Abs((i * 5 % 13) - 6) / 6.0 * 0.5).ToString("0.00", System.Globalization.CultureInfo.InvariantCulture) + "s")
            .ToList();

        ApyaMarkSvg.ListenDurations.ShouldBe(expected);
        ApyaMarkSvg.RayAngles.ShouldBe(Enumerable.Range(0, 13)
            .Select(i => (i * 360.0 / 13).ToString("0.00", System.Globalization.CultureInfo.InvariantCulture)).ToList());
    }

    [Fact]
    public async Task Tag_helper_svg_basar_ve_ek_oznitelikleri_korur()
    {
        var attributes = new TagHelperAttributeList { { "class", "text-muted" }, { "id", "asistan-isaret" } };
        var context = new TagHelperContext(attributes, new Dictionary<object, object>(), "t1");
        var output = new TagHelperOutput("apya-mark", new TagHelperAttributeList { { "class", "text-muted" }, { "id", "asistan-isaret" } },
            (_, _) => Task.FromResult<TagHelperContent>(new DefaultTagHelperContent()));

        var helper = new ApyaMarkTagHelper { Size = 20, State = "streaming", Label = "APYA" };
        await helper.ProcessAsync(context, output);

        output.TagName.ShouldBe("svg");
        output.TagMode.ShouldBe(TagMode.StartTagAndEndTag);
        output.Attributes["class"].Value.ToString()!.Split(' ').ShouldBe(new[] { "text-muted", "apya-mark" }, ignoreOrder: true);
        output.Attributes["id"].Value.ShouldBe("asistan-isaret");
        output.Attributes["data-state"].Value.ShouldBe("streaming");
        output.Attributes["width"].Value.ShouldBe("20");
        output.Attributes["aria-label"].Value.ShouldBe("APYA");
        Count(output.Content.GetContent(), "apya-mark__ray").ShouldBe(13);
    }
}
