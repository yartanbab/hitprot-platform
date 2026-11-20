using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// KİLİT SÖZLEŞME: kiracı, host'un yayınladığı TÜM açık çağrıları görür. Uyum eşiği
/// listeden ELEMEZ, yalnız "Size Önerilen" bloğunu ayırır (<c>IsRecommended</c>).
/// <para>
/// Regresyon kaynağı: <c>GetMyRecommendationsAsync</c> eşiğin altında kalan çağrıyı hiç
/// döndürmüyordu; kiracı katalogda böyle bir çağrı olduğunu ekranda göremiyordu.
/// </para>
/// <para>
/// Testler host bağlamında katalog yazar (TenantId=null), okumayı kiracı bağlamına
/// geçerek yapar — kiracı sayfasının gerçek yolu budur.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class TenantOpenCallCatalog_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid TenantId = Guid.Parse("a1b2c3d4-1111-2222-3333-444444444444");

    private readonly IGrantRecommendationAppService _recommendationAppService;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly ICurrentTenant _currentTenant;

    public TenantOpenCallCatalog_Tests()
    {
        _recommendationAppService = GetRequiredService<IGrantRecommendationAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    /// <summary>
    /// Kriter etiketi olmayan program 0 puan alır; eşik 0 ise önerilir, 90 ise önerilmez.
    /// Kiracının profili boş olduğu için puan her iki durumda da 0'dır.
    /// </summary>
    private async Task<GrantCall> CreateOpenCallAsync(string name, double minMatchScore, GrantCallStatus status = GrantCallStatus.Acik)
    {
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında tohumlanmalı");

        var grant = new Grant(Guid.NewGuid(), name, "TÜBİTAK", maxAmount: 100_000m, minMatchScore: minMatchScore);
        await _grantRepository.InsertAsync(grant, autoSave: true);

        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", status);
        await _callRepository.InsertAsync(call, autoSave: true);
        return call;
    }

    [Fact]
    public async Task Esigin_altindaki_acik_cagri_da_kiraciya_listelenir()
    {
        var uyumlu = await CreateOpenCallAsync("Eşiği geçen program", minMatchScore: 0);
        var esikAlti = await CreateOpenCallAsync("Eşiği geçmeyen program", minMatchScore: 90);

        using (_currentTenant.Change(TenantId))
        {
            var tumu = await _recommendationAppService.GetOpenCallsAsync();

            tumu.Single(x => x.GrantCallId == uyumlu.Id).IsRecommended.ShouldBeTrue();
            tumu.Single(x => x.GrantCallId == esikAlti.Id).IsRecommended.ShouldBeFalse();
        }
    }

    [Fact]
    public async Task Oneri_blogu_yalniz_esigi_gecen_cagrilari_icerir()
    {
        var uyumlu = await CreateOpenCallAsync("Öneri eşiği 0", minMatchScore: 0);
        var esikAlti = await CreateOpenCallAsync("Öneri eşiği 90", minMatchScore: 90);

        using (_currentTenant.Change(TenantId))
        {
            var oneriler = await _recommendationAppService.GetMyRecommendationsAsync();

            oneriler.ShouldContain(x => x.GrantCallId == uyumlu.Id);
            oneriler.ShouldNotContain(x => x.GrantCallId == esikAlti.Id);
            oneriler.ShouldAllBe(x => x.IsRecommended);
        }
    }

    [Fact]
    public async Task Kapanmis_cagri_kiraciya_listelenmez()
    {
        // "Yayında" olmanın ölçüsü Status=Açık; kapanan çağrı katalog listesine girmez.
        var kapali = await CreateOpenCallAsync("Kapanmış program", minMatchScore: 0, status: GrantCallStatus.Kapandi);

        using (_currentTenant.Change(TenantId))
        {
            var tumu = await _recommendationAppService.GetOpenCallsAsync();

            tumu.ShouldNotContain(x => x.GrantCallId == kapali.Id);
        }
    }

    /// <summary>
    /// Son başvuru tarihi geçen çağrı, otomatik kapanış çalışana kadar "Açık" durumda kalır.
    /// Katalog yalnız duruma baktığı için o aralıkta çağrıyı listeliyor, ayrıntısını açıyordu;
    /// ilgi ve başvuru kapıları ise reddediyor — firma tıklayınca hata alıyordu.
    /// </summary>
    [Fact]
    public async Task Son_tarihi_gecmis_cagri_durumu_acik_olsa_da_listelenmez_ve_ayrintisi_acilmaz()
    {
        var gecmis = await CreateOpenCallAsync("Süresi dolan program", minMatchScore: 0);
        gecmis.SetSchedule(null, DateTime.Now.Date.AddDays(-1));
        await _callRepository.UpdateAsync(gecmis, autoSave: true);

        var sonGun = await CreateOpenCallAsync("Son gün programı", minMatchScore: 0);
        sonGun.SetSchedule(null, DateTime.Now.Date);
        await _callRepository.UpdateAsync(sonGun, autoSave: true);

        using (_currentTenant.Change(TenantId))
        {
            var tumu = await _recommendationAppService.GetOpenCallsAsync();

            tumu.ShouldNotContain(x => x.GrantCallId == gecmis.Id);
            tumu.ShouldContain(x => x.GrantCallId == sonGun.Id, "son gün dahildir");

            await Should.ThrowAsync<Volo.Abp.Domain.Entities.EntityNotFoundException>(
                () => _recommendationAppService.GetCallDetailAsync(gecmis.Id));
            (await _recommendationAppService.GetCallDetailAsync(sonGun.Id)).ShouldNotBeNull();
        }
    }

    [Fact]
    public async Task Onerilenler_listenin_basinda_doner()
    {
        var esikAlti = await CreateOpenCallAsync("Sıralama — eşik altı", minMatchScore: 90);
        var uyumlu = await CreateOpenCallAsync("Sıralama — önerilen", minMatchScore: 0);

        using (_currentTenant.Change(TenantId))
        {
            var tumu = await _recommendationAppService.GetOpenCallsAsync();

            var uyumluSira = tumu.FindIndex(x => x.GrantCallId == uyumlu.Id);
            var esikAltiSira = tumu.FindIndex(x => x.GrantCallId == esikAlti.Id);
            uyumluSira.ShouldBeLessThan(esikAltiSira);
        }
    }

    /// <summary>Fırsatlar ekranının gelişmiş filtresi tarayıcıda süzer; süzdüğü alanlar akışta gelmeli.</summary>
    [Fact]
    public async Task Akis_filtre_alanlarini_programdan_tasir()
    {
        var call = await CreateOpenCallAsync("Filtre alanları programı", minMatchScore: 0);
        var grant = await _grantRepository.GetAsync(call.GrantId);
        grant.MinAmount = 20_000m;
        grant.RepaymentType = GrantRepaymentType.GeriOdemeli;
        grant.RequiresConsortium = true;
        grant.PrefersFemaleEntrepreneur = true;
        await _grantRepository.UpdateAsync(grant, autoSave: true);

        var tags = GetRequiredService<IRepository<GrantCriteriaTag, Guid>>();
        await tags.InsertAsync(new GrantCriteriaTag(Guid.NewGuid(), grant.Id, GrantCriteriaKind.Sektor, "tarım"), autoSave: true);
        await tags.InsertAsync(new GrantCriteriaTag(Guid.NewGuid(), grant.Id, GrantCriteriaKind.Bolge, "Ankara"), autoSave: true);
        await tags.InsertAsync(new GrantCriteriaTag(Guid.NewGuid(), grant.Id, GrantCriteriaKind.AnahtarKelime, "kırsal"), autoSave: true);

        using (_currentTenant.Change(TenantId))
        {
            var row = (await _recommendationAppService.GetOpenCallsAsync()).Single(x => x.GrantCallId == call.Id);

            row.MinAmount.ShouldBe(20_000m);
            row.RepaymentType.ShouldBe(GrantRepaymentType.GeriOdemeli);
            row.RequiresConsortium.ShouldBeTrue();
            row.PrefersFemaleEntrepreneur.ShouldBeTrue();
            row.PrefersYoungEntrepreneur.ShouldBeFalse();
            row.Sectors.ShouldBe(new[] { "tarım" });
            row.Regions.ShouldBe(new[] { "Ankara" });
            row.Keywords.ShouldBe(new[] { "kırsal" });
        }
    }

    /// <summary>
    /// Kullanıcının isteği: dernek olan kuruma yalnız şirkete açık program (KOSGEB gibi) ÖNERİLMEZ;
    /// "Tümü"nde gerekçesiyle durur. Hibe profili kaydedilmemiş derneğin türü kurum profilinden
    /// çözülür — eskiden sessizce Şirket sayılıp bu programlar ona önerilebiliyordu.
    /// </summary>
    [Fact]
    public async Task Dernege_yalniz_sirkete_acik_program_onerilmez()
    {
        var dernekId = Guid.NewGuid();
        await GetRequiredService<IRepository<Apya.Platform.Tenants.TenantProfile, Guid>>().InsertAsync(
            new Apya.Platform.Tenants.TenantProfile(Guid.NewGuid(), dernekId, Apya.Platform.Tenants.CompanyType.Association,
                "1234567890", "dernek@example.test"), autoSave: true);

        var sirketProgrami = await CreateOpenCallAsync("Yalnız şirkete açık program", minMatchScore: 0);
        var stkProgrami = await CreateOpenCallAsync("STK programı", minMatchScore: 0);
        await SetApplicantTypesAsync(sirketProgrami.GrantId, OrganizationType.Sirket);
        await SetApplicantTypesAsync(stkProgrami.GrantId, OrganizationType.Dernek, OrganizationType.Vakif);

        using (_currentTenant.Change(dernekId))
        {
            var tumu = await _recommendationAppService.GetOpenCallsAsync();
            var sirket = tumu.Single(x => x.GrantCallId == sirketProgrami.Id);
            sirket.IsRecommended.ShouldBeFalse();
            sirket.Bucket.ShouldBe(GrantEligibilityBucket.UygunDegil);
            sirket.FailedRules.ShouldContain(GrantEligibilityRule.OrganizationType);
            tumu.Single(x => x.GrantCallId == stkProgrami.Id).IsRecommended.ShouldBeTrue();

            var oneriler = await _recommendationAppService.GetMyRecommendationsAsync();
            oneriler.ShouldNotContain(x => x.GrantCallId == sirketProgrami.Id);
            oneriler.ShouldContain(x => x.GrantCallId == stkProgrami.Id);
        }
    }

    private async Task SetApplicantTypesAsync(Guid grantId, params OrganizationType[] types)
    {
        var grant = await _grantRepository.GetAsync(grantId);
        grant.EligibleApplicantTypes = types.Aggregate(0, (mask, t) => mask | t.ToMaskBit());
        await _grantRepository.UpdateAsync(grant, autoSave: true);
    }
}
