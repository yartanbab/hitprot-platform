using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Settings;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Projects;

/// <summary>
/// PRJ-08 · Proje göstergeleri (ürün kararı, 2026-10-13): hedef tanımı, ölçüm girişi, ilerleme ve
/// durum hesabı, iş adımı / kanıt belgesi bağlarının aynı projeden olması.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ProjectIndicator_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly Guid OtherTenant = Guid.Parse("99990000-cccc-4000-8000-000000000108");

    private readonly IProjectIndicatorAppService _indicators;
    private readonly IProjectWorkStepAppService _workSteps;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectIndicator, Guid> _indicatorRepository;
    private readonly IRepository<ProjectIndicatorEntry, Guid> _entryRepository;
    private readonly IRepository<Document, Guid> _folderRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly ICurrentTenant _currentTenant;

    public ProjectIndicator_Tests()
    {
        _indicators = GetRequiredService<IProjectIndicatorAppService>();
        _workSteps = GetRequiredService<IProjectWorkStepAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _indicatorRepository = GetRequiredService<IRepository<ProjectIndicator, Guid>>();
        _entryRepository = GetRequiredService<IRepository<ProjectIndicatorEntry, Guid>>();
        _folderRepository = GetRequiredService<IRepository<Document, Guid>>();
        _fileRepository = GetRequiredService<IRepository<DocumentFile, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> ProjectAsync(Guid? tenantId = null)
    {
        using (_currentTenant.Change(tenantId))
        {
            var project = new Project(
                Guid.NewGuid(), tenantId, null, "Gösterge projesi", "GST-" + Guid.NewGuid().ToString("N")[..8], "");
            await _projectRepository.InsertAsync(project, autoSave: true);
            return project.Id;
        }
    }

    private async Task<Guid> StepAsync(Guid projectId)
        => (await _workSteps.CreateAsync(new CreateUpdateProjectWorkStepDto { ProjectId = projectId, Order = 1, Name = "Eğitimler" })).Id;

    private async Task<Guid> FileAsync(Guid? projectId)
    {
        var folder = new Document(Guid.NewGuid(), null, "Kanıtlar", "");
        await _folderRepository.InsertAsync(folder, autoSave: true);
        var file = new DocumentFile(Guid.NewGuid(), null, folder.Id, "Katılım listesi.pdf", projectId: projectId);
        await _fileRepository.InsertAsync(file, autoSave: true);
        return file.Id;
    }

    private static CreateUpdateProjectIndicatorDto Input(
        Guid projectId, decimal baseline = 0m, decimal target = 200m, DateTime? targetDate = null, Guid? stepId = null)
        => new()
        {
            ProjectId = projectId,
            Name = "Eğitilen kişi sayısı",
            Unit = "kişi",
            BaselineValue = baseline,
            TargetValue = target,
            TargetDate = targetDate,
            WorkStepId = stepId
        };

    private async Task<ProjectIndicatorDto> RowAsync(Guid projectId, Guid id)
        => (await _indicators.GetListAsync(projectId)).Single(i => i.Id == id);

    [Fact]
    public async Task Olcum_girildikce_gerceklesen_ve_yuzde_en_son_tarihli_olcumden_gelir()
    {
        var projectId = await ProjectAsync();
        var stepId = await StepAsync(projectId);
        var id = (await _indicators.CreateAsync(Input(projectId, stepId: stepId))).Id;

        var empty = await RowAsync(projectId, id);
        empty.CurrentValue.ShouldBe(0m);
        empty.ProgressPercent.ShouldBe(0);
        empty.EntryCount.ShouldBe(0);
        empty.WorkStepName.ShouldBe("Eğitimler");
        empty.Status.ShouldBe(ProjectIndicatorStatus.OnTrack);

        // Sonradan girilen ESKİ tarihli ölçüm güncel değeri değiştirmez.
        await _indicators.AddEntryAsync(id, new CreateProjectIndicatorEntryDto { EntryDate = new DateTime(2026, 9, 1), Value = 90m });
        await _indicators.AddEntryAsync(id, new CreateProjectIndicatorEntryDto { EntryDate = new DateTime(2026, 6, 1), Value = 40m });

        var row = await RowAsync(projectId, id);
        row.CurrentValue.ShouldBe(90m);
        row.LastEntryDate.ShouldBe(new DateTime(2026, 9, 1));
        row.EntryCount.ShouldBe(2);
        row.ProgressPercent.ShouldBe(45);

        (await _indicators.GetEntriesAsync(id)).Select(e => e.Value).ShouldBe(new[] { 90m, 40m });
    }

    [Fact]
    public async Task Hedefe_ulasan_tamam_tarihi_gecen_geride_sayilir()
    {
        var projectId = await ProjectAsync();
        var late = (await _indicators.CreateAsync(Input(projectId, targetDate: new DateTime(2020, 1, 1)))).Id;
        var done = (await _indicators.CreateAsync(Input(projectId, targetDate: new DateTime(2020, 1, 1)))).Id;

        await _indicators.AddEntryAsync(late, new CreateProjectIndicatorEntryDto { EntryDate = new DateTime(2019, 12, 1), Value = 199m });
        await _indicators.AddEntryAsync(done, new CreateProjectIndicatorEntryDto { EntryDate = new DateTime(2019, 12, 1), Value = 230m });

        var lateRow = await RowAsync(projectId, late);
        lateRow.ProgressPercent.ShouldBe(99); // aşağı yuvarlanır: %99,5 tamam sayılmaz
        lateRow.Status.ShouldBe(ProjectIndicatorStatus.Behind);

        var doneRow = await RowAsync(projectId, done);
        doneRow.ProgressPercent.ShouldBe(100); // hedefi aşan değer %100'de kalır
        doneRow.Status.ShouldBe(ProjectIndicatorStatus.Completed);
    }

    [Fact]
    public async Task Azaltma_hedefinde_ilerleme_dusen_degerle_artar()
    {
        var projectId = await ProjectAsync();
        var id = (await _indicators.CreateAsync(Input(projectId, baseline: 40m, target: 10m))).Id;

        await _indicators.AddEntryAsync(id, new CreateProjectIndicatorEntryDto { EntryDate = new DateTime(2026, 9, 1), Value = 25m });

        (await RowAsync(projectId, id)).ProgressPercent.ShouldBe(50);
    }

    [Fact]
    public async Task Hedef_baslangica_esit_olamaz_ad_bos_olamaz()
    {
        var projectId = await ProjectAsync();

        (await Should.ThrowAsync<BusinessException>(() => _indicators.CreateAsync(Input(projectId, baseline: 50m, target: 50m))))
            .Code.ShouldBe(PlatformDomainErrorCodes.ProjectIndicatorTargetInvalid);

        var id = (await _indicators.CreateAsync(Input(projectId))).Id;
        var blank = Input(projectId);
        blank.Name = "   ";
        await Should.ThrowAsync<Exception>(() => _indicators.UpdateAsync(id, blank));

        (await _indicatorRepository.GetAsync(id)).Name.ShouldBe("Eğitilen kişi sayısı");
    }

    [Fact]
    public async Task Baska_projenin_is_adimi_ya_da_belgesi_baglanamaz()
    {
        var projectId = await ProjectAsync();
        var otherProject = await ProjectAsync();

        (await Should.ThrowAsync<BusinessException>(() =>
                _indicators.CreateAsync(Input(projectId, stepId: StepAsync(otherProject).GetAwaiter().GetResult()))))
            .Code.ShouldBe(PlatformDomainErrorCodes.ProjectIndicatorWorkStepMismatch);

        var id = (await _indicators.CreateAsync(Input(projectId))).Id;
        var foreignFile = await FileAsync(otherProject);

        (await Should.ThrowAsync<BusinessException>(() => _indicators.AddEntryAsync(id,
                new CreateProjectIndicatorEntryDto { EntryDate = new DateTime(2026, 9, 1), Value = 10m, DocumentFileId = foreignFile })))
            .Code.ShouldBe(PlatformDomainErrorCodes.ProjectIndicatorDocumentMismatch);
        (await _entryRepository.GetListAsync(e => e.IndicatorId == id)).ShouldBeEmpty();

        // Aynı projenin belgesi bağlanır ve adı ölçüm listesinde görünür.
        var ownFile = await FileAsync(projectId);
        await _indicators.AddEntryAsync(id,
            new CreateProjectIndicatorEntryDto { EntryDate = new DateTime(2026, 9, 1), Value = 10m, DocumentFileId = ownFile });
        (await _indicators.GetEntriesAsync(id)).Single().DocumentName.ShouldBe("Katılım listesi.pdf");
    }

    [Fact]
    public async Task Baska_kiracinin_projesine_gosterge_acilamaz_gostergesi_okunamaz()
    {
        var foreignProject = await ProjectAsync(OtherTenant);

        await Should.ThrowAsync<EntityNotFoundException>(() => _indicators.CreateAsync(Input(foreignProject)));
        await Should.ThrowAsync<EntityNotFoundException>(() => _indicators.GetListAsync(foreignProject));

        Guid foreignIndicator;
        using (_currentTenant.Change(OtherTenant))
        {
            var indicator = new ProjectIndicator(Guid.NewGuid(), OtherTenant, foreignProject, "Yabancı", null, 0m, 10m);
            await _indicatorRepository.InsertAsync(indicator, autoSave: true);
            foreignIndicator = indicator.Id;
        }

        await Should.ThrowAsync<EntityNotFoundException>(() => _indicators.GetEntriesAsync(foreignIndicator));
        await Should.ThrowAsync<EntityNotFoundException>(() => _indicators.AddEntryAsync(foreignIndicator,
            new CreateProjectIndicatorEntryDto { EntryDate = new DateTime(2026, 9, 1), Value = 1m }));
        await Should.ThrowAsync<EntityNotFoundException>(() => _indicators.DeleteAsync(foreignIndicator));
    }

    [Fact]
    public async Task Gosterge_silinince_olcumleri_gider_is_adimi_silinince_bag_kopar()
    {
        var projectId = await ProjectAsync();
        var stepId = await StepAsync(projectId);
        var kept = (await _indicators.CreateAsync(Input(projectId, stepId: stepId))).Id;
        var removed = (await _indicators.CreateAsync(Input(projectId))).Id;
        await _indicators.AddEntryAsync(removed, new CreateProjectIndicatorEntryDto { EntryDate = new DateTime(2026, 9, 1), Value = 5m });
        var entryId = (await _indicators.AddEntryAsync(kept, new CreateProjectIndicatorEntryDto { EntryDate = new DateTime(2026, 9, 1), Value = 5m })).Id;

        await _indicators.DeleteAsync(removed);
        (await _entryRepository.GetListAsync(e => e.IndicatorId == removed)).ShouldBeEmpty();
        (await _indicators.GetListAsync(projectId)).Select(i => i.Id).ShouldBe(new[] { kept });

        await _workSteps.DeleteAsync(stepId);
        var row = await RowAsync(projectId, kept);
        row.WorkStepId.ShouldBeNull();
        row.EntryCount.ShouldBe(1);

        await _indicators.DeleteEntryAsync(entryId);
        (await RowAsync(projectId, kept)).EntryCount.ShouldBe(0);
    }

    /// <summary>
    /// Kurulu kiracılar: projeyi gören rol göstergeleri görür, düzenleyen rol yönetir; telafi bir kez koşar.
    /// </summary>
    [Fact]
    public async Task Telafi_izinleri_proje_iznine_gore_verir_ve_bir_kez_kosar()
    {
        const string provider = RolePermissionValueProvider.ProviderName;
        var settings = GetRequiredService<ISettingManager>();
        var grants = GetRequiredService<IPermissionGrantRepository>();
        var seeder = GetRequiredService<IPermissionDataSeeder>();
        var contributor = GetRequiredService<ProjectIndicatorPermissionDataSeedContributor>();
        var roles = GetRequiredService<Volo.Abp.Identity.IIdentityRoleRepository>();
        var tenantManager = GetRequiredService<Volo.Abp.TenantManagement.ITenantManager>();
        var tenants = GetRequiredService<Volo.Abp.TenantManagement.ITenantRepository>();

        var tenantId = await WithUnitOfWorkAsync(async () =>
        {
            var tenant = await tenantManager.CreateAsync("gosterge-izni-" + Guid.NewGuid().ToString("N")[..6]);
            await tenants.InsertAsync(tenant, autoSave: true);
            return tenant.Id;
        });

        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                foreach (var name in new[] { "goren", "duzenleyen", "disarida" })
                {
                    await roles.InsertAsync(new Volo.Abp.Identity.IdentityRole(Guid.NewGuid(), name, tenantId), autoSave: true);
                }

                await seeder.SeedAsync(provider, "goren", new[] { PlatformPermissions.Projects.Default }, tenantId);
                await seeder.SeedAsync(provider, "duzenleyen",
                    new[] { PlatformPermissions.Projects.Default, PlatformPermissions.Projects.Edit }, tenantId);
            }
        });

        Task<bool> HasAsync(string role, string permission) => WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                return await grants.FindAsync(permission, provider, role) != null;
            }
        });
        Task SeedAsHostAsync() => WithUnitOfWorkAsync(() => contributor.SeedAsync(new DataSeedContext()));

        // Test sunucusu açılışta tüm tohumlayıcıları koşturur; işaret sıfırlanıp telafi yeniden denenir.
        await WithUnitOfWorkAsync(() => settings.SetGlobalAsync(
            PlatformSettings.Backfills.ProjectIndicatorPermissionsGranted, null));
        await SeedAsHostAsync();

        (await HasAsync("goren", PlatformPermissions.Projects.ViewIndicators)).ShouldBeTrue();
        (await HasAsync("goren", PlatformPermissions.Projects.ManageIndicators)).ShouldBeFalse();
        (await HasAsync("duzenleyen", PlatformPermissions.Projects.ViewIndicators)).ShouldBeTrue();
        (await HasAsync("duzenleyen", PlatformPermissions.Projects.ManageIndicators)).ShouldBeTrue();
        (await HasAsync("disarida", PlatformPermissions.Projects.ViewIndicators)).ShouldBeFalse();

        // İkinci koşu: bilerek kaldırılan izin geri gelmez.
        await WithUnitOfWorkAsync(async () =>
        {
            using (_currentTenant.Change(tenantId))
            {
                var grant = await grants.FindAsync(PlatformPermissions.Projects.ViewIndicators, provider, "goren");
                await grants.DeleteAsync(grant!, autoSave: true);
            }
        });

        await SeedAsHostAsync();
        (await HasAsync("goren", PlatformPermissions.Projects.ViewIndicators)).ShouldBeFalse();
    }
}
