using System;
using Apya.Platform.Grants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// Zorluk ölçeği 1-5'tir. Beş etken birden tutunca seviye 6'ya çıkıyordu; katalog belge listesi
/// ve e-imza bilgisiyle dolunca kiracı kataloğunda bu programlar ölçek dışı görünüyordu.
/// </summary>
public class GrantDifficultyCalculator_Tests
{
    private readonly GrantDifficultyCalculator _calculator = new();

    [Fact]
    public void Etken_yoksa_seviye_1()
    {
        var grant = new Grant(Guid.NewGuid(), "P", "K", 0m, 0);

        var result = _calculator.Calculate(grant, documentCount: 0, requiresESignature: false, stageStepCount: 0, daysRemaining: null);

        result.Level.ShouldBe(1);
        result.Reasons.ShouldBeEmpty();
    }

    [Fact]
    public void Bes_etken_birden_tutsa_da_seviye_5te_kalir()
    {
        var grant = new Grant(Guid.NewGuid(), "P", "K", 0m, 0)
        {
            RequiresConsortium = true,
            ProjectDurationMonths = GrantDifficultyCalculator.LongProjectMonths
        };

        var result = _calculator.Calculate(
            grant,
            documentCount: GrantDifficultyCalculator.ManyDocumentsThreshold,
            requiresESignature: true,
            stageStepCount: 0,
            daysRemaining: 3);

        result.Reasons.Count.ShouldBe(5);
        result.Level.ShouldBe(5);
        result.IsHard.ShouldBeTrue();
    }
}
