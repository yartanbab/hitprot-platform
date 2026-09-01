using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.ProjectBudgets;

/// <summary>
/// SÖZLEŞME: dilim yüklendiğinde kesintileri DE yüklenir.
///
/// <para><c>includeDetails: true</c> tek başına hiçbir şey yapmaz; ABP'nin varsayılan
/// deposu alt koleksiyonu ancak <c>DefaultWithDetailsFunc</c> kayıtlıysa Include eder
/// (<c>PlatformEntityFrameworkCoreModule</c>). Kayıt yokken navigasyon boş geliyordu ve
/// sonuç yalnız görüntü değil VERİ BÜTÜNLÜĞÜ idi:</para>
///
/// <para><c>FundingTranche.AddDeduction</c>, "kesintilerin toplamı dilimin planlanan
/// tutarını aşamaz" kuralını <c>Deductions</c> koleksiyonundan hesaplar. Koleksiyon boş
/// yüklendiğinde toplam 0 sanılıyor ve kural hiç çalışmıyordu — 2026-09-02'de 700.000'lik
/// bir dilime iki ayrı 600.000'lik kesinti kabul edildiği ölçüldü.</para>
///
/// <para>Sayfa akışı bunu GİZLİYORDU: /Finance önce <c>GetOverviewAsync</c> çağırıyor, o da
/// kesintileri ayrı sorguyla yüklüyor ve EF'in relationship fixup'ı navigasyonu dolduruyordu.
/// Doğrudan API çağrısında önceki sorgu olmadığı için kesintiler boş dönüyordu. Bu yüzden
/// test AYRI çağrılarla ölçer, tek istekte zincir kurmaz.</para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FundingTrancheDetails_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly IRepository<Project, Guid> _projectRepository;

    public FundingTrancheDetails_Tests()
    {
        _budgetAppService = GetRequiredService<IProjectBudgetAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
    }

    private async Task<Guid> NewProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(), null, null,
            "Kesinti testi " + Guid.NewGuid().ToString("N")[..6],
            "PRJ-TEST", "", 1_000_000m, 0m, "TRY");

        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    [Fact]
    public async Task Dilim_okundugunda_kesintileri_de_gelir()
    {
        var projectId = await NewProjectAsync();
        var tranche = await _budgetAppService.CreateTrancheAsync(projectId,
            new CreateUpdateTrancheDto { PlannedAmount = 700_000m, Title = "1. Dilim" });

        await _budgetAppService.AddDeductionAsync(tranche.Id, new CreateDeductionDto
        {
            Amount = 100_000m, Reason = "Denetim", DeductionDate = new DateTime(2026, 8, 1),
        });

        // AYRI çağrı: öncesinde kesintileri yükleyen başka bir sorgu YOK.
        var tranches = await _budgetAppService.GetTranchesAsync(projectId);

        var row = tranches.Single();
        row.Deductions.Count.ShouldBe(1);
        row.DeductionTotal.ShouldBe(100_000m);
        row.ExpectedAmount.ShouldBe(600_000m);
    }

    [Fact]
    public async Task Kesintilerin_toplami_dilimi_ASAMAZ()
    {
        var projectId = await NewProjectAsync();
        var tranche = await _budgetAppService.CreateTrancheAsync(projectId,
            new CreateUpdateTrancheDto { PlannedAmount = 700_000m, Title = "1. Dilim" });

        // Tek başına geçerli.
        await _budgetAppService.AddDeductionAsync(tranche.Id, new CreateDeductionDto
        {
            Amount = 600_000m, Reason = "Birinci", DeductionDate = new DateTime(2026, 8, 1),
        });

        // İkincisi de tek başına dilimden küçük, ama TOPLAM 1.200.000 > 700.000.
        // Koleksiyon boş yüklenirse bu çağrı sessizce geçerdi.
        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _budgetAppService.AddDeductionAsync(tranche.Id, new CreateDeductionDto
            {
                Amount = 600_000m, Reason = "İkinci", DeductionDate = new DateTime(2026, 8, 2),
            }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.DeductionExceedsTranche);
    }

    /// <summary>
    /// Aynı kayıt eksikliği <see cref="BudgetRevision"/> için de vardı: revizyonun
    /// satırları boş gelirse geçmiş "hangi kalem ne kadar değişti" sorusunu cevaplayamaz.
    /// </summary>
    [Fact]
    public async Task Revizyon_okundugunda_satirlari_da_gelir()
    {
        var projectId = await NewProjectAsync();
        var line = await _budgetAppService.CreateLineAsync(projectId, new CreateUpdateBudgetLineDto
        {
            Code = "1", Name = "Personel", PlannedAmount = 500_000m,
        });

        await _budgetAppService.ApplyRevisionAsync(projectId, new ApplyBudgetRevisionDto
        {
            Reason = "Kesinti sonrası",
            EffectiveDate = new DateTime(2026, 8, 15),
            Changes = { [line.Id] = 400_000m },
        });

        var revisions = await _budgetAppService.GetRevisionsAsync(projectId);

        var revision = revisions.Single();
        revision.Lines.Count.ShouldBe(1);
        revision.Lines.Single().PreviousAmount.ShouldBe(500_000m);
        revision.Lines.Single().NewAmount.ShouldBe(400_000m);
        revision.NetDelta.ShouldBe(-100_000m);
    }
}
