using System;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

public class GrantCall_Tests
{
    [Fact]
    public void SetPeriod_Should_Throw_When_Blank()
    {
        var call = new GrantCall(Guid.NewGuid(), Guid.NewGuid(), "2025/1", GrantCallStatus.Acik);
        Assert.Throws<ArgumentException>(() => call.SetPeriod("  "));
    }

    [Fact]
    public void SetSchedule_Should_Throw_When_Deadline_Before_Open()
    {
        var call = new GrantCall(Guid.NewGuid(), Guid.NewGuid(), "2025/1", GrantCallStatus.Acik);
        var ex = Assert.Throws<BusinessException>(() =>
            call.SetSchedule(new DateTime(2025, 5, 10), new DateTime(2025, 5, 1)));
        ex.Code.ShouldBe(PlatformDomainErrorCodes.GrantCallScheduleInvalid);
    }

    [Fact]
    public void SetSchedule_Should_Accept_Valid_Range()
    {
        var call = new GrantCall(Guid.NewGuid(), Guid.NewGuid(), "2025/1", GrantCallStatus.Acik);
        call.SetSchedule(new DateTime(2025, 5, 1), new DateTime(2025, 6, 1));
        call.Deadline!.Value.ShouldBe(new DateTime(2025, 6, 1));
    }

    /* ─── Çağrı açık mı: durum + son başvuru tarihi (LIF-04 / LIF-05) ─── */

    private static readonly DateTime Today = new(2026, 10, 8, 14, 30, 0);

    private static GrantCall Call(GrantCallStatus status, DateTime? deadline)
    {
        var call = new GrantCall(Guid.NewGuid(), Guid.NewGuid(), "2026/1", status);
        call.SetSchedule(null, deadline);
        return call;
    }

    [Fact]
    public void Son_Tarihi_Olmayan_Acik_Cagri_Aciktir()
    {
        Call(GrantCallStatus.Acik, null).IsOpenOn(Today).ShouldBeTrue();
        Call(GrantCallStatus.Acik, null).IsPastDeadline(Today).ShouldBeFalse();
    }

    /// <summary>Son gün DAHİL: o günün saatinden bağımsız, gün bitene kadar açık.</summary>
    [Fact]
    public void Son_Gununde_Cagri_Hala_Aciktir()
    {
        Call(GrantCallStatus.Acik, Today.Date).IsOpenOn(Today).ShouldBeTrue();
        Call(GrantCallStatus.Acik, Today.Date.AddHours(9)).IsOpenOn(Today).ShouldBeTrue();
    }

    /// <summary>
    /// Tarihi geçen çağrı, otomatik kapanış çalışana kadar "Açık" durumda kalır; kural duruma
    /// güvenmez.
    /// </summary>
    [Fact]
    public void Son_Tarihi_Gecmis_Cagri_Durumu_Acik_Olsa_Da_Acik_Degildir()
    {
        var call = Call(GrantCallStatus.Acik, Today.Date.AddDays(-1));

        call.IsPastDeadline(Today).ShouldBeTrue();
        call.IsOpenOn(Today).ShouldBeFalse();
    }

    [Theory]
    [InlineData(GrantCallStatus.Taslak)]
    [InlineData(GrantCallStatus.Planlandi)]
    [InlineData(GrantCallStatus.Kapandi)]
    public void Yayinda_Olmayan_Cagri_Tarihi_Gecmese_De_Acik_Degildir(GrantCallStatus status)
    {
        Call(status, Today.Date.AddDays(30)).IsOpenOn(Today).ShouldBeFalse();
    }
}
