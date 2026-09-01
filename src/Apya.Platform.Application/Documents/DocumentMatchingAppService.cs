using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Customers;
using Apya.Platform.Expenses;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;

namespace Apya.Platform.Documents;

/// <summary>
/// Harcama ↔ belge eşleştirme tezgâhı.
///
/// Skorlama <see cref="ExpenseMatchScorer"/>'dadır (Domain, saf fonksiyon).
/// Bu servis veriyi toplar, kullanıcı onayını kaydeder ve çift kayıt uyarısı üretir.
/// OTOMATİK bağlama YAPMAZ: yüksek skorlu bir aday bile kullanıcı onayı bekler —
/// yanlış bağlanmış bir fatura mali raporu sessizce bozar.
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class DocumentMatchingAppService : ApplicationService, IDocumentMatchingAppService
{
    private readonly IRepository<DocumentExpenseMatch, Guid> _matchRepository;
    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly IRepository<DocumentTypeField, Guid> _fieldRepository;
    private readonly IRepository<DocumentFieldValue, Guid> _fieldValueRepository;
    private readonly IRepository<DocumentAttachment, Guid> _attachmentRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<Customer, Guid> _customerRepository;
    private readonly IRepository<ProjectBudgetLine, Guid> _budgetLineRepository;

    public DocumentMatchingAppService(
        IRepository<DocumentExpenseMatch, Guid> matchRepository,
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<DocumentType, Guid> typeRepository,
        IRepository<DocumentTypeField, Guid> fieldRepository,
        IRepository<DocumentFieldValue, Guid> fieldValueRepository,
        IRepository<DocumentAttachment, Guid> attachmentRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<Customer, Guid> customerRepository,
        IRepository<ProjectBudgetLine, Guid> budgetLineRepository)
    {
        _matchRepository = matchRepository;
        _fileRepository = fileRepository;
        _typeRepository = typeRepository;
        _fieldRepository = fieldRepository;
        _fieldValueRepository = fieldValueRepository;
        _attachmentRepository = attachmentRepository;
        _expenseRepository = expenseRepository;
        _customerRepository = customerRepository;
        _budgetLineRepository = budgetLineRepository;
    }

    public virtual async Task<MatchingBoardDto> GetBoardAsync(Guid projectId)
    {
        var matchedExpenseIds = (await GetProjectMatchesAsync(projectId)).Select(m => m.ExpenseId).ToHashSet();
        var matchedFileIds = (await GetProjectMatchesAsync(projectId)).Select(m => m.DocumentFileId).ToHashSet();

        var expenses = (await _expenseRepository.GetListAsync(e => e.ProjectId == projectId))
            .Where(e => !matchedExpenseIds.Contains(e.Id))
            .OrderByDescending(e => e.ExpenseDate)
            .ToList();

        var supplierNames = await GetCustomerNamesAsync(
            expenses.Where(e => e.CustomerId.HasValue).Select(e => e.CustomerId!.Value).Distinct().ToList());

        // Kalem adlari TEK sorguda: her harcama icin ayri sorgu N+1 uretirdi.
        var budgetLineNames = (await _budgetLineRepository.GetListAsync(l => l.ProjectId == projectId))
            .ToDictionary(l => l.Id, l => string.IsNullOrWhiteSpace(l.Code) ? l.Name : l.Code + " · " + l.Name);

        var documents = await LoadMatchDocumentsAsync(projectId);
        var unmatchedDocuments = documents.Where(d => !matchedFileIds.Contains(d.Id)).ToList();

        var typeNames = await GetTypeNamesForFilesAsync(unmatchedDocuments.Select(d => d.Id).ToList());

        return new MatchingBoardDto
        {
            ProjectId = projectId,
            UndocumentedTotal = expenses.Sum(e => e.Amount),
            Expenses = expenses.Select(e => new UnmatchedExpenseDto
            {
                Id = e.Id,
                Title = e.Title,
                Amount = e.Amount,
                Currency = e.Currency,
                ExpenseDate = e.ExpenseDate,
                SupplierName = e.CustomerId.HasValue ? supplierNames.GetValueOrDefault(e.CustomerId.Value) : null,
                Description = e.Description,
                BudgetLineId = e.BudgetLineId,
                BudgetLineName = e.BudgetLineId.HasValue
                    ? budgetLineNames.GetValueOrDefault(e.BudgetLineId.Value)
                    : null,
            }).ToList(),
            Documents = unmatchedDocuments.Select(d => new UnmatchedDocumentDto
            {
                Id = d.Id,
                DisplayName = d.DisplayName,
                Amount = d.Amount,
                DocumentDate = d.DocumentDate,
                DocumentTypeName = typeNames.GetValueOrDefault(d.Id),
                // Çift kayıt uyarısı TÜM belgelere karşı hesaplanır, yalnız
                // bağlanmamışlara karşı değil — kopyanın eşi bağlanmış olabilir.
                DuplicateOf = ExpenseMatchScorer.DetectDuplicate(d, documents),
            }).ToList(),
        };
    }

    public virtual async Task<List<MatchCandidateDto>> GetCandidatesAsync(Guid expenseId)
    {
        var expense = await _expenseRepository.GetAsync(expenseId);

        if (!expense.ProjectId.HasValue)
        {
            return new List<MatchCandidateDto>();
        }

        var matchedFileIds = (await GetProjectMatchesAsync(expense.ProjectId.Value))
            .Select(m => m.DocumentFileId).ToHashSet();

        var documents = (await LoadMatchDocumentsAsync(expense.ProjectId.Value))
            .Where(d => !matchedFileIds.Contains(d.Id))
            .ToList();

        var matchExpense = await ToMatchExpenseAsync(expense);
        var candidates = ExpenseMatchScorer.RankForExpense(matchExpense, documents);

        var byId = documents.ToDictionary(d => d.Id);

        return candidates.Select(c =>
        {
            var doc = byId[c.DocumentFileId];
            return new MatchCandidateDto
            {
                DocumentFileId = c.DocumentFileId,
                DisplayName = doc.DisplayName,
                Amount = doc.Amount,
                DocumentDate = doc.DocumentDate,
                Score = c.Score,
                AmountScore = c.AmountScore,
                DateScore = c.DateScore,
                SupplierScore = c.SupplierScore,
                IsStrong = c.IsStrong,
                Reasons = c.Reasons.ToList(),
            };
        }).ToList();
    }

    [Authorize(PlatformPermissions.Documents.ManageMeta)]
    public virtual async Task<DocumentMatchDto> CreateMatchAsync(CreateMatchDto input)
    {
        var file = await _fileRepository.GetAsync(input.DocumentFileId);
        var expense = await _expenseRepository.GetAsync(input.ExpenseId);

        var existing = await _matchRepository.FindAsync(m =>
            m.DocumentFileId == input.DocumentFileId && m.ExpenseId == input.ExpenseId);

        if (existing != null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.DocumentExpenseAlreadyMatched)
                .WithData("DocumentFileId", input.DocumentFileId)
                .WithData("ExpenseId", input.ExpenseId);
        }

        // Skor istemciden geliyorsa güvenilmez; sunucuda yeniden hesaplanır.
        var matchExpense = await ToMatchExpenseAsync(expense);
        var matchDocument = (await LoadMatchDocumentsAsync(file.ProjectId ?? Guid.Empty))
            .FirstOrDefault(d => d.Id == file.Id);

        var score = matchDocument != null
            ? ExpenseMatchScorer.Score(matchDocument, matchExpense).Score
            : 0;

        var match = new DocumentExpenseMatch(
            GuidGenerator.Create(), CurrentTenant.Id, input.DocumentFileId, input.ExpenseId,
            score, MatchSource.Manual, input.AnnexNumber);

        await _matchRepository.InsertAsync(match, autoSave: true);

        // Eşleşen belge "Matched" durumuna geçer — liste ve uygunluk buna bakıyor.
        if (file.Status != DocumentFileStatus.Matched)
        {
            file.ChangeStatus(DocumentFileStatus.Matched);
            await _fileRepository.UpdateAsync(file);
        }

        return new DocumentMatchDto
        {
            Id = match.Id,
            DocumentFileId = file.Id,
            DocumentFileName = file.DisplayName,
            ExpenseId = expense.Id,
            ExpenseTitle = expense.Title,
            ExpenseAmount = expense.Amount,
            Score = match.Score,
            Source = match.Source,
            AnnexNumber = match.AnnexNumber,
        };
    }

    [Authorize(PlatformPermissions.Documents.ManageMeta)]
    public virtual async Task RemoveMatchAsync(Guid matchId)
    {
        var match = await _matchRepository.GetAsync(matchId);
        await _matchRepository.DeleteAsync(match, autoSave: true);

        // Belgenin başka bağı kalmadıysa "Kesin"e döner; "Eşleşti" yanlış olurdu.
        var remaining = await _matchRepository.CountAsync(m => m.DocumentFileId == match.DocumentFileId);
        if (remaining == 0)
        {
            var file = await _fileRepository.FindAsync(match.DocumentFileId);
            if (file != null && file.Status == DocumentFileStatus.Matched)
            {
                file.ChangeStatus(DocumentFileStatus.Final);
                await _fileRepository.UpdateAsync(file);
            }
        }
    }

    public virtual async Task<List<DocumentMatchDto>> GetMatchesAsync(Guid projectId)
    {
        var matches = await GetProjectMatchesAsync(projectId);

        if (matches.Count == 0)
        {
            return new List<DocumentMatchDto>();
        }

        var fileIds = matches.Select(m => m.DocumentFileId).Distinct().ToList();
        var files = (await _fileRepository.GetListAsync(f => fileIds.Contains(f.Id)))
            .ToDictionary(f => f.Id);

        var expenseIds = matches.Select(m => m.ExpenseId).Distinct().ToList();
        var expenses = (await _expenseRepository.GetListAsync(e => expenseIds.Contains(e.Id)))
            .ToDictionary(e => e.Id);

        return matches.Select(m => new DocumentMatchDto
        {
            Id = m.Id,
            DocumentFileId = m.DocumentFileId,
            DocumentFileName = files.GetValueOrDefault(m.DocumentFileId)?.DisplayName ?? "(silinmiş belge)",
            ExpenseId = m.ExpenseId,
            ExpenseTitle = expenses.GetValueOrDefault(m.ExpenseId)?.Title ?? "(silinmiş harcama)",
            ExpenseAmount = expenses.GetValueOrDefault(m.ExpenseId)?.Amount ?? 0m,
            Score = m.Score,
            Source = m.Source,
            AnnexNumber = m.AnnexNumber,
        }).ToList();
    }

    /* ─────────────────────────── Yardımcılar ─────────────────────────── */

    /// <summary>Projedeki tüm eşleşmeler (belge tarafından projeye bağlanır).</summary>
    private async Task<List<DocumentExpenseMatch>> GetProjectMatchesAsync(Guid projectId)
    {
        var fileQueryable = await _fileRepository.GetQueryableAsync();
        var projectFileIds = fileQueryable.Where(f => f.ProjectId == projectId).Select(f => f.Id);

        var matchQueryable = await _matchRepository.GetQueryableAsync();
        return await AsyncExecuter.ToListAsync(
            matchQueryable.AsNoTracking().Where(m => projectFileIds.Contains(m.DocumentFileId)));
    }

    /// <summary>
    /// Belgeleri skorlanabilir hale getirir. Tedarikçi, meta şemadaki
    /// "Relation" tipli tedarikçi alanının metin değerinden okunur.
    /// </summary>
    private async Task<List<MatchDocument>> LoadMatchDocumentsAsync(Guid projectId)
    {
        var fileQueryable = await _fileRepository.GetQueryableAsync();
        var files = await AsyncExecuter.ToListAsync(
            fileQueryable.AsNoTracking()
                .Where(f => f.ProjectId == projectId)
                .Select(f => new { f.Id, f.DisplayName, f.Amount, f.DocumentDate, f.LatestAttachmentId }));

        if (files.Count == 0)
        {
            return new List<MatchDocument>();
        }

        var fileIds = files.Select(f => f.Id).ToList();

        var suppliers = await LoadSupplierValuesAsync(fileIds);

        var attachmentIds = files.Where(f => f.LatestAttachmentId.HasValue)
            .Select(f => f.LatestAttachmentId!.Value).ToList();
        var attachmentQueryable = await _attachmentRepository.GetQueryableAsync();
        var hashes = (await AsyncExecuter.ToListAsync(
                attachmentQueryable.AsNoTracking()
                    .Where(a => attachmentIds.Contains(a.Id))
                    .Select(a => new { a.Id, a.ContentHash })))
            .ToDictionary(a => a.Id, a => a.ContentHash);

        return files.Select(f => new MatchDocument(
            f.Id,
            f.DisplayName,
            f.Amount,
            f.DocumentDate,
            suppliers.GetValueOrDefault(f.Id),
            f.LatestAttachmentId.HasValue ? hashes.GetValueOrDefault(f.LatestAttachmentId.Value) : null)).ToList();
    }

    /// <summary>Belgelerin tedarikçi meta alanı değerleri (anahtar: supplier/counterparty).</summary>
    private async Task<Dictionary<Guid, string?>> LoadSupplierValuesAsync(List<Guid> fileIds)
    {
        var fieldQueryable = await _fieldRepository.GetQueryableAsync();
        var supplierFieldIds = await AsyncExecuter.ToListAsync(
            fieldQueryable.AsNoTracking()
                .Where(f => f.Key == "supplier" || f.Key == "counterparty")
                .Select(f => f.Id));

        if (supplierFieldIds.Count == 0)
        {
            return new Dictionary<Guid, string?>();
        }

        var valueQueryable = await _fieldValueRepository.GetQueryableAsync();
        var values = await AsyncExecuter.ToListAsync(
            valueQueryable.AsNoTracking()
                .Where(v => fileIds.Contains(v.DocumentFileId)
                    && supplierFieldIds.Contains(v.FieldId)
                    && v.ValueText != null)
                .Select(v => new { v.DocumentFileId, v.ValueText }));

        return values
            .GroupBy(v => v.DocumentFileId)
            .ToDictionary(g => g.Key, g => g.First().ValueText);
    }

    private async Task<MatchExpense> ToMatchExpenseAsync(Expense expense)
    {
        string? supplier = null;

        if (expense.CustomerId.HasValue)
        {
            var names = await GetCustomerNamesAsync(new List<Guid> { expense.CustomerId.Value });
            supplier = names.GetValueOrDefault(expense.CustomerId.Value);
        }

        return new MatchExpense(expense.Id, expense.Title, expense.Amount, expense.ExpenseDate, supplier);
    }

    private async Task<Dictionary<Guid, string>> GetCustomerNamesAsync(List<Guid> customerIds)
    {
        if (customerIds.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        var queryable = await _customerRepository.GetQueryableAsync();
        return (await AsyncExecuter.ToListAsync(
                queryable.AsNoTracking().Where(c => customerIds.Contains(c.Id)).Select(c => new { c.Id, c.Name })))
            .ToDictionary(k => k.Id, v => v.Name);
    }

    private async Task<Dictionary<Guid, string>> GetTypeNamesForFilesAsync(List<Guid> fileIds)
    {
        if (fileIds.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        var fileQueryable = await _fileRepository.GetQueryableAsync();
        var pairs = await AsyncExecuter.ToListAsync(
            fileQueryable.AsNoTracking()
                .Where(f => fileIds.Contains(f.Id) && f.DocumentTypeId != null)
                .Select(f => new { f.Id, TypeId = f.DocumentTypeId!.Value }));

        if (pairs.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        var typeIds = pairs.Select(p => p.TypeId).Distinct().ToList();
        var typeQueryable = await _typeRepository.GetQueryableAsync();
        var types = (await AsyncExecuter.ToListAsync(
                typeQueryable.AsNoTracking().Where(t => typeIds.Contains(t.Id)).Select(t => new { t.Id, t.Name })))
            .ToDictionary(k => k.Id, v => v.Name);

        return pairs
            .Where(p => types.ContainsKey(p.TypeId))
            .ToDictionary(p => p.Id, p => types[p.TypeId]);
    }
}
