using System.Linq;
using Apya.Platform.Web.Pages.Finance;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Bağlam sihirbazının (tasarım 1c) kalem önerisi.
///
/// Sihirbaz kullanıcının girmediği bir BÜTÇE yazmamalı: yalnız kalem ADI önerir,
/// tutar sıfır gelir. Bir gün "şablonda 100.000 yazsın" diye eklenirse bu test
/// düşer — ekranda uydurma para görünmesinin tek koruması budur.
/// </summary>
public class FinanceContextWizard_Tests
{
    [Theory]
    [InlineData(FinanceContextTemplate.Corporate)]
    [InlineData(FinanceContextTemplate.Grant)]
    [InlineData(FinanceContextTemplate.Event)]
    public void Onerilen_kalemlerin_TUTARI_daima_sifirdir(FinanceContextTemplate template)
    {
        var rows = ContextWizardModalModel.PresetFor(template);

        rows.ShouldAllBe(r => r.Amount == 0m);
    }

    [Theory]
    [InlineData(FinanceContextTemplate.Corporate)]
    [InlineData(FinanceContextTemplate.Grant)]
    [InlineData(FinanceContextTemplate.Event)]
    public void Her_sablonun_adi_ve_kodu_dolu_kalemleri_vardir(FinanceContextTemplate template)
    {
        var rows = ContextWizardModalModel.PresetFor(template);

        rows.ShouldNotBeEmpty();
        rows.ShouldAllBe(r => !string.IsNullOrWhiteSpace(r.Name));
        rows.ShouldAllBe(r => !string.IsNullOrWhiteSpace(r.Code));
    }

    [Theory]
    [InlineData(FinanceContextTemplate.Corporate)]
    [InlineData(FinanceContextTemplate.Grant)]
    [InlineData(FinanceContextTemplate.Event)]
    public void Kalem_kodlari_sablon_icinde_benzersizdir(FinanceContextTemplate template)
    {
        var codes = ContextWizardModalModel.PresetFor(template).Select(r => r.Code).ToList();

        codes.Distinct().Count().ShouldBe(codes.Count,
            "aynı kodla iki kalem açılırsa sunucu LineCodeAlreadyExists ile reddeder");
    }

    /// <summary>
    /// Hibe şablonu diğerlerinden AYRIŞMALI — hepsi aynı listeyi döndürseydi
    /// şablon seçiminin ekranda hiçbir karşılığı olmazdı.
    /// </summary>
    [Fact]
    public void Sablonlar_birbirinden_farkli_kalem_onerir()
    {
        var corporate = ContextWizardModalModel.PresetFor(FinanceContextTemplate.Corporate)
            .Select(r => r.Name).ToList();
        var grant = ContextWizardModalModel.PresetFor(FinanceContextTemplate.Grant)
            .Select(r => r.Name).ToList();
        var evt = ContextWizardModalModel.PresetFor(FinanceContextTemplate.Event)
            .Select(r => r.Name).ToList();

        grant.ShouldNotBe(corporate);
        evt.ShouldNotBe(corporate);
        evt.ShouldNotBe(grant);
    }
}
