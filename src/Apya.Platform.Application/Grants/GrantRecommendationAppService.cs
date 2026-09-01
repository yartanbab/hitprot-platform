using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// Kiracı katalog yüzeyi (1d · 9a · 1e) — CANLI hesaplanır, kalıcı değildir.
/// Katalogun TAMAMI döner; uygunluk satır satır <see cref="GrantEligibilityBucket"/> ile
/// işaretlenir. Eşik listeden ELEMEZ, yalnız "Size Önerilen" bloğunu ayırır.
///
/// <para>Katalog (Grant/GrantCall/…) host'ta TenantId=null; okumak için IMultiTenant
/// filtresi geçici kapatılır. 🔴 Filtre kapalıyken TenantId koşulu ELLE konur — aksi
/// halde kiracı başka kiracının kataloğunu görürdü.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantRecommendationAppService : ApplicationService, IGrantRecommendationAppService
{
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantRecommendation, Guid> _hostRecRepo;
    private readonly IRepository<GrantBookmark, Guid> _bookmarkRepo;
    private readonly IRepository<GrantDocumentRequirement, Guid> _documentRepo;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepo;
    private readonly IRepository<GrantStageTemplate, Guid> _templateRepo;
    private readonly IRepository<GrantStageTemplateStep, Guid> _stepRepo;
    private readonly FirmSignalsBuilder _signalsBuilder;
    private readonly GrantMatchManager _matcher;
    private readonly GrantMatchWeightResolver _weightResolver;
    private readonly GrantDifficultyCalculator _difficulty;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantRecommendationAppService(
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantRecommendation, Guid> hostRecRepo,
        IRepository<GrantBookmark, Guid> bookmarkRepo,
        IRepository<GrantDocumentRequirement, Guid> documentRepo,
        IRepository<GrantEligibleCostItem, Guid> costItemRepo,
        IRepository<GrantStageTemplate, Guid> templateRepo,
        IRepository<GrantStageTemplateStep, Guid> stepRepo,
        FirmSignalsBuilder signalsBuilder,
        GrantMatchManager matcher,
        GrantMatchWeightResolver weightResolver,
        GrantDifficultyCalculator difficulty,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _criteriaRepo = criteriaRepo;
        _appRepo = appRepo;
        _hostRecRepo = hostRecRepo;
        _bookmarkRepo = bookmarkRepo;
        _documentRepo = documentRepo;
        _costItemRepo = costItemRepo;
        _templateRepo = templateRepo;
        _stepRepo = stepRepo;
        _signalsBuilder = signalsBuilder;
        _matcher = matcher;
        _weightResolver = weightResolver;
        _difficulty = difficulty;
        _mtFilter = mtFilter;
    }

    public async Task<List<GrantRecommendationDto>> GetMyRecommendationsAsync()
    {
        return (await BuildOpenCallFeedAsync()).Where(r => r.IsRecommended).ToList();
    }

    public Task<List<GrantRecommendationDto>> GetOpenCallsAsync()
    {
        return BuildOpenCallFeedAsync();
    }

    public async Task<bool> ToggleBookmarkAsync(Guid grantCallId)
    {
        var existing = await _bookmarkRepo.FirstOrDefaultAsync(b => b.GrantCallId == grantCallId);
        if (existing != null)
        {
            await _bookmarkRepo.DeleteAsync(existing, autoSave: true);
            return false;
        }

        await _bookmarkRepo.InsertAsync(
            new GrantBookmark(GuidGenerator.Create(), CurrentTenant.Id, grantCallId), autoSave: true);
        return true;
    }

    public async Task<GrantCallDetailDto> GetCallDetailAsync(Guid grantCallId)
    {
        var signals = await _signalsBuilder.BuildAsync(CurrentTenant.Id);
        var applied = (await _appRepo.GetListAsync()).Select(a => a.GrantCallId).ToHashSet();
        var bookmarked = (await _bookmarkRepo.GetListAsync()).Select(b => b.GrantCallId).ToHashSet();
        var today = Clock.Now.Date;

        using (_mtFilter.Disable())
        {
            var call = await _callRepo.FirstOrDefaultAsync(
                c => c.Id == grantCallId && c.Status == GrantCallStatus.Acik && c.TenantId == null);
            if (call == null)
            {
                // Taslak/kapalı çağrı ya da başka kiracının satırı — kiracıya YOK sayılır.
                throw new EntityNotFoundException(typeof(GrantCall), grantCallId);
            }

            var grant = await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null)
                        ?? throw new EntityNotFoundException(typeof(Grant), call.GrantId);
            var tags = await _criteriaRepo.GetListAsync(t => t.GrantId == grant.Id && t.TenantId == null);
            var documents = await _documentRepo.GetListAsync(d => d.GrantId == grant.Id && d.TenantId == null);
            var costItems = await _costItemRepo.GetListAsync(c => c.GrantId == grant.Id && c.TenantId == null);
            var steps = await ResolveStepsAsync(grant.StageTemplateId);

            var weights = await _weightResolver.ResolveAsync(grant.Id);
            var breakdown = _matcher.Explain(signals, grant, tags, weights);
            var eligibility = _matcher.Evaluate(signals, grant, today);
            var days = DaysRemaining(call, today);
            var difficulty = _difficulty.Calculate(
                grant, documents.Count, documents.Any(d => d.RequiresESignature), steps.Count, days);

            return new GrantCallDetailDto
            {
                GrantCallId = call.Id,
                GrantId = grant.Id,
                GrantName = grant.Name,
                Issuer = grant.Issuer,
                Description = grant.Description,
                SourceUrl = grant.SourceUrl,
                Period = call.Period,
                Deadline = call.Deadline,
                DaysRemaining = days,
                MaxAmount = grant.MaxAmount,
                SupportRatePercent = grant.SupportRatePercent,
                CoFinancingRatePercent = grant.SupportRatePercent.HasValue
                    ? 100 - grant.SupportRatePercent.Value
                    : null,
                ProjectDurationMonths = grant.ProjectDurationMonths,
                RepaymentType = grant.RepaymentType,
                HasAdvancePayment = grant.HasAdvancePayment,
                RequiresGuaranteeLetter = grant.RequiresGuaranteeLetter,
                Bucket = eligibility.Bucket,
                Rules = eligibility.Rules
                    .Select(r =>
                    {
                        var (firmValue, grantValue) = RuleValues(r.Rule, signals, grant, today);
                        return new GrantRuleCheckDto
                        {
                            Rule = r.Rule,
                            Outcome = r.Outcome,
                            FirmValue = firmValue,
                            GrantValue = grantValue
                        };
                    })
                    .ToList(),
                // "Eksik iki şart eleyici değil" notu: eleyen kural yokken gösterilir.
                MissingRulesAreNotBlocking = eligibility.UnknownCount > 0 && eligibility.IsEligible,
                CostItems = costItems
                    .OrderBy(c => c.Kind)
                    .Select(c => new GrantEligibleCostItemDto { Kind = c.Kind, LimitPercent = c.LimitPercent })
                    .ToList(),
                StageSteps = steps
                    .Select(s => new GrantStageTemplateStepDto
                    {
                        Order = s.Order,
                        Name = s.Name,
                        Note = s.Note,
                        Owner = s.Owner,
                        RequiredDocumentsNote = s.RequiredDocumentsNote,
                        CompletionCondition = s.CompletionCondition,
                        ReminderDays = s.ReminderDays
                    })
                    .ToList(),
                Documents = documents
                    .OrderBy(d => d.Order)
                    .Select(d => new GrantDocumentRequirementDto
                    {
                        Order = d.Order,
                        Name = d.Name,
                        Obligation = d.Obligation,
                        UploaderParty = d.UploaderParty,
                        RequiresESignature = d.RequiresESignature
                    })
                    .ToList(),
                Score = breakdown.Total,
                ScoreDimensions = breakdown.Dimensions
                    .Select(d => new GrantScoreDimensionDto
                    {
                        Dimension = d.Dimension,
                        Value = d.Value,
                        Weight = d.Weight
                    })
                    .ToList(),
                Difficulty = difficulty.Level,
                DifficultyReasons = difficulty.Reasons.ToList(),
                IsHard = difficulty.IsHard,
                Similar = await BuildSimilarAsync(call, grant, signals, today),
                AlreadyApplied = applied.Contains(call.Id),
                IsBookmarked = bookmarked.Contains(call.Id)
            };
        }
    }

    /// <summary>Aynı kurumun ya da en yüksek skorlu diğer açık çağrılar (en fazla 3).</summary>
    private async Task<List<GrantSimilarCallDto>> BuildSimilarAsync(
        GrantCall call, Grant grant, FirmSignals signals, DateTime today)
    {
        var others = await _callRepo.GetListAsync(
            c => c.Status == GrantCallStatus.Acik && c.TenantId == null && c.Id != call.Id);
        if (others.Count == 0)
        {
            return new List<GrantSimilarCallDto>();
        }

        var grantIds = others.Select(c => c.GrantId).Distinct().ToList();
        var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id) && g.TenantId == null))
            .ToDictionary(g => g.Id);
        var tagsByGrant = (await _criteriaRepo.GetListAsync(t => grantIds.Contains(t.GrantId) && t.TenantId == null))
            .GroupBy(t => t.GrantId)
            .ToDictionary(g => g.Key, g => (IReadOnlyList<GrantCriteriaTag>)g.ToList());
        var weights = await _weightResolver.ResolveManyAsync(grantIds);

        return others
            .Where(c => grants.ContainsKey(c.GrantId))
            .Select(c =>
            {
                var g = grants[c.GrantId];
                var tags = tagsByGrant.TryGetValue(g.Id, out var t) ? t : new List<GrantCriteriaTag>();
                return new GrantSimilarCallDto
                {
                    GrantCallId = c.Id,
                    GrantName = g.Name,
                    Issuer = g.Issuer,
                    Score = _matcher.Score(signals, g, tags, weights[g.Id])
                };
            })
            // Aynı kurumun çağrıları önce, sonra skor.
            .OrderByDescending(s => s.Issuer == grant.Issuer)
            .ThenByDescending(s => s.Score)
            .Take(3)
            .ToList();
    }

    private async Task<List<GrantStageTemplateStep>> ResolveStepsAsync(Guid? templateId)
    {
        // Programın şablonu yoksa varsayılan şablon gösterilir (3b tohumu).
        var id = templateId;
        if (id == null)
        {
            var def = await _templateRepo.FirstOrDefaultAsync(t => t.IsDefault);
            id = def?.Id;
        }
        if (id == null)
        {
            return new List<GrantStageTemplateStep>();
        }
        return (await _stepRepo.GetListAsync(s => s.StageTemplateId == id.Value))
            .OrderBy(s => s.Order)
            .ToList();
    }

    private async Task<List<GrantRecommendationDto>> BuildOpenCallFeedAsync()
    {
        // 1) Firma sinyalleri (profil + proje geçmişi).
        var signals = await _signalsBuilder.BuildAsync(CurrentTenant.Id);

        // 2) Başvurduğum çağrılar + takip ettiklerim (tenant-scoped).
        var appliedIds = (await _appRepo.GetListAsync()).Select(a => a.GrantCallId).ToHashSet();
        var bookmarkedIds = (await _bookmarkRepo.GetListAsync()).Select(b => b.GrantCallId).ToHashSet();

        // 2b) Host'un gönderdiği aktif öneriler (B3, tenant-scoped, Dismissed hariç).
        var hostRecCallIds = (await _hostRecRepo.GetListAsync(
                r => r.Source == GrantRecommendationSource.Host && r.Status != GrantRecommendationStatus.Dismissed))
            .Select(r => r.GrantCallId)
            .ToHashSet();

        // 3) Katalog (host TenantId=null → filtreyi kapat).
        // 🔴 Filtre kapalıyken TenantId koşulu ELLE konur: aksi halde sorgu TÜM kiracıların
        // çağrılarını döndürür ve kiracı, başka kiracının kataloğunu görür. Filtre yalnız
        // host satırlarına ERİŞMEK için kapatılıyor, kapsamı genişletmek için değil.
        var result = new List<GrantRecommendationDto>();
        using (_mtFilter.Disable())
        {
            var openCalls = await _callRepo.GetListAsync(
                c => c.Status == GrantCallStatus.Acik && c.TenantId == null);
            if (openCalls.Count == 0)
            {
                return result;
            }

            var grantIds = openCalls.Select(c => c.GrantId).Distinct().ToList();
            var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id) && g.TenantId == null))
                .ToDictionary(g => g.Id);
            var tagsByGrant = (await _criteriaRepo.GetListAsync(t => grantIds.Contains(t.GrantId) && t.TenantId == null))
                .GroupBy(t => t.GrantId)
                .ToDictionary(g => g.Key, g => (IReadOnlyList<GrantCriteriaTag>)g.ToList());
            var docsByGrant = (await _documentRepo.GetListAsync(d => grantIds.Contains(d.GrantId) && d.TenantId == null))
                .GroupBy(d => d.GrantId)
                .ToDictionary(g => g.Key, g => g.ToList());
            var stepCountByTemplate = (await _stepRepo.GetListAsync())
                .GroupBy(s => s.StageTemplateId)
                .ToDictionary(g => g.Key, g => g.Count());
            var weightsByGrant = await _weightResolver.ResolveManyAsync(grantIds);

            var today = Clock.Now.Date;
            foreach (var call in openCalls)
            {
                if (!grants.TryGetValue(call.GrantId, out var grant))
                {
                    continue;
                }
                var gtags = tagsByGrant.TryGetValue(call.GrantId, out var lst)
                    ? lst : (IReadOnlyList<GrantCriteriaTag>)new List<GrantCriteriaTag>();
                var docs = docsByGrant.GetValueOrDefault(grant.Id) ?? new List<GrantDocumentRequirement>();
                var stepCount = grant.StageTemplateId.HasValue
                    ? stepCountByTemplate.GetValueOrDefault(grant.StageTemplateId.Value)
                    : 0;

                var score = _matcher.Score(signals, grant, gtags, weightsByGrant[grant.Id]);
                var eligibility = _matcher.Evaluate(signals, grant, today);
                var days = DaysRemaining(call, today);
                var isHostRecommended = hostRecCallIds.Contains(call.Id);

                var reasonRule = ReasonRuleOf(eligibility);
                var (reasonFirm, reasonGrant) = reasonRule.HasValue
                    ? RuleValues(reasonRule.Value, signals, grant, today)
                    : (null, null);

                result.Add(new GrantRecommendationDto
                {
                    GrantCallId = call.Id,
                    GrantId = grant.Id,
                    GrantName = grant.Name,
                    Issuer = grant.Issuer,
                    Period = call.Period,
                    Deadline = call.Deadline,
                    DaysRemaining = days,
                    MaxAmount = grant.MaxAmount,
                    SupportRatePercent = grant.SupportRatePercent,
                    Score = score,
                    AlreadyApplied = appliedIds.Contains(call.Id),
                    IsHostRecommended = isHostRecommended,
                    IsRecommended = score >= grant.MinMatchScore || isHostRecommended,
                    Bucket = eligibility.Bucket,
                    PassedRules = RulesWith(eligibility, GrantRuleOutcome.Passed),
                    FailedRules = RulesWith(eligibility, GrantRuleOutcome.Failed),
                    UnknownRules = RulesWith(eligibility, GrantRuleOutcome.Unknown),
                    ReasonRule = reasonRule,
                    ReasonFirmValue = reasonFirm,
                    ReasonGrantValue = reasonGrant,
                    IsFixable = eligibility.IsFixable,
                    Difficulty = _difficulty
                        .Calculate(grant, docs.Count, docs.Any(d => d.RequiresESignature), stepCount, days)
                        .Level,
                    IsBookmarked = bookmarkedIds.Contains(call.Id)
                });
            }
        }

        return result
            .OrderByDescending(r => r.IsRecommended)
            .ThenBy(r => r.Bucket)
            .ThenByDescending(r => r.Score)
            .ThenBy(r => r.DaysRemaining ?? int.MaxValue)
            .ToList();
    }

    private static int? DaysRemaining(GrantCall call, DateTime today)
        => call.Deadline.HasValue ? (int)(call.Deadline.Value.Date - today).TotalDays : null;

    private static List<GrantEligibilityRule> RulesWith(GrantEligibilityResult r, GrantRuleOutcome outcome)
        => r.Rules.Where(x => x.Outcome == outcome).Select(x => x.Rule).OrderBy(x => x).ToList();

    /// <summary>Tek satırlık gerekçenin dayanacağı şart: önce eleyen, yoksa ölçülemeyen.</summary>
    private static GrantEligibilityRule? ReasonRuleOf(GrantEligibilityResult r)
    {
        var failed = r.Rules.Where(x => x.Outcome == GrantRuleOutcome.Failed).OrderBy(x => x.Rule).ToList();
        if (failed.Count > 0)
        {
            return failed[0].Rule;
        }
        var unknown = r.Rules.Where(x => x.Outcome == GrantRuleOutcome.Unknown).OrderBy(x => x.Rule).ToList();
        return unknown.Count > 0 ? unknown[0].Rule : null;
    }

    /// <summary>
    /// Gerekçe ve uygunluk tablosu için (firmadaki değer, programın istediği) çifti.
    /// Metin üretilmez — istemci bu değerlerle yerelleştirilmiş cümleyi kurar.
    /// </summary>
    private static (string? FirmValue, string? GrantValue) RuleValues(
        GrantEligibilityRule rule, FirmSignals firm, Grant grant, DateTime today)
    {
        var c = CultureInfo.InvariantCulture;
        return rule switch
        {
            GrantEligibilityRule.CompanySize => (
                firm.Size.HasValue ? ((int)firm.Size.Value).ToString(c) : null,
                grant.EligibleCompanySizes.ToString(c)),
            GrantEligibilityRule.CompanyAge => (
                firm.FoundedOn.HasValue ? YearsSince(firm.FoundedOn.Value, today).ToString(c) : null,
                Range(grant.MinCompanyAgeYears, grant.MaxCompanyAgeYears)),
            GrantEligibilityRule.Trl => (
                firm.Trl?.ToString(c),
                Range(grant.MinTrl, grant.MaxTrl)),
            GrantEligibilityRule.StaffCount => (
                firm.StaffCount?.ToString(c),
                grant.MinStaffCount?.ToString(c)),
            GrantEligibilityRule.RdStaffCount => (
                firm.RdStaffCount?.ToString(c),
                grant.MinRdStaffCount?.ToString(c)),
            GrantEligibilityRule.Revenue => (
                firm.AnnualRevenue?.ToString(c),
                Range(grant.MinRevenue, grant.MaxRevenue)),
            GrantEligibilityRule.Consortium => (
                firm.HasConsortiumPartner?.ToString().ToLowerInvariant(),
                grant.MinConsortiumPartners?.ToString(c) ?? "1"),
            _ => (null, null)
        };
    }

    /// <summary>
    /// Açık uçlu aralık okunabilir yazılır: yalnız alt sınır varsa "2+", yalnız üst sınır
    /// varsa "≤7". Ham "2-" biçimi kullanıcıya yarım cümle gibi görünüyordu.
    /// </summary>
    private static string? Range<T>(T? min, T? max) where T : struct
        => (min, max) switch
        {
            (null, null) => null,
            (not null, null) => $"{min}+",
            (null, not null) => $"≤{max}",
            _ => $"{min}-{max}"
        };

    private static int YearsSince(DateTime from, DateTime today)
    {
        var years = today.Year - from.Year;
        if (from.Date > today.AddYears(-years))
        {
            years--;
        }
        return years < 0 ? 0 : years;
    }
}
