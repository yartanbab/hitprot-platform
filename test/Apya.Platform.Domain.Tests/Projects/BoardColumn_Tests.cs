using System;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Tests.Domain.Projects;

/// <summary>
/// Faz 4a: özel kolon → durum eşlemesi kuralları.
/// <para>
/// Sistem kolonunun <c>StatusValue</c>'su onun KİMLİĞİ — kartlar oraya Status
/// üzerinden yerleşiyor, değişirse pano bozulur. Özel kolonda ise eşleme
/// isteğe bağlı: null = bugünkü davranış (durum değişmesin).
/// </para>
/// </summary>
public class BoardColumn_Tests
{
    private static BoardColumn Custom() =>
        new(Guid.NewGuid(), Guid.NewGuid(), "Hakem değerlendirmesi", 4, "primary", statusValue: null, isSystem: false);

    private static BoardColumn System() =>
        new(Guid.NewGuid(), Guid.NewGuid(), "Testte", 2, "info", statusValue: 3, isSystem: true);

    [Fact]
    public void Ozel_kolona_durum_eslenebilir()
    {
        var col = Custom();

        col.SetStatusValue(3);

        col.StatusValue.ShouldBe(3);
    }

    [Fact]
    public void Eslemesi_kaldirmak_bugunku_davranisa_dondurur()
    {
        var col = Custom();
        col.SetStatusValue(3);

        col.SetStatusValue(null);

        col.StatusValue.ShouldBeNull();
    }

    [Fact]
    public void Sistem_kolonunun_durumu_DEGISTIRILEMEZ()
    {
        var col = System();

        Should.Throw<BusinessException>(() => col.SetStatusValue(2))
            .Code.ShouldBe("Apya:BoardColumn:SystemStatusImmutable");

        col.StatusValue.ShouldBe(3);
    }

    [Theory]
    [InlineData(0)]   // Cancelled ayrı akış (daraltılmış İptal kolonu)
    [InlineData(5)]
    [InlineData(-1)]
    public void Gecersiz_durum_degeri_reddedilir(int value)
    {
        var col = Custom();

        Should.Throw<BusinessException>(() => col.SetStatusValue(value))
            .Code.ShouldBe("Apya:BoardColumn:InvalidStatusValue");

        col.StatusValue.ShouldBeNull();
    }

    [Fact]
    public void Ad_renk_wip_guncellemesi_eslemeye_DOKUNMAZ()
    {
        // UpdateBoardColumnDto ad+renk+WIP'i birlikte ister; eşleme AYRI uçtan
        // gider ki yeniden adlandırma onu sessizce sıfırlamasın.
        var col = Custom();
        col.SetStatusValue(3);

        col.Update("Kod İncelemesi", "success", 5);

        col.StatusValue.ShouldBe(3);
        col.Name.ShouldBe("Kod İncelemesi");
        col.ColorClass.ShouldBe("success");
        col.WipLimit.ShouldBe(5);
    }
}
