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

    [Fact]
    public void Bekleyen_talep_geri_cekilebilir_ve_kapanir()
    {
        var fresh = NewInterest();
        fresh.Withdraw(Now);

        fresh.Status.ShouldBe(GrantInterestStatus.GeriCekildi);
        fresh.WithdrawnAt.ShouldBe(Now);
        fresh.IsPending.ShouldBeFalse("geri çekilen talep host kutusunda bekleyen sayılmaz");

        // İncelemeye alınmış talep de karar değildir — firma hâlâ vazgeçebilir.
        var reviewing = NewInterest();
        reviewing.StartReview(Guid.NewGuid(), Now);
        reviewing.Withdraw(Now);
        reviewing.Status.ShouldBe(GrantInterestStatus.GeriCekildi);
    }

    [Fact]
    public void Karara_baglanmis_ya_da_cekilmis_talep_geri_cekilemez()
    {
        var started = NewInterest();
        started.MarkApplicationStarted(Guid.NewGuid(), Guid.NewGuid(), Now);
        Should.Throw<BusinessException>(() => started.Withdraw(Now))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestNotWithdrawable);

        var rejected = NewInterest();
        rejected.Reject("gerekçe", Guid.NewGuid(), Now);
        Should.Throw<BusinessException>(() => rejected.Withdraw(Now))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestNotWithdrawable);

        var withdrawn = NewInterest();
        withdrawn.Withdraw(Now);
        Should.Throw<BusinessException>(() => withdrawn.Withdraw(Now.AddHours(1)))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestNotWithdrawable);
        withdrawn.WithdrawnAt.ShouldBe(Now, "ilk geri çekme anı ezilmemeli");

        // Geri çekilen talebe host da dokunamaz: başvuru başlatılamaz, reddedilemez.
        Should.Throw<BusinessException>(() => withdrawn.MarkApplicationStarted(Guid.NewGuid(), Guid.NewGuid(), Now))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantInterestAlreadyAnswered);
    }

    [Fact]
    public void Ortak_adi_yalniz_ortagi_belli_kayitta_tutulur()
    {
        var hasPartner = new GrantInterest(Guid.NewGuid(), null, Guid.NewGuid(), null, "fikir",
            needsPartner: false, partnerName: "  Vektör Yazılım  ");
        hasPartner.NeedsPartner.ShouldBe(false);
        hasPartner.PartnerName.ShouldBe("Vektör Yazılım");

        // "Ortak arıyoruz" diyen kayıtta ad anlamsız; formdan artık kalmış olsa bile yazılmaz.
        var needsPartner = new GrantInterest(Guid.NewGuid(), null, Guid.NewGuid(), null, "fikir",
            needsPartner: true, partnerName: "Eski ad");
        needsPartner.NeedsPartner.ShouldBe(true);
        needsPartner.PartnerName.ShouldBeNull();

        var notAsked = new GrantInterest(Guid.NewGuid(), null, Guid.NewGuid(), null, "fikir", partnerName: "Ad");
        notAsked.NeedsPartner.ShouldBeNull();
        notAsked.PartnerName.ShouldBeNull();
    }

    [Fact]
    public void Butce_negatif_olamaz_baslangic_gun_olarak_saklanir()
    {
        Should.Throw<ArgumentOutOfRangeException>(() =>
            new GrantInterest(Guid.NewGuid(), null, Guid.NewGuid(), null, "fikir", estimatedBudget: -1m));

        var interest = new GrantInterest(Guid.NewGuid(), null, Guid.NewGuid(), null, "fikir",
            estimatedBudget: 12_500_000m, targetStartDate: new DateTime(2027, 1, 1, 15, 30, 0));
        interest.EstimatedBudget.ShouldBe(12_500_000m);
        interest.TargetStartDate.ShouldBe(new DateTime(2027, 1, 1));
    }

    [Fact]
    public void Fikir_formu_cevaplari_kirpilir_bos_cevap_null_saklanir()
    {
        var interest = NewInterest("fikir");

        interest.SetIdeaDetails(
            problemStatement: "  Saha verisi elle toplanıyor  ",
            targetAudience: "   ",
            plannedActivities: null,
            durationAndPartners: "12 ay; belediye",
            supportNeeds: "",
            priorExperience: "TÜBİTAK 1501",
            teamStructure: "3 yazılımcı",
            stakeholders: " Dernek X ");

        interest.ProblemStatement.ShouldBe("Saha verisi elle toplanıyor");
        interest.TargetAudience.ShouldBeNull("boşluktan ibaret cevap yazılmamış sayılır");
        interest.PlannedActivities.ShouldBeNull();
        interest.DurationAndPartners.ShouldBe("12 ay; belediye");
        interest.SupportNeeds.ShouldBeNull();
        interest.PriorExperience.ShouldBe("TÜBİTAK 1501");
        interest.TeamStructure.ShouldBe("3 yazılımcı");
        interest.Stakeholders.ShouldBe("Dernek X");

        // Her cevap 1000 karakterle sınırlı; aşan cevap kabul edilmez.
        Should.Throw<ArgumentException>(() => interest.SetIdeaDetails(
            new string('x', GrantInterestConsts.MaxAnswerLength + 1), null, null, null, null, null, null, null));
    }
}
