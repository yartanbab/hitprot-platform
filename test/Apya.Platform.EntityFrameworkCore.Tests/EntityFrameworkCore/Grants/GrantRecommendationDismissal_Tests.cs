using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// "İlgilenmiyorum + gerekçe": otomatik öneri de kapatılabilir, her tepki DEĞİŞMEZ bir olay
/// olarak o anki skor ve uygunluk kovasıyla yazılır; çağrının hâli son olaydan okunur.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantRecommendationDismissal_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantRecommendationAppService _recommendations;
    private readonly IRepository<GrantRecommendationEvent, Guid> _eventRepository;
    private readonly IRepository<GrantRecommendation, Guid> _recRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public GrantRecommendationDismissal_Tests()
    {
        _recommendations = GetRequiredService<IGrantRecommendationAppService>();
        _eventRepository = GetRequiredService<IRepository<GrantRecommendationEvent, Guid>>();
        _recRepository = GetRequiredService<IRepository<GrantRecommendation, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    private async Task<GrantCall> CreateHostCallAsync(string name, GrantCallStatus status = GrantCallStatus.Acik)
    {
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında tohumlanmalı");
        // Eşik 0: etiketsiz program da "Size Önerilen"e düşer (otomatik öneri).
        var grant = new Grant(Guid.NewGuid(), name, "Kurum", 1_000_000m, minMatchScore: 0);
        await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(grant, autoSave: true);
        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", status);
        call.SetSchedule(null, _clock.Now.Date.AddDays(20));
        return await GetRequiredService<IRepository<GrantCall, Guid>>().InsertAsync(call, autoSave: true);
    }

    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    private Task DismissAsync(Guid callId, GrantDismissReason reason = GrantDismissReason.OutOfScope, string? note = null)
        => _recommendations.DismissRecommendationAsync(
            new DismissGrantRecommendationInput { GrantCallId = callId, Reason = reason, Note = note });

    [Fact]
    public async Task Otomatik_oneri_gerekceyle_kapatilir_ve_olay_baglamiyla_yazilir()
    {
        var call = await CreateHostCallAsync("Otomatik Öneri Programı");
        var tenantId = await CreateTenantAsync("Kapatan Firma");

        using (_currentTenant.Change(tenantId))
        {
            (await _recommendations.GetMyRecommendationsAsync()).ShouldContain(r => r.GrantCallId == call.Id);

            await DismissAsync(call.Id, GrantDismissReason.BudgetInsufficient, "  eş finansman %50  ");

            (await _recommendations.GetMyRecommendationsAsync()).ShouldNotContain(r => r.GrantCallId == call.Id);
            var card = (await _recommendations.GetOpenCallsAsync()).Single(r => r.GrantCallId == call.Id);
            card.IsDismissed.ShouldBeTrue();
            card.DismissReason.ShouldBe(GrantDismissReason.BudgetInsufficient);
            card.DismissedAt.ShouldNotBeNull();

            var e = (await _eventRepository.GetListAsync(x => x.GrantCallId == call.Id)).ShouldHaveSingleItem();
            e.TenantId.ShouldBe(tenantId);
            e.Kind.ShouldBe(GrantRecommendationEventKind.Dismissed);
            e.Reason.ShouldBe(GrantDismissReason.BudgetInsufficient);
            e.Note.ShouldBe("eş finansman %50");
            e.GrantId.ShouldBe(call.GrantId);
            e.MatchScore.ShouldBe(card.Score);
            e.Bucket.ShouldBe(card.Bucket);
            e.WasHostRecommended.ShouldBeFalse();
        }
    }

    [Fact]
    public async Task Geri_al_cagriyi_akisa_dondurur_ve_gecmisi_ezmez()
    {
        var call = await CreateHostCallAsync("Geri Alınan Program");
        var tenantId = await CreateTenantAsync("Geri Alan Firma");

        using (_currentTenant.Change(tenantId))
        {
            await DismissAsync(call.Id, GrantDismissReason.NotEnoughTime);
            await _recommendations.RestoreRecommendationAsync(call.Id);
            await _recommendations.RestoreRecommendationAsync(call.Id); // çift tık: yeni olay yok

            (await _recommendations.GetMyRecommendationsAsync()).ShouldContain(r => r.GrantCallId == call.Id);
            (await _eventRepository.GetListAsync(x => x.GrantCallId == call.Id))
                .OrderBy(x => x.CreationTime)
                .Select(x => x.Kind)
                .ShouldBe(new[] { GrantRecommendationEventKind.Dismissed, GrantRecommendationEventKind.Restored });
        }
    }

    [Fact]
    public async Task Danisman_onerisi_kapatilip_geri_alininca_goruldu_olur()
    {
        var call = await CreateHostCallAsync("Danışman Önerisi Programı");
        var tenantId = await CreateTenantAsync("Danışmanlı Firma");

        using (_currentTenant.Change(tenantId))
        {
            await _recRepository.InsertAsync(
                new GrantRecommendation(Guid.NewGuid(), tenantId, call.Id, GrantRecommendationSource.Host, null),
                autoSave: true);

            await DismissAsync(call.Id, GrantDismissReason.NoCapacity);
            (await _recRepository.GetListAsync(r => r.GrantCallId == call.Id))
                .ShouldAllBe(r => r.Status == GrantRecommendationStatus.Dismissed);
            (await _eventRepository.GetListAsync(x => x.GrantCallId == call.Id))
                .ShouldHaveSingleItem().WasHostRecommended.ShouldBeTrue();

            await _recommendations.RestoreRecommendationAsync(call.Id);
            (await _recRepository.GetListAsync(r => r.GrantCallId == call.Id))
                .ShouldAllBe(r => r.Status == GrantRecommendationStatus.Seen);
        }
    }

    [Fact]
    public async Task Basvurulmus_cagri_kapatilmaz()
    {
        var call = await CreateHostCallAsync("Başvurulmuş Program");
        var tenantId = await CreateTenantAsync("Başvuran Firma");

        using (_currentTenant.Change(tenantId))
        {
            await GetRequiredService<IRepository<GrantApplication, Guid>>().InsertAsync(
                new GrantApplication(Guid.NewGuid(), tenantId, call.Id, _clock.Now), autoSave: true);

            await DismissAsync(call.Id);

            (await _eventRepository.GetListAsync(x => x.GrantCallId == call.Id)).ShouldBeEmpty();
        }
    }

    [Fact]
    public async Task Yayinda_olmayan_cagri_kapatilamaz()
    {
        var call = await CreateHostCallAsync("Taslak Program", GrantCallStatus.Taslak);
        var tenantId = await CreateTenantAsync("Taslak Gören Firma");

        using (_currentTenant.Change(tenantId))
        {
            await Should.ThrowAsync<EntityNotFoundException>(() => DismissAsync(call.Id));
            (await _eventRepository.GetListAsync(x => x.GrantCallId == call.Id)).ShouldBeEmpty();
        }
    }
}
