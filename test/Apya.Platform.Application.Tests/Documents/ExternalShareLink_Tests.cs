using System;
using Apya.Platform.Documents;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Tests.Application.Documents;

/// <summary>
/// Süreli dış paylaşım linki, kurum dışındaki kişinin belgelere eriştiği tek kapı.
/// Buradaki kapılar (süre, iptal, indirme izni) anonim yolda tek savunmadır —
/// yanlış açılırsa dosya kurum dışına sızar, yanlış kapanırsa denetçi çalışamaz.
/// </summary>
public class ExternalShareLink_Tests
{
    private static readonly DateTime Now = new(2026, 8, 20);

    private static ExternalShareLink Link(bool allowDownload = false, int lifetimeDays = 7)
        => new(
            Guid.NewGuid(),
            tenantId: Guid.NewGuid(),
            targetType: ShareTargetType.DeliveryPackage,
            targetId: Guid.NewGuid(),
            tokenHash: new string('a', 64),
            expiresAt: Now.AddDays(lifetimeDays),
            allowDownload: allowDownload);

    [Fact]
    public void Yururlukteki_link_kullanilabilir()
    {
        Should.NotThrow(() => Link().EnsureUsable(Now));
    }

    [Fact]
    public void Suresi_dolan_link_reddedilir()
    {
        var link = Link(lifetimeDays: 7);

        var ex = Should.Throw<BusinessException>(() => link.EnsureUsable(Now.AddDays(8)));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ShareLinkExpired);
    }

    /// <summary>Son geçerlilik anı dahil değildir — sınırda link kapanır.</summary>
    [Fact]
    public void Bitis_aninda_link_kapalidir()
    {
        var link = Link(lifetimeDays: 7);

        Should.Throw<BusinessException>(() => link.EnsureUsable(Now.AddDays(7)));
    }

    [Fact]
    public void Iptal_edilen_link_suresi_dolmamis_olsa_da_reddedilir()
    {
        var link = Link();
        link.Revoke(Now);

        var ex = Should.Throw<BusinessException>(() => link.EnsureUsable(Now));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ShareLinkRevoked);
    }

    [Fact]
    public void Iptal_geri_alinamaz_ilk_zaman_korunur()
    {
        var link = Link();
        link.Revoke(Now);
        link.Revoke(Now.AddDays(1));

        link.IsRevoked.ShouldBeTrue();
        link.RevokedAt.ShouldBe(Now);
    }

    [Fact]
    public void Indirmeye_kapali_linkte_indirme_reddedilir()
    {
        var ex = Should.Throw<BusinessException>(() => Link(allowDownload: false).EnsureDownloadAllowed());
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ShareLinkDownloadNotAllowed);
    }

    [Fact]
    public void Indirmeye_acik_linkte_indirme_gecer()
    {
        Should.NotThrow(() => Link(allowDownload: true).EnsureDownloadAllowed());
    }

    [Fact]
    public void Her_erisim_sayaci_arttirir()
    {
        var link = Link();

        link.RegisterAccess();
        link.RegisterAccess();

        link.AccessCount.ShouldBe(2);
    }
}
