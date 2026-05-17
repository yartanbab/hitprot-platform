using System;
using Shouldly;
using Xunit;
using Apya.Platform.Ai.Tenants;

namespace Apya.Platform.Tests.Domain.Ai;

public class TenantAiSettings_Tests
{
    private static readonly DateTime PeriodStart = new(2026, 5, 1, 0, 0, 0, DateTimeKind.Utc);

    private static TenantAiSettings Create(DateTime? periodStart = null) =>
        new(Guid.NewGuid(), tenantId: null, quotaPeriodStart: periodStart ?? PeriodStart);

    [Fact]
    public void Constructor_Should_Initialize_Defaults()
    {
        var s = Create();

        s.PreferredProvider.ShouldBe("openai");
        s.PreferredModel.ShouldBe("gpt-4o-mini");
        s.MonthlyTokenQuota.ShouldBe(100_000);
        s.IsEnabled.ShouldBeTrue();
        s.TokensUsedThisMonth.ShouldBe(0);
        s.QuotaPeriodStart.ShouldBe(PeriodStart);
    }

    [Fact]
    public void SetProvider_Should_Update_Values()
    {
        var s = Create();

        s.SetProvider("anthropic", "claude-opus-4-7");

        s.PreferredProvider.ShouldBe("anthropic");
        s.PreferredModel.ShouldBe("claude-opus-4-7");
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void SetProvider_Should_Throw_On_Invalid_Provider(string? provider)
    {
        var s = Create();

        Assert.Throws<ArgumentException>(() => s.SetProvider(provider!, "gpt-4o"));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void SetProvider_Should_Throw_On_Invalid_Model(string? model)
    {
        var s = Create();

        Assert.Throws<ArgumentException>(() => s.SetProvider("openai", model!));
    }

    [Fact]
    public void SetQuota_Should_Throw_On_Negative()
    {
        var s = Create();

        Assert.Throws<ArgumentException>(() => s.SetQuota(-1));
    }

    [Fact]
    public void SetQuota_Should_Accept_Zero()
    {
        var s = Create();

        s.SetQuota(0);

        s.MonthlyTokenQuota.ShouldBe(0);
    }

    [Fact]
    public void RecordUsage_Should_Accumulate_Within_Same_Window()
    {
        var s = Create();

        s.RecordUsage(100, new DateTime(2026, 5, 10, 0, 0, 0, DateTimeKind.Utc));
        s.RecordUsage(150, new DateTime(2026, 5, 20, 0, 0, 0, DateTimeKind.Utc));

        s.TokensUsedThisMonth.ShouldBe(250);
        s.QuotaPeriodStart.ShouldBe(PeriodStart);
    }

    [Fact]
    public void RecordUsage_Should_Reset_When_Crossing_Month_Boundary()
    {
        var s = Create();
        s.RecordUsage(500, new DateTime(2026, 5, 15, 0, 0, 0, DateTimeKind.Utc));

        s.RecordUsage(200, new DateTime(2026, 6, 5, 0, 0, 0, DateTimeKind.Utc));

        s.TokensUsedThisMonth.ShouldBe(200);
        s.QuotaPeriodStart.ShouldBe(new DateTime(2026, 6, 1, 0, 0, 0, DateTimeKind.Utc));
    }

    [Fact]
    public void CanConsume_Should_Return_True_When_Within_Quota()
    {
        var s = Create();
        s.SetQuota(1000);

        s.CanConsume(500).ShouldBeTrue();
    }

    [Fact]
    public void CanConsume_Should_Return_False_When_Exceeding_Quota()
    {
        var s = Create();
        s.SetQuota(1000);
        s.RecordUsage(900, new DateTime(2026, 5, 10, 0, 0, 0, DateTimeKind.Utc));

        s.CanConsume(200).ShouldBeFalse();
    }

    [Fact]
    public void CanConsume_Should_Return_False_When_Disabled()
    {
        var s = Create();
        s.Disable();

        s.CanConsume(1).ShouldBeFalse();
        s.IsEnabled.ShouldBeFalse();
    }

    [Fact]
    public void Enable_After_Disable_Should_Restore_Capability()
    {
        var s = Create();
        s.Disable();
        s.Enable();

        s.IsEnabled.ShouldBeTrue();
        s.CanConsume(1).ShouldBeTrue();
    }

    [Fact]
    public void RemainingTokens_Should_Be_Quota_Minus_Used()
    {
        var s = Create();
        s.SetQuota(1000);
        s.RecordUsage(300, new DateTime(2026, 5, 10, 0, 0, 0, DateTimeKind.Utc));

        s.RemainingTokens.ShouldBe(700);
    }

    [Fact]
    public void RemainingTokens_Should_Be_Zero_When_Used_Exceeds_Quota()
    {
        var s = Create();
        s.SetQuota(100);
        s.RecordUsage(150, new DateTime(2026, 5, 10, 0, 0, 0, DateTimeKind.Utc));

        s.RemainingTokens.ShouldBe(0);
    }
}
