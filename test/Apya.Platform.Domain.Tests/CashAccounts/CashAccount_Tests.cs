using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.CashAccounts;

namespace Apya.Platform.Tests.Domain.CashAccounts;

public class CashAccount_Tests
{
    [Fact]
    public void Constructor_Should_Set_Defaults()
    {
        var acc = new CashAccount(Guid.NewGuid(), "Ana Kasa");

        acc.Name.ShouldBe("Ana Kasa");
        acc.Type.ShouldBe(CashAccountType.Cash);
        acc.Currency.ShouldBe("TRY");
        acc.OpeningBalance.ShouldBe(0);
        acc.IsActive.ShouldBeTrue();
    }

    [Fact]
    public void Constructor_Should_Accept_Bank_Currency_And_Balance()
    {
        var acc = new CashAccount(
            Guid.NewGuid(), "Ziraat USD", CashAccountType.Bank, "usd", 1500.50m);

        acc.Type.ShouldBe(CashAccountType.Bank);
        acc.Currency.ShouldBe("USD"); // upper-invariant'a normalize
        acc.OpeningBalance.ShouldBe(1500.50m);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_When_Name_Empty(string? name)
    {
        var ex = Assert.Throws<BusinessException>(() => new CashAccount(Guid.NewGuid(), name!));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.CashAccountNameRequired);
    }

    [Theory]
    [InlineData("TR")]
    [InlineData("TRYX")]
    [InlineData("")]
    public void SetCurrency_Should_Throw_When_Not_3_Chars(string currency)
    {
        var acc = new CashAccount(Guid.NewGuid(), "Kasa");
        var ex = Assert.Throws<BusinessException>(() => acc.SetCurrency(currency));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.CashAccountCurrencyInvalid);
    }

    [Fact]
    public void SetName_Should_Throw_When_Too_Long()
    {
        var acc = new CashAccount(Guid.NewGuid(), "Kasa");
        var longName = new string('x', CashAccountConsts.MaxNameLength + 1);

        var ex = Assert.Throws<BusinessException>(() => acc.SetName(longName));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.CashAccountFieldTooLong);
    }

    [Fact]
    public void Deactivate_And_Activate_Should_Flip_IsActive()
    {
        var acc = new CashAccount(Guid.NewGuid(), "Kasa");

        acc.Deactivate();
        acc.IsActive.ShouldBeFalse();

        acc.Activate();
        acc.IsActive.ShouldBeTrue();
    }
}
