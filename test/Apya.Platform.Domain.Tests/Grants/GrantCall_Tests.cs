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
}
