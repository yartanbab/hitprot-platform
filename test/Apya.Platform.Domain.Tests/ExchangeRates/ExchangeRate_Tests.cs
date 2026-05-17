using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.ExchangeRates;

namespace Apya.Platform.Tests.Domain.ExchangeRates;

public class ExchangeRate_Tests
{
    [Fact]
    public void Constructor_Should_Normalize_Currencies_And_Strip_Time()
    {
        var rate = new ExchangeRate(
            Guid.NewGuid(), "usd", "try", 34.25m,
            new DateTime(2026, 5, 17, 14, 30, 0));

        rate.FromCurrency.ShouldBe("USD");
        rate.ToCurrency.ShouldBe("TRY");
        rate.Rate.ShouldBe(34.25m);
        rate.RateDate.ShouldBe(new DateTime(2026, 5, 17));
        rate.Source.ShouldBe(ExchangeRateSource.Manual);
    }

    [Fact]
    public void Constructor_Should_Throw_When_Same_Currency()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new ExchangeRate(Guid.NewGuid(), "TRY", "TRY", 1m, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ExchangeRateSameCurrency);
    }

    [Theory]
    [InlineData("US")]
    [InlineData("USDD")]
    [InlineData("")]
    public void Constructor_Should_Throw_On_Invalid_Currency(string from)
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new ExchangeRate(Guid.NewGuid(), from, "TRY", 1m, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ExchangeRateCurrencyInvalid);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    public void SetRate_Should_Throw_When_Not_Positive(decimal bad)
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new ExchangeRate(Guid.NewGuid(), "EUR", "TRY", bad, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.ExchangeRateInvalid);
    }

    [Fact]
    public void SetRate_Should_Update_Valid_Rate()
    {
        var rate = new ExchangeRate(Guid.NewGuid(), "EUR", "TRY", 36m, DateTime.Today);
        rate.SetRate(37.5m);
        rate.Rate.ShouldBe(37.5m);
    }
}
