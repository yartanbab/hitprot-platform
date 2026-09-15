using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>19b · Fikir davetinin kuralları: mesaj zorunlu, hatırlatma 1-60 gün, firma bir kez, hatırlatma tek sefer.</summary>
public class GrantIdeaInvitation_Tests
{
    private static readonly DateTime Now = new(2026, 9, 15, 10, 0, 0);

    private static GrantIdeaInvitation New(string message = "Fikrinizi paylaşın", int? remind = 10)
        => new(Guid.NewGuid(), null, message, GrantIdeaInvitationAudience.Filtered, sendEmail: false, remind, Now);

    [Fact]
    public void Mesajsiz_davet_olmaz()
    {
        Should.Throw<BusinessException>(() => New("   ")).Code.ShouldBe(PlatformDomainErrorCodes.GrantInvitationMessageRequired);
        New("  Fikrinizi paylaşın  ").Message.ShouldBe("Fikrinizi paylaşın");
    }

    [Theory]
    [InlineData(0)]
    [InlineData(61)]
    public void Hatirlatma_gunu_sinir_disinda_olamaz(int days)
    {
        Should.Throw<BusinessException>(() => New(remind: days)).Code.ShouldBe(PlatformDomainErrorCodes.GrantInvitationReminderInvalid);
    }

    [Fact]
    public void Ayni_firma_iki_kez_eklenmez()
    {
        var invitation = New();
        var firm = Guid.NewGuid();

        var first = invitation.AddRecipient(Guid.NewGuid(), firm);
        var again = invitation.AddRecipient(Guid.NewGuid(), firm);

        again.ShouldBeSameAs(first);
        invitation.Recipients.Count.ShouldBe(1);
    }

    [Fact]
    public void Hatirlatma_suresi_gonderimden_sayilir()
    {
        var invitation = New(remind: 10);

        invitation.RemindAt.ShouldBe(Now.AddDays(10));
        invitation.IsReminderDue(Now.AddDays(9)).ShouldBeFalse();
        invitation.IsReminderDue(Now.AddDays(10)).ShouldBeTrue();

        var silent = New(remind: null);
        silent.RemindAt.ShouldBeNull();
        silent.IsReminderDue(Now.AddYears(1)).ShouldBeFalse();
    }

    [Fact]
    public void Hatirlatma_ani_ilk_isaretlemede_kalir()
    {
        var recipient = New().AddRecipient(Guid.NewGuid(), Guid.NewGuid());

        recipient.MarkReminded(Now);
        recipient.MarkReminded(Now.AddDays(1));

        recipient.RemindedAt.ShouldBe(Now);
    }
}
