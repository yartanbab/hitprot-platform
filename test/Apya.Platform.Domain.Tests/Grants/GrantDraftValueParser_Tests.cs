using System;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// Taslak alanı → program parametresi ayrıştırması. Taslak oluşturma (3a) ve parametre
/// formunun "nereden geldi" karşılaştırması (10b) AYNI kuralı kullanır.
/// </summary>
public class GrantDraftValueParser_Tests
{
    private static Grant NewGrant() => new(Guid.NewGuid(), "Program", "Kurum", 0m, 0);

    [Fact]
    public void Tanidigi_alanlari_programa_yazar()
    {
        var grant = NewGrant();

        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldMaxAmount, "10000000.50").ShouldBeTrue();
        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldSupportRate, " 60 ").ShouldBeTrue();
        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldDuration, "24").ShouldBeTrue();
        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldCompanyAge, "2").ShouldBeTrue();
        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldCompanySizes, "6").ShouldBeTrue();
        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldRdStaff, "2").ShouldBeTrue();
        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldConsortium, "true").ShouldBeTrue();
        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldTrl, "3-7").ShouldBeTrue();

        grant.MaxAmount.ShouldBe(10_000_000.50m);
        grant.SupportRatePercent.ShouldBe(60);
        grant.ProjectDurationMonths.ShouldBe(24);
        grant.MinCompanyAgeYears.ShouldBe(2);
        grant.EligibleCompanySizes.ShouldBe(6);
        grant.MinRdStaffCount.ShouldBe(2);
        grant.RequiresConsortium.ShouldBeTrue();
        grant.MinTrl.ShouldBe(3);
        grant.MaxTrl.ShouldBe(7);
    }

    [Fact]
    public void Ayristirilamayan_ya_da_tanimsiz_alan_programa_dokunmaz()
    {
        var grant = NewGrant();
        grant.MinCompanyAgeYears = 5;
        grant.MinTrl = 4;
        grant.MaxTrl = 6;

        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldCompanyAge, "iki yıl").ShouldBeFalse();
        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldCompanyAge, "   ").ShouldBeFalse();
        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldTrl, "3").ShouldBeFalse();
        // Ad, kurum, son tarih programın parametresi değil — burada uygulanmaz.
        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldName, "Başka Ad").ShouldBeFalse();
        GrantDraftValueParser.TryApply(grant, GrantTextExtractor.FieldDeadline, "2026-10-01").ShouldBeFalse();

        grant.MinCompanyAgeYears.ShouldBe(5);
        grant.MinTrl.ShouldBe(4);
        grant.MaxTrl.ShouldBe(6);
        grant.Name.ShouldBe("Program");
    }
}
