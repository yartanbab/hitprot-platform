using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 18d · Hibe Yolculuğum: firmanın ilgi talepleri, başvuruları, projeleri ve kapanan çağrıları
/// çağrı başına TEK satırda. Yeni kayıt tutulmaz; mevcut kayıtlardan hesaplanır.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantJourney_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantJourneyAppService _journey;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantApplication, Guid> _appRepository;
    private readonly IRepository<GrantInterest, Guid> _interestRepository;
    private readonly IRepository<GrantDisbursementTranche, Guid> _trancheRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public GrantJourney_Tests()
    {
        _journey = GetRequiredService<IGrantJourneyAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _appRepository = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _interestRepository = GetRequiredService<IRepository<GrantInterest, Guid>>();
        _trancheRepository = GetRequiredService<IRepository<GrantDisbursementTranche, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    private async Task<GrantCall> CreateHostCallAsync(string name, int daysToDeadline, GrantCallStatus status = GrantCallStatus.Acik)
    {
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında tohumlanmalı");
        var grant = new Grant(Guid.NewGuid(), name, "Kurum", 1_000_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", status);
        call.SetSchedule(null, _clock.Now.Date.AddDays(daysToDeadline));
        await _callRepository.InsertAsync(call, autoSave: true);
        return call;
    }

    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await _tenantManager.CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    [Fact]
    public async Task Yolculuk_cagri_basina_tek_satir_ve_dogru_durum_verir()
    {
        var pendingCall = await CreateHostCallAsync("Bekleyen İlgi", daysToDeadline: 30);
        var rejectedCall = await CreateHostCallAsync("Reddedilen İlgi", daysToDeadline: 30);
        var openCall = await CreateHostCallAsync("Hazırlanan Başvuru", daysToDeadline: 12);
        var closedCall = await CreateHostCallAsync("Kapanan Çağrı", daysToDeadline: -5, GrantCallStatus.Kapandi);
        var projectCall = await CreateHostCallAsync("Projeye Dönen", daysToDeadline: -60, GrantCallStatus.Kapandi);
        var tenantId = await CreateTenantAsync("Yolculuk Firması");

        using (_currentTenant.Change(tenantId))
        {
            await _interestRepository.InsertAsync(new GrantInterest(Guid.NewGuid(), tenantId, pendingCall.Id, null, "fikir"), autoSave: true);

            var rejected = new GrantInterest(Guid.NewGuid(), tenantId, rejectedCall.Id, null, "fikir");
            rejected.Reject("Kapsam dışı.", null, _clock.Now);
            await _interestRepository.InsertAsync(rejected, autoSave: true);

            // Başvurusu açılmış çağrıdaki ilgi talebi AYRI satır olmamalı.
            var started = new GrantInterest(Guid.NewGuid(), tenantId, openCall.Id, null, "fikir");
            await _interestRepository.InsertAsync(started, autoSave: true);
            await _appRepository.InsertAsync(new GrantApplication(Guid.NewGuid(), tenantId, openCall.Id), autoSave: true);

            await _appRepository.InsertAsync(new GrantApplication(Guid.NewGuid(), tenantId, closedCall.Id), autoSave: true);

            var project = new Project(Guid.NewGuid(), tenantId, null, "Sensör Kalibrasyon Altyapısı", "PRJ-J1", "açıklama");
            await _projectRepository.InsertAsync(project, autoSave: true);
            var won = new GrantApplication(Guid.NewGuid(), tenantId, projectCall.Id);
            won.AdvanceStage(GrantApplicationStage.Onay, 2_100_000m);
            won.LinkToProject(project.Id);
            await _appRepository.InsertAsync(won, autoSave: true);
            await _trancheRepository.InsertAsync(new GrantDisbursementTranche(Guid.NewGuid(), tenantId, won.Id, 2, 700_000m, _clock.Now.Date.AddDays(20)), autoSave: true);

            var dto = await _journey.GetAsync();

            dto.Items.Count.ShouldBe(5, "çağrı başına tek satır");
            dto.Items.Single(i => i.GrantCallId == pendingCall.Id).Kind.ShouldBe(GrantJourneyItemKind.InterestPending);
            var rejectedItem = dto.Items.Single(i => i.GrantCallId == rejectedCall.Id);
            rejectedItem.Kind.ShouldBe(GrantJourneyItemKind.InterestRejected);
            rejectedItem.HostFeedback.ShouldBe("Kapsam dışı.");
            var openItem = dto.Items.Single(i => i.GrantCallId == openCall.Id);
            openItem.Kind.ShouldBe(GrantJourneyItemKind.ApplicationOpen);
            openItem.InterestId.ShouldBeNull("başvuru varken talep satırı gösterilmez");
            dto.Items.Single(i => i.GrantCallId == closedCall.Id).Kind.ShouldBe(GrantJourneyItemKind.CallClosed);

            var projectItem = dto.Items.Single(i => i.GrantCallId == projectCall.Id);
            projectItem.Kind.ShouldBe(GrantJourneyItemKind.Project);
            projectItem.ProjectName.ShouldBe("Sensör Kalibrasyon Altyapısı");
            projectItem.ApprovedAmount.ShouldBe(2_100_000m);
            projectItem.NextTrancheNo.ShouldBe(2);

            dto.ActiveCount.ShouldBe(2);
            dto.ProjectCount.ShouldBe(1);
            dto.MissedCount.ShouldBe(1);
            dto.WonAmount.ShouldBe(2_100_000m);

            // Süren işler önce, son tarihi yakın olan başta.
            dto.Items[0].GrantCallId.ShouldBe(openCall.Id);
            dto.Items[1].GrantCallId.ShouldBe(pendingCall.Id);
        }
    }

    [Fact]
    public async Task Baska_firmanin_iliskisi_yolculuga_girmez()
    {
        var call = await CreateHostCallAsync("Yalıtım", daysToDeadline: 10);
        var tenantA = await CreateTenantAsync("A");
        var tenantB = await CreateTenantAsync("B");

        using (_currentTenant.Change(tenantA))
        {
            await _interestRepository.InsertAsync(new GrantInterest(Guid.NewGuid(), tenantA, call.Id, null, "fikir"), autoSave: true);
        }

        using (_currentTenant.Change(tenantB))
        {
            var dto = await _journey.GetAsync();
            dto.Items.ShouldBeEmpty();
            dto.ActiveCount.ShouldBe(0);
        }
    }

    [Fact]
    public async Task Host_yolculuk_acamaz()
    {
        await Should.ThrowAsync<AbpAuthorizationException>(() => _journey.GetAsync());
    }
}
