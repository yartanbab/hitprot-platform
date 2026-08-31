using System;
using Apya.Platform.Tasks;
using Shouldly;
using Volo.Abp;
using Xunit;

namespace Apya.Platform.Tests.Application.Tasks;

/// <summary>
/// Süreli görev linki, ekip dışındaki kişinin göreve eriştiği tek kapı — ve
/// belgelerdeki salt okunur linkin aksine YAZMA yetkisi taşır. Buradaki kapılar
/// (süre, iptal, yorum/yükleme/indirme izni, yükleme tavanı) anonim yolda tek
/// savunmadır: yanlış açılırsa iş dışarıdan bozulur, yanlış kapanırsa dış kişi
/// çalışamaz.
/// </summary>
public class TaskShareLink_Tests
{
    private static readonly DateTime Now = new(2026, 8, 27);

    private static TaskShareLink Link(
        bool allowComment = true,
        bool allowUpload = true,
        bool allowDownload = true,
        int lifetimeDays = 7)
        => new(
            Guid.NewGuid(),
            tenantId: Guid.NewGuid(),
            taskId: Guid.NewGuid(),
            tokenHash: new string('a', 64),
            recipientName: "Ahmet Yılmaz",
            recipientEmail: "ahmet@ornek.com",
            expiresAt: Now.AddDays(lifetimeDays),
            allowComment: allowComment,
            allowUpload: allowUpload,
            allowDownload: allowDownload);

    /* ─── Süre ve iptal ──────────────────────────────────────────────── */

    [Fact]
    public void Yururlukteki_link_kullanilabilir()
    {
        Should.NotThrow(() => Link().EnsureUsable(Now));
    }

    [Fact]
    public void Suresi_dolan_link_reddedilir()
    {
        var ex = Should.Throw<BusinessException>(() => Link(lifetimeDays: 7).EnsureUsable(Now.AddDays(8)));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskShareLinkExpired);
    }

    /// <summary>Son geçerlilik anı dahil değildir — sınırda link kapanır.</summary>
    [Fact]
    public void Bitis_aninda_link_kapalidir()
    {
        Should.Throw<BusinessException>(() => Link(lifetimeDays: 7).EnsureUsable(Now.AddDays(7)));
    }

    [Fact]
    public void Iptal_edilen_link_suresi_dolmamis_olsa_da_reddedilir()
    {
        var link = Link();
        link.Revoke(Now);

        var ex = Should.Throw<BusinessException>(() => link.EnsureUsable(Now));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskShareLinkRevoked);
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

    /* ─── İzin bayrakları ────────────────────────────────────────────── */

    [Fact]
    public void Yoruma_kapali_linkte_yorum_reddedilir()
    {
        var ex = Should.Throw<BusinessException>(() => Link(allowComment: false).EnsureCommentAllowed());
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskShareCommentNotAllowed);
    }

    [Fact]
    public void Yuklemeye_kapali_linkte_yukleme_reddedilir()
    {
        var ex = Should.Throw<BusinessException>(() => Link(allowUpload: false).EnsureUploadAllowed());
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskShareUploadNotAllowed);
    }

    [Fact]
    public void Indirmeye_kapali_linkte_indirme_reddedilir()
    {
        var ex = Should.Throw<BusinessException>(() => Link(allowDownload: false).EnsureDownloadAllowed());
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskShareDownloadNotAllowed);
    }

    /* ─── Yükleme tavanı ─────────────────────────────────────────────── */

    /// <summary>
    /// Anonim yükleme ucunda boyut ve uzantı kontrolü TEK dosyayı sınırlar; toplamı
    /// sınırlayan tek şey bu tavandır. Tavan entity'de durur ki çağıran atlayamasın.
    /// </summary>
    [Fact]
    public void Yukleme_tavanina_gelince_yeni_yukleme_reddedilir()
    {
        var link = Link(allowUpload: true);

        for (var i = 0; i < TaskShareConsts.MaxUploadsPerLink; i++)
        {
            Should.NotThrow(() => link.EnsureUploadAllowed());
            link.RegisterUpload();
        }

        var ex = Should.Throw<BusinessException>(() => link.EnsureUploadAllowed());
        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskShareUploadLimitExceeded);
    }

    [Fact]
    public void Tavanin_bir_altinda_yukleme_hala_serbesttir()
    {
        var link = Link(allowUpload: true);

        for (var i = 0; i < TaskShareConsts.MaxUploadsPerLink - 1; i++)
        {
            link.RegisterUpload();
        }

        Should.NotThrow(() => link.EnsureUploadAllowed());
    }

    /* ─── Alıcı ──────────────────────────────────────────────────────── */

    [Fact]
    public void Alici_adi_bos_olamaz()
    {
        var ex = Should.Throw<BusinessException>(() => new TaskShareLink(
            Guid.NewGuid(), null, Guid.NewGuid(), new string('a', 64),
            recipientName: "   ", recipientEmail: null,
            expiresAt: Now.AddDays(7),
            allowComment: true, allowUpload: true, allowDownload: true));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.TaskShareRecipientNameRequired);
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
