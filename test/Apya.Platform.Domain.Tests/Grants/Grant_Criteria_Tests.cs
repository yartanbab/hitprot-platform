using System;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

public class Grant_Criteria_Tests
{
    [Fact]
    public void CriteriaTag_Should_Trim_Value()
    {
        var tag = new GrantCriteriaTag(Guid.NewGuid(), Guid.NewGuid(), GrantCriteriaKind.Sektor, "  yazılım  ");
        tag.Value.ShouldBe("yazılım");
        tag.Kind.ShouldBe(GrantCriteriaKind.Sektor);
    }

    [Fact]
    public void CompanySize_Flags_Should_Combine()
    {
        var kobi = CompanySize.Mikro | CompanySize.Kucuk | CompanySize.Orta;
        ((int)kobi).ShouldBe(7);
        kobi.HasFlag(CompanySize.Orta).ShouldBeTrue();
        kobi.HasFlag(CompanySize.Buyuk).ShouldBeFalse();
    }
}
