using System;
using Apya.Platform.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Grants;

public class GrantRecommendationEvent_Tests
{
    private static GrantRecommendationEvent Dismiss(GrantDismissReason reason, string? note = null, int score = 50)
        => GrantRecommendationEvent.Dismissed(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(),
            reason, note, score, GrantEligibilityBucket.Kosullu, wasHostRecommended: false);

    [Fact]
    public void Tanimsiz_gerekce_reddedilir()
    {
        Should.Throw<ArgumentException>(() => Dismiss((GrantDismissReason)0));
        Should.Throw<ArgumentException>(() => Dismiss((GrantDismissReason)99));
    }

    [Fact]
    public void Bos_not_null_olur_uzun_not_reddedilir()
    {
        Dismiss(GrantDismissReason.Other, "   ").Note.ShouldBeNull();
        Should.Throw<ArgumentException>(() => Dismiss(GrantDismissReason.Other, new string('a', GrantRecommendationEventConsts.MaxNoteLength + 1)));
    }

    [Fact]
    public void Skor_0_100_araligina_sikistirilir_ve_geri_al_gerekce_tasimaz()
    {
        Dismiss(GrantDismissReason.OutOfScope, score: 140).MatchScore.ShouldBe(100);

        var restored = GrantRecommendationEvent.Restored(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(),
            -5, GrantEligibilityBucket.Uygun, wasHostRecommended: true);
        restored.Kind.ShouldBe(GrantRecommendationEventKind.Restored);
        restored.Reason.ShouldBeNull();
        restored.MatchScore.ShouldBe(0);
    }
}
