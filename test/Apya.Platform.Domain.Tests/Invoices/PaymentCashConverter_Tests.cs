using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Invoices;

namespace Apya.Platform.Tests.Domain.Invoices;

public class PaymentCashConverter_Tests
{
    [Fact]
    public void Same_Currency_Should_Return_Amount_Unchanged_Even_Without_Rate()
    {
        var result = PaymentCashConverter.ToCashCurrency(1000m, "TRY", "TRY", null);
        result.ShouldBe(1000m);
    }

    [Fact]
    public void Same_Currency_Case_Insensitive()
    {
        var result = PaymentCashConverter.ToCashCurrency(500m, "usd", "USD", null);
        result.ShouldBe(500m);
    }

    [Fact]
    public void Different_Currency_Should_Apply_Rate_And_Round_2dp()
    {
        // 1000 EUR, 1 EUR = 35.1234 TRY
        var result = PaymentCashConverter.ToCashCurrency(1000m, "EUR", "TRY", 35.1234m);
        result.ShouldBe(35123.40m);
    }

    [Fact]
    public void Different_Currency_Should_Round_Half_Away_From_Zero()
    {
        var result = PaymentCashConverter.ToCashCurrency(3m, "USD", "TRY", 1.005m);
        result.ShouldBe(3.02m); // 3.015 → 3.02
    }

    [Fact]
    public void Different_Currency_With_Null_Rate_Should_Throw()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            PaymentCashConverter.ToCashCurrency(100m, "EUR", "TRY", null));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.PaymentExchangeRateMissing);
    }

    [Fact]
    public void Different_Currency_With_Zero_Rate_Should_Throw()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            PaymentCashConverter.ToCashCurrency(100m, "EUR", "TRY", 0m));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.PaymentExchangeRateMissing);
    }

    [Fact]
    public void Different_Currency_With_Negative_Rate_Should_Throw()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            PaymentCashConverter.ToCashCurrency(100m, "EUR", "TRY", -2m));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.PaymentExchangeRateMissing);
    }
}
