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
}
