using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// 18e · Görüşme önerisi kuralları: tam üç, farklı, ileri tarihli saat; geçmiş saat onaylanamaz; gerekçesiz
/// başka saat isteği yok; cevaplanmış öneri ikinci kez cevaplanamaz.
/// </summary>
public class GrantMeetingProposal_Tests
{
    private static readonly DateTime Now = new(2026, 9, 14, 10, 0, 0);

    private static GrantMeetingProposal NewProposal(params DateTime[] slots)
        => new(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), slots, Now);

    private static GrantMeetingProposal Valid()
        => NewProposal(Now.AddDays(2).AddHours(5), Now.AddDays(1), Now.AddDays(1).AddHours(5));

    [Fact]
    public void Saatler_siralanir_ve_beklemede_baslar()
    {
        var proposal = Valid();

        proposal.Status.ShouldBe(GrantMeetingStatus.Bekliyor);
        proposal.Slots.ShouldBe(new[] { Now.AddDays(1), Now.AddDays(1).AddHours(5), Now.AddDays(2).AddHours(5) });
        proposal.IsOpen.ShouldBeTrue();
    }

    [Fact]
    public void Eksik_tekrarlanan_gecmis_ya_da_cok_uzak_saat_reddedilir()
    {
        void Invalid(params DateTime[] slots)
            => Should.Throw<BusinessException>(() => NewProposal(slots)).Code.ShouldBe(PlatformDomainErrorCodes.GrantMeetingSlotsInvalid);

        Invalid(Now.AddDays(1), Now.AddDays(2));
        Invalid(Now.AddDays(1), Now.AddDays(1), Now.AddDays(2));
        Invalid(Now.AddHours(-1), Now.AddDays(1), Now.AddDays(2));
        Invalid(Now.AddDays(1), Now.AddDays(2), Now.AddDays(GrantMeetingConsts.MaxDaysAhead + 1));
    }

    [Fact]
    public void Onayda_secilen_saat_yazilir_ikinci_cevap_verilemez()
    {
        var proposal = Valid();
        var consultant = Guid.NewGuid();

        proposal.Confirm(1, consultant, Now);

        proposal.Status.ShouldBe(GrantMeetingStatus.Onaylandi);
        proposal.ConfirmedSlot.ShouldBe(Now.AddDays(1).AddHours(5));
        proposal.AnsweredByUserId.ShouldBe(consultant);
        Should.Throw<BusinessException>(() => proposal.RequestOtherTime("uymuyor", consultant, Now))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantMeetingNotPending);
    }

    [Fact]
    public void Gecmiste_kalan_ya_da_olmayan_saat_onaylanamaz()
    {
        var proposal = Valid();

        Should.Throw<BusinessException>(() => proposal.Confirm(3, null, Now)).Code.ShouldBe(PlatformDomainErrorCodes.GrantMeetingSlotsInvalid);
        Should.Throw<BusinessException>(() => proposal.Confirm(0, null, Now.AddDays(1).AddMinutes(1)))
            .Code.ShouldBe(PlatformDomainErrorCodes.GrantMeetingSlotsInvalid);
        proposal.Status.ShouldBe(GrantMeetingStatus.Bekliyor);
    }

    [Fact]
    public void Baska_saat_istegi_gerekce_ister_ve_oneriyi_kapatir()
    {
        var proposal = Valid();

        Should.Throw<BusinessException>(() => proposal.RequestOtherTime("  ", null, Now)).Code.ShouldBe(PlatformDomainErrorCodes.GrantMeetingNoteRequired);

        proposal.RequestOtherTime(" Hafta içi öğleden sonra uygunum. ", null, Now);

        proposal.Status.ShouldBe(GrantMeetingStatus.BaskaSaatIstendi);
        proposal.HostNote.ShouldBe("Hafta içi öğleden sonra uygunum.");
        proposal.IsOpen.ShouldBeFalse();
    }
}
