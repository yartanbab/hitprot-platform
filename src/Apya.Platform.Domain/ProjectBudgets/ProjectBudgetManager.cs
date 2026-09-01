using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Proje bütçesinin birden fazla varlığa dokunan kuralları. AppService bunları
/// yeniden yazmaz.
///
/// Buraya taşınmasının sebebi tek tek kuralların karmaşıklığı değil, hepsinin
/// AYNI ANDA doğru olması gerekmesi: bir revizyon hem kalem tutarlarını
/// değiştirir, hem geçmiş kaydı üretir, hem kesintiyi o kayda bağlar. Üçü ayrı
/// yerlerde yapılırsa biri atlandığında kimse fark etmez.
/// </summary>
public class ProjectBudgetManager : DomainService
{
    private readonly IRepository<ProjectBudgetLine, Guid> _lineRepository;
    private readonly IRepository<FundingTranche, Guid> _trancheRepository;
    private readonly IRepository<BudgetRevision, Guid> _revisionRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;

    public ProjectBudgetManager(
        IRepository<ProjectBudgetLine, Guid> lineRepository,
        IRepository<FundingTranche, Guid> trancheRepository,
        IRepository<BudgetRevision, Guid> revisionRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<IncomeEntry, Guid> incomeRepository)
    {
        _lineRepository = lineRepository;
        _trancheRepository = trancheRepository;
        _revisionRepository = revisionRepository;
        _expenseRepository = expenseRepository;
        _incomeRepository = incomeRepository;
    }

    /// <summary>
    /// Kalem oluşturur. Kod proje içinde tekildir; boş kod serbesttir (kodsuz
    /// çalışan kiracılar var) ama doluysa çakışamaz.
    /// </summary>
    public async Task<ProjectBudgetLine> CreateLineAsync(
        Guid projectId,
        string code,
        string name,
        decimal plannedAmount,
        decimal? approvedAmount = null,
        decimal? transferLimitPercent = null)
    {
        await EnsureCodeIsFreeAsync(projectId, code, excludedLineId: null);

        var order = await NextLineOrderAsync(projectId);

        return new ProjectBudgetLine(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            projectId,
            code,
            name,
            plannedAmount,
            approvedAmount ?? plannedAmount,
            order,
            transferLimitPercent);
    }

    /// <summary>Kalemi günceller. Tutar değişimi revizyon DEĞİLDİR — bkz. <see cref="ApplyRevisionAsync"/>.</summary>
    public async Task UpdateLineAsync(
        ProjectBudgetLine line,
        string code,
        string name,
        decimal plannedAmount,
        decimal approvedAmount,
        decimal? transferLimitPercent)
    {
        await EnsureCodeIsFreeAsync(line.ProjectId, code, excludedLineId: line.Id);

        line.SetCode(code);
        line.SetName(name);
        line.SetAmounts(plannedAmount, approvedAmount);
        line.SetTransferLimit(transferLimitPercent);
    }

    /// <summary>
    /// Kalemi siler. Bağlı gider/gelir kaydı varsa REDDEDER: kaydı sessizce
    /// kalemsiz bırakmak, harcamayı bütçeden görünmez yapar.
    /// </summary>
    public async Task DeleteLineAsync(ProjectBudgetLine line)
    {
        var expenseCount = await _expenseRepository.CountAsync(x => x.BudgetLineId == line.Id);
        var incomeCount = await _incomeRepository.CountAsync(x => x.BudgetLineId == line.Id);

        if (expenseCount + incomeCount > 0)
            throw new BusinessException(PlatformDomainErrorCodes.BudgetLineInUse)
                .WithData("LineName", line.Name)
                .WithData("RecordCount", expenseCount + incomeCount);

        await _lineRepository.DeleteAsync(line);
    }

    /// <summary>Projedeki bir sonraki dilim sırası.</summary>
    public async Task<int> NextTrancheSequenceAsync(Guid projectId)
    {
        var tranches = await _trancheRepository.GetListAsync(x => x.ProjectId == projectId);
        return tranches.Count == 0 ? 1 : tranches.Max(x => x.SequenceNo) + 1;
    }

    public async Task<FundingTranche> CreateTrancheAsync(
        Guid projectId,
        decimal plannedAmount,
        DateTime? plannedDate,
        string? title,
        string? note)
    {
        var sequenceNo = await NextTrancheSequenceAsync(projectId);

        return new FundingTranche(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            projectId,
            sequenceNo,
            plannedAmount,
            plannedDate,
            title,
            note);
    }

    public Task<TrancheDeduction> AddDeductionAsync(
        FundingTranche tranche,
        decimal amount,
        string reason,
        DateTime deductionDate)
        => Task.FromResult(tranche.AddDeduction(GuidGenerator.Create(), amount, reason, deductionDate));

    /// <summary>
    /// Bütçe revizyonu uygular: geçmiş kaydını üretir, kalem tutarlarını değiştirir
    /// ve isteğe bağlı olarak bunu tetikleyen kesintiyi kayda bağlar. Üçü tek
    /// işlemdedir; hiçbiri tek başına anlamlı değil.
    /// </summary>
    /// <param name="changes">Kalem id → yeni onaylanan tutar. Değişmeyen kalem verilmez.</param>
    public async Task<BudgetRevision> ApplyRevisionAsync(
        Guid projectId,
        string reason,
        DateTime effectiveDate,
        IReadOnlyDictionary<Guid, decimal> changes,
        TrancheDeduction? sourceDeduction = null)
    {
        if (changes == null || changes.Count == 0)
            throw new BusinessException(PlatformDomainErrorCodes.BudgetRevisionEmpty);

        var lines = await _lineRepository.GetListAsync(x => x.ProjectId == projectId);
        var byId = lines.ToDictionary(x => x.Id);

        // Önce DOĞRULA, sonra yaz: yarısı uygulanmış bir revizyon, hiç uygulanmamış
        // olandan çok daha kötüdür.
        foreach (var (lineId, newAmount) in changes)
        {
            if (!byId.ContainsKey(lineId))
                throw new BusinessException(PlatformDomainErrorCodes.BudgetLineProjectMismatch)
                    .WithData("BudgetLineId", lineId)
                    .WithData("ProjectId", projectId);

            if (newAmount < 0)
                throw new BusinessException(PlatformDomainErrorCodes.BudgetRevisionAmountInvalid)
                    .WithData("BudgetLineId", lineId)
                    .WithData("NewAmount", newAmount);
        }

        var revisionNo = await NextRevisionNoAsync(projectId);
        var revision = new BudgetRevision(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            projectId,
            revisionNo,
            reason,
            effectiveDate);

        foreach (var (lineId, newAmount) in changes)
        {
            var line = byId[lineId];
            revision.AddLine(GuidGenerator.Create(), lineId, line.ApprovedAmount, newAmount);
            line.ApplyRevisedAmount(newAmount);
            await _lineRepository.UpdateAsync(line);
        }

        revision.SealTotal(lines.Sum(x => x.ApprovedAmount));
        await _revisionRepository.InsertAsync(revision);

        sourceDeduction?.MarkAppliedToBudget(revision.Id);

        return revision;
    }

    public async Task<int> NextRevisionNoAsync(Guid projectId)
    {
        var revisions = await _revisionRepository.GetListAsync(x => x.ProjectId == projectId);
        return revisions.Count == 0 ? 1 : revisions.Max(x => x.RevisionNo) + 1;
    }

    private async Task EnsureCodeIsFreeAsync(Guid projectId, string? code, Guid? excludedLineId)
    {
        var clean = (code ?? string.Empty).Trim();
        if (clean.Length == 0)
        {
            return;
        }

        var existing = await _lineRepository.FindAsync(x =>
            x.ProjectId == projectId && x.Code == clean && (excludedLineId == null || x.Id != excludedLineId));

        if (existing != null)
            throw new BusinessException(PlatformDomainErrorCodes.BudgetLineCodeAlreadyExists)
                .WithData("Code", clean);
    }

    private async Task<int> NextLineOrderAsync(Guid projectId)
    {
        var lines = await _lineRepository.GetListAsync(x => x.ProjectId == projectId);
        return lines.Count == 0 ? 1 : lines.Max(x => x.Order) + 1;
    }
}
