using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.FxRevaluations;

namespace Apya.Platform.Tests.Domain.FxRevaluations;

public class FxRevaluationCalculator_Tests
{
    [Fact]
    public void Try_Account_Returns_Balance_Unchanged_Without_Rate()
    {
        FxRevaluationCalculator.ToBaseCurrency(10000m, "TRY", null).ShouldBe(10000m);
    }

    [Fact]
    public void Try_Case_Insensitive()
    {
        FxRevaluationCalculator.ToBaseCurrency(500m, "try", null).ShouldBe(500m);
    }

    [Fact]
    public void Foreign_Account_Applies_Rate_Rounded_2dp()
    {
        // 1000 USD, yıl sonu 1 USD = 35.1267 TRY
        FxRevaluationCalculator.ToBaseCurrency(1000m, "USD", 35.1267m).ShouldBe(35126.70m);
    }

    [Fact]
    public void Foreign_Account_Without_Rate_Throws()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            FxRevaluationCalculator.ToBaseCurrency(1000m, "EUR", null));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.FxRevaluationRateMissing);
    }

    [Fact]
    public void Foreign_Account_With_Zero_Rate_Throws()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            FxRevaluationCalculator.ToBaseCurrency(1000m, "EUR", 0m));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.FxRevaluationRateMissing);
    }

    [Fact]
    public void Snapshot_AddLine_Accumulates_Total()
    {
        var snap = new FxRevaluationSnapshot(System.Guid.NewGuid(), new System.DateTime(2026, 12, 31));
        snap.AddLine(new FxRevaluationLine(System.Guid.NewGuid(), System.Guid.NewGuid(), "USD Kasa", "USD", 1000m, 35m, 35000m));
        snap.AddLine(new FxRevaluationLine(System.Guid.NewGuid(), System.Guid.NewGuid(), "EUR Kasa", "EUR", 500m, 38m, 19000m));

        snap.Lines.Count.ShouldBe(2);
        snap.TotalTryValue.ShouldBe(54000m);
    }
}
