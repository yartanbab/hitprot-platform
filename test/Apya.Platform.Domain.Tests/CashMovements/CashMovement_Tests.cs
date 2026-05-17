using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.CashMovements;

namespace Apya.Platform.Tests.Domain.CashMovements;

public class CashMovement_Tests
{
    private static readonly Guid Acc = Guid.NewGuid();

    [Fact]
    public void Constructor_Should_Set_Values_And_Default_Source()
    {
        var m = new CashMovement(Guid.NewGuid(), Acc, CashMovementDirection.In, 1500m,
            new DateTime(2026, 5, 18), "Hibe ödemesi");

        m.CashAccountId.ShouldBe(Acc);
        m.Direction.ShouldBe(CashMovementDirection.In);
        m.Amount.ShouldBe(1500m);
        m.Source.ShouldBe(CashMovementSource.Manual);
        m.ReferenceId.ShouldBeNull();
    }

    [Fact]
    public void Constructor_Should_Throw_When_Account_Empty()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new CashMovement(Guid.NewGuid(), Guid.Empty, CashMovementDirection.In, 10m, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.CashMovementAccountRequired);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-100)]
    public void Constructor_Should_Throw_When_Amount_Not_Positive(decimal bad)
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new CashMovement(Guid.NewGuid(), Acc, CashMovementDirection.Out, bad, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.CashMovementAmountInvalid);
    }

    [Fact]
    public void SignedAmount_Should_Be_Positive_For_In()
    {
        var m = new CashMovement(Guid.NewGuid(), Acc, CashMovementDirection.In, 250m, DateTime.Today);
        m.SignedAmount.ShouldBe(250m);
    }

    [Fact]
    public void SignedAmount_Should_Be_Negative_For_Out()
    {
        var m = new CashMovement(Guid.NewGuid(), Acc, CashMovementDirection.Out, 250m, DateTime.Today);
        m.SignedAmount.ShouldBe(-250m);
    }

    [Fact]
    public void SetAmount_Should_Update_When_Positive()
    {
        var m = new CashMovement(Guid.NewGuid(), Acc, CashMovementDirection.In, 100m, DateTime.Today);
        m.SetAmount(999.99m);
        m.Amount.ShouldBe(999.99m);
    }
}
