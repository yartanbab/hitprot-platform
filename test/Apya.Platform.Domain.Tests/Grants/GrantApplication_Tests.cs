using System;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

public class GrantApplication_Tests
{
    private static GrantApplication NewApp() => new GrantApplication(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());

    [Fact]
    public void AdvanceStage_Updates_Stage()
    {
        var app = NewApp();
        app.AdvanceStage(GrantApplicationStage.Degerlendirme);
        app.Stage.ShouldBe(GrantApplicationStage.Degerlendirme);
        app.ApprovedAmount.ShouldBeNull();
    }

    [Fact]
    public void AdvanceStage_With_ApprovedAmount_Sets_It()
    {
        var app = NewApp();
        app.AdvanceStage(GrantApplicationStage.Onay, 50000m);
        app.Stage.ShouldBe(GrantApplicationStage.Onay);
        app.ApprovedAmount.ShouldBe(50000m);
    }

    [Fact]
    public void AdvanceStage_Without_ApprovedAmount_Keeps_Previous_Value()
    {
        var app = NewApp();
        app.AdvanceStage(GrantApplicationStage.Onay, 50000m);
        app.AdvanceStage(GrantApplicationStage.Odeme);
        app.Stage.ShouldBe(GrantApplicationStage.Odeme);
        app.ApprovedAmount.ShouldBe(50000m);
    }
}
