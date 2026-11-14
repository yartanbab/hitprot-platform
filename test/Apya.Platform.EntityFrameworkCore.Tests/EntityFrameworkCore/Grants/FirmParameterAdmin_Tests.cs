using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Kurum parametre kataloğunun host yönetimi: yeni parametre veriyle eklenir ve kurumun
/// formunda hemen görünür; sistem parametresinin kodda yaşayan özellikleri kilitlidir;
/// değeri girilmiş tanım silinmez.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FirmParameterAdmin_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Cofinancing = FirmParameterCatalog.IdOf(26);
    private static readonly Guid AnnualRevenue = FirmParameterCatalog.IdOf(6); // sistem

    private readonly IFirmParameterAdminAppService _admin;
    private readonly IFirmDataAppService _firmData;
    private readonly ICurrentTenant _currentTenant;

    public FirmParameterAdmin_Tests()
    {
        _admin = GetRequiredService<IFirmParameterAdminAppService>();
        _firmData = GetRequiredService<IFirmDataAppService>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private static SaveFirmParameterDefinitionDto NewInput(string code, FirmParameterDataType type = FirmParameterDataType.Number) => new()
    {
        Code = code,
        Name = "İhracat yapılan ülke sayısı",
        Description = "İhracat destekleri deneyimli ihracatçıları önceliklendirir.",
        DataType = type,
        Group = FirmParameterGroup.Deneyim,
        Requirement = FirmParameterRequirement.Onerilen,
        MinNumber = 0,
        MaxNumber = 250,
        ValidityMonths = 12
    };

    private static async Task<string> CodeOfAsync(Func<Task> action)
        => (await Should.ThrowAsync<BusinessException>(action)).Code!;

    [Fact]
    public async Task Yeni_parametre_kod_degisikligi_olmadan_eklenir_ve_kurumun_formunda_gorunur()
    {
        var created = await _admin.CreateAsync(NewInput("export_country_count"));

        created.IsSystem.ShouldBeFalse();
        created.Version.ShouldBe(1);
        created.MaxNumber.ShouldBe(250m);

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var item = (await _firmData.GetMineAsync()).Groups
                .Single(g => g.Group == FirmParameterGroup.Deneyim).Items
                .Single(i => i.Code == "export_country_count");
            item.Name.ShouldBe("İhracat yapılan ülke sayısı");

            // Tanımdaki sınır kurumun girdiği değere uygulanır.
            (await CodeOfAsync(() => _firmData.SaveMineAsync(new SaveFirmDataDto
            {
                Items = { new SaveFirmDataItemDto { DefinitionId = created.Id, RawValue = "300" } }
            }))).ShouldBe(PlatformDomainErrorCodes.FirmParameterValueAboveMax);
        }
    }

    [Fact]
    public async Task Ayni_kodla_ikinci_parametre_acilamaz()
    {
        (await CodeOfAsync(() => _admin.CreateAsync(NewInput("cofinancing_capacity"))))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterCodeExists);
    }

    [Theory]
    [InlineData("İhracat")]
    [InlineData("")]
    public async Task Gecersiz_kod_reddedilir(string code)
    {
        (await CodeOfAsync(() => _admin.CreateAsync(NewInput(code))))
            .ShouldBe(PlatformDomainErrorCodes.FirmParameterCodeInvalid);
    }

    [Fact]
    public async Task Secimli_parametre_seceneksiz_acilamaz_seceneklerle_acilir()
    {
        var input = NewInput("export_experience", FirmParameterDataType.Select);
        (await CodeOfAsync(() => _admin.CreateAsync(input))).ShouldBe(PlatformDomainErrorCodes.FirmParameterOptionsRequired);

        input.OptionsText = "Yok\r\n1-3 ülke\n\n4+ ülke\n1-3 ülke";
        (await _admin.CreateAsync(input)).Options.ShouldBe(new[] { "Yok", "1-3 ülke", "4+ ülke" });
    }

    [Fact]
    public async Task Ad_ve_sinir_kurallari_ham_hata_yerine_anlasilir_hata_verir()
    {
        var noName = NewInput("no_name");
        noName.Name = "  ";
        (await CodeOfAsync(() => _admin.CreateAsync(noName))).ShouldBe(PlatformDomainErrorCodes.FirmParameterNameRequired);

        var badValidity = NewInput("bad_validity");
        badValidity.ValidityMonths = 0;
        (await CodeOfAsync(() => _admin.CreateAsync(badValidity))).ShouldBe(PlatformDomainErrorCodes.FirmParameterLimitInvalid);

        var inverted = NewInput("inverted_range");
        inverted.MinNumber = 10;
        inverted.MaxNumber = 5;
        (await CodeOfAsync(() => _admin.CreateAsync(inverted))).ShouldBe(PlatformDomainErrorCodes.FirmParameterRangeInverted);
    }

    [Fact]
    public async Task Eslestirmedeki_rol_degisince_surum_artar_baska_degisiklikte_artmaz()
    {
        var current = await _admin.GetAsync(Cofinancing);
        var input = ToInput(current);

        input.Name = "Öz kaynak kapasitesi (TL)";
        (await _admin.UpdateAsync(Cofinancing, input)).Version.ShouldBe(current.Version);

        input.MatchUsage = FirmParameterMatchUsage.Eleme;
        var updated = await _admin.UpdateAsync(Cofinancing, input);
        updated.Version.ShouldBe(current.Version + 1);
        updated.Name.ShouldBe("Öz kaynak kapasitesi (TL)");
        updated.Code.ShouldBe("cofinancing_capacity", "kod değişmez");
        updated.DataType.ShouldBe(FirmParameterDataType.Money, "tip değişmez");
    }

    [Fact]
    public async Task Sistem_parametresinin_metni_degisir_kilitli_ozelligi_degismez_silinmez()
    {
        var current = await _admin.GetAsync(AnnualRevenue);
        var input = ToInput(current);

        input.Name = "Yıllık net satış";
        input.Requirement = FirmParameterRequirement.Onerilen;
        input.Group = FirmParameterGroup.Tercih; // yok sayılır
        var updated = await _admin.UpdateAsync(AnnualRevenue, input);
        updated.Name.ShouldBe("Yıllık net satış");
        updated.Requirement.ShouldBe(FirmParameterRequirement.Onerilen);
        updated.Group.ShouldBe(current.Group);

        input.MatchUsage = FirmParameterMatchUsage.Kullanilmaz;
        (await CodeOfAsync(() => _admin.UpdateAsync(AnnualRevenue, input))).ShouldBe(PlatformDomainErrorCodes.FirmParameterSystemLocked);
        (await CodeOfAsync(() => _admin.DeleteAsync(AnnualRevenue))).ShouldBe(PlatformDomainErrorCodes.FirmParameterSystemLocked);
    }

    [Fact]
    public async Task Degeri_girilmis_tanim_silinmez_kullanimdan_kaldirilinca_formdan_cikar()
    {
        var created = await _admin.CreateAsync(NewInput("fair_participation_count"));

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            await _firmData.SaveMineAsync(new SaveFirmDataDto
            {
                Items = { new SaveFirmDataItemDto { DefinitionId = created.Id, RawValue = "3" } }
            });
        }

        (await _admin.GetAsync(created.Id)).ValueOwnerCount.ShouldBe(1, "sayım bütün kurumlar üzerinden");
        (await CodeOfAsync(() => _admin.DeleteAsync(created.Id))).ShouldBe(PlatformDomainErrorCodes.FirmParameterHasValues);

        var input = ToInput(await _admin.GetAsync(created.Id));
        input.IsActive = false;
        await _admin.UpdateAsync(created.Id, input);

        using (_currentTenant.Change(Guid.NewGuid()))
        {
            (await _firmData.GetMineAsync()).Groups.SelectMany(g => g.Items)
                .ShouldNotContain(i => i.Code == "fair_participation_count");
        }
    }

    [Fact]
    public async Task Degeri_olmayan_tanim_silinir()
    {
        var created = await _admin.CreateAsync(NewInput("unused_parameter"));

        await _admin.DeleteAsync(created.Id);

        (await _admin.GetListAsync()).ShouldNotContain(d => d.Code == "unused_parameter");
    }

    [Fact]
    public async Task Katalog_kurum_baglamindan_yonetilemez()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            await Should.ThrowAsync<AbpAuthorizationException>(() => _admin.GetListAsync());
            await Should.ThrowAsync<AbpAuthorizationException>(() => _admin.CreateAsync(NewInput("tenant_made")));
        }
    }

    private static SaveFirmParameterDefinitionDto ToInput(FirmParameterDefinitionDto d) => new()
    {
        Code = d.Code,
        Name = d.Name,
        Description = d.Description,
        DataType = d.DataType,
        Group = d.Group,
        Requirement = d.Requirement,
        Audience = d.Audience,
        AllowDocumentSource = d.AllowDocumentSource,
        ValidityMonths = d.ValidityMonths,
        MinNumber = d.MinNumber,
        MaxNumber = d.MaxNumber,
        MaxLength = d.MaxLength,
        OptionsText = string.Join("\n", d.Options),
        MatchUsage = d.MatchUsage,
        IsActive = d.IsActive,
        Order = d.Order
    };
}
