using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.CustomerLedger;

namespace Apya.Platform.Tests.Domain.CustomerLedger;

public class CustomerLedgerEntry_Tests
{
    private static readonly Guid Cust = Guid.NewGuid();

    [Fact]
    public void Constructor_Should_Set_Values_And_Normalize_Currency()
    {
        var e = new CustomerLedgerEntry(Guid.NewGuid(), Cust, CustomerLedgerDirection.Debit,
            12000m, new DateTime(2026, 5, 18), CustomerLedgerSource.Invoice, "usd");

        e.CustomerId.ShouldBe(Cust);
        e.Direction.ShouldBe(CustomerLedgerDirection.Debit);
        e.Amount.ShouldBe(12000m);
        e.Currency.ShouldBe("USD");
        e.Source.ShouldBe(CustomerLedgerSource.Invoice);
    }

    [Fact]
    public void Constructor_Should_Throw_When_Customer_Empty()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new CustomerLedgerEntry(Guid.NewGuid(), Guid.Empty, CustomerLedgerDirection.Debit, 10m, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.CustomerLedgerCustomerRequired);
    }

    [Fact]
    public void Constructor_Should_Throw_When_Amount_Zero()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new CustomerLedgerEntry(Guid.NewGuid(), Cust, CustomerLedgerDirection.Credit, 0m, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.CustomerLedgerAmountInvalid);
    }

    [Fact]
    public void Constructor_Should_Throw_When_Amount_Negative()
    {
        var ex = Assert.Throws<BusinessException>(() =>
            new CustomerLedgerEntry(Guid.NewGuid(), Cust, CustomerLedgerDirection.Credit, -5m, DateTime.Today));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.CustomerLedgerAmountInvalid);
    }

    [Fact]
    public void SignedAmount_Debit_Positive_Credit_Negative()
    {
        var debit = new CustomerLedgerEntry(Guid.NewGuid(), Cust, CustomerLedgerDirection.Debit, 1000m, DateTime.Today);
        var credit = new CustomerLedgerEntry(Guid.NewGuid(), Cust, CustomerLedgerDirection.Credit, 400m, DateTime.Today);

        debit.SignedAmount.ShouldBe(1000m);
        credit.SignedAmount.ShouldBe(-400m);
        // Bakiye senaryosu: 1000 borç − 400 tahsilat = 600 (müşteri hâlâ borçlu)
        (debit.SignedAmount + credit.SignedAmount).ShouldBe(600m);
    }

    [Fact]
    public void SetAmount_Should_Update_When_Positive()
    {
        var e = new CustomerLedgerEntry(Guid.NewGuid(), Cust, CustomerLedgerDirection.Debit, 100m, DateTime.Today);
        e.SetAmount(2500.75m);
        e.Amount.ShouldBe(2500.75m);
    }
}
