using Shouldly;
using Xunit;

namespace Apya.Platform;

/// <summary>QA-36 · Görev ve gösterge ilerlemesi aynı kuralla yuvarlanır.</summary>
public class ProgressPercent_Tests
{
    [Theory]
    [InlineData(2, 3, 67)]     // aşağı yuvarlama %66 diyordu
    [InlineData(1, 2, 50)]
    [InlineData(1, 8, 13)]     // 12,5 → yarım yukarı
    [InlineData(199, 200, 99)] // bitmeden %100 yok (bankacı yuvarlaması %100 diyordu)
    [InlineData(1, 300, 1)]    // başlamışken %0 yok
    [InlineData(0, 5, 0)]
    [InlineData(5, 5, 100)]
    public void Tek_kural(int done, int total, int expected)
        => ProgressPercent.Of((decimal)done / total).ShouldBe(expected);

    [Fact]
    public void Gosterge_ve_gorev_ayni_kurali_kullanir()
    {
        Apya.Platform.Projects.ProjectIndicatorProgress.Percent(0m, 3m, 2m).ShouldBe(67);
        Apya.Platform.Projects.ProjectIndicatorProgress.Percent(0m, 200m, 199m).ShouldBe(99);
    }
}
