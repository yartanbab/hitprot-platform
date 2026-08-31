using System.Linq;
using Apya.Platform.Web.ReleaseNotes;
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

    [Fact]
    public void Find_var_olan_surumu_bulur_olmayana_null_doner()
    {
        var known = ReleaseNoteCatalog.All[0].Version;

        ReleaseNoteCatalog.Find(known).ShouldNotBeNull();
        ReleaseNoteCatalog.Find("1900.01.01").ShouldBeNull();
        ReleaseNoteCatalog.Find(null).ShouldBeNull();
    }
}
