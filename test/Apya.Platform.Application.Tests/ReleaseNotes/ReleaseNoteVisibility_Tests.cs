using Apya.Platform.ReleaseNotes;
using Apya.Platform.Tenants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Application.ReleaseNotes;

/// <summary>
/// Sürüm notu yayın kapısı. Bu kural yanlışsa hata sessizdir: host'un onaylamadığı ya da
/// yalnız üst pakete açtığı bir madde müşteriye gider ve kimse fark etmez — ekran normal
/// görünür. Bu yüzden "kapalı" tarafın her sebebi ayrı ayrı sabitlenmiştir.
/// </summary>
public class ReleaseNoteVisibility_Tests
{
    private static ReleaseNotePublicationCacheEntry Decision(
        bool approved = true,
        bool modal = true,
        bool history = true,
        string packages = "Basic,Standard,Premium,Enterprise",
        ReleaseNoteAudience audience = ReleaseNoteAudience.Everyone)
        => new()
        {
            Version = "2026.09.02",
            ItemKey = "abc123",
            IsApproved = approved,
            ShowInModal = modal,
            ShowInHistory = history,
            Packages = packages,
            Audience = audience
        };

    [Fact]
    public void Karar_yoksa_gosterilmez()
    {
        ReleaseNoteVisibility.IsVisibleToTenant(null, PackageCode.Enterprise, true, forModal: true)
            .ShouldBeFalse("kataloğa madde eklemek tek başına yayınlamak değildir");
    }

    [Fact]
    public void Onaylanmamis_madde_gosterilmez()
    {
        ReleaseNoteVisibility.IsVisibleToTenant(
            Decision(approved: false), PackageCode.Enterprise, true, forModal: true).ShouldBeFalse();
    }

    [Fact]
    public void Onayli_madde_her_iki_yuzeyde_de_gorunur()
    {
        ReleaseNoteVisibility.IsVisibleToTenant(Decision(), PackageCode.Basic, false, forModal: true).ShouldBeTrue();
        ReleaseNoteVisibility.IsVisibleToTenant(Decision(), PackageCode.Basic, false, forModal: false).ShouldBeTrue();
    }

    /// <summary>Pencere ve geçmiş AYRI kararlardır: biri kapalıyken diğeri açık kalabilir.</summary>
    [Fact]
    public void Pencere_ve_gecmis_bagimsiz_kapatilabilir()
    {
        var yalnizGecmis = Decision(modal: false);
        ReleaseNoteVisibility.IsVisibleToTenant(yalnizGecmis, PackageCode.Premium, false, forModal: true).ShouldBeFalse();
        ReleaseNoteVisibility.IsVisibleToTenant(yalnizGecmis, PackageCode.Premium, false, forModal: false).ShouldBeTrue();

        var yalnizPencere = Decision(history: false);
        ReleaseNoteVisibility.IsVisibleToTenant(yalnizPencere, PackageCode.Premium, false, forModal: true).ShouldBeTrue();
        ReleaseNoteVisibility.IsVisibleToTenant(yalnizPencere, PackageCode.Premium, false, forModal: false).ShouldBeFalse();
    }

    [Fact]
    public void Paket_disindaki_kiraci_gormez()
    {
        var ustPaketler = Decision(packages: "Premium,Enterprise");

        ReleaseNoteVisibility.IsVisibleToTenant(ustPaketler, PackageCode.Basic, false, forModal: true).ShouldBeFalse();
        ReleaseNoteVisibility.IsVisibleToTenant(ustPaketler, PackageCode.Standard, false, forModal: true).ShouldBeFalse();
        ReleaseNoteVisibility.IsVisibleToTenant(ustPaketler, PackageCode.Premium, false, forModal: true).ShouldBeTrue();
        ReleaseNoteVisibility.IsVisibleToTenant(ustPaketler, PackageCode.Enterprise, false, forModal: true).ShouldBeTrue();
    }

    /// <summary>
    /// Dört kutunun da kaldırıldığı madde kimseye gitmez. Boş listeyi "hepsi" saymak,
    /// host'un bilerek kapattığı maddeyi yayında bırakırdı.
    /// </summary>
    [Fact]
    public void Bos_paket_listesi_hicbir_kiraciya_acilmaz()
    {
        var bos = Decision(packages: "");

        ReleaseNoteVisibility.IsVisibleToTenant(bos, PackageCode.Basic, true, forModal: true).ShouldBeFalse();
        ReleaseNoteVisibility.IsVisibleToTenant(bos, PackageCode.Enterprise, true, forModal: false).ShouldBeFalse();
    }

    [Fact]
    public void Kiraci_yoneticisi_seviyesi_normal_kullaniciyi_eler()
    {
        var yoneticiye = Decision(audience: ReleaseNoteAudience.TenantAdmins);

        ReleaseNoteVisibility.IsVisibleToTenant(yoneticiye, PackageCode.Standard, isTenantAdmin: false, forModal: true).ShouldBeFalse();
        ReleaseNoteVisibility.IsVisibleToTenant(yoneticiye, PackageCode.Standard, isTenantAdmin: true, forModal: true).ShouldBeTrue();
    }

    [Fact]
    public void Yalniz_host_seviyesi_kiraci_yoneticisine_bile_kapali()
    {
        var hostOnly = Decision(audience: ReleaseNoteAudience.HostOnly);

        ReleaseNoteVisibility.IsVisibleToTenant(hostOnly, PackageCode.Enterprise, isTenantAdmin: true, forModal: true).ShouldBeFalse();
        ReleaseNoteVisibility.IsVisibleToTenant(hostOnly, PackageCode.Enterprise, isTenantAdmin: true, forModal: false).ShouldBeFalse();
    }

    [Fact]
    public void Taninmayan_paket_adi_sessizce_atilir()
    {
        ReleaseNoteVisibility.ParsePackages("Basic,Efsane,Premium")
            .ShouldBe(new[] { PackageCode.Basic, PackageCode.Premium });
    }
}
