using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Proje bütçesinin okuma/yazma yüzeyi. İş kuralları
/// <see cref="ProjectBudgetManager"/>'da; burası orkestrasyon.
///
/// HOST BAĞLAMI: her okuma <c>CurrentTenant.Id == null</c> iken tenant filtresini
/// kapatır. Bu, /Finance'in proje seçicisiyle (ProjectAppService) AYNI davranıştır —
/// aksi halde host admin bir kiracı projesi seçtiğinde bütçe dolu, kalemler boş
/// görünürdü.
/// </summary>
[Authorize(PlatformPermissions.Projects.ViewBudget)]
public class ProjectBudgetAppService : ApplicationService, IProjectBudgetAppService
{
    private readonly IRepository<ProjectBudgetLine, Guid> _lineRepository;
    private readonly IRepository<FundingTranche, Guid> _trancheRepository;
    private readonly IRepository<TrancheDeduction, Guid> _deductionRepository;
    private readonly IRepository<BudgetRevision, Guid> _revisionRepository;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly ProjectBudgetManager _budgetManager;

    public ProjectBudgetAppService(
        IRepository<ProjectBudgetLine, Guid> lineRepository,
        IRepository<FundingTranche, Guid> trancheRepository,
        IRepository<TrancheDeduction, Guid> deductionRepository,
        IRepository<BudgetRevision, Guid> revisionRepository,
        IRepository<Project, Guid> projectRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<IncomeEntry, Guid> incomeRepository,
        ProjectBudgetManager budgetManager)
    {
        _lineRepository = lineRepository;
        _trancheRepository = trancheRepository;
        _deductionRepository = deductionRepository;
        _revisionRepository = revisionRepository;
        _projectRepository = projectRepository;
        _expenseRepository = expenseRepository;
        _incomeRepository = incomeRepository;
        _budgetManager = budgetManager;
    }

    /// <summary>Host bağlamında kiracı filtresini kapatır; kiracı bağlamında dokunmaz.</summary>
    private IDisposable? HostScope()
        => CurrentTenant.Id == null ? DataFilter.Disable<IMultiTenant>() : null;

    // ─────────────────────────── ÖZET ───────────────────────────

    public async Task<ProjectBudgetOverviewDto> GetOverviewAsync(Guid projectId)
    {
        using var scope = HostScope();

        var project = await _projectRepository.GetAsync(projectId);
        var lines = await LoadLinesAsync(projectId);
        var tranches = await _trancheRepository.GetListAsync(x => x.ProjectId == projectId, includeDetails: true);

        var expenses = await _expenseRepository.GetListAsync(x => x.ProjectId == projectId);
        var incomes = await _incomeRepository.GetListAsync(x => x.ProjectId == projectId);
        var deductions = await LoadDeductionsAsync(tranches);

        var hasLines = lines.Count > 0;
        var totalSpent = expenses.Sum(x => x.Amount);

        var dto = new ProjectBudgetOverviewDto
        {
            ProjectId = projectId,
            Currency = string.IsNullOrWhiteSpace(project.Currency) ? "TRY" : project.Currency,
            HasBudgetLines = hasLines,

            // Kalem yoksa proje bütçesi tek tutardır; ekran boş kalmasın diye ona düşülür.
            ContractBudget = hasLines ? lines.Sum(x => x.PlannedAmount) : project.TotalBudget,
            ApprovedBudget = hasLines ? lines.Sum(x => x.ApprovedAmount) : project.TotalBudget,

            PlannedFunding = tranches.Sum(x => x.PlannedAmount),
            ReceivedFunding = tranches.Sum(x => x.ReceivedAmount),
            DeductionTotal = deductions.Sum(x => x.Amount),
            UnfundedTotal = deductions.Where(x => x.Resolution == DeductionResolution.Unfunded).Sum(x => x.Amount),
            IncomeRecordTotal = incomes.Sum(x => x.Amount),

            SpentAmount = totalSpent,
            UnassignedSpentAmount = expenses.Where(x => x.BudgetLineId == null).Sum(x => x.Amount),

            TrancheCount = tranches.Count,
            CollectedTrancheCount = tranches.Count(x => x.Status == FundingTrancheStatus.Collected),

            LatestRevisionNo = await LatestRevisionNoAsync(projectId),
            Lines = lines
        };

        return dto;
    }

    // ─────────────────────────── KALEMLER ───────────────────────────

    public async Task<List<ProjectBudgetLineDto>> GetLinesAsync(Guid projectId)
    {
        using var scope = HostScope();
        return await LoadLinesAsync(projectId);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<ProjectBudgetLineDto> CreateLineAsync(Guid projectId, CreateUpdateBudgetLineDto input)
    {
        using var scope = HostScope();

        // Proje gerçekten var mı — olmayan projeye kalem açılmasın.
        await _projectRepository.GetAsync(projectId);

        var line = await _budgetManager.CreateLineAsync(
            projectId,
            input.Code ?? string.Empty,
            input.Name,
            input.PlannedAmount,
            input.ApprovedAmount,
            input.TransferLimitPercent);

        await _lineRepository.InsertAsync(line, autoSave: true);
        return await MapLineAsync(line);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<ProjectBudgetLineDto> UpdateLineAsync(Guid id, CreateUpdateBudgetLineDto input)
    {
        using var scope = HostScope();

        var line = await _lineRepository.GetAsync(id);

        await _budgetManager.UpdateLineAsync(
            line,
            input.Code ?? string.Empty,
            input.Name,
            input.PlannedAmount,
            input.ApprovedAmount ?? line.ApprovedAmount,
            input.TransferLimitPercent);

        await _lineRepository.UpdateAsync(line, autoSave: true);
        return await MapLineAsync(line);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task DeleteLineAsync(Guid id)
    {
        using var scope = HostScope();

        var line = await _lineRepository.GetAsync(id);
        await _budgetManager.DeleteLineAsync(line);
    }

    // ─────────────────────────── DİLİMLER ───────────────────────────

    public async Task<List<FundingTrancheDto>> GetTranchesAsync(Guid projectId)
    {
        using var scope = HostScope();

        var tranches = await _trancheRepository.GetListAsync(x => x.ProjectId == projectId, includeDetails: true);
        return await MapTranchesAsync(tranches.OrderBy(x => x.SequenceNo).ToList());
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<FundingTrancheDto> CreateTrancheAsync(Guid projectId, CreateUpdateTrancheDto input)
    {
        using var scope = HostScope();

        await _projectRepository.GetAsync(projectId);

        var tranche = await _budgetManager.CreateTrancheAsync(
            projectId, input.PlannedAmount, input.PlannedDate, input.Title, input.Note);

        await _trancheRepository.InsertAsync(tranche, autoSave: true);
        return await MapTrancheAsync(tranche);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<FundingTrancheDto> UpdateTrancheAsync(Guid id, CreateUpdateTrancheDto input)
    {
        using var scope = HostScope();

        var tranche = await _trancheRepository.GetAsync(id, includeDetails: true);
        tranche.SetPlan(input.PlannedAmount, input.PlannedDate);
        tranche.SetTitle(input.Title);
        tranche.SetNote(input.Note);

        await _trancheRepository.UpdateAsync(tranche, autoSave: true);
        return await MapTrancheAsync(tranche);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task DeleteTrancheAsync(Guid id)
    {
        using var scope = HostScope();
        await _trancheRepository.DeleteAsync(id);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<FundingTrancheDto> RegisterCollectionAsync(Guid trancheId, RegisterCollectionDto input)
    {
        using var scope = HostScope();

        var tranche = await _trancheRepository.GetAsync(trancheId, includeDetails: true);
        tranche.RegisterCollection(input.ReceivedAmount, input.ReceivedDate, input.IncomeEntryId);

        await _trancheRepository.UpdateAsync(tranche, autoSave: true);
        return await MapTrancheAsync(tranche);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<FundingTrancheDto> SetDisputedAsync(Guid trancheId, bool disputed)
    {
        using var scope = HostScope();

        var tranche = await _trancheRepository.GetAsync(trancheId, includeDetails: true);
        tranche.SetDisputed(disputed);

        await _trancheRepository.UpdateAsync(tranche, autoSave: true);
        return await MapTrancheAsync(tranche);
    }

    // ─────────────────────────── KESİNTİLER ───────────────────────────

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<FundingTrancheDto> AddDeductionAsync(Guid trancheId, CreateDeductionDto input)
    {
        using var scope = HostScope();

        var tranche = await _trancheRepository.GetAsync(trancheId, includeDetails: true);
        await _budgetManager.AddDeductionAsync(tranche, input.Amount, input.Reason, input.DeductionDate);

        await _trancheRepository.UpdateAsync(tranche, autoSave: true);
        return await MapTrancheAsync(tranche);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<FundingTrancheDto> RemoveDeductionAsync(Guid deductionId)
    {
        using var scope = HostScope();

        var deduction = await _deductionRepository.GetAsync(deductionId);
        var tranche = await _trancheRepository.GetAsync(deduction.TrancheId, includeDetails: true);

        tranche.RemoveDeduction(deductionId);
        await _trancheRepository.UpdateAsync(tranche, autoSave: true);
        return await MapTrancheAsync(tranche);
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public Task<FundingTrancheDto> MarkDeductionUnfundedAsync(Guid deductionId)
        => ChangeDeductionResolutionAsync(deductionId, d => d.MarkUnfunded());

    [Authorize(PlatformPermissions.Projects.Edit)]
    public Task<FundingTrancheDto> ReopenDeductionAsync(Guid deductionId)
        => ChangeDeductionResolutionAsync(deductionId, d => d.Reopen());

    private async Task<FundingTrancheDto> ChangeDeductionResolutionAsync(Guid deductionId, Action<TrancheDeduction> change)
    {
        using var scope = HostScope();

        var deduction = await _deductionRepository.GetAsync(deductionId);
        change(deduction);
        await _deductionRepository.UpdateAsync(deduction, autoSave: true);

        var tranche = await _trancheRepository.GetAsync(deduction.TrancheId, includeDetails: true);
        return await MapTrancheAsync(tranche);
    }

    // ─────────────────────────── REVİZYONLAR ───────────────────────────

    public async Task<List<BudgetRevisionDto>> GetRevisionsAsync(Guid projectId)
    {
        using var scope = HostScope();

        var revisions = await _revisionRepository.GetListAsync(x => x.ProjectId == projectId, includeDetails: true);
        var lines = await _lineRepository.GetListAsync(x => x.ProjectId == projectId);
        var lineNames = lines.ToDictionary(x => x.Id, x => x.Name);

        return revisions
            .OrderByDescending(x => x.RevisionNo)
            .Select(r =>
            {
                var dto = ObjectMapper.Map<BudgetRevision, BudgetRevisionDto>(r);
                dto.NetDelta = r.NetDelta;
                foreach (var lineDto in dto.Lines)
                {
                    // Kalem silinmiş olabilir — geçmiş kaydı yine de okunabilmeli.
                    lineDto.BudgetLineName = lineNames.TryGetValue(lineDto.BudgetLineId, out var name)
                        ? name
                        : "(silinmiş kalem)";
                }
                return dto;
            })
            .ToList();
    }

    [Authorize(PlatformPermissions.Projects.Edit)]
    public async Task<BudgetRevisionDto> ApplyRevisionAsync(Guid projectId, ApplyBudgetRevisionDto input)
    {
        using var scope = HostScope();

        TrancheDeduction? sourceDeduction = null;
        if (input.SourceDeductionId.HasValue)
        {
            sourceDeduction = await _deductionRepository.GetAsync(input.SourceDeductionId.Value);
        }

        var revision = await _budgetManager.ApplyRevisionAsync(
            projectId,
            input.Reason,
            input.EffectiveDate == default ? Clock.Now : input.EffectiveDate,
            input.Changes,
            sourceDeduction);

        if (sourceDeduction != null)
        {
            await _deductionRepository.UpdateAsync(sourceDeduction, autoSave: true);
        }

        var dto = ObjectMapper.Map<BudgetRevision, BudgetRevisionDto>(revision);
        dto.NetDelta = revision.NetDelta;
        return dto;
    }

    // ─────────────────────────── YARDIMCILAR ───────────────────────────

    /// <summary>
    /// Kalemleri gerçekleşme tutarlarıyla birlikte döner. Gider/gelir tek sorguda
    /// çekilip bellekte gruplanır — kalem başına sorgu açmak N+1 üretirdi.
    /// </summary>
    private async Task<List<ProjectBudgetLineDto>> LoadLinesAsync(Guid projectId)
    {
        var lines = await _lineRepository.GetListAsync(x => x.ProjectId == projectId);
        if (lines.Count == 0)
        {
            return new List<ProjectBudgetLineDto>();
        }

        var expenses = await _expenseRepository.GetListAsync(x => x.ProjectId == projectId && x.BudgetLineId != null);
        var incomes = await _incomeRepository.GetListAsync(x => x.ProjectId == projectId && x.BudgetLineId != null);

        var spentByLine = expenses
            .GroupBy(x => x.BudgetLineId!.Value)
            .ToDictionary(g => g.Key, g => new { Total = g.Sum(x => x.Amount), Count = g.Count() });
        var incomeByLine = incomes
            .GroupBy(x => x.BudgetLineId!.Value)
            .ToDictionary(g => g.Key, g => new { Total = g.Sum(x => x.Amount), Count = g.Count() });

        return lines
            .OrderBy(x => x.Order)
            .ThenBy(x => x.Code)
            .Select(line =>
            {
                var dto = ObjectMapper.Map<ProjectBudgetLine, ProjectBudgetLineDto>(line);
                var spent = spentByLine.GetValueOrDefault(line.Id);
                var income = incomeByLine.GetValueOrDefault(line.Id);
                dto.SpentAmount = spent?.Total ?? 0m;
                dto.IncomeAmount = income?.Total ?? 0m;
                dto.LinkedRecordCount = (spent?.Count ?? 0) + (income?.Count ?? 0);
                return dto;
            })
            .ToList();
    }

    private async Task<ProjectBudgetLineDto> MapLineAsync(ProjectBudgetLine line)
    {
        var all = await LoadLinesAsync(line.ProjectId);
        return all.First(x => x.Id == line.Id);
    }

    private async Task<List<TrancheDeduction>> LoadDeductionsAsync(IEnumerable<FundingTranche> tranches)
    {
        var ids = tranches.Select(x => x.Id).ToList();
        if (ids.Count == 0)
        {
            return new List<TrancheDeduction>();
        }

        return await _deductionRepository.GetListAsync(x => ids.Contains(x.TrancheId));
    }

    private async Task<FundingTrancheDto> MapTrancheAsync(FundingTranche tranche)
        => (await MapTranchesAsync(new List<FundingTranche> { tranche })).Single();

    private async Task<List<FundingTrancheDto>> MapTranchesAsync(List<FundingTranche> tranches)
    {
        // Kesintinin bağlı olduğu revizyonun NUMARASI başka bir aggregate'te —
        // rozet ("Bütçeye işlendi · Rev.2") için tek sorguda çözülür.
        var revisionIds = tranches
            .SelectMany(t => t.Deductions)
            .Where(d => d.BudgetRevisionId.HasValue)
            .Select(d => d.BudgetRevisionId!.Value)
            .Distinct()
            .ToList();

        var revisionNos = new Dictionary<Guid, int>();
        if (revisionIds.Count > 0)
        {
            var revisions = await _revisionRepository.GetListAsync(x => revisionIds.Contains(x.Id));
            revisionNos = revisions.ToDictionary(x => x.Id, x => x.RevisionNo);
        }

        return tranches.Select(t =>
        {
            var dto = ObjectMapper.Map<FundingTranche, FundingTrancheDto>(t);
            dto.Deductions = t.Deductions
                .OrderBy(d => d.DeductionDate)
                .Select(d =>
                {
                    var deductionDto = ObjectMapper.Map<TrancheDeduction, TrancheDeductionDto>(d);
                    if (d.BudgetRevisionId.HasValue && revisionNos.TryGetValue(d.BudgetRevisionId.Value, out var no))
                    {
                        deductionDto.BudgetRevisionNo = no;
                    }
                    return deductionDto;
                })
                .ToList();
            return dto;
        }).ToList();
    }

    private async Task<int> LatestRevisionNoAsync(Guid projectId)
    {
        var revisions = await _revisionRepository.GetListAsync(x => x.ProjectId == projectId);
        return revisions.Count == 0 ? 0 : revisions.Max(x => x.RevisionNo);
    }
}
