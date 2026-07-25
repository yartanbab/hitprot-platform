using System;
using System.Collections.Generic;
using System.Linq;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;
using Apya.Platform.Projects;

namespace Apya.Platform.Tests.Domain.Grants;

public class GrantMatchManager_Tests
{
    private readonly GrantMatchManager _m = new();

    private static Grant Grant(int sizes, double minScore, decimal maxAmount = 1000000m) =>
        new Grant(Guid.NewGuid(), "P", "K", maxAmount, minScore) { EligibleCompanySizes = sizes };

    private static List<GrantCriteriaTag> Tags(params (GrantCriteriaKind, string)[] xs)
    {
        var gid = Guid.NewGuid();
        return xs.Select(x => new GrantCriteriaTag(Guid.NewGuid(), gid, x.Item1, x.Item2)).ToList();
    }

    private static FirmSignals Firm(
        CompanySize? size,
        params (GrantCriteriaKind, string)[] xs) => Firm(size, null, null, xs);

    private static FirmSignals Firm(
        CompanySize? size,
        decimal? typicalProjectBudget,
        ProjectCategory? dominantCategory,
        params (GrantCriteriaKind, string)[] xs) =>
        new FirmSignals
        {
            Size = size,
            Tags = xs.Select(x => new FirmSignalTag(x.Item1, x.Item2)).ToList(),
            TypicalProjectBudget = typicalProjectBudget,
            DominantCategory = dominantCategory
        };

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

    [Fact]
    public void No_Project_History_Skips_B2_Dimensions_Same_As_B1()
    {
        // TypicalProjectBudget/DominantCategory null → B1 davranışıyla birebir aynı.
        var grant = Grant((int)CompanySize.Kucuk, 50);
        var gt = Tags((GrantCriteriaKind.Sektor, "yazılım"));
        var firm = Firm(CompanySize.Kucuk, null, null, (GrantCriteriaKind.Sektor, "Yazılım"));
        _m.Score(firm, grant, gt).ShouldBe(100);
    }

    [Fact]
    public void Budget_Fit_Full_When_Typical_Budget_Under_MaxAmount()
    {
        var grant = Grant(0, 0, maxAmount: 100000m);
        var gt = Tags((GrantCriteriaKind.Sektor, "a"));
        // sektör 1/1=1.0, bütçe-uyumu 1.0 (50000 <= 100000) → ort 1.0 → 100
        var firm = Firm(null, 50000m, null, (GrantCriteriaKind.Sektor, "a"));
        _m.Score(firm, grant, gt).ShouldBe(100);
    }

    [Fact]
    public void Budget_Fit_Partial_When_Typical_Budget_Exceeds_MaxAmount()
    {
        var grant = Grant(0, 0, maxAmount: 50000m);
        var gt = Tags((GrantCriteriaKind.Sektor, "a"));
        // sektör 1.0, bütçe-uyumu 50000/100000=0.5 → ort .75 → 75
        var firm = Firm(null, 100000m, null, (GrantCriteriaKind.Sektor, "a"));
        _m.Score(firm, grant, gt).ShouldBe(75);
    }

    [Fact]
    public void Category_Fit_Full_For_GrantProject_Dominant()
    {
        var grant = Grant(0, 0);
        var gt = Tags((GrantCriteriaKind.Sektor, "a"));
        // sektör 1.0, kategori-uyumu 1.0 (GrantProject) → ort 1.0 → 100
        var firm = Firm(null, null, ProjectCategory.GrantProject, (GrantCriteriaKind.Sektor, "a"));
        _m.Score(firm, grant, gt).ShouldBe(100);
    }

    [Fact]
    public void Category_Fit_Half_For_Non_Grant_Dominant()
    {
        var grant = Grant(0, 0);
        var gt = Tags((GrantCriteriaKind.Sektor, "a"));
        // sektör 1.0, kategori-uyumu 0.5 (Other) → ort .75 → 75
        var firm = Firm(null, null, ProjectCategory.Other, (GrantCriteriaKind.Sektor, "a"));
        _m.Score(firm, grant, gt).ShouldBe(75);
    }
}
