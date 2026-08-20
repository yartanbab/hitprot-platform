using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.Expenses;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;

namespace Apya.Platform.Documents;

/// <summary>
/// Sınıflandırma önerileri.
///
/// KAYNAK: yeni bir tahmin mantığı YOK. Öneriler modülün zaten sahip olduğu iki
/// motordan üretilir — kural motorunun planı (<see cref="DocumentRuleEvaluator"/>)
/// ve harcama eşleşme skorlayıcısı (<see cref="ExpenseMatchScorer"/>). Böylece
/// kullanıcının gördüğü öneri ile kural açtığında olacak şey aynı yerden gelir.
///
/// SAKLAMA: öneriler saklanmaz, her okumada hesaplanır (uygunluk ile aynı
/// tasarım). Veritabanında yalnız veriden türetilemeyen karar durur: reddetme.
///
/// OTOMATİK UYGULAMA YOK: 100 puanlık öneri bile onay ister. Otomatik davranış
/// isteyen kullanıcı kuralı açar — o zaman sorumluluk açıkça kuraldadır.
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class DocumentSuggestionAppService : ApplicationService, IDocumentSuggestionAppService
{
    /// <summary>Şerit için üst sınır — yüzlerce öneri kullanıcıya karar aldırmaz.</summary>
    private const int MaxSuggestions = 50;

    private readonly IRepository<DocumentFile, Guid> _fileRepository;
    private readonly IRepository<Document, Guid> _documentRepository;
    private readonly IRepository<DocumentType, Guid> _typeRepository;
    private readonly IRepository<DocumentRule, Guid> _ruleRepository;
    private readonly IRepository<DocumentRuleCondition, Guid> _conditionRepository;
    private readonly IRepository<DocumentRuleAction, Guid> _actionRepository;
    private readonly IRepository<DocumentSuggestionDismissal, Guid> _dismissalRepository;
    private readonly IRepository<DocumentExpenseMatch, Guid> _matchRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;
    private readonly IRepository<ProjectWorkStep, Guid> _workStepRepository;
    private readonly IDocumentMatchingAppService _matchingAppService;

    public DocumentSuggestionAppService(
        IRepository<DocumentFile, Guid> fileRepository,
        IRepository<Document, Guid> documentRepository,
        IRepository<DocumentType, Guid> typeRepository,
        IRepository<DocumentRule, Guid> ruleRepository,
        IRepository<DocumentRuleCondition, Guid> conditionRepository,
        IRepository<DocumentRuleAction, Guid> actionRepository,
        IRepository<DocumentSuggestionDismissal, Guid> dismissalRepository,
        IRepository<DocumentExpenseMatch, Guid> matchRepository,
        IRepository<Expense, Guid> expenseRepository,
        IRepository<ProjectWorkStep, Guid> workStepRepository,
        IDocumentMatchingAppService matchingAppService)
    {
        _fileRepository = fileRepository;
        _documentRepository = documentRepository;
        _typeRepository = typeRepository;
        _ruleRepository = ruleRepository;
        _conditionRepository = conditionRepository;
        _actionRepository = actionRepository;
        _dismissalRepository = dismissalRepository;
        _matchRepository = matchRepository;
        _expenseRepository = expenseRepository;
        _workStepRepository = workStepRepository;
        _matchingAppService = matchingAppService;
    }

    public virtual async Task<DocumentSuggestionSummaryDto> GetPendingAsync(Guid? projectId = null)
    {
        var suggestions = await BuildAsync(projectId);

        if (suggestions.Count == 0)
        {
            return new DocumentSuggestionSummaryDto();
        }

        var fileIds = suggestions.Select(s => s.DocumentFileId).Distinct().ToList();

        var fileNames = (await AsyncExecuter.ToListAsync(
                (await _fileRepository.GetQueryableAsync()).AsNoTracking()
                    .Where(f => fileIds.Contains(f.Id))
                    .Select(f => new { f.Id, f.DisplayName })))
            .ToDictionary(k => k.Id, v => v.DisplayName);

        var targetNames = await ResolveTargetNamesAsync(suggestions);

        var items = suggestions
            .Take(MaxSuggestions)
            .Select(s => new DocumentSuggestionDto
            {
                DocumentFileId = s.DocumentFileId,
                DocumentFileName = fileNames.GetValueOrDefault(s.DocumentFileId) ?? "(silinmiş belge)",
                Kind = s.Kind,
                Payload = s.Payload,
                TargetName = targetNames.GetValueOrDefault(TargetKey(s)),
                Reason = s.Reason,
                Confidence = s.Confidence,
            })
            .ToList();

        return new DocumentSuggestionSummaryDto
        {
            Items = items,
            DocumentCount = items.Select(i => i.DocumentFileId).Distinct().Count(),
        };
    }

    public virtual async Task<int> ApplyAsync(ApplyDocumentSuggestionsDto input)
    {
        if (input.Suggestions.Count == 0)
        {
            return 0;
        }

        var applied = 0;

        foreach (var reference in input.Suggestions)
        {
            var file = await _fileRepository.FindAsync(reference.DocumentFileId);

            // Kilitli belgeye öneri de dokunamaz — kilit kullanıcı kararıdır ve
            // kural motorunda da aynı kural geçerli.
            if (file == null || file.IsLocked)
            {
                continue;
            }

            switch (reference.Kind)
            {
                case DocumentSuggestionKind.Folder
                    when DocumentSuggestionBuilder.PayloadAsGuid(reference.Payload) is { } folderId:
                    file.MoveTo(folderId);
                    break;

                case DocumentSuggestionKind.DocumentType
                    when DocumentSuggestionBuilder.PayloadAsGuid(reference.Payload) is { } typeId:
                    file.SetClassification(typeId, file.ProjectId, file.WorkStepId);
                    break;

                case DocumentSuggestionKind.WorkStep
                    when DocumentSuggestionBuilder.PayloadAsGuid(reference.Payload) is { } stepId:
                    file.SetClassification(file.DocumentTypeId, file.ProjectId, stepId);
                    break;

                case DocumentSuggestionKind.PeriodCode
                    when DocumentSuggestionBuilder.PayloadAsText(reference.Payload) is { } period:
                    file.SetDates(file.DocumentDate, period, file.ExpiryDate);
                    break;

                case DocumentSuggestionKind.Expense
                    when DocumentSuggestionBuilder.PayloadAsGuid(reference.Payload) is { } expenseId:
                    // Eşleştirme kendi servisinde: EK numarası, çift kayıt kontrolü
                    // ve denetim izi orada yaşıyor.
                    await _matchingAppService.CreateMatchAsync(new CreateMatchDto
                    {
                        DocumentFileId = file.Id,
                        ExpenseId = expenseId,
                    });
                    applied++;
                    continue;

                default:
                    continue;
            }

            await _fileRepository.UpdateAsync(file);
            applied++;
        }

        return applied;
    }

    public virtual async Task DismissAsync(ApplyDocumentSuggestionsDto input)
    {
        foreach (var reference in input.Suggestions)
        {
            var key = DocumentSuggestionBuilder.KeyOf(new DocumentSuggestion(
                reference.DocumentFileId, reference.Kind, reference.Payload, string.Empty, 0));

            var exists = await _dismissalRepository.AnyAsync(d =>
                d.DocumentFileId == reference.DocumentFileId && d.SuggestionKey == key);

            if (exists)
            {
                continue;
            }

            await _dismissalRepository.InsertAsync(new DocumentSuggestionDismissal(
                GuidGenerator.Create(), CurrentTenant.Id, reference.DocumentFileId, key));
        }
    }

    /* ─────────────────────────── Üretim ─────────────────────────── */

    private async Task<List<DocumentSuggestion>> BuildAsync(Guid? projectId)
    {
        var suggestions = new List<DocumentSuggestion>();

        suggestions.AddRange(await BuildFromRulesAsync());
        suggestions.AddRange(await BuildFromExpensesAsync(projectId));

        if (suggestions.Count == 0)
        {
            return suggestions;
        }

        // Proje bağlamı verildiyse yalnız o projenin belgeleri.
        if (projectId.HasValue)
        {
            var projectFileIds = (await AsyncExecuter.ToListAsync(
                    (await _fileRepository.GetQueryableAsync()).AsNoTracking()
                        .Where(f => f.ProjectId == projectId.Value)
                        .Select(f => f.Id)))
                .ToHashSet();

            suggestions = suggestions.Where(s => projectFileIds.Contains(s.DocumentFileId)).ToList();
        }

        var deduped = DocumentSuggestionBuilder.Deduplicate(suggestions);

        var fileIds = deduped.Select(s => s.DocumentFileId).Distinct().ToList();
        var dismissed = (await _dismissalRepository.GetListAsync(d => fileIds.Contains(d.DocumentFileId)))
            .Select(d => (d.DocumentFileId, d.SuggestionKey))
            .ToHashSet();

        return deduped
            .Where(s => !dismissed.Contains((s.DocumentFileId, DocumentSuggestionBuilder.KeyOf(s))))
            .ToList();
    }

    /// <summary>
    /// AÇIK kuralların planı. Kapalı kural öneri üretmez: kullanıcı onu bilerek
    /// kapatmış, önerisini geri getirmek kararını görmezden gelmek olurdu.
    /// </summary>
    private async Task<List<DocumentSuggestion>> BuildFromRulesAsync()
    {
        var rules = (await _ruleRepository.GetListAsync(r => r.IsEnabled))
            .OrderBy(r => r.Order)
            .ToList();

        if (rules.Count == 0)
        {
            return new List<DocumentSuggestion>();
        }

        var documents = await LoadRuleDocumentsAsync();
        if (documents.Count == 0)
        {
            return new List<DocumentSuggestion>();
        }

        var ruleIds = rules.Select(r => r.Id).ToList();
        var conditions = (await _conditionRepository.GetListAsync(c => ruleIds.Contains(c.RuleId))).ToList();
        var actions = (await _actionRepository.GetListAsync(a => ruleIds.Contains(a.RuleId))).ToList();

        var result = new List<DocumentSuggestion>();

        foreach (var rule in rules)
        {
            var plan = DocumentRuleEvaluator.Plan(
                rule,
                conditions.Where(c => c.RuleId == rule.Id).OrderBy(c => c.Order).ToList(),
                actions.Where(a => a.RuleId == rule.Id).OrderBy(a => a.Order).ToList(),
                documents);

            result.AddRange(DocumentSuggestionBuilder.FromRulePlan(rule.Name, plan));
        }

        return result;
    }

    /// <summary>
    /// Henüz hiçbir harcamaya bağlanmamış, tutarı olan belgeler için en iyi aday.
    /// Zaten eşleşmiş belge öneri üretmez.
    /// </summary>
    private async Task<List<DocumentSuggestion>> BuildFromExpensesAsync(Guid? projectId)
    {
        var matchedFileIds = (await AsyncExecuter.ToListAsync(
                (await _matchRepository.GetQueryableAsync()).AsNoTracking().Select(m => m.DocumentFileId)))
            .ToHashSet();

        var fileQueryable = (await _fileRepository.GetQueryableAsync()).AsNoTracking()
            .Where(f => f.Amount != null && f.ProjectId != null);

        if (projectId.HasValue)
        {
            fileQueryable = fileQueryable.Where(f => f.ProjectId == projectId.Value);
        }

        var files = (await AsyncExecuter.ToListAsync(fileQueryable
                .Select(f => new { f.Id, f.DisplayName, f.Amount, f.DocumentDate, f.ProjectId })))
            .Where(f => !matchedFileIds.Contains(f.Id))
            .Take(MaxSuggestions)
            .ToList();

        if (files.Count == 0)
        {
            return new List<DocumentSuggestion>();
        }

        var projectIds = files.Select(f => f.ProjectId!.Value).Distinct().ToList();
        var expenses = await AsyncExecuter.ToListAsync(
            (await _expenseRepository.GetQueryableAsync()).AsNoTracking()
                .Where(e => e.ProjectId != null && projectIds.Contains(e.ProjectId.Value))
                .Select(e => new { e.Id, e.Title, e.Amount, e.ExpenseDate, e.ProjectId }));

        var result = new List<DocumentSuggestion>();

        foreach (var file in files)
        {
            // Tedarikçi meta alanı burada okunmuyor: skorun tedarikçi bileşeni
            // olmadan da tutar+tarih eşiği geçebiliyor; okumak N+1 sorgu demekti.
            var document = new MatchDocument(file.Id, file.DisplayName, file.Amount, file.DocumentDate, null, null);

            var candidates = expenses
                .Where(e => e.ProjectId == file.ProjectId)
                .Select(e => ExpenseMatchScorer.Score(
                    document, new MatchExpense(e.Id, e.Title, e.Amount, e.ExpenseDate, null)))
                .ToList();

            result.AddRange(DocumentSuggestionBuilder.FromMatchCandidates(file.Id, candidates));
        }

        return result;
    }

    private async Task<List<RuleDocument>> LoadRuleDocumentsAsync()
    {
        var files = await AsyncExecuter.ToListAsync(
            (await _fileRepository.GetQueryableAsync()).AsNoTracking().Select(f => new
            {
                f.Id, f.DisplayName, f.DocumentId, f.DocumentTypeId, f.Amount,
                f.PeriodCode, f.Status, f.WorkStepId, f.ExpiryDate,
            }));

        return files.Select(f => new RuleDocument(
            f.Id, f.DisplayName, f.DocumentId, f.DocumentTypeId, f.Amount,
            f.PeriodCode, f.Status, f.WorkStepId, f.ExpiryDate,
            // Zorunlu alan sayımı öneri üretiminde kullanılmıyor; kural koşulu
            // bunu isterse gerçek sayım gerekir (bkz. DocumentAdminAppService).
            MissingRequiredFieldCount: 0)).ToList();
    }

    /* ─────────────────────────── Hedef adları ─────────────────────────── */

    private static string TargetKey(DocumentSuggestion suggestion)
        => $"{(int)suggestion.Kind}:{suggestion.Payload}";

    private async Task<Dictionary<string, string>> ResolveTargetNamesAsync(List<DocumentSuggestion> suggestions)
    {
        var names = new Dictionary<string, string>();

        async Task FillAsync<TKey>(
            DocumentSuggestionKind kind,
            Func<List<Guid>, Task<Dictionary<Guid, string>>> loader)
        {
            var ids = suggestions
                .Where(s => s.Kind == kind)
                .Select(s => DocumentSuggestionBuilder.PayloadAsGuid(s.Payload))
                .Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();

            if (ids.Count == 0)
            {
                return;
            }

            foreach (var (id, name) in await loader(ids))
            {
                names[$"{(int)kind}:{id}"] = name;
            }
        }

        await FillAsync<Guid>(DocumentSuggestionKind.Folder, async ids =>
            (await AsyncExecuter.ToListAsync((await _documentRepository.GetQueryableAsync()).AsNoTracking()
                .Where(d => ids.Contains(d.Id)).Select(d => new { d.Id, d.Title })))
                .ToDictionary(k => k.Id, v => v.Title));

        await FillAsync<Guid>(DocumentSuggestionKind.DocumentType, async ids =>
            (await AsyncExecuter.ToListAsync((await _typeRepository.GetQueryableAsync()).AsNoTracking()
                .Where(t => ids.Contains(t.Id)).Select(t => new { t.Id, t.Name })))
                .ToDictionary(k => k.Id, v => v.Name));

        await FillAsync<Guid>(DocumentSuggestionKind.WorkStep, async ids =>
            (await AsyncExecuter.ToListAsync((await _workStepRepository.GetQueryableAsync()).AsNoTracking()
                .Where(s => ids.Contains(s.Id)).Select(s => new { s.Id, s.Order, s.Name })))
                .ToDictionary(k => k.Id, v => $"{v.Order} · {v.Name}"));

        await FillAsync<Guid>(DocumentSuggestionKind.Expense, async ids =>
            (await AsyncExecuter.ToListAsync((await _expenseRepository.GetQueryableAsync()).AsNoTracking()
                .Where(e => ids.Contains(e.Id)).Select(e => new { e.Id, e.Title })))
                .ToDictionary(k => k.Id, v => v.Title));

        // Dönem kodu zaten okunur bir metin; ayrıca çözülmesine gerek yok.
        foreach (var suggestion in suggestions.Where(s => s.Kind == DocumentSuggestionKind.PeriodCode))
        {
            names[TargetKey(suggestion)] = suggestion.Payload ?? string.Empty;
        }

        return names;
    }
}
