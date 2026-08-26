using System.IO;
using Apya.Platform.Tenants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// KOTA DUVARI → YÜKSELTME sözleşmesi.
///
/// <para>Kota dolduğunda sunucunun attığı hata KODU, istemcinin düz hata kutusu yerine
/// yükseltme yönlendirmesi göstermesinin tek tetikleyicisidir. Kod ile betik ayrışırsa
/// hiçbir şey patlamaz: kullanıcı yine "paketinizi yükseltin" yazan ama gidecek yeri
/// olmayan kutuyu görür. Bu, ekranda hata vermeyen bir bozulmadır — bu yüzden ölçülür.</para>
/// </summary>
public class QuotaUpsell_Tests
{
    private static string ReadUpsellScript()
    {
        // Test, Web projesinin bin klasöründen koşar; wwwroot oraya kopyalanmaz.
        var path = Path.Combine(
            Directory.GetCurrentDirectory(),
            "..", "..", "..", "..", "..",
            "src", "Apya.Platform.Web", "wwwroot", "js", "apya-quota-upsell.js");

        File.Exists(path).ShouldBeTrue($"Yükseltme betiği bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path);
    }

    [Fact]
    public void Yukseltme_betigi_sunucudaki_kota_kodlarini_taniyor()
    {
        var script = ReadUpsellScript();

        script.ShouldContain(PackageQuotaErrorCodes.MaxProjectsReached);
        script.ShouldContain(PackageQuotaErrorCodes.MaxUsersReached);
    }

    /// <summary>
    /// Yönlendirmenin hedefi "Paketim" ekranıdır. Adres değişirse düğme 404'e gider.
    /// </summary>
    [Fact]
    public void Yukseltme_betigi_Paketim_ekranina_yonlendiriyor()
    {
        ReadUpsellScript().ShouldContain("'/Subscription'");
    }

    /// <summary>
    /// Ekran <c>TenantSettings</c> iznine bağlı. Betik izni sormadan düğme basarsa
    /// yetkisiz kullanıcı 403'e sürüklenir.
    /// </summary>
    [Fact]
    public void Yukseltme_betigi_dugmeyi_izne_bagliyor()
    {
        ReadUpsellScript().ShouldContain("Platform.TenantSettings");
    }
}
