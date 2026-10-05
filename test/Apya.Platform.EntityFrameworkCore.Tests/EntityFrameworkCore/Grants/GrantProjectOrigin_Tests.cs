using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Grants;

/// <summary>
/// 🔴 DOC-02 · Projeden hibeye köprü. Dönüşüm özeti "evrak başvuruda kalır, projeden
/// erişilir" diye söz veriyor; bu servis sözü tutan tek yoldur.
///
/// <para>Yeni alan YOK: bağ başvurunun <c>ProjectId</c>'sinden TERS yönde okunur.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantProjectOrigin_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IGrantProjectOriginAppService _origin;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantApplication, Guid> _appRepository;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IClock _clock;

    public GrantProjectOrigin_Tests()
    {
        _origin = GetRequiredService<IGrantProjectOriginAppService>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _appRepository = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _docRepository = GetRequiredService<IRepository<GrantApplicationDocument, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _clock = GetRequiredService<IClock>();
    }

    private async Task<GrantCall> CreateHostCallAsync(string grantName, string period)
    {
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında tohumlanmalı");
        var grant = new Grant(Guid.NewGuid(), grantName, "Kurum", 500_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        var call = new GrantCall(Guid.NewGuid(), grant.Id, period, GrantCallStatus.Acik);
        call.SetSchedule(null, _clock.Now.Date.AddDays(30));
        await _callRepository.InsertAsync(call, autoSave: true);
        return call;
    }

    private async Task<Guid> CreateTenantAsync(string name)
    {
        var tenant = await _tenantManager.CreateAsync(name + " " + Guid.NewGuid().ToString("N")[..6]);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        return tenant.Id;
    }

    /// <summary>
    /// Hibeden doğan proje kaynağını, çağrı dönemini ve evrak SAYISINI taşır. Evrakın
    /// kendisi taşınmaz: belgeler başvuruda kalır, şerit yalnız oraya götürür.
    /// </summary>
    [Fact]
    public async Task Hibeden_dogan_proje_kaynagini_ve_evrak_sayisini_tasir()
    {
        var call = await CreateHostCallAsync("Yeşil Dönüşüm Desteği", "2026/2");
        var tenantId = await CreateTenantAsync("Köprü Firması");

        using (_currentTenant.Change(tenantId))
        {
            var project = new Project(Guid.NewGuid(), tenantId, null, "Isı Geri Kazanım", "PRJ-O1", "açıklama");
            await _projectRepository.InsertAsync(project, autoSave: true);

            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            application.LinkToProject(project.Id);
            await _appRepository.InsertAsync(application, autoSave: true);

            await _docRepository.InsertAsync(new GrantApplicationDocument(
                Guid.NewGuid(), tenantId, application.Id, null, "Faaliyet raporu",
                GrantDocumentObligation.Zorunlu, GrantPartyRole.Firma, false, 0), autoSave: true);
            await _docRepository.InsertAsync(new GrantApplicationDocument(
                Guid.NewGuid(), tenantId, application.Id, null, "Taahhütname",
                GrantDocumentObligation.Zorunlu, GrantPartyRole.Firma, true, 1), autoSave: true);

            var dto = await _origin.GetByProjectAsync(project.Id);

            dto.ShouldNotBeNull();
            dto!.ApplicationId.ShouldBe(application.Id);
            dto.GrantName.ShouldBe("Yeşil Dönüşüm Desteği");
            dto.CallPeriod.ShouldBe("2026/2");
            dto.DocumentCount.ShouldBe(2);
        }
    }

    /// <summary>Hibeden doğmamış projede şerit hiç basılmamalı.</summary>
    [Fact]
    public async Task Hibesiz_proje_null_doner()
    {
        var tenantId = await CreateTenantAsync("Hibesiz Firma");

        using (_currentTenant.Change(tenantId))
        {
            var project = new Project(Guid.NewGuid(), tenantId, null, "Sıradan Proje", "PRJ-O2", "açıklama");
            await _projectRepository.InsertAsync(project, autoSave: true);

            (await _origin.GetByProjectAsync(project.Id)).ShouldBeNull();
        }

        (await _origin.GetByProjectAsync(Guid.Empty)).ShouldBeNull("boş kimlik sorgu açmamalı");
    }

    /// <summary>
    /// Host proje konsolunu kiracı filtresi KAPALI açar (ProjectAppService.GetDetailAsync);
    /// köprü de aynı şeyi yapmazsa host gördüğü projenin hibesini göremezdi.
    /// 🔴 Buna karşılık BAŞKA kiracı aynı projeyi soramaz: kiracı bağlamında filtre AÇIK kalır.
    /// </summary>
    [Fact]
    public async Task Host_gorur_baska_kiraci_goremez()
    {
        var call = await CreateHostCallAsync("Sanayi Dijitalleşme", "2026/3");
        var ownerTenantId = await CreateTenantAsync("Sahip Firma");
        var otherTenantId = await CreateTenantAsync("Yabancı Firma");

        Guid projectId;
        using (_currentTenant.Change(ownerTenantId))
        {
            var project = new Project(Guid.NewGuid(), ownerTenantId, null, "Hat Otomasyonu", "PRJ-O3", "açıklama");
            await _projectRepository.InsertAsync(project, autoSave: true);
            projectId = project.Id;

            var application = new GrantApplication(Guid.NewGuid(), ownerTenantId, call.Id);
            application.LinkToProject(project.Id);
            await _appRepository.InsertAsync(application, autoSave: true);
        }

        // Host bağlamı (testler host'ta koşar).
        var hostView = await _origin.GetByProjectAsync(projectId);
        hostView.ShouldNotBeNull();
        hostView!.GrantName.ShouldBe("Sanayi Dijitalleşme");

        using (_currentTenant.Change(otherTenantId))
        {
            (await _origin.GetByProjectAsync(projectId)).ShouldBeNull("yabancı kiracı başvuruyu görmemeli");
        }
    }
}
