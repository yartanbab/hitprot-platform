using System;
using System.Linq;
using Shouldly;
using Volo.Abp;
using Xunit;
using Apya.Platform.Grants;

namespace Apya.Platform.Tests.Domain.Grants;

public class FirmParameterDefinition_Tests
{
    private static FirmParameterDefinition New(string code = "cofinancing_capacity", FirmParameterDataType type = FirmParameterDataType.Money)
        => new(Guid.NewGuid(), code, "Eş finansman kapasitesi", type, FirmParameterGroup.Finans);

    [Theory]
    [InlineData("")]
    [InlineData("Cofinancing")]      // büyük harf
    [InlineData("1_capacity")]       // rakamla başlıyor
    [InlineData("es finansman")]     // boşluk
    [InlineData("eş_finansman")]     // Türkçe harf
    [InlineData("kapasite-tl")]      // tire
    public void Kod_kucuk_ASCII_harf_rakam_ve_alt_cizgidir(string code)
    {
        Should.Throw<BusinessException>(() => New(code))
            .Code.ShouldBe(PlatformDomainErrorCodes.FirmParameterCodeInvalid);
    }

    [Fact]
    public void Kod_uzunluk_sinirini_asamaz()
    {
        New(new string('a', FirmParameterConsts.MaxCodeLength)).Code.Length.ShouldBe(FirmParameterConsts.MaxCodeLength);
        Should.Throw<BusinessException>(() => New(new string('a', FirmParameterConsts.MaxCodeLength + 1)))
            .Code.ShouldBe(PlatformDomainErrorCodes.FirmParameterCodeInvalid);
    }

    [Fact]
    public void Ters_sayi_araligi_reddedilir()
    {
        Should.Throw<BusinessException>(() => New().SetNumberRange(10, 5))
            .Code.ShouldBe(PlatformDomainErrorCodes.FirmParameterRangeInverted);

        Should.NotThrow(() => New().SetNumberRange(0, null));
    }

    [Fact]
    public void Secenekler_temizlenir_ve_bos_liste_reddedilir()
    {
        var definition = New("experience_band", FirmParameterDataType.Select);

        definition.SetOptions(new[] { " 1-3 ", "4-10", "", "1-3" });
        definition.GetOptions().ShouldBe(new[] { "1-3", "4-10" });

        Should.Throw<BusinessException>(() => definition.SetOptions(new[] { " ", "" }))
            .Code.ShouldBe(PlatformDomainErrorCodes.FirmParameterOptionsRequired);
    }

    [Fact]
    public void Eslestirmedeki_rol_degisince_surum_artar()
    {
        var definition = New();
        definition.Version.ShouldBe(1);

        definition.SetMatchUsage(FirmParameterMatchUsage.Kullanilmaz);
        definition.Version.ShouldBe(1, "rol değişmediyse sürüm artmaz");

        definition.SetMatchUsage(FirmParameterMatchUsage.Eleme);
        definition.Version.ShouldBe(2);

        definition.SetMatchUsage(FirmParameterMatchUsage.Skor);
        definition.Version.ShouldBe(3);
    }

    [Fact]
    public void Gecerlilik_suresi_pozitif_ay_ya_da_suresizdir()
    {
        var definition = New();

        definition.SetValidity(6);
        definition.ValidityMonths.ShouldBe(6);
        definition.SetValidity(null);
        definition.ValidityMonths.ShouldBeNull();
        Should.Throw<ArgumentOutOfRangeException>(() => definition.SetValidity(0));
    }

    [Fact]
    public void Kurum_turune_uymayan_parametre_o_kurum_icin_gecerli_degildir()
    {
        var companyOnly = New();
        companyOnly.Audience = FirmParameterAudience.YalnizSirket;
        var ngoOnly = New();
        ngoOnly.Audience = FirmParameterAudience.YalnizStk;

        companyOnly.AppliesTo(OrganizationType.Sirket).ShouldBeTrue();
        companyOnly.AppliesTo(OrganizationType.Dernek).ShouldBeFalse();
        ngoOnly.AppliesTo(OrganizationType.Vakif).ShouldBeTrue();
        ngoOnly.AppliesTo(OrganizationType.Sirket).ShouldBeFalse();
        New().AppliesTo(OrganizationType.Federasyon).ShouldBeTrue();
    }
}

/// <summary>Başlangıç kataloğunun değişmezleri. Katalog saf veridir; burada veritabanı yoktur.</summary>
public class FirmParameterCatalog_Tests
{
    [Fact]
    public void Kodlar_ve_kimlikler_benzersizdir()
    {
        var catalog = FirmParameterCatalog.Build();

        catalog.Select(d => d.Code).Distinct().Count().ShouldBe(catalog.Count);
        catalog.Select(d => d.Id).Distinct().Count().ShouldBe(catalog.Count);
    }

    [Fact]
    public void Eslestirme_motorunun_okudugu_her_alan_katalogda_tam_bir_kez_yer_alir()
    {
        var keys = FirmParameterCatalog.Build().Where(d => d.IsSystem).Select(d => d.SystemKey!.Value).ToList();

        keys.OrderBy(k => k).ShouldBe(Enum.GetValues<FirmParameterSystemKey>().OrderBy(k => k));
    }

    [Theory]
    [InlineData("strategic_goals")]
    [InlineData("priority_project_areas")]
    [InlineData("upcoming_project_goals")]
    [InlineData("target_beneficiaries")]
    [InlineData("annual_project_capacity")]
    [InlineData("expertise_areas")]
    [InlineData("technical_infrastructure")]
    [InlineData("cofinancing_capacity")]
    [InlineData("partnerships")]
    [InlineData("external_past_projects")]
    [InlineData("desired_grant_programs")]
    [InlineData("excluded_areas")]
    [InlineData("implementation_sustainability")]
    public void Kurumun_elle_girecegi_her_bilgi_katalogda_ve_kullanici_girisine_aciktir(string code)
    {
        var definition = FirmParameterCatalog.Build().Single(d => d.Code == code);

        definition.IsSystem.ShouldBeFalse();
        definition.AllowedSources.HasFlag(FirmParameterSource.Kullanici).ShouldBeTrue();
        definition.Description.ShouldNotBeNullOrWhiteSpace("eksik veri uyarısı bu gerekçeyi gösterir");
    }

    [Fact]
    public void Satir_numarasi_kimliktir()
    {
        // Numara değişirse canlıdaki tanım yetim kalır ve aynı kod ikinci kez eklenmeye çalışılır.
        FirmParameterCatalog.Build().Single(d => d.Code == "cofinancing_capacity").Id
            .ShouldBe(Guid.Parse("f17a0000-0000-4000-8000-000000000026"));
        FirmParameterCatalog.Build().Single(d => d.Code == "organization_type").Id
            .ShouldBe(Guid.Parse("f17a0000-0000-4000-8000-000000000001"));
    }
}
