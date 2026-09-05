using System;
using Shouldly;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

/// <summary>
/// Kurum türünün eşleştirmeye bakan tek etkisi: asgari personel şartının hangi değerle
/// ölçüldüğü. STK'lar personeli tam sayıyla değil bantla beyan eder.
/// </summary>
public class FirmProfile_OrganizationType_Tests
{
    private static FirmProfile Profile() => new(Guid.NewGuid(), Guid.NewGuid());

    [Fact]
    public void Sirkette_Personel_Sayisi_Beyan_Edilen_Degerdir()
    {
        var p = Profile();
        p.Type = OrganizationType.Sirket;
        p.StaffCount = 40;
        p.ProfessionalStaffBand = NgoStaffBand.YirmiBesUstu; // şirkette yok sayılır

        p.EffectiveStaffCount.ShouldBe(40);
    }

    [Theory]
    [InlineData(NgoStaffBand.BirUc, 1)]
    [InlineData(NgoStaffBand.DortOn, 4)]
    [InlineData(NgoStaffBand.OnBirYirmiBes, 11)]
    [InlineData(NgoStaffBand.YirmiBesUstu, 26)]
    public void Stk_Personel_Sayisi_Bandin_Alt_Sinirdir(NgoStaffBand band, int beklenen)
    {
        var p = Profile();
        p.Type = OrganizationType.Dernek;
        p.ProfessionalStaffBand = band;

        p.EffectiveStaffCount.ShouldBe(beklenen);
    }

    [Fact]
    public void Bant_Girilmemisse_Personel_Sarti_Olculemez()
    {
        var p = Profile();
        p.Type = OrganizationType.Vakif;
        p.StaffCount = 40; // şirket alanı; STK'da okunmaz

        p.EffectiveStaffCount.ShouldBeNull();
    }

    /// <summary>
    /// Alt sınır seçilir ki bant, karşılamadığı bir şartı karşılıyormuş gibi göstermesin:
    /// "4-10" bandındaki bir dernek, asgari 10 personel isteyen programı geçemez.
    /// </summary>
    [Fact]
    public void Bandin_Alt_Siniri_Asgari_Personel_Sartini_Zorlar()
    {
        var manager = new GrantMatchManager();
        var grant = new Grant(Guid.NewGuid(), "P", "K", 1_000_000m, 0) { MinStaffCount = 10 };
        var p = Profile();
        p.Type = OrganizationType.Dernek;
        p.ProfessionalStaffBand = NgoStaffBand.DortOn;

        var result = manager.Evaluate(
            new FirmSignals { StaffCount = p.EffectiveStaffCount },
            grant,
            new DateTime(2026, 9, 1));

        result.IsEligible.ShouldBeFalse();
    }
}
