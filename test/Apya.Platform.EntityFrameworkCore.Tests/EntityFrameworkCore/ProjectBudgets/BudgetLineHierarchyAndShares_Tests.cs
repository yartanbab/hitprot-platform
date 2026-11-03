using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.ProjectBudgets;

/// <summary>
/// SÖZLEŞME (kullanıcı kararı 2026-10-31):
///   1) Kalemler ağaçtır; varsayılan sıra kodun SAYI sırasıdır (1, 2, 2.1, 2.2, 10).
///   2) Üst kalem kendi tutarı + alt kalemlerinin toplamını gösterir; proje toplamı çift saymaz.
///   3) Hibe payı elle girilir ya da projenin destek oranından hesaplanır; kurum payı = onaylanan − hibe.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class BudgetLineHierarchyAndShares_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectBudgetAppService _budget;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly ICurrentTenant _currentTenant;

    public BudgetLineHierarchyAndShares_Tests()
    {
        _budget = GetRequiredService<IProjectBudgetAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _currentTenant = GetRequiredService<ICurrentTenant>();
    }

    private async Task<Guid> NewProjectAsync()
    {
        var suffix = Guid.NewGuid().ToString("N")[..6];
        // Proje kodu veritabanında tekil — iki projeli testte çakışmasın.
        var project = new Project(
            Guid.NewGuid(), _currentTenant.Id, null,
            "Ağaç testi " + suffix, "PRJ-AGAC-" + suffix, "", 0m, 0m, "TRY");

        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private Task<ProjectBudgetLineDto> AddAsync(Guid projectId, string code, decimal amount, Guid? parentId = null, decimal? grant = null)
        => _budget.CreateLineAsync(projectId, new CreateUpdateBudgetLineDto
        {
            Code = code, Name = "Kalem " + code, PlannedAmount = amount, ParentId = parentId, GrantAmount = grant
        });

    [Fact]
    public async Task Varsayilan_sira_kod_sayi_sirasidir_ve_alt_kalem_ustunun_altindadir()
    {
        var projectId = await NewProjectAsync();

        // Bilerek karışık sırada eklenir: tablo sırası (Order) koda göre değil.
        var k10 = await AddAsync(projectId, "10", 1m);
        var k2 = await AddAsync(projectId, "2", 0m);
        await AddAsync(projectId, "2.10", 1m, k2.Id);
        await AddAsync(projectId, "2.2", 1m, k2.Id);
        await AddAsync(projectId, "1", 1m);
        await AddAsync(projectId, "2.1", 1m, k2.Id);

        var lines = await _budget.GetLinesAsync(projectId);

        lines.Select(x => x.Code).ShouldBe(new[] { "1", "2", "2.1", "2.2", "2.10", "10" });
        lines.Single(x => x.Code == "2").HasChildren.ShouldBeTrue();
        lines.Single(x => x.Code == "2.10").Depth.ShouldBe(1);
        lines.Single(x => x.Id == k10.Id).Depth.ShouldBe(0);
    }

    [Fact]
    public async Task Ust_kalem_alt_toplami_gosterir_proje_toplami_cift_saymaz()
    {
        var projectId = await NewProjectAsync();

        var kategori = await AddAsync(projectId, "2", 5_000m);      // kendi tutarı da var
        await AddAsync(projectId, "2.1", 20_000m, kategori.Id);
        await AddAsync(projectId, "2.2", 15_000m, kategori.Id);
        await AddAsync(projectId, "1", 12_000m);

        var overview = await _budget.GetOverviewAsync(projectId);
        var ust = overview.Lines.Single(x => x.Code == "2");

        ust.ApprovedAmount.ShouldBe(5_000m);
        ust.TotalApprovedAmount.ShouldBe(40_000m);
        // 12.000 + 5.000 + 20.000 + 15.000 — üst satırın toplamı yeniden eklenmez.
        overview.ApprovedBudget.ShouldBe(52_000m);
    }

    [Fact]
    public async Task Hibe_payi_bos_ise_destek_oranindan_hesaplanir_kurum_kalandir()
    {
        var projectId = await NewProjectAsync();
        await _budget.UpdateSupportRateAsync(projectId, new UpdateSupportRateDto { SupportRatePercent = 75m });

        await AddAsync(projectId, "1", 20_000m);                    // orandan: 15.000 / 5.000
        await AddAsync(projectId, "2", 10_000m, grant: 10_000m);    // elle: 10.000 / 0

        var overview = await _budget.GetOverviewAsync(projectId);

        overview.SupportRatePercent.ShouldBe(75m);
        overview.InstitutionRatePercent.ShouldBe(25m);

        var bir = overview.Lines.Single(x => x.Code == "1");
        bir.GrantShare.ShouldBe(15_000m);
        bir.InstitutionShare.ShouldBe(5_000m);

        var iki = overview.Lines.Single(x => x.Code == "2");
        iki.GrantShare.ShouldBe(10_000m);
        iki.InstitutionShare.ShouldBe(0m);

        overview.GrantShareTotal.ShouldBe(25_000m);
        overview.InstitutionShareTotal.ShouldBe(5_000m);
    }

    [Fact]
    public async Task Oran_ve_elle_pay_yoksa_pay_bilinmez_sifir_sayilmaz()
    {
        var projectId = await NewProjectAsync();
        await AddAsync(projectId, "1", 20_000m);

        var overview = await _budget.GetOverviewAsync(projectId);

        overview.SupportRatePercent.ShouldBeNull();
        overview.Lines.Single().GrantShare.ShouldBeNull();
        overview.GrantShareTotal.ShouldBeNull();
    }

    [Fact]
    public async Task Hibe_payi_onaylanan_tutari_asamaz()
    {
        var projectId = await NewProjectAsync();

        var ex = await Should.ThrowAsync<BusinessException>(() => AddAsync(projectId, "1", 10_000m, grant: 10_001m));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineGrantAmountInvalid);
    }

    [Fact]
    public async Task Kalem_kendi_alt_kaleminin_altina_tasinamaz()
    {
        var projectId = await NewProjectAsync();
        var ust = await AddAsync(projectId, "1", 0m);
        var alt = await AddAsync(projectId, "1.1", 1m, ust.Id);

        var ex = await Should.ThrowAsync<BusinessException>(() => _budget.UpdateLineAsync(ust.Id, new CreateUpdateBudgetLineDto
        {
            Code = "1", Name = "Kalem 1", PlannedAmount = 0m, ParentId = alt.Id
        }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineParentInvalid);
    }

    [Fact]
    public async Task Baska_projenin_kalemi_ust_kalem_olamaz()
    {
        var projectA = await NewProjectAsync();
        var projectB = await NewProjectAsync();
        var yabanci = await AddAsync(projectB, "1", 0m);

        var ex = await Should.ThrowAsync<BusinessException>(() => AddAsync(projectA, "1.1", 1m, yabanci.Id));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineParentInvalid);
    }

    [Fact]
    public async Task Derinlik_siniri_asilamaz()
    {
        var projectId = await NewProjectAsync();

        Guid? parent = null;
        for (var i = 1; i <= ProjectBudgetConsts.MaxLineDepth; i++)
        {
            parent = (await AddAsync(projectId, "d" + i, 1m, parent)).Id;
        }

        var ex = await Should.ThrowAsync<BusinessException>(() => AddAsync(projectId, "fazla", 1m, parent));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineParentInvalid);
    }

    [Fact]
    public async Task Alt_kalemi_olan_kalem_silinemez()
    {
        var projectId = await NewProjectAsync();
        var ust = await AddAsync(projectId, "1", 0m);
        await AddAsync(projectId, "1.1", 1m, ust.Id);

        var ex = await Should.ThrowAsync<BusinessException>(() => _budget.DeleteLineAsync(ust.Id));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.BudgetLineHasChildren);
    }
}
