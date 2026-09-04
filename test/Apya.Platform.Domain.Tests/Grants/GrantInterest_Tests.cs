using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// İlgi talebinin karar kuralları: gerekçesiz red YOK, karara bağlanmış talep
/// ikinci kez cevaplanamaz.
/// </summary>
public class GrantInterest_Tests
{
    private static readonly DateTime Now = new(2026, 9, 4, 10, 0, 0);

    private static GrantInterest NewInterest(string? note = null)
        => new(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), note);

    [Fact]
    public void Yeni_talep_beklemede_baslar()
    {
        var interest = NewInterest();

        interest.Status.ShouldBe(GrantInterestStatus.Yeni);
        interest.IsPending.ShouldBeTrue();
        interest.HostFeedback.ShouldBeNull();
        interest.GrantApplicationId.ShouldBeNull();
    }

    [Fact]
    public void Bos_not_null_olarak_saklanir()
    {
        // Boşluktan ibaret not "yazılmış not" sayılmaz; host kutusu "not bırakılmamış" yazar.
        NewInterest("   ").Note.ShouldBeNull();
        NewInterest(" ilgileniyoruz ").Note.ShouldBe("ilgileniyoruz");
    }

    [Fact]
    public void Incelemeye_alinan_talep_beklemede_kalir()
    {
        var interest = NewInterest();
        var userId = Guid.NewGuid();

        interest.StartReview(userId, Now);

        interest.Status.ShouldBe(GrantInterestStatus.Inceleniyor);
        interest.IsPending.ShouldBeTrue("inceleme bir karar değildir; talep kutuda durmayı sürdürür");
        interest.ReviewedByUserId.ShouldBe(userId);
        interest.ReviewedAt.ShouldBe(Now);
    }

    [Fact]
    public void Basvuru_baslatilan_talep_basvuruya_baglanir()
    {
        var interest = NewInterest();
        var applicationId = Guid.NewGuid();

        interest.MarkApplicationStarted(applicationId, Guid.NewGuid(), Now);

        interest.Status.ShouldBe(GrantInterestStatus.BasvuruAcildi);
        interest.GrantApplicationId.ShouldBe(applicationId);
        interest.IsPending.ShouldBeFalse();
    }

    [Fact]
    public void Gerekcesiz_red_edilemez()
    {
        var interest = NewInterest();

        Should.Throw<BusinessException>(() => interest.Reject("   ", Guid.NewGuid(), Now))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestReasonRequired);

        interest.Status.ShouldBe(GrantInterestStatus.Yeni, "başarısız kapatma durumu değiştirmemeli");
    }

    [Fact]
    public void Red_gerekcesi_kirpilarak_saklanir()
    {
        var interest = NewInterest();

        interest.Reject("  Konsorsiyum ortağınız yok.  ", Guid.NewGuid(), Now);

        interest.Status.ShouldBe(GrantInterestStatus.UygunDegil);
        interest.HostFeedback.ShouldBe("Konsorsiyum ortağınız yok.");
    }

    [Fact]
    public void Karara_baglanmis_talep_yeniden_cevaplanamaz()
    {
        var started = NewInterest();
        started.MarkApplicationStarted(Guid.NewGuid(), Guid.NewGuid(), Now);

        Should.Throw<BusinessException>(() => started.Reject("gerekçe", Guid.NewGuid(), Now))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAlreadyAnswered);

        var rejected = NewInterest();
        rejected.Reject("gerekçe", Guid.NewGuid(), Now);

        Should.Throw<BusinessException>(() => rejected.MarkApplicationStarted(Guid.NewGuid(), Guid.NewGuid(), Now))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAlreadyAnswered);
        Should.Throw<BusinessException>(() => rejected.StartReview(Guid.NewGuid(), Now))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAlreadyAnswered);
    }
}
