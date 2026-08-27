using Apya.Platform.Telemetry;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Telemetry;

/// <summary>
/// Uç kimliği yanlış üretilirse yavaş uç listesi anlamını yitirir: kimlik taşıyan
/// yollar normalize edilmezse her kayıt ayrı "endpoint" sayılır, fazla normalize
/// edilirse farklı uçlar tek satıra düşer.
/// </summary>
public class EndpointUrlNormalizer_Tests
{
    [Theory]
    // Yerel audit log'dan alınmış gerçek yollar
    [InlineData("/Projects/ProjectDetails/3a233119-da82-38d8-5988-1d55d7d0dbb2", "/Projects/ProjectDetails/{id}")]
    [InlineData("/api/app/task/feature/3a233119-22a0-f2e7-9a81-157320c81ad0", "/api/app/task/feature/{id}")]
    // Tire içermeyen ("N") GUID biçimi de kimliktir
    [InlineData("/api/app/project/3a233119da8238d859881d55d7d0dbb2", "/api/app/project/{id}")]
    // Sayısal kimlik
    [InlineData("/Tasks/Detail/42", "/Tasks/Detail/{id}")]
    // Birden fazla kimlik aynı yolda
    [InlineData("/api/app/project/3a233119-da82-38d8-5988-1d55d7d0dbb2/step/7", "/api/app/project/{id}/step/{id}")]
    public void Kimlik_tasiyan_segmentler_isarete_indirgenir(string url, string expected)
    {
        EndpointUrlNormalizer.Normalize(url).ShouldBe(expected);
    }

    [Theory]
    [InlineData("/api/app/task")]
    [InlineData("/Account/Login")]
    [InlineData("/csp-violations")]
    // Rakam İÇEREN ama salt rakam olmayan segment kimlik değildir
    [InlineData("/api/v1/users")]
    // Kısa hex dizisi normal bir yol adı olabilir; yalnız uzun token kimlik sayılır
    [InlineData("/Documents/abc")]
    public void Sabit_yollar_oldugu_gibi_kalir(string url)
    {
        EndpointUrlNormalizer.Normalize(url).ShouldBe(url);
    }

    [Fact]
    public void Uzun_hex_token_kimlik_sayilir()
    {
        // 64 karakterlik SHA-256 özeti — kayda özgüdür, uç adı değildir.
        const string sha = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";

        EndpointUrlNormalizer.Normalize($"/Documents/Download/{sha}")
            .ShouldBe("/Documents/Download/{id}");
    }

    [Fact]
    public void Sorgu_dizesi_ve_fragment_atilir()
    {
        // ABP yalnız yolu yazıyor; yine de savunmacı davranıyoruz.
        EndpointUrlNormalizer.Normalize("/api/app/task?filter=acik&page=2").ShouldBe("/api/app/task");
        EndpointUrlNormalizer.Normalize("/Admin/SystemHealth#client-errors").ShouldBe("/Admin/SystemHealth");
    }

    [Fact]
    public void Sondaki_egik_cizgi_ayri_uc_uretmez()
    {
        EndpointUrlNormalizer.Normalize("/api/app/task/").ShouldBe("/api/app/task");
    }

    [Theory]
    [InlineData(null, "")]
    [InlineData("", "")]
    [InlineData("   ", "")]
    [InlineData("/", "/")]
    public void Bos_ve_kok_yol_patlamaz(string? url, string expected)
    {
        EndpointUrlNormalizer.Normalize(url).ShouldBe(expected);
    }

    /* --- Arama yardımcıları: normalize yol ham satırlarla EŞİT DEĞİLDİR --- */

    [Fact]
    public void Sabit_yolda_onek_yolun_kendisidir()
    {
        // Değişken segment yoksa SQL'de eşitlikle aranabilir.
        EndpointUrlNormalizer.HasPlaceholder("/api/app/task").ShouldBeFalse();
        EndpointUrlNormalizer.LiteralPrefix("/api/app/task").ShouldBe("/api/app/task");
    }

    [Fact]
    public void Degisken_yolda_onek_ilk_isarete_kadardir()
    {
        const string url = "/Projects/ProjectDetails/{id}";

        EndpointUrlNormalizer.HasPlaceholder(url).ShouldBeTrue();
        EndpointUrlNormalizer.LiteralPrefix(url).ShouldBe("/Projects/ProjectDetails/");
    }

    [Fact]
    public void Onek_ham_yolun_gercekten_basidir()
    {
        // Ön-daraltmanın işe yaraması için: ham satır, normalize yolun önekiyle BAŞLAMALI.
        const string raw = "/api/app/project/3a233119-da82-38d8-5988-1d55d7d0dbb2/step/7";

        var normalized = EndpointUrlNormalizer.Normalize(raw);
        var prefix = EndpointUrlNormalizer.LiteralPrefix(normalized);

        raw.ShouldStartWith(prefix);
        prefix.ShouldBe("/api/app/project/");
    }

    [Fact]
    public void Bos_yolda_onek_bos_doner()
    {
        EndpointUrlNormalizer.HasPlaceholder(null).ShouldBeFalse();
        EndpointUrlNormalizer.LiteralPrefix(null).ShouldBe("");
    }
}
