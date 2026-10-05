using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// Raporun "Kilometre taşları" bölümünün kaynağı. Proje tarafında kilometre taşı
/// varlığı YOK ve bilerek açılmadı: kilometre taşı başvuruda yaşar, rapor onu
/// proje→başvuru köprüsünden okur. Kopyalansaydı iki liste ayrışırdı.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantProjectMilestones_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantProjectOriginAppService _origin;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantApplication, Guid> _appRepository;
    private readonly IRepository<GrantMilestone, Guid> _milestoneRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;

    public GrantProjectMilestones_Tests()
    {
        _origin = GetRequiredService<IGrantProjectOriginAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _appRepository = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _milestoneRepository = GetRequiredService<IRepository<GrantMilestone, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<GrantCall> CreateHostCallAsync(string grantName)
    {
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında tohumlanmalı");
        var grant = new Grant(Guid.NewGuid(), grantName, "Kurum", 500_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2026/1", GrantCallStatus.Acik);
        await _callRepository.InsertAsync(call, autoSave: true);
        return call;
    }

    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await _tenantManager.CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    /// <summary>Tenant bağlamında proje + ona bağlı başvuru kurar; ikisinin kimliğini döner.</summary>
    private async Task<(Guid ProjectId, Guid ApplicationId)> CreateConvertedProjectAsync(
        Guid tenantId, Guid callId, string code)
    {
        var project = new Project(Guid.NewGuid(), tenantId, null, "Proje " + code, code, "açıklama");
        await _projectRepository.InsertAsync(project, autoSave: true);

        var application = new GrantApplication(Guid.NewGuid(), tenantId, callId);
        application.LinkToProject(project.Id);
        await _appRepository.InsertAsync(application, autoSave: true);

        return (project.Id, application.Id);
    }

    /// <summary>
    /// Tarihi olan önce ve tarih sırasıyla, tarihsizler sonda: "ne zaman" sorusuna cevap
    /// vermeyen satır takvimi bölmemeli.
    /// </summary>
    [Fact]
    public async Task Kilometre_taslari_tarih_sirasiyla_tarihsizler_sonda_gelir()
    {
        var call = await CreateHostCallAsync("Kilometre Taşı Desteği");
        var tenantId = await CreateTenantAsync("Takvim Firması");

        using (_currentTenant.Change(tenantId))
        {
            var (projectId, applicationId) = await CreateConvertedProjectAsync(tenantId, call.Id, "PRJ-M1");

            await _milestoneRepository.InsertAsync(
                new GrantMilestone(Guid.NewGuid(), tenantId, applicationId, "Kapanış", null), autoSave: true);
            await _milestoneRepository.InsertAsync(
                new GrantMilestone(Guid.NewGuid(), tenantId, applicationId, "Saha kurulumu", new DateTime(2026, 8, 1)), autoSave: true);
            var done = new GrantMilestone(Guid.NewGuid(), tenantId, applicationId, "Prototip", new DateTime(2026, 4, 1));
            done.Complete();
            await _milestoneRepository.InsertAsync(done, autoSave: true);

            var milestones = await _origin.GetMilestonesByProjectAsync(projectId);

            milestones.Select(m => m.Title).ShouldBe(new[] { "Prototip", "Saha kurulumu", "Kapanış" });
            milestones[0].IsCompleted.ShouldBeTrue();
            milestones[1].IsCompleted.ShouldBeFalse();
            milestones[2].DueDate.ShouldBeNull();
        }
    }

    /// <summary>Hibeden doğmamış proje hata vermez, boş liste döner: bölüm "yok" satırı basar.</summary>
    [Fact]
    public async Task Hibesiz_projede_bos_liste_doner()
    {
        var tenantId = await CreateTenantAsync("Hibesiz Firma");

        using (_currentTenant.Change(tenantId))
        {
            var project = new Project(Guid.NewGuid(), tenantId, null, "Sıradan", "PRJ-M2", "açıklama");
            await _projectRepository.InsertAsync(project, autoSave: true);

            (await _origin.GetMilestonesByProjectAsync(project.Id)).ShouldBeEmpty();
        }

        (await _origin.GetMilestonesByProjectAsync(Guid.Empty)).ShouldBeEmpty();
    }

    /// <summary>
    /// 🔴 Kilometre taşları filtre kapalı okunuyor (host kiracı projesini görebilsin diye);
    /// kapıyı tutan şey BAŞVURUNUN kiracı kuralıyla bulunması. Yabancı kiracı başvuruyu
    /// bulamadığı için kilometre taşlarına da ulaşamamalı.
    /// </summary>
    [Fact]
    public async Task Host_gorur_baska_kiraci_goremez()
    {
        var call = await CreateHostCallAsync("İzolasyon Desteği");
        var ownerTenantId = await CreateTenantAsync("Sahip Firma");
        var otherTenantId = await CreateTenantAsync("Yabancı Firma");

        Guid projectId;
        using (_currentTenant.Change(ownerTenantId))
        {
            Guid applicationId;
            (projectId, applicationId) = await CreateConvertedProjectAsync(ownerTenantId, call.Id, "PRJ-M3");
            await _milestoneRepository.InsertAsync(
                new GrantMilestone(Guid.NewGuid(), ownerTenantId, applicationId, "Gizli taş", new DateTime(2026, 6, 1)),
                autoSave: true);
        }

        (await _origin.GetMilestonesByProjectAsync(projectId)).Count.ShouldBe(1, "host görmeli");

        using (_currentTenant.Change(otherTenantId))
        {
            (await _origin.GetMilestonesByProjectAsync(projectId)).ShouldBeEmpty("yabancı kiracı görmemeli");
        }
    }
}
