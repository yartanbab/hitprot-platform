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
/// 11a/11b · "Bugün": kiracı kendi işlerini, host bütün firmaların işlerini görür; sıra risk × tutar.
///
/// <para>Regresyon kaynağı: host okuması kiracı filtresi AÇIK yapılsaydı kutu hep boş kalırdı;
/// kiracı okuması filtre KAPALI yapılsaydı başka firmanın evrakı listeye sızardı.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantToday_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantTodayAppService _today;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantApplication, Guid> _appRepository;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepository;
    private readonly IRepository<GrantDecision, Guid> _decisionRepository;
    private readonly IRepository<GrantInterest, Guid> _interestRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public GrantToday_Tests()
    {
        _today = GetRequiredService<IGrantTodayAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _appRepository = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _docRepository = GetRequiredService<IRepository<GrantApplicationDocument, Guid>>();
        _decisionRepository = GetRequiredService<IRepository<GrantDecision, Guid>>();
        _interestRepository = GetRequiredService<IRepository<GrantInterest, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    private async Task<(Grant Grant, GrantCall Call)> CreateHostCallAsync(string name, int daysToDeadline, decimal maxAmount = 1_000_000m)
    {
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında tohumlanmalı");
        var grant = new Grant(Guid.NewGuid(), name, "Kurum", maxAmount, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
        call.SetSchedule(null, _clock.Now.Date.AddDays(daysToDeadline));
        await _callRepository.InsertAsync(call, autoSave: true);
        return (grant, call);
    }

    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await _tenantManager.CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    /// <summary>Kiracı bağlamında başvuru + firmanın yükleyeceği zorunlu evrak.</summary>
    private async Task<GrantApplication> CreateApplicationAsync(Guid tenantId, GrantCall call, int firmDocs, int consultantDocs = 0)
    {
        using (_currentTenant.Change(tenantId))
        {
            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            await _appRepository.InsertAsync(application, autoSave: true);
            for (var i = 0; i < firmDocs; i++)
            {
                await _docRepository.InsertAsync(new GrantApplicationDocument(
                    Guid.NewGuid(), tenantId, application.Id, null, "Firma evrakı " + i,
                    GrantDocumentObligation.Zorunlu, GrantPartyRole.Firma, requiresESignature: false, order: i), autoSave: true);
            }
            for (var i = 0; i < consultantDocs; i++)
            {
                await _docRepository.InsertAsync(new GrantApplicationDocument(
                    Guid.NewGuid(), tenantId, application.Id, null, "Danışman evrakı " + i,
                    GrantDocumentObligation.Zorunlu, GrantPartyRole.Danisman, requiresESignature: false, order: 10 + i), autoSave: true);
            }
            return application;
        }
    }

    [Fact]
    public async Task Kiraci_kendi_evrak_isini_gorur_danismaninkini_bilgi_icin_sayar()
    {
        var (_, call) = await CreateHostCallAsync("Evrak Programı", daysToDeadline: 10);
        var tenantId = await CreateTenantAsync("Evrak Firması");
        var application = await CreateApplicationAsync(tenantId, call, firmDocs: 2, consultantDocs: 3);

        using (_currentTenant.Change(tenantId))
        {
            var dto = await _today.GetAsync();

            dto.IsHost.ShouldBeFalse();
            // Evrak + boş form alanları (proje başlığı, özet, süre): iki iş, ikisi de firmada.
            dto.Items.Count.ShouldBe(2);
            var upload = dto.Items.Single(i => i.Kind == GrantTodayItemKind.UploadDocuments);
            upload.Owner.ShouldBe(GrantTodayOwner.Me);
            upload.Value.ShouldBe(2, "yalnız firmanın yükleyeceği evrak sayılır");
            upload.ApplicationId.ShouldBe(application.Id);
            upload.DaysRemaining.ShouldBe(10);
            dto.Items.Single(i => i.Kind == GrantTodayItemKind.CompleteForm).Value.ShouldBe(3);

            // Danışmanın evrakı iş DEĞİL, bilgi: sayıya girer, listeye girmez.
            dto.ConsultantItemCount.ShouldBe(3);
            dto.ConsultantItems.ShouldHaveSingleItem().DocumentCount.ShouldBe(3);
            dto.Applications.ShouldHaveSingleItem().NextAction.ShouldBe(GrantNextAction.UploadDocuments);
            dto.ItemCount.ShouldBe(2);
            dto.NearestDeadlineDays.ShouldBe(10);
        }
    }

    [Fact]
    public async Task Kiraci_baska_firmanin_isini_gormez()
    {
        var (_, call) = await CreateHostCallAsync("Yalıtım Programı", daysToDeadline: 10);
        var tenantA = await CreateTenantAsync("A Firması");
        var tenantB = await CreateTenantAsync("B Firması");
        await CreateApplicationAsync(tenantA, call, firmDocs: 2);

        using (_currentTenant.Change(tenantB))
        {
            var dto = await _today.GetAsync();
            dto.Items.ShouldBeEmpty();
            dto.Applications.ShouldBeEmpty();
        }
    }

    [Fact]
    public async Task Host_butun_firmalarin_islerini_sahibine_gore_ayirir()
    {
        var (_, call) = await CreateHostCallAsync("Kutu Programı", daysToDeadline: 12);
        var tenantA = await CreateTenantAsync("Firmada Bekleyen");
        var tenantB = await CreateTenantAsync("Danışmanda Bekleyen");
        var appA = await CreateApplicationAsync(tenantA, call, firmDocs: 1);
        var appB = await CreateApplicationAsync(tenantB, call, firmDocs: 0, consultantDocs: 2);

        var dto = await _today.GetAsync();

        dto.IsHost.ShouldBeTrue();
        var all = dto.Items.Concat(dto.MoreItems).ToList();
        var onFirm = all.Single(i => i.ApplicationId == appA.Id);
        onFirm.Kind.ShouldBe(GrantTodayItemKind.WaitingOnFirm);
        onFirm.Owner.ShouldBe(GrantTodayOwner.Firm);
        onFirm.FirmName.ShouldStartWith("Firmada Bekleyen");

        var onMe = all.Single(i => i.ApplicationId == appB.Id);
        onMe.Kind.ShouldBe(GrantTodayItemKind.UploadDocuments);
        onMe.Owner.ShouldBe(GrantTodayOwner.Me);
        onMe.Value.ShouldBe(2);
    }

    [Fact]
    public async Task Host_bekleyen_ilgi_taleplerini_tek_satirda_sayar()
    {
        var (_, call) = await CreateHostCallAsync("İlgi Programı", daysToDeadline: 20);
        var tenantId = await CreateTenantAsync("İlgili Firma");
        using (_currentTenant.Change(tenantId))
        {
            await _interestRepository.InsertAsync(
                new GrantInterest(Guid.NewGuid(), tenantId, call.Id, null, "fikir"), autoSave: true);
        }

        var dto = await _today.GetAsync();

        var item = dto.Items.Concat(dto.MoreItems).Single(i => i.Kind == GrantTodayItemKind.InterestReview);
        item.Value.ShouldBeGreaterThanOrEqualTo(1);
        item.Owner.ShouldBe(GrantTodayOwner.Me);
    }

    [Fact]
    public async Task Sira_risk_ve_tutara_gore_kisa_sureli_buyuk_is_ustte()
    {
        var (_, urgentCall) = await CreateHostCallAsync("Acil Program", daysToDeadline: 3, maxAmount: 5_000_000m);
        var (_, laterCall) = await CreateHostCallAsync("Uzak Program", daysToDeadline: 60, maxAmount: 100_000m);
        var tenantId = await CreateTenantAsync("Sıralama Firması");
        await CreateApplicationAsync(tenantId, laterCall, firmDocs: 1);
        await CreateApplicationAsync(tenantId, urgentCall, firmDocs: 1);

        using (_currentTenant.Change(tenantId))
        {
            var dto = await _today.GetAsync();
            // Her başvuru iki iş üretir (evrak + boş form); kiracıda üçü öne çıkar, biri katlanır.
            dto.ItemCount.ShouldBe(4);
            dto.Items.Count.ShouldBe(3);
            dto.MoreItems.Count.ShouldBe(1);
            dto.Items[0].GrantName.ShouldBe("Acil Program");
            dto.Items[1].GrantName.ShouldBe("Acil Program", "aynı dosyanın iki işi de uzak programın önünde");
            dto.Items[0].Priority.ShouldBeGreaterThan(dto.Items[2].Priority);
            dto.MoreItems[0].GrantName.ShouldBe("Uzak Program");
            dto.NearDeadlineCount.ShouldBe(2);
        }
    }

    [Fact]
    public async Task Reddedilen_basvuru_itiraz_suresi_acikken_ise_donusur_kapaninca_donusmez()
    {
        var (_, call) = await CreateHostCallAsync("Red Programı", daysToDeadline: 30);
        var tenantId = await CreateTenantAsync("Reddedilen Firma");
        var application = await CreateApplicationAsync(tenantId, call, firmDocs: 1);

        using (_currentTenant.Change(tenantId))
        {
            await _decisionRepository.InsertAsync(new GrantDecision(
                Guid.NewGuid(), tenantId, application.Id, GrantDecisionOutcome.Reddedildi,
                _clock.Now.Date.AddDays(-2), "REF-1", _clock.Now.Date.AddDays(9)), autoSave: true);

            var dto = await _today.GetAsync();
            var appeal = dto.Items.Concat(dto.MoreItems).Single(i => i.Kind == GrantTodayItemKind.AppealDeadline);
            appeal.DaysRemaining.ShouldBe(9);
            // Reddedilen başvuruda evrak işi artık anlamsız: yalnız itiraz listelenir.
            dto.Items.Concat(dto.MoreItems).ShouldNotContain(i => i.Kind == GrantTodayItemKind.UploadDocuments);
            dto.Applications.Single().AppealDaysLeft.ShouldBe(9);
        }
    }
}
