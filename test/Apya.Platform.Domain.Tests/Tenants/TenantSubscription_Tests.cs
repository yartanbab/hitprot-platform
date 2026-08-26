using System;
using Apya.Platform.Tenants;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.Tenants;

/// <summary>
/// Abonelik döneminin süre aritmetiği. Enum değerinin AY SAYISI olması sözleşmenin
/// parçasıdır: bir gün <see cref="SubscriptionPeriod"/>'a yeni bir dönem eklenirse
/// (ör. iki yıllık = 24) bitiş hesabı kendiliğinden doğru çalışmalıdır.
/// </summary>
public class TenantSubscription_Tests
{
    private static readonly DateTime Start = new(2026, 1, 31, 10, 0, 0, DateTimeKind.Utc);

    private static TenantSubscription Create(SubscriptionPeriod period, DateTime? start = null) =>
        new(Guid.NewGuid(), Guid.NewGuid(), PackageCode.Premium, period, start ?? Start,
            SubscriptionSource.Manual);

    [Theory]
    [InlineData(SubscriptionPeriod.Monthly, 1)]
    [InlineData(SubscriptionPeriod.Quarterly, 3)]
    [InlineData(SubscriptionPeriod.SemiAnnual, 6)]
    [InlineData(SubscriptionPeriod.Annual, 12)]
    public void EndDate_Should_Be_StartDate_Plus_Period_Months(SubscriptionPeriod period, int months)
    {
        var subscription = Create(period);

        subscription.EndDate.ShouldBe(Start.AddMonths(months));
        subscription.Status.ShouldBe(SubscriptionStatus.Active);
        subscription.IsCurrent.ShouldBeTrue();
    }

    /// <summary>Ayın 31'inde başlayan dönem, kısa ayda taşmaz — AddMonths ayın sonuna sabitler.</summary>
    [Fact]
    public void EndDate_Should_Clamp_To_Month_End_For_Short_Months()
    {
        var subscription = Create(SubscriptionPeriod.Monthly);

        subscription.EndDate!.Value.Month.ShouldBe(2);
        subscription.EndDate!.Value.Day.ShouldBe(28);
    }

    [Fact]
    public void Unlimited_Period_Should_Have_No_EndDate()
    {
        var subscription = Create(SubscriptionPeriod.Unlimited);

        subscription.EndDate.ShouldBeNull();
        subscription.EffectiveEndDate.ShouldBeNull();
    }

    [Fact]
    public void Grace_Should_Push_The_Effective_End_Without_Touching_EndDate()
    {
        var subscription = Create(SubscriptionPeriod.Monthly);
        var graceEnd = subscription.EndDate!.Value.AddDays(7);

        subscription.MarkInGrace(graceEnd);

        subscription.Status.ShouldBe(SubscriptionStatus.InGrace);
        subscription.IsCurrent.ShouldBeTrue();      // ek sürede paket HÂLÂ açık
        subscription.EndDate.ShouldBe(Start.AddMonths(1));
        subscription.EffectiveEndDate.ShouldBe(graceEnd);
    }

    [Fact]
    public void Expire_Should_Close_The_Row()
    {
        var subscription = Create(SubscriptionPeriod.Monthly);
        var now = Start.AddMonths(2);

        subscription.Expire(now);

        subscription.Status.ShouldBe(SubscriptionStatus.Expired);
        subscription.EndedAt.ShouldBe(now);
        subscription.IsCurrent.ShouldBeFalse();
    }

    [Fact]
    public void Supersede_Should_Close_The_Row()
    {
        var subscription = Create(SubscriptionPeriod.Annual);
        var now = Start.AddDays(10);

        subscription.Supersede(now);

        subscription.Status.ShouldBe(SubscriptionStatus.Superseded);
        subscription.EndedAt.ShouldBe(now);
        subscription.IsCurrent.ShouldBeFalse();
    }

    /// <summary>Ödeme kancası bugün kullanılmıyor: yeni satır bu alanları boş doğurur.</summary>
    [Fact]
    public void Payment_Fields_Should_Start_Empty()
    {
        var subscription = Create(SubscriptionPeriod.Monthly);

        subscription.AutoRenew.ShouldBeFalse();
        subscription.ExternalReference.ShouldBeNull();

        subscription.SetPaymentReference("iyz-123", autoRenew: true);

        subscription.AutoRenew.ShouldBeTrue();
        subscription.ExternalReference.ShouldBe("iyz-123");
    }
}
