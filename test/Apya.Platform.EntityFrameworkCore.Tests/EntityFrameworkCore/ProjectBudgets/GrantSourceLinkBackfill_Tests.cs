using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.ProjectBudgets;

/// <summary>
/// 🔴 CNV-01 / FIN-04 geri dolumu: kaynak kimliği alanları eklenmeden ÖNCE dönüştürülmüş
/// bir proje, alanlar eklendikten sonra doğduğu hibe kayıtlarına bağlanır.
///
/// <para>Fikstür bilerek dönüşüm servisini KULLANMAZ: yeni dönüşüm bağı kendisi yazıyor,
/// burada ölçülen şey bağı OLMAYAN eski kayıt. Kayıtlar elle, bağsız kurulur.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class GrantSourceLinkBackfill_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly GrantSourceLinkBackfillDataSeedContributor _backfill;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<GrantApplication, Guid> _appRepository;
    private readonly IRepository<GrantApplicationBudgetLine, Guid> _grantLineRepository;
    private readonly IRepository<GrantDisbursementTranche, Guid> _grantTrancheRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<ProjectBudgetLine, Guid> _projectLineRepository;
    private readonly IRepository<FundingTranche, Guid> _projectTrancheRepository;
    private readonly ITenantManager _tenantManager;
    private readonly ITenantRepository _tenantRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly IUnitOfWorkManager _uowManager;

    public GrantSourceLinkBackfill_Tests()
    {
        _backfill = GetRequiredService<GrantSourceLinkBackfillDataSeedContributor>();
        _grantRepository = GetRequiredService<IRepository<Grant, Guid>>();
        _callRepository = GetRequiredService<IRepository<GrantCall, Guid>>();
        _appRepository = GetRequiredService<IRepository<GrantApplication, Guid>>();
        _grantLineRepository = GetRequiredService<IRepository<GrantApplicationBudgetLine, Guid>>();
        _grantTrancheRepository = GetRequiredService<IRepository<GrantDisbursementTranche, Guid>>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _projectLineRepository = GetRequiredService<IRepository<ProjectBudgetLine, Guid>>();
        _projectTrancheRepository = GetRequiredService<IRepository<FundingTranche, Guid>>();
        _tenantManager = GetRequiredService<ITenantManager>();
        _tenantRepository = GetRequiredService<ITenantRepository>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
        _uowManager = GetRequiredService<IUnitOfWorkManager>();
    }

    private sealed record Fixture(
        Guid TenantId, Guid ProjectId,
        Guid GrantPersonnel, Guid GrantMachine, Guid GrantTwinA, Guid GrantTwinB,
        Guid GrantTranche1, Guid GrantTranche2,
        Guid LinePersonnel, Guid LineMachine, Guid LineTwinA, Guid LineTwinB, Guid LineManual,
        Guid Tranche1, Guid Tranche2);

    /// <summary>
    /// Bağsız, "eski" bir dönüşüm kurar:
    /// <list type="bullet">
    /// <item>Personel 600.000 ve Makine 150.000 — tutarları TEKİL, bağlanmalı.</item>
    /// <item>İki kalem 50.000 — tutar ikisinde de aynı, BELİRSİZ, bağlanmamalı.</item>
    /// <item>75.000'lik kalem projede elle açılmış — başvuruda karşılığı yok.</item>
    /// <item>1. dilim sıra+tutar tutuyor; 2. dilimin tutarı projede değiştirilmiş.</item>
    /// </list>
    /// </summary>
    private async Task<Fixture> CreateLegacyConversionAsync()
    {
        _currentTenant.Id.ShouldBeNull("katalog host bağlamında tohumlanmalı");

        var grant = new Grant(Guid.NewGuid(), "Geri Dolum Desteği", "Kurum", 900_000m, minMatchScore: 0);
        await _grantRepository.InsertAsync(grant, autoSave: true);
        var call = new GrantCall(Guid.NewGuid(), grant.Id, "2025/2", GrantCallStatus.Kapandi);
        await _callRepository.InsertAsync(call, autoSave: true);

        var tenant = await _tenantManager.CreateAsync("Geri Dolum " + Guid.NewGuid().ToString("N")[..6]);
        await _tenantRepository.InsertAsync(tenant, autoSave: true);
        var tenantId = tenant.Id;

        using (_currentTenant.Change(tenantId))
        {
            var project = new Project(Guid.NewGuid(), tenantId, grant.Id, "Eski Dönüşüm", "PRJ-BF", "açıklama");
            await _projectRepository.InsertAsync(project, autoSave: true);

            var application = new GrantApplication(Guid.NewGuid(), tenantId, call.Id);
            application.LinkToProject(project.Id);
            await _appRepository.InsertAsync(application, autoSave: true);

            async Task<Guid> GrantLineAsync(GrantCostItemKind kind, decimal amount)
            {
                var line = new GrantApplicationBudgetLine(Guid.NewGuid(), tenantId, application.Id, kind);
                line.SetAmount(amount);
                await _grantLineRepository.InsertAsync(line, autoSave: true);
                return line.Id;
            }

            async Task<Guid> ProjectLineAsync(string code, string name, decimal amount, int order)
            {
                var line = new ProjectBudgetLine(Guid.NewGuid(), tenantId, project.Id, code, name, amount, amount, order);
                await _projectLineRepository.InsertAsync(line, autoSave: true);
                return line.Id;
            }

            async Task<Guid> GrantTrancheAsync(int no, decimal amount)
            {
                var tranche = new GrantDisbursementTranche(Guid.NewGuid(), tenantId, application.Id, no, amount, null);
                await _grantTrancheRepository.InsertAsync(tranche, autoSave: true);
                return tranche.Id;
            }

            async Task<Guid> ProjectTrancheAsync(int no, decimal amount)
            {
                var tranche = new FundingTranche(Guid.NewGuid(), tenantId, project.Id, no, amount);
                await _projectTrancheRepository.InsertAsync(tranche, autoSave: true);
                return tranche.Id;
            }

            return new Fixture(
                tenantId, project.Id,
                await GrantLineAsync(GrantCostItemKind.Personel, 600_000m),
                await GrantLineAsync(GrantCostItemKind.MakineTechizat, 150_000m),
                await GrantLineAsync(GrantCostItemKind.SarfMalzeme, 50_000m),
                await GrantLineAsync(GrantCostItemKind.Danismanlik, 50_000m),
                await GrantTrancheAsync(1, 400_000m),
                await GrantTrancheAsync(2, 500_000m),
                await ProjectLineAsync("01", "Personel", 600_000m, 0),
                await ProjectLineAsync("02", "Makine", 150_000m, 1),
                await ProjectLineAsync("03", "Sarf", 50_000m, 2),
                await ProjectLineAsync("04", "Danışmanlık", 50_000m, 3),
                await ProjectLineAsync("05", "Sonradan eklenen", 75_000m, 4),
                await ProjectTrancheAsync(1, 400_000m),
                // Kullanıcı 2. dilimin tutarını projede değiştirmiş: artık aynı dilim sayılmaz.
                await ProjectTrancheAsync(2, 450_000m));
        }
    }

    private async Task<(ProjectBudgetLine[] Lines, FundingTranche[] Tranches)> ReadStoredAsync(Fixture f)
    {
        using var uow = _uowManager.Begin(requiresNew: true);
        using (_currentTenant.Change(f.TenantId))
        {
            var lines = (await _projectLineRepository.GetListAsync(l => l.ProjectId == f.ProjectId)).ToArray();
            var tranches = (await _projectTrancheRepository.GetListAsync(t => t.ProjectId == f.ProjectId)).ToArray();
            await uow.CompleteAsync();
            return (lines, tranches);
        }
    }

    [Fact]
    public async Task Tekil_eslesen_baglanir_belirsiz_olan_bos_kalir()
    {
        var f = await WithUnitOfWorkAsync(CreateLegacyConversionAsync);

        await WithUnitOfWorkAsync(() => _backfill.SeedAsync(new DataSeedContext()));

        var (lines, tranches) = await ReadStoredAsync(f);

        lines.Single(l => l.Id == f.LinePersonnel).SourceGrantLineId.ShouldBe(f.GrantPersonnel);
        lines.Single(l => l.Id == f.LineMachine).SourceGrantLineId.ShouldBe(f.GrantMachine);

        // 🔴 Aynı tutarı taşıyan iki kalem: hangisinin hangisinden doğduğu bilinemez.
        lines.Single(l => l.Id == f.LineTwinA).SourceGrantLineId.ShouldBeNull();
        lines.Single(l => l.Id == f.LineTwinB).SourceGrantLineId.ShouldBeNull();

        // Projede elle açılan kalemin başvuruda karşılığı yok.
        lines.Single(l => l.Id == f.LineManual).SourceGrantLineId.ShouldBeNull();

        tranches.Single(t => t.Id == f.Tranche1).SourceGrantTrancheId.ShouldBe(f.GrantTranche1);
        tranches.Single(t => t.Id == f.Tranche2).SourceGrantTrancheId.ShouldBeNull("tutarı projede değiştirilmiş");
    }

    /// <summary>
    /// Tohumlayıcı her DbMigrator turunda koşar. İkinci tur hiçbir şeyi değiştirmemeli:
    /// ne kurulmuş bağı, ne de bilerek boş bırakılanı.
    /// </summary>
    [Fact]
    public async Task Ikinci_tur_hicbir_seyi_degistirmez()
    {
        var f = await WithUnitOfWorkAsync(CreateLegacyConversionAsync);

        await WithUnitOfWorkAsync(() => _backfill.SeedAsync(new DataSeedContext()));
        var first = await ReadStoredAsync(f);

        await WithUnitOfWorkAsync(() => _backfill.SeedAsync(new DataSeedContext()));
        var second = await ReadStoredAsync(f);

        second.Lines.OrderBy(l => l.Id).Select(l => l.SourceGrantLineId)
            .ShouldBe(first.Lines.OrderBy(l => l.Id).Select(l => l.SourceGrantLineId));
        second.Tranches.OrderBy(t => t.Id).Select(t => t.SourceGrantTrancheId)
            .ShouldBe(first.Tranches.OrderBy(t => t.Id).Select(t => t.SourceGrantTrancheId));
    }

    /// <summary>Kiracı başına çağrıda tarama YAPILMAZ: aynı iş kiracı sayısı kadar tekrarlanırdı.</summary>
    [Fact]
    public async Task Kiraci_baglaminda_cagrilirsa_dokunmaz()
    {
        var f = await WithUnitOfWorkAsync(CreateLegacyConversionAsync);

        await WithUnitOfWorkAsync(() => _backfill.SeedAsync(new DataSeedContext(f.TenantId)));

        var (lines, tranches) = await ReadStoredAsync(f);
        lines.ShouldAllBe(l => l.SourceGrantLineId == null);
        tranches.ShouldAllBe(t => t.SourceGrantTrancheId == null);
    }
}
