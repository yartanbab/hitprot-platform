using System;
using System.Collections.Generic;
using System.Linq;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

public class GrantMatchManager_Tests
{
    private readonly GrantMatchManager _m = new();

    private static Grant Grant(int sizes, double minScore) =>
        new Grant(Guid.NewGuid(), "P", "K", 1000000m, minScore) { EligibleCompanySizes = sizes };

    private static List<GrantCriteriaTag> Tags(params (GrantCriteriaKind, string)[] xs)
    {
        var gid = Guid.NewGuid();
        return xs.Select(x => new GrantCriteriaTag(Guid.NewGuid(), gid, x.Item1, x.Item2)).ToList();
    }

    private static FirmSignals Firm(CompanySize? size, params (GrantCriteriaKind, string)[] xs) =>
        new FirmSignals { Size = size, Tags = xs.Select(x => new FirmSignalTag(x.Item1, x.Item2)).ToList() };

    [Fact]
    public void Full_Overlap_Scores_100_When_Size_Ok()
    {
        var grant = Grant((int)CompanySize.Kucuk, 50);
        var gt = Tags((GrantCriteriaKind.Sektor, "yazılım"));
        var firm = Firm(CompanySize.Kucuk, (GrantCriteriaKind.Sektor, "Yazılım")); // case-insensitive
        _m.Score(firm, grant, gt).ShouldBe(100);
    }

    [Fact]
    public void No_Grant_Tags_Scores_Zero()
    {
        _m.Score(Firm(CompanySize.Kucuk), Grant(0, 0), new List<GrantCriteriaTag>()).ShouldBe(0);
    }

    [Fact]
    public void Partial_Overlap_Averaged_Across_Kinds()
    {
        var grant = Grant(0, 0);
        var gt = Tags((GrantCriteriaKind.Sektor, "a"), (GrantCriteriaKind.Sektor, "b"),
                      (GrantCriteriaKind.Bolge, "ankara"));
        // sektör 1/2 = .5, bölge 1/1 = 1 → ort .75 → 75
        var firm = Firm(null, (GrantCriteriaKind.Sektor, "a"), (GrantCriteriaKind.Bolge, "Ankara"));
        _m.Score(firm, grant, gt).ShouldBe(75);
    }

    [Fact]
    public void Size_Mismatch_Applies_Penalty()
    {
        var grant = Grant((int)CompanySize.Buyuk, 0);
        var gt = Tags((GrantCriteriaKind.Sektor, "a"));
        var firm = Firm(CompanySize.Mikro, (GrantCriteriaKind.Sektor, "a")); // base 100, size uyumsuz → 30
        _m.Score(firm, grant, gt).ShouldBe(30);
    }

    [Fact]
    public void IsRecommended_Uses_MinMatchScore()
    {
        var grant = Grant(0, 80);
        var gt = Tags((GrantCriteriaKind.Sektor, "a"), (GrantCriteriaKind.Sektor, "b"));
        var firm = Firm(null, (GrantCriteriaKind.Sektor, "a")); // 50 < 80
        _m.IsRecommended(firm, grant, gt).ShouldBeFalse();
    }
}
