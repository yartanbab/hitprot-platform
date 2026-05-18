using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Incomes;

namespace Apya.Platform.Tests.Domain.Incomes;

public class IncomeEntry_Tests
{
    [Fact]
    public void Constructor_Should_Set_Values_And_Normalize_Currency()
    {
        var e = new IncomeEntry(Guid.NewGuid(), "TÜBİTAK 1501 hibesi", 250000m,
            new DateTime(2026, 5, 18), IncomeCategory.Grant, "usd");

        e.Title.ShouldBe("TÜBİTAK 1501 hibesi");
        e.Amount.ShouldBe(250000m);
        e.Category.ShouldBe(IncomeCategory.Grant);
        e.Currency.ShouldBe("USD");
        e.CashAccountId.ShouldBeNull();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    public void Constructor_Should_Throw_When_Title_Empty(string? title)
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new IncomeEntry(Guid.NewGuid(), title!, 100m, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.IncomeTitleRequired);
    }

    [Fact]
    public void Constructor_Should_Throw_When_Amount_Zero()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new IncomeEntry(Guid.NewGuid(), "Hibe", 0m, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.IncomeAmountInvalid);
    }

    [Fact]
    public void Constructor_Should_Throw_When_Amount_Negative()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new IncomeEntry(Guid.NewGuid(), "Hibe", -10m, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.IncomeAmountInvalid);
    }

    [Fact]
    public void Constructor_Should_Keep_Optional_Tags()
    {
        var cash = Guid.NewGuid();
        var proj = Guid.NewGuid();
        var e = new IncomeEntry(Guid.NewGuid(), "Bağış", 5000m, DateTime.Today,
            IncomeCategory.Donation, "TRY", cash, proj);

        e.CashAccountId.ShouldBe(cash);
        e.ProjectId.ShouldBe(proj);
        e.Category.ShouldBe(IncomeCategory.Donation);
    }

    [Fact]
    public void SetTitle_Should_Throw_When_Too_Long()
    {
        var e = new IncomeEntry(Guid.NewGuid(), "ok", 1m, DateTime.Today);
        var ex = Assert.Throws<BusinessException>(() =>
            e.SetTitle(new string('x', IncomeConsts.MaxTitleLength + 1)));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.IncomeFieldTooLong);
    }
}
