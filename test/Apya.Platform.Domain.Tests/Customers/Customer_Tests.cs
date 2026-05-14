using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Customers;

namespace Apya.Platform.Tests.Domain.Customers;

public class Customer_Tests
{
    [Fact]
    public void Constructor_Should_Set_Active_By_Default()
    {
        var customer = new Customer(Guid.NewGuid(), "Acme A.Ş.");

        customer.Name.ShouldBe("Acme A.Ş.");
        customer.IsActive.ShouldBeTrue();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Constructor_Should_Throw_When_Name_Is_Empty(string? name)
    {
        var ex = Assert.Throws<BusinessException>(() => new Customer(Guid.NewGuid(), name!));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.CustomerNameRequired);
    }

    [Fact]
    public void Constructor_Should_Throw_When_Name_Exceeds_Max_Length()
    {
        var longName = new string('x', CustomerConsts.MaxNameLength + 1);

        var ex = Assert.Throws<BusinessException>(() => new Customer(Guid.NewGuid(), longName));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.CustomerFieldTooLong);
    }

    [Fact]
    public void SetName_Should_Trim_Whitespace()
    {
        var customer = new Customer(Guid.NewGuid(), "Acme");
        customer.SetName("  Yeni Ad  ");
        customer.Name.ShouldBe("Yeni Ad");
    }

    [Fact]
    public void Deactivate_Should_Flip_IsActive_To_False()
    {
        var customer = new Customer(Guid.NewGuid(), "Acme");
        customer.Deactivate();
        customer.IsActive.ShouldBeFalse();
    }

    [Fact]
    public void Activate_Should_Restore_IsActive()
    {
        var customer = new Customer(Guid.NewGuid(), "Acme");
        customer.Deactivate();
        customer.Activate();
        customer.IsActive.ShouldBeTrue();
    }
}
