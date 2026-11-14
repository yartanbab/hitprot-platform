using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Kurum parametre kataloğu ve değerlerinin kalıcılık sözleşmesi: katalog host'ta tektir ve
/// tohumlama host'un yaptığı değişikliği ezmez; değer kuruma özgüdür, kurum başına parametre
/// başına tek satırdır ve "bilinmiyor" satırın YOKLUĞUDUR.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FirmParameter_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid Cofinancing = FirmParameterCatalog.IdOf(26);
    private static readonly Guid AnnualRevenue = FirmParameterCatalog.IdOf(6); // sistem parametresi

    private readonly FirmParameterManager _manager;
    private readonly FirmParameterDefinitionDataSeedContributor _seed;
    private readonly IRepository<FirmParameterDefinition, Guid> _definitionRepository;
    private readonly IRepository<FirmParameterValue, Guid> _valueRepository;
    private readonly ICurrentTenant _currentTenant;

    public FirmParameter_Tests()
    {
        _manager = GetRequiredService<FirmParameterManager>();
        _seed = GetRequiredService<FirmParameterDefinitionDataSeedContributor>();
        _definitionRepository = GetRequiredService<IRepository<FirmParameterDefinition, Guid>>();
        _valueRepository = GetRequiredService<IRepository<FirmParameterValue, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private Task SetMoneyAsync(Guid definitionId, decimal amount)
        => WithUnitOfWorkAsync(() => _manager.SetValueAsync(
            definitionId, new FirmParameterInput(Number: amount), FirmParameterOrigin.UserEntry));

    private Task<FirmParameterValue?> FindValueAsync(Guid definitionId)
        => WithUnitOfWorkAsync(() => _valueRepository.FirstOrDefaultAsync(v => v.DefinitionId == definitionId));

    private Task<int> LiveDefinitionCountAsync()
        => WithUnitOfWorkAsync(async () => (int)await _definitionRepository.GetCountAsync());

    // ---------- Katalog ----------

    [Fact]
    public async Task Tohumlama_katalogu_kurar_ve_yeniden_kosunca_cogaltmaz()
    {
        var expected = FirmParameterCatalog.Build().Count;
        (await LiveDefinitionCountAsync()).ShouldBe(expected, "test barındırıcısı açılışta tohumlar");

        await WithUnitOfWorkAsync(() => _seed.SeedAsync(new DataSeedContext()));

        (await LiveDefinitionCountAsync()).ShouldBe(expected);
    }

    [Fact]
    public async Task Katalog_kurum_baglamindan_da_okunur()
    {
        // Tanım IMultiTenant DEĞİL: kurum, kiracı süzgecini kapatmadan aynı kataloğu görür.
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            (await LiveDefinitionCountAsync()).ShouldBe(FirmParameterCatalog.Build().Count);
        }
    }

    [Fact]
    public async Task Hostun_degistirdigi_tanim_tohumlamayla_ezilmez()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var definition = await _definitionRepository.GetAsync(Cofinancing);
            definition.SetText("Öz kaynak tutarı", "Host'un yazdığı açıklama");
            definition.SetMatchUsage(FirmParameterMatchUsage.Eleme);
            await _definitionRepository.UpdateAsync(definition, autoSave: true);
        });

        await WithUnitOfWorkAsync(() => _seed.SeedAsync(new DataSeedContext()));

        var after = await WithUnitOfWorkAsync(() => _definitionRepository.GetAsync(Cofinancing));
        after.Name.ShouldBe("Öz kaynak tutarı");
        after.MatchUsage.ShouldBe(FirmParameterMatchUsage.Eleme);
        after.Version.ShouldBe(2);
    }

    [Fact]
    public async Task Hostun_sildigi_tanim_tohumlamayla_geri_gelmez()
    {
        await WithUnitOfWorkAsync(() => _definitionRepository.DeleteAsync(Cofinancing, autoSave: true));

        // Silinen satır tabloda durur; aynı Id ile yeniden eklemeye kalkmak birincil anahtarda çakışırdı.
        await WithUnitOfWorkAsync(() => _seed.SeedAsync(new DataSeedContext()));

        (await WithUnitOfWorkAsync(() => _definitionRepository.FindAsync(Cofinancing))).ShouldBeNull();
    }

    [Fact]
    public async Task Tohumlama_kurum_baglaminda_hicbir_sey_yazmaz_hostta_eksigi_tamamlar()
    {
        // Yumuşak silme değil, satırın kendisi kaldırılır: "eksik tanım" durumu.
        await WithUnitOfWorkAsync(() => _definitionRepository.DeleteDirectAsync(d => d.Id == Cofinancing));
        var expected = FirmParameterCatalog.Build().Count;
        (await LiveDefinitionCountAsync()).ShouldBe(expected - 1);

        // ABP tohumlayıcıyı her yeni kurum açılışında da çağırır.
        await WithUnitOfWorkAsync(() => _seed.SeedAsync(new DataSeedContext(Guid.NewGuid())));
        (await LiveDefinitionCountAsync()).ShouldBe(expected - 1);

        await WithUnitOfWorkAsync(() => _seed.SeedAsync(new DataSeedContext()));
        (await LiveDefinitionCountAsync()).ShouldBe(expected);
    }

    [Fact]
    public async Task Kod_canli_tanimlar_arasinda_benzersizdir_silinenin_kodu_yeniden_kullanilir()
    {
        FirmParameterDefinition Duplicate() => new(
            Guid.NewGuid(), "cofinancing_capacity", "Aynı kodlu tanım", FirmParameterDataType.Money, FirmParameterGroup.Finans);

        await Should.ThrowAsync<DbUpdateException>(() => WithUnitOfWorkAsync(
            () => _definitionRepository.InsertAsync(Duplicate(), autoSave: true)));

        await WithUnitOfWorkAsync(() => _definitionRepository.DeleteAsync(Cofinancing, autoSave: true));

        await WithUnitOfWorkAsync(() => _definitionRepository.InsertAsync(Duplicate(), autoSave: true));
        (await WithUnitOfWorkAsync(() => _definitionRepository.CountAsync(d => d.Code == "cofinancing_capacity"))).ShouldBe(1);
    }

    // ---------- Değer ----------

    [Fact]
    public async Task Sifir_yazmak_ile_bilinmiyor_ayridir()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            (await FindValueAsync(Cofinancing)).ShouldBeNull("hiç girilmemiş bilgi satır olarak durmaz");

            await SetMoneyAsync(Cofinancing, 0m);
            var zero = await FindValueAsync(Cofinancing);
            zero.ShouldNotBeNull();
            zero.ValueNumber.ShouldBe(0m, "kurum 'eş finansman ayıramam' dedi; bu bir bilgidir");

            await WithUnitOfWorkAsync(() => _manager.ClearValueAsync(Cofinancing));
            (await FindValueAsync(Cofinancing)).ShouldBeNull("temizlenen değer yeniden 'bilinmiyor' olur");
        }
    }

    [Fact]
    public async Task Ayni_parametreye_ikinci_yazma_satiri_gunceller()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            await SetMoneyAsync(Cofinancing, 100_000m);
            await SetMoneyAsync(Cofinancing, 250_000m);

            var rows = await WithUnitOfWorkAsync(() => _valueRepository.GetListAsync(v => v.DefinitionId == Cofinancing));
            rows.Count.ShouldBe(1);
            rows[0].ValueNumber.ShouldBe(250_000m);
            rows[0].Source.ShouldBe(FirmParameterSource.Kullanici);
        }
    }

    [Fact]
    public async Task Deger_kuruma_ozgudur()
    {
        var tenantA = Guid.NewGuid();
        var tenantB = Guid.NewGuid();

        using (_currentTenant.Change(tenantA))
        {
            await SetMoneyAsync(Cofinancing, 250_000m);
        }

        using (_currentTenant.Change(tenantB))
        {
            (await FindValueAsync(Cofinancing)).ShouldBeNull("başka kurumun beyanı görünmez");
            await SetMoneyAsync(Cofinancing, 0m);
            await WithUnitOfWorkAsync(() => _manager.ClearValueAsync(Cofinancing));
        }

        using (_currentTenant.Change(tenantA))
        {
            var mine = await FindValueAsync(Cofinancing);
            mine.ShouldNotBeNull("B kurumunun temizlemesi A'nın değerine dokunmaz");
            mine.ValueNumber.ShouldBe(250_000m);
            mine.TenantId.ShouldBe(tenantA);
        }
    }

    [Fact]
    public async Task Host_baglaminda_deger_yazilamaz()
    {
        var error = await Should.ThrowAsync<BusinessException>(() => SetMoneyAsync(Cofinancing, 1m));

        error.Code.ShouldBe(PlatformDomainErrorCodes.FirmParameterTenantRequired);
    }

    [Fact]
    public async Task Sistem_parametresine_bu_tablodan_deger_yazilamaz()
    {
        using (_currentTenant.Change(Guid.NewGuid()))
        {
            var error = await Should.ThrowAsync<BusinessException>(() => SetMoneyAsync(AnnualRevenue, 1_000_000m));

            error.Code.ShouldBe(PlatformDomainErrorCodes.FirmParameterSystemReadOnly);
            (await FindValueAsync(AnnualRevenue)).ShouldBeNull();
        }
    }

    [Fact]
    public async Task Kurum_basina_parametre_basina_tek_satir_veritabaninda_da_zorlanir()
    {
        // Manager'ı atlayan bir yol aynı kuruma ikinci satır yazamaz.
        var tenantId = Guid.NewGuid();
        using (_currentTenant.Change(tenantId))
        {
            await SetMoneyAsync(Cofinancing, 10m);

            await Should.ThrowAsync<DbUpdateException>(() => WithUnitOfWorkAsync(async () =>
            {
                var definition = await _definitionRepository.GetAsync(Cofinancing);
                await _valueRepository.InsertAsync(
                    new FirmParameterValue(
                        Guid.NewGuid(), tenantId, definition,
                        new FirmParameterInput(Number: 20m), FirmParameterOrigin.UserEntry, DateTime.Now),
                    autoSave: true);
            }));
        }
    }
}
