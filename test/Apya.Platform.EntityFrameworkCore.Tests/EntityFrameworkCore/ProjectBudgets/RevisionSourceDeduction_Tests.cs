using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.ProjectBudgets;

/// <summary>
/// Bütçe revizyonu "kaynak kesinti" ile uygulandığında o kesinti "bütçeye işlendi" diye
/// kapanır. Kesintinin revizyonun projesine ait olduğu denetlenmiyordu: A projesinin
/// kesintisi, B projesinin revizyonuyla kapatılabiliyordu.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class RevisionSourceDeduction_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly IRepository<Project, Guid> _projectRepository;

    public RevisionSourceDeduction_Tests()
    {
        _budgetAppService = GetRequiredService<IProjectBudgetAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
    }

    private async Task<Guid> NewProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(), null, null, "Revizyon kesinti testi",
            "RKT-" + Guid.NewGuid().ToString("N")[..8], "", 1_000_000m, 0m, "TRY");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<Guid> NewDeductionAsync(Guid projectId)
    {
        var tranche = await _budgetAppService.CreateTrancheAsync(projectId,
            new CreateUpdateTrancheDto { PlannedAmount = 700_000m, Title = "1. Dilim" });
        var withDeduction = await _budgetAppService.AddDeductionAsync(tranche.Id, new CreateDeductionDto
        {
            Amount = 100_000m, Reason = "Denetim", DeductionDate = new DateTime(2026, 8, 1),
        });
        return withDeduction.Deductions.Single().Id;
    }

    private async Task<ApplyBudgetRevisionDto> RevisionInputAsync(Guid projectId, Guid deductionId)
    {
        var line = await _budgetAppService.CreateLineAsync(projectId, new CreateUpdateBudgetLineDto
        {
            Code = "1", Name = "Personel", PlannedAmount = 500_000m,
        });

        return new ApplyBudgetRevisionDto
        {
            Reason = "Kesinti sonrası revizyon",
            EffectiveDate = new DateTime(2026, 8, 15),
            Changes = new Dictionary<Guid, decimal> { [line.Id] = 400_000m },
            SourceDeductionId = deductionId
        };
    }

    private async Task<DeductionDtoState> ReadDeductionAsync(Guid projectId, Guid deductionId)
    {
        var deduction = (await _budgetAppService.GetTranchesAsync(projectId))
            .SelectMany(t => t.Deductions).Single(d => d.Id == deductionId);
        return new DeductionDtoState(deduction.Resolution, deduction.BudgetRevisionId);
    }

    private record DeductionDtoState(DeductionResolution Resolution, Guid? BudgetRevisionId);

    [Fact]
    public async Task Baska_projenin_kesintisi_bu_projenin_revizyonuyla_kapatilamaz()
    {
        var projectA = await NewProjectAsync();
        var projectB = await NewProjectAsync();
        var deductionOfA = await NewDeductionAsync(projectA);
        var input = await RevisionInputAsync(projectB, deductionOfA);

        await Should.ThrowAsync<EntityNotFoundException>(() => _budgetAppService.ApplyRevisionAsync(projectB, input));

        var state = await ReadDeductionAsync(projectA, deductionOfA);
        state.Resolution.ShouldBe(DeductionResolution.Open);
        state.BudgetRevisionId.ShouldBeNull();
    }

    /// <summary>Karşı yön: projenin kendi kesintisi revizyona bağlanır.</summary>
    [Fact]
    public async Task Projenin_kendi_kesintisi_revizyona_baglanir()
    {
        var project = await NewProjectAsync();
        var deduction = await NewDeductionAsync(project);
        var input = await RevisionInputAsync(project, deduction);

        var revision = await _budgetAppService.ApplyRevisionAsync(project, input);

        (await ReadDeductionAsync(project, deduction)).BudgetRevisionId.ShouldBe(revision.Id);
    }
}
