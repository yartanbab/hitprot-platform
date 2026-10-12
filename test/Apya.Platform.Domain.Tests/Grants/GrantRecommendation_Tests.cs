using System;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

public class GrantRecommendation_Tests
{
    private static GrantRecommendation New() =>
        new(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), GrantRecommendationSource.Host, null);

    [Fact]
    public void Dismiss_Yeni_Oneriyi_Kapatir()
    {
        var recommendation = New();

        recommendation.Dismiss();

        recommendation.Status.ShouldBe(GrantRecommendationStatus.Dismissed);
    }

    /// <summary>Başvuruya dönmüş öneri kapatılmaz; kapatılmış öneri de sonradan "başvuruldu" olmaz.</summary>
    [Fact]
    public void Basvurulan_Oneri_Kapatilmaz_Kapatilan_Basvuruldu_Olmaz()
    {
        var applied = New();
        applied.MarkApplied();
        applied.Dismiss();
        applied.Status.ShouldBe(GrantRecommendationStatus.Applied);

        var dismissed = New();
        dismissed.Dismiss();
        dismissed.MarkApplied();
        dismissed.Status.ShouldBe(GrantRecommendationStatus.Dismissed);
    }
}
