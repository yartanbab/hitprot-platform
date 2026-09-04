using System.Linq;
using Shouldly;
using Xunit;

namespace Apya.Platform.ReleaseNotes;

/// <summary>
/// Sürüm notu kataloğunun sapma koruması.
///
/// <para>Katalog elle düzenlenen bir listedir ve "Yenilikler" penceresi yalnız
/// <see cref="ReleaseNoteCatalog.Latest"/> — yani <c>All[0]</c> — sürümünü gösterir. Yeni
/// sürüm listenin BAŞINA değil de sonuna eklenirse pencere eski sürümü göstermeye devam
/// eder ve yeni yayın kullanıcıya hiç duyurulmaz; sayfa yine açıldığı için hiçbir test
/// bunu yakalamaz.</para>
///
/// <para>Sürüm kimliği görülme takibinin anahtarıdır: iki not aynı <c>Version</c> ile
/// gelirse, ilkini görmüş kullanıcı ikincisini hiç görmez.</para>
/// </summary>
public class ReleaseNoteCatalog_Tests
{
    [Fact]
    public void Katalog_bos_olamaz()
    {
        ReleaseNoteCatalog.All.ShouldNotBeEmpty();
    }

    [Fact]
    public void Surum_kimlikleri_benzersizdir()
    {
        var versions = ReleaseNoteCatalog.All.Select(r => r.Version).ToList();

        versions.Distinct().Count().ShouldBe(versions.Count,
            "aynı Version'a sahip iki not, görülme takibini bozar");
    }

    /// <summary>
    /// Liste EN YENİ İLK sıralanır. Sürüm kimliği "yyyy.MM.dd" olduğu için sıralama
    /// ordinal karşılaştırmayla doğrulanabilir.
    /// </summary>
    [Fact]
    public void En_yeni_surum_listenin_basindadir()
    {
        var versions = ReleaseNoteCatalog.All.Select(r => r.Version).ToList();

        versions.ShouldBe(
            versions.OrderByDescending(v => v, System.StringComparer.Ordinal).ToList(),
            "yeni sürüm listenin BAŞINA eklenmeli; Latest = All[0]");
    }

    [Fact]
    public void Latest_ilk_ogedir()
    {
        ReleaseNoteCatalog.Latest.ShouldBeSameAs(ReleaseNoteCatalog.All[0]);
    }

    [Fact]
    public void Her_surumun_basligi_tarihi_ve_en_az_bir_maddesi_vardir()
    {
        foreach (var note in ReleaseNoteCatalog.All)
        {
            note.Version.ShouldNotBeNullOrWhiteSpace();
            note.Date.ShouldNotBeNullOrWhiteSpace();
            note.Title.ShouldNotBeNullOrWhiteSpace();
            note.Items.ShouldNotBeEmpty($"{note.Version} sürümünde madde yok");

            foreach (var item in note.Items)
            {
                item.Title.ShouldNotBeNullOrWhiteSpace($"{note.Version} sürümünde başlıksız madde var");
                item.Description.ShouldNotBeNullOrWhiteSpace($"{note.Version} / {item.Title} açıklamasız");
            }
        }
    }

    /// <summary>
    /// Madde anahtarı yayın kararının (onay / paket / seviye) tek bağıdır. Anahtar boş
    /// kalır ya da sürüm içinde tekrar ederse iki farklı maddenin kararı birbirine
    /// karışır — üstelik ekran normal göründüğü için bu sessizce olur.
    /// </summary>
    [Fact]
    public void Madde_anahtarlari_surum_icinde_benzersiz_ve_dolu()
    {
        foreach (var note in ReleaseNoteCatalog.All)
        {
            var keys = note.Items.Select(i => i.Key).ToList();

            keys.ShouldAllBe(k => !string.IsNullOrWhiteSpace(k),
                $"{note.Version} sürümünde anahtarsız madde var");

            keys.Distinct().Count().ShouldBe(keys.Count,
                $"{note.Version} sürümünde anahtar tekrarı var — yayın kararları karışır");
        }
    }

    /// <summary>Anahtar başlıktan türer: aynı başlık her koşuda aynı anahtarı vermeli.</summary>
    [Fact]
    public void Anahtar_baslikla_kararlidir()
    {
        var item = ReleaseNoteCatalog.All[0].Items[0];
        var yeniden = new ReleaseNote("9999.01.01", "test", "test",
            new ReleaseNoteItem(item.Category, item.Title, "başka açıklama"));

        yeniden.Items[0].Key.ShouldBe(item.Key);
    }
}
