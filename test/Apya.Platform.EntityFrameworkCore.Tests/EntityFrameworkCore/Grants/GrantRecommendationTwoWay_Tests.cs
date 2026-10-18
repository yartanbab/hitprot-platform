using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// H-07 · Danışman önerisi iki yönlü: danışmanın notu firmaya görünür, firma ayrıntıyı açınca
/// öneri "Görüldü" olur, danışman gönderim ekranında firmanın karşılığını (gördü, ilgilenmiyor,
/// ilgi bildirdi) görür. Eskiden not firmaya hiç ulaşmıyordu ve "Görüldü" durumu tanımlı olduğu
/// hâlde hiç yazılmıyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantRecommendationTwoWay_Tests : PlatformEntityFrameworkCoreTestBase
{
    private const string Note = "Ar-Ge personeliniz bu çağrıya çok uygun.";

    private readonly IGrantRecommendationAppService _recommendations;
    private readonly IGrantHostDispatchAppService _dispatch;
    private readonly IRepository<GrantRecommendation, Guid> _recRepository;
    private readonly IRepository<GrantInterest, Guid> _interestRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public GrantRecommendationTwoWay_Tests()
    {
        _recommendations = GetRequiredService<IGrantRecommendationAppService>();
        _dispatch = GetRequiredService<IGrantHostDispatchAppService>();
        _recRepository = GetRequiredService<IRepository<GrantRecommendation, Guid>>();
        _interestRepository = GetRequiredService<IRepository<GrantInterest, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    private async Task<GrantCall> CreateHostCallAsync(string name)
    {
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında tohumlanmalı");
        var grant = new Grant(Guid.NewGuid(), name, "Kurum", 1_000_000m, minMatchScore: 0);
        await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(grant, autoSave: true);
        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
        call.SetSchedule(null, _clock.Now.Date.AddDays(20));
        return await GetRequiredService<IRepository<GrantCall, Guid>>().InsertAsync(call, autoSave: true);
    }

    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    private Task SendAsync(Guid tenantId, Guid callId, string? note = Note)
        => _recRepository.InsertAsync(
            new GrantRecommendation(Guid.NewGuid(), tenantId, callId, GrantRecommendationSource.Host, note), autoSave: true);

    [Fact]
    public async Task Danisman_notu_firmaya_gorunur_ve_ayrinti_oneriyi_goruldu_yapar()
    {
        var call = await CreateHostCallAsync("İki Yönlü Öneri Programı");
        var tenantId = await CreateTenantAsync("Not Okuyan Firma");

        using (_currentTenant.Change(tenantId))
        {
            await SendAsync(tenantId, call.Id);

            var card = (await _recommendations.GetOpenCallsAsync()).Single(r => r.GrantCallId == call.Id);
            card.IsHostRecommended.ShouldBeTrue();
            card.HostRecommendationNote.ShouldBe(Note);

            var detail = await _recommendations.GetCallDetailAsync(call.Id);
            detail.IsHostRecommended.ShouldBeTrue();
            detail.HostRecommendationNote.ShouldBe(Note);

            await _recommendations.MarkRecommendationSeenAsync(call.Id);

            (await _recRepository.GetListAsync(r => r.GrantCallId == call.Id))
                .ShouldAllBe(r => r.Status == GrantRecommendationStatus.Seen);
        }
    }

    [Fact]
    public async Task Kapatilan_oneri_ayrintida_gorunmez_ve_goruldu_onu_geri_acmaz()
    {
        var call = await CreateHostCallAsync("Kapatılan Öneri Programı");
        var tenantId = await CreateTenantAsync("Kapatan Firma");

        using (_currentTenant.Change(tenantId))
        {
            await SendAsync(tenantId, call.Id);
            await _recommendations.DismissRecommendationAsync(call.Id);

            await _recommendations.MarkRecommendationSeenAsync(call.Id);

            (await _recommendations.GetCallDetailAsync(call.Id)).IsHostRecommended.ShouldBeFalse();
            (await _recRepository.GetListAsync(r => r.GrantCallId == call.Id))
                .ShouldAllBe(r => r.Status == GrantRecommendationStatus.Dismissed);
        }
    }

    [Fact]
    public async Task Gonderim_ekrani_onerinin_firmadaki_karsiligini_gosterir()
    {
        var call = await CreateHostCallAsync("Karşılık Programı");
        var seen = await CreateTenantAsync("Gören Firma");
        var dismissed = await CreateTenantAsync("İlgilenmeyen Firma");

        using (_currentTenant.Change(seen))
        {
            await SendAsync(seen, call.Id);
            await _recommendations.MarkRecommendationSeenAsync(call.Id);
            await _interestRepository.InsertAsync(
                new GrantInterest(Guid.NewGuid(), seen, call.Id, null, "İlgileniyoruz"), autoSave: true);
        }

        using (_currentTenant.Change(dismissed))
        {
            await SendAsync(dismissed, call.Id);
            await _recommendations.DismissRecommendationAsync(call.Id);
        }

        var console = await _dispatch.PreviewAsync(new PreviewHostRecommendationInput { GrantCallId = call.Id });

        var seenRow = console.Candidates.Single(c => c.TenantId == seen);
        seenRow.RecommendationStatus.ShouldBe(GrantRecommendationStatus.Seen);
        seenRow.HasInterest.ShouldBeTrue();

        var dismissedRow = console.Candidates.Single(c => c.TenantId == dismissed);
        dismissedRow.RecommendationStatus.ShouldBe(GrantRecommendationStatus.Dismissed);
        dismissedRow.HasInterest.ShouldBeFalse();
    }
}
