using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Expenses;

namespace Apya.Platform.Tests.Domain.Expenses;

public class Expense_Tests
{
    private static readonly Guid Cash = Guid.NewGuid();

    [Fact]
    public void Constructor_Should_Set_Values_And_Defaults()
    {
        var e = new Expense(Guid.NewGuid(), "Ofis kirası", 12000m, Cash,
            new DateTime(2026, 5, 18), ExpenseCategory.Office);

        e.Title.ShouldBe("Ofis kirası");
        e.Amount.ShouldBe(12000m);
        e.CashAccountId.ShouldBe(Cash);
        e.Category.ShouldBe(ExpenseCategory.Office);
        e.Currency.ShouldBe("TRY");
        e.ProjectId.ShouldBeNull();
        e.CustomerId.ShouldBeNull();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_When_Title_Empty(string? title)
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new Expense(Guid.NewGuid(), title!, 100m, Cash, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ExpenseTitleRequired);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-50)]
    public void Constructor_Should_Throw_When_Amount_Not_Positive(decimal bad)
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new Expense(Guid.NewGuid(), "Test", bad, Cash, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ExpenseAmountInvalid);
    }

    [Fact]
    public void Constructor_Should_Throw_When_CashAccount_Empty()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new Expense(Guid.NewGuid(), "Test", 100m, Guid.Empty, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ExpenseCashAccountRequired);
    }

    [Fact]
    public void Constructor_Should_Normalize_Currency_And_Keep_Optional_Links()
    {
        var proj = Guid.NewGuid();
        var cust = Guid.NewGuid();
        var e = new Expense(Guid.NewGuid(), "Danışmanlık", 5000m, Cash, DateTime.Today,
            ExpenseCategory.Service, "usd", proj, cust, "Q2 danışmanlık");

        e.Currency.ShouldBe("USD");
        e.ProjectId.ShouldBe(proj);
        e.CustomerId.ShouldBe(cust);
        e.Category.ShouldBe(ExpenseCategory.Service);
    }

    [Fact]
    public void SetTitle_Should_Throw_When_Too_Long()
    {
        var e = new Expense(Guid.NewGuid(), "ok", 1m, Cash, DateTime.Today);
        var ex = Assert.Throws<BusinessException>(() =>
            e.SetTitle(new string('x', ExpenseConsts.MaxTitleLength + 1)));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ExpenseFieldTooLong);
    }
}
