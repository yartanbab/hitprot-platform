using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 18c · Çağrı dönüşüm hunisi. Görüntülenme gün + kanal başına sayılır; diğer aşamalar var olan kayıtlardan
/// (talep, ilgi, başvuru) pencereye göre sayılır. Kiracı verisini de saydığı için ekran yalnız host'undur.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantFunnel_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantFunnelAppService _funnel;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IGrantCallDailyStatRepository _statRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantFunnel_Tests()
    {
        _funnel = GetRequiredService<IGrantFunnelAppService>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _statRepository = GetRequiredService<IGrantCallDailyStatRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<GrantCall> CreateHostCallAsync(string name)
    {
        var grant = await GetRequiredService<IRepository<Grant, Guid>>()
            .InsertAsync(new Grant(Guid.NewGuid(), name, "KOSGEB", 1_000_000m, minMatchScore: 0), autoSave: true);
        return await _callRepository.InsertAsync(new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik), autoSave: true);
    }

    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    [Fact]
    public async Task Goruntulenme_gun_ve_kanal_basina_sayilir_yabanci_kimlik_sayilmaz()
    {
        var call = await CreateHostCallAsync("Görüntülenen Program");
        var tenantId = await CreateTenantAsync("Bakan Firma");

        await _funnel.RecordPublicViewAsync(call.Id);
        await _funnel.RecordPublicViewAsync(call.Id);
        await _funnel.RecordTenantViewAsync(call.Id); // host'un bakışı sayılmaz
        using (_currentTenant.Change(tenantId))
        {
            await _funnel.RecordTenantViewAsync(call.Id);
        }

        var unknown = Guid.NewGuid();
        await _funnel.RecordPublicViewAsync(unknown);

        var stats = await _statRepository.GetListAsync(s => s.GrantCallId == call.Id);
        stats.Count.ShouldBe(2);
        stats.Single(s => s.Kind == GrantCallStatKind.PublicView).Count.ShouldBe(2);
        stats.Single(s => s.Kind == GrantCallStatKind.TenantView).Count.ShouldBe(1);
        (await _statRepository.GetListAsync(s => s.GrantCallId == unknown)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Huni_asamalari_pencere_icindeki_kayitlardan_sayilir()
    {
        var call = await CreateHostCallAsync("Huni Programı");

        await _funnel.RecordPublicViewAsync(call.Id);
        await _funnel.RecordPublicViewAsync(call.Id);
        await _funnel.RecordPublicViewAsync(call.Id);
        await _statRepository.InsertAsync(
            new GrantCallDailyStat(Guid.NewGuid(), call.Id, DateTime.Now.Date.AddDays(-120), GrantCallStatKind.PublicView, 50), autoSave: true);

        // pargetto: iki talep, biri randevu istedi; pencere dışındaki talep sayılmaz.
        var leads = GetRequiredService<IRepository<GrantLead, Guid>>();
        await leads.InsertAsync(new GrantLead(Guid.NewGuid(), call.Id, "Deniz Lojistik", "Ayşe Kaya", "ayse@deniz.test"), autoSave: true);
        var withMeeting = new GrantLead(Guid.NewGuid(), call.Id, "Vektör Yazılım", "Mert Can", "mert@vektor.test");
        withMeeting.RequestMeeting(DateTime.Now.AddDays(2), null);
        await leads.InsertAsync(withMeeting, autoSave: true);
        var oldLead = new GrantLead(Guid.NewGuid(), call.Id, "Eski Firma", "Eski Kişi", "eski@firma.test");
        await leads.InsertAsync(oldLead, autoSave: true);
        ObjectHelper.TrySetProperty(oldLead, x => x.CreationTime, () => DateTime.Now.AddDays(-120));
        await leads.UpdateAsync(oldLead, autoSave: true);

        // Platform: iki kiracıdan ilgi (biri danışman incelemesinde) ve başvuru (biri onaylı). Kiracı başına çağrıda tek başvuru.
        var firmA = await CreateTenantAsync("İlgili Firma");
        var firmB = await CreateTenantAsync("İnceleme Firması");
        var interests = GetRequiredService<IRepository<GrantInterest, Guid>>();
        var applications = GetRequiredService<IRepository<GrantApplication, Guid>>();
        using (_currentTenant.Change(firmA))
        {
            await interests.InsertAsync(new GrantInterest(Guid.NewGuid(), firmA, call.Id, null, "fikir"), autoSave: true);
            await _funnel.RecordTenantViewAsync(call.Id);
            await applications.InsertAsync(new GrantApplication(Guid.NewGuid(), firmA, call.Id), autoSave: true);
        }

        using (_currentTenant.Change(firmB))
        {
            var reviewed = new GrantInterest(Guid.NewGuid(), firmB, call.Id, null, "fikir");
            reviewed.StartReview(Guid.NewGuid(), DateTime.Now);
            await interests.InsertAsync(reviewed, autoSave: true);
            var approved = new GrantApplication(Guid.NewGuid(), firmB, call.Id);
            approved.AdvanceStage(GrantApplicationStage.Onay, 750_000m);
            await applications.InsertAsync(approved, autoSave: true);
        }

        var funnel = await _funnel.GetAsync(call.Id, 60);

        funnel.CallLabel.ShouldBe("KOSGEB · Huni Programı (2026/1)");
        funnel.Days.ShouldBe(60);
        funnel.PublicViews.ShouldBe(3);
        funnel.TenantViews.ShouldBe(1);
        funnel.Tests.ShouldBe(2);
        funnel.Interests.ShouldBe(2);
        funnel.Meetings.ShouldBe(2);
        funnel.Applications.ShouldBe(2);
        funnel.Approved.ShouldBe(1);

        (await _funnel.GetAsync(call.Id, 45)).Days.ShouldBe(60);
        (await _funnel.GetCallsAsync()).ShouldContain(c => c.Id == call.Id && c.Label == funnel.CallLabel);
    }

    [Fact]
    public async Task Huni_kiraci_baglaminda_acilmaz()
    {
        var call = await CreateHostCallAsync("Gizli Huni");
        var tenantId = await CreateTenantAsync("Meraklı Firma");

        using (_currentTenant.Change(tenantId))
        {
            await Should.ThrowAsync<AbpAuthorizationException>(() => _funnel.GetAsync(call.Id));
            await Should.ThrowAsync<AbpAuthorizationException>(() => _funnel.GetCallsAsync());
        }
    }
}
