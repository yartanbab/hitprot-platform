using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Kurumsal Veriler servisinin sözleşmesi: form tanımlardan gelir, boş alan "bilinmiyor"dur,
/// değişmeyen değer yeniden yazılmaz ve tek hatalı alan hiçbir şeyi yarım kaydetmez.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FirmData_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Cofinancing = FirmParameterCatalog.IdOf(26);
    private static readonly Guid StrategicGoals = FirmParameterCatalog.IdOf(19);
    private static readonly Guid PublicDebt = FirmParameterCatalog.IdOf(34);
    private static readonly Guid AnnualRevenue = FirmParameterCatalog.IdOf(6); // sistem parametresi

    private readonly IFirmDataAppService _service;
    private readonly FirmParameterManager _manager;
    private readonly IRepository<FirmParameterValue, Guid> _valueRepository;
    private readonly IRepository<FirmProfile, Guid> _profileRepository;
    private readonly ICurrentTenant _currentTenant;

    public FirmData_Tests()
    {
        _service = GetRequiredService<IFirmDataAppService>();
        _manager = GetRequiredService<FirmParameterManager>();
        _valueRepository = GetRequiredService<IRepository<FirmParameterValue, Guid>>();
        _profileRepository = GetRequiredService<IRepository<FirmProfile, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private static SaveFirmDataDto Save(params (Guid Id, string? Raw)[] items) => new()
    {
        Items = items.Select(i => new SaveFirmDataItemDto { DefinitionId = i.Id, RawValue = i.Raw }).ToList()
    };

    private static FirmDataItemDto Item(FirmDataDto data, Guid id)
        => data.Groups.SelectMany(g => g.Items).Single(i => i.DefinitionId == id);

    private Task<FirmParameterValue?> RowAsync(Guid id)
        => WithUnitOfWorkAsync(() => _valueRepository.FirstOrDefaultAsync(v => v.DefinitionId == id));

    [Fact]
    public async Task Form_yalniz_elle_girilen_parametreleri_gruplu_listeler()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var data = await _service.GetMineAsync();
            var items = data.Groups.SelectMany(g => g.Items).ToList();

            items.ShouldContain(i => i.Code == "cofinancing_capacity");
            items.ShouldNotContain(i => i.DefinitionId == AnnualRevenue, "ciro hibe profilinden düzenlenir, burada ikinci kez sorulmaz");
            data.TotalCount.ShouldBe(items.Count);
            data.FilledCount.ShouldBe(0);
            data.Groups.Select(g => g.Group).ShouldBeUnique();
            Item(data, Cofinancing).Description.ShouldNotBeNullOrWhiteSpace();
        }
    }

    [Fact]
    public async Task Sifir_girilmis_sayilir_bos_alan_bilinmiyor_kalir()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var data = await _service.SaveMineAsync(Save((Cofinancing, "0"), (StrategicGoals, "   "), (PublicDebt, "false")));

            Item(data, Cofinancing).HasValue.ShouldBeTrue();
            Item(data, Cofinancing).RawValue.ShouldBe("0");
            Item(data, PublicDebt).RawValue.ShouldBe("false", "'hayır' bir cevaptır");
            Item(data, StrategicGoals).HasValue.ShouldBeFalse();
            data.FilledCount.ShouldBe(2);
            (await RowAsync(StrategicGoals)).ShouldBeNull();
        }
    }

    [Fact]
    public async Task Alani_bosaltmak_degeri_bilinmiyora_dondurur()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            await _service.SaveMineAsync(Save((Cofinancing, "250000.50")));
            (await RowAsync(Cofinancing))!.ValueNumber.ShouldBe(250000.50m);

            var data = await _service.SaveMineAsync(Save((Cofinancing, "")));

            Item(data, Cofinancing).HasValue.ShouldBeFalse();
            (await RowAsync(Cofinancing)).ShouldBeNull("boşaltılan alan sıfıra değil 'bilinmiyor'a döner");
        }
    }

    [Fact]
    public async Task Degismeyen_deger_yeniden_yazilmaz_kaynagi_ve_tarihi_korunur()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            // Belgeden gelmiş bir değer: form onu olduğu gibi geri gönderince "elle girildi"ye dönmemeli.
            await WithUnitOfWorkAsync(() => _manager.SetValueAsync(
                Cofinancing,
                new FirmParameterInput(Number: 100_000m),
                new FirmParameterOrigin(FirmParameterSource.BelgeAi, Confidence: 90, Page: 4)));
            var before = (await RowAsync(Cofinancing))!;

            await _service.SaveMineAsync(Save((Cofinancing, "100000"), (StrategicGoals, "Bölgesel büyüme")));

            var after = (await RowAsync(Cofinancing))!;
            after.Source.ShouldBe(FirmParameterSource.BelgeAi);
            after.SourcePage.ShouldBe(4);
            after.ConfirmedAt.ShouldBe(before.ConfirmedAt);

            // Değer gerçekten değişince kaynak kullanıcıya geçer.
            await _service.SaveMineAsync(Save((Cofinancing, "120000")));
            (await RowAsync(Cofinancing))!.Source.ShouldBe(FirmParameterSource.Kullanici);
        }
    }

    [Theory]
    [InlineData("on bin")]
    [InlineData("1.000,50")]
    [InlineData("-5")]
    public async Task Okunamayan_ya_da_sinir_disi_deger_hicbir_alani_kaydetmez(string raw)
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var error = await Should.ThrowAsync<BusinessException>(
                () => _service.SaveMineAsync(Save((StrategicGoals, "Geçerli metin"), (Cofinancing, raw))));

            error.Code.ShouldStartWith("Platform:FirmParameter:");
            error.Data["Name"].ShouldNotBeNull();
            (await RowAsync(StrategicGoals)).ShouldBeNull("aynı gönderimdeki geçerli alan da yarım kaydedilmez");
        }
    }

    [Fact]
    public async Task Sistem_parametresi_gonderilse_de_yok_sayilir()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            await _service.SaveMineAsync(Save((AnnualRevenue, "5000000")));

            (await RowAsync(AnnualRevenue)).ShouldBeNull();
        }
    }

    [Fact]
    public async Task Kurum_turune_uymayan_parametre_formda_gorunmez()
    {
        var tenantId = Guid.NewGuid();
        using (_currentTenant.Change(tenantId))
        {
            var definitionRepository = GetRequiredService<IRepository<FirmParameterDefinition, Guid>>();
            var companyOnly = new FirmParameterDefinition(
                Guid.NewGuid(), "export_share", "İhracat payı", FirmParameterDataType.Percent, FirmParameterGroup.Finans)
            {
                Audience = FirmParameterAudience.YalnizSirket
            };
            await WithUnitOfWorkAsync(() => definitionRepository.InsertAsync(companyOnly, autoSave: true));

            (await _service.GetMineAsync()).Groups.SelectMany(g => g.Items)
                .ShouldContain(i => i.Code == "export_share", "türü bilinmeyen kurumdan parametre gizlenmez");

            await WithUnitOfWorkAsync(() => _profileRepository.InsertAsync(
                new FirmProfile(Guid.NewGuid(), tenantId) { Type = OrganizationType.Dernek }, autoSave: true));

            (await _service.GetMineAsync()).Groups.SelectMany(g => g.Items)
                .ShouldNotContain(i => i.Code == "export_share");
        }
    }

    [Fact]
    public async Task Host_baglaminda_kurumsal_veri_yoktur()
    {
        (await Should.ThrowAsync<BusinessException>(() => _service.GetMineAsync()))
            .Code.ShouldBe(PlatformDomainErrorCodes.FirmParameterTenantRequired);
    }
}
