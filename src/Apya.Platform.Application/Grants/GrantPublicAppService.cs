using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 1f / 1g / 5b · Kamuya açık hibe yüzeyi.
///
/// <para>🔴 ANONİM. İki koruma birlikte uygulanır: kiracı filtresi kapatılıp
/// <c>TenantId == null</c> koşulu ELLE konur (filtre kapatmak kapsamı tüm
/// kiracılara açar) ve yalnız <see cref="GrantCallStatus.Acik"/> çağrılar okunur.
/// Taslak çağrı hiçbir kamu yüzeyinde görünmez.</para>
///
/// <para>🔴 E-POSTA DUVARI YOK: <see cref="EvaluateAsync"/> hiçbir kayıt açmaz,
/// sonucu doğrudan döner. Talep ancak ziyaretçi CTA'ya basınca oluşur.</para>
///
/// <para>🔴 HTTP API olarak AÇILMAZ (<c>RemoteService(false)</c>) — emsal
/// <c>DemoRequestAppService</c>: yazma oturumsuz ve IP yalnız Web sınırında
/// güvenilir yakalanır; açık bir uç formu atlayıp kayıt üretmeye izin verirdi.
/// Kamu sayfaları bu servisi kendi sayfa işleyicilerinden çağırır.</para>
/// </summary>
[AllowAnonymous]
[RemoteService(false)]
public class GrantPublicAppService : PlatformAppService, IGrantPublicAppService
{
    /// <summary>1f hero'sundaki "30 günde kapanan" sayacı.</summary>
    public const int ClosingSoonDays = 30;

    /// <summary>Arama sonucunda dönecek en fazla satır.</summary>
    public const int MaxResults = 60;

    /// <summary>Detayda gösterilecek benzer çağrı sayısı.</summary>
    public const int SimilarCount = 3;

    /// <summary>Bu zorluğun altındaki çağrıda danışmanlık ÖNERİLMEZ.</summary>
    public const int ConsultingDifficultyFloor = 3;

    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costRepo;
    private readonly IRepository<GrantDocumentRequirement, Guid> _docRepo;
    private readonly IRepository<GrantStageTemplateStep, Guid> _stepRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _tagRepo;
    private readonly IRepository<GrantLead, Guid> _leadRepo;
    private readonly GrantMatchManager _matcher;
    private readonly GrantMatchWeightResolver _weightResolver;
    private readonly GrantDifficultyCalculator _difficulty;
    private readonly GrantLeadManager _leadManager;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantPublicAppService(
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantEligibleCostItem, Guid> costRepo,
        IRepository<GrantDocumentRequirement, Guid> docRepo,
        IRepository<GrantStageTemplateStep, Guid> stepRepo,
        IRepository<GrantCriteriaTag, Guid> tagRepo,
        IRepository<GrantLead, Guid> leadRepo,
        GrantMatchManager matcher,
        GrantMatchWeightResolver weightResolver,
        GrantDifficultyCalculator difficulty,
        GrantLeadManager leadManager,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _costRepo = costRepo;
        _docRepo = docRepo;
        _stepRepo = stepRepo;
        _tagRepo = tagRepo;
        _leadRepo = leadRepo;
        _matcher = matcher;
        _weightResolver = weightResolver;
        _difficulty = difficulty;
        _leadManager = leadManager;
        _mtFilter = mtFilter;
    }

    // ─────────────────────────────────────────────── 1f

    public async Task<GrantPublicSearchResultDto> SearchAsync(GrantPublicSearchInput input)
    {
        var today = Clock.Now.Date;
        var (calls, grants) = await ReadOpenCatalogAsync();

        var rows = new List<(GrantPublicCallDto Dto, Grant Grant)>();
        foreach (var call in calls)
        {
            if (!grants.TryGetValue(call.GrantId, out var grant)) { continue; }
            rows.Add((await MapCallAsync(call, grant, today), grant));
        }

        var dto = new GrantPublicSearchResultDto
        {
            TotalOpenCount = rows.Count,
            TotalBudget = rows.Sum(r => r.Dto.MaxAmount ?? 0m),
            ClosingSoonCount = rows.Count(r => r.Dto.DaysRemaining is >= 0 and <= ClosingSoonDays),
            LastUpdatedAt = calls.Count == 0 ? null : calls.Max(c => c.LastModificationTime ?? c.CreationTime),
            // Sayaçlar SÜZGEÇTEN ÖNCE hesaplanır: kullanıcı bir kurumu seçtiğinde
            // diğer kurumların sayısı sıfıra düşerse panel kullanılamaz hâle gelir.
            IssuerFacets = rows
                .GroupBy(r => r.Grant.Issuer)
                .Select(g => new GrantPublicFacetDto { Value = g.Key, Count = g.Count() })
                .OrderByDescending(f => f.Count).ThenBy(f => f.Value)
                .ToList()
        };

        dto.Items = rows
            .Where(r => Matches(r, input))
            .Select(r => r.Dto)
            .OrderBy(c => c.DaysRemaining ?? int.MaxValue)
            .Take(MaxResults)
            .ToList();

        return dto;
    }

    private static bool Matches((GrantPublicCallDto Dto, Grant Grant) row, GrantPublicSearchInput input)
    {
        var (dto, grant) = row;

        if (!input.Query.IsNullOrWhiteSpace())
        {
            var q = input.Query!.Trim();
            var hit = grant.Name.Contains(q, StringComparison.OrdinalIgnoreCase)
                      || grant.Issuer.Contains(q, StringComparison.OrdinalIgnoreCase)
                      || (grant.Description?.Contains(q, StringComparison.OrdinalIgnoreCase) ?? false);
            if (!hit) { return false; }
        }

        if (input.Issuers.Count > 0 && !input.Issuers.Contains(grant.Issuer)) { return false; }
        if (input.MinAmount.HasValue && (dto.MaxAmount ?? 0m) < input.MinAmount.Value) { return false; }
        if (input.MaxAmount.HasValue && (dto.MaxAmount ?? 0m) > input.MaxAmount.Value) { return false; }
        if (input.Difficulties.Count > 0 && !input.Difficulties.Contains(dto.Difficulty)) { return false; }

        if (input.DeadlineWithinDays.HasValue
            && (dto.DaysRemaining == null || dto.DaysRemaining > input.DeadlineWithinDays.Value))
        {
            return false;
        }

        // Ölçek kısıtı OLMAYAN çağrı (maske 0) her ölçeğe uyar; süzgeçten düşürülmez.
        if (input.Sizes.Count > 0 && dto.EligibleSizes.Count > 0
            && !dto.EligibleSizes.Intersect(input.Sizes).Any())
        {
            return false;
        }

        return true;
    }

    // ─────────────────────────────────────────────── 1g

    public async Task<GrantPublicDetailDto> GetDetailAsync(Guid callId)
    {
        var today = Clock.Now.Date;
        var (call, grant) = await GetOpenCallAsync(callId);

        List<GrantEligibleCostItem> costs;
        List<GrantDocumentRequirement> docs;
        using (_mtFilter.Disable())
        {
            costs = (await _costRepo.GetListAsync(c => c.GrantId == grant.Id && c.TenantId == null))
                .OrderBy(c => (int)c.Kind).ToList();
            docs = await _docRepo.GetListAsync(d => d.GrantId == grant.Id && d.TenantId == null);
        }

        var stepCount = await GetStepCountAsync(grant);
        var days = DaysRemaining(call, today);
        var difficulty = _difficulty.Calculate(
            grant, docs.Count, docs.Any(d => d.RequiresESignature), stepCount, days);

        var dto = new GrantPublicDetailDto
        {
            CallId = call.Id,
            GrantName = grant.Name,
            Issuer = grant.Issuer,
            Description = grant.Description,
            Period = call.Period,
            Deadline = call.Deadline,
            DaysRemaining = days,
            MaxAmount = grant.MaxAmount,
            SupportRatePercent = grant.SupportRatePercent,
            ProjectDurationMonths = grant.ProjectDurationMonths,
            RepaymentType = grant.RepaymentType,
            SourceUrl = grant.SourceUrl,
            Difficulty = difficulty.Level,
            DifficultyReasons = difficulty.Reasons.ToList(),
            Criteria = BuildCriteria(grant),
            CostItems = costs.Select(c => new GrantPublicCostItemDto
            {
                Kind = c.Kind,
                LimitPercent = c.LimitPercent
            }).ToList(),
            Questions = BuildQuestions(grant)
        };

        // Benzer hibeler: aynı kurumun diğer açık çağrıları, son tarihe göre.
        var (calls, grants) = await ReadOpenCatalogAsync();
        foreach (var other in calls.Where(c => c.Id != call.Id))
        {
            if (!grants.TryGetValue(other.GrantId, out var otherGrant)) { continue; }
            if (otherGrant.Issuer != grant.Issuer) { continue; }

            dto.SimilarCalls.Add(await MapCallAsync(other, otherGrant, today));
            if (dto.SimilarCalls.Count == SimilarCount) { break; }
        }

        return dto;
    }

    /// <summary>
    /// "Kimler başvurabilir" kutuları — yalnız çağrının BEYAN ETTİĞİ şartlar.
    /// Boş şart için kutu açmak "kısıt yok"u "bilgi eksik" gibi gösterirdi.
    /// </summary>
    private static List<GrantPublicCriterionDto> BuildCriteria(Grant grant)
    {
        var list = new List<GrantPublicCriterionDto>();

        if (grant.EligibleCompanySizes != 0)
        {
            list.Add(new GrantPublicCriterionDto
            {
                Rule = GrantEligibilityRule.CompanySize,
                Value = string.Join(",", DecodeSizes(grant.EligibleCompanySizes).Select(s => (int)s))
            });
        }
        if (grant.MinCompanyAgeYears.HasValue || grant.MaxCompanyAgeYears.HasValue)
        {
            list.Add(Range(GrantEligibilityRule.CompanyAge, grant.MinCompanyAgeYears, grant.MaxCompanyAgeYears));
        }
        if (grant.MinRevenue.HasValue || grant.MaxRevenue.HasValue)
        {
            list.Add(Range(GrantEligibilityRule.Revenue, grant.MinRevenue, grant.MaxRevenue));
        }
        if (grant.MinRdStaffCount.HasValue)
        {
            list.Add(Range(GrantEligibilityRule.RdStaffCount, grant.MinRdStaffCount, null));
        }
        if (grant.MinStaffCount.HasValue)
        {
            list.Add(Range(GrantEligibilityRule.StaffCount, grant.MinStaffCount, null));
        }
        if (grant.MinTrl.HasValue || grant.MaxTrl.HasValue)
        {
            list.Add(Range(GrantEligibilityRule.Trl, grant.MinTrl, grant.MaxTrl));
        }
        if (grant.RequiresConsortium)
        {
            list.Add(new GrantPublicCriterionDto
            {
                Rule = GrantEligibilityRule.Consortium,
                Value = (grant.MinConsortiumPartners ?? 2).ToString()
            });
        }

        return list;
    }

    private static GrantPublicCriterionDto Range(GrantEligibilityRule rule, decimal? min, decimal? max)
        => new() { Rule = rule, Value = $"{min}|{max}" };

    /// <summary>
    /// Test soruları çağrının şartlarından TÜRETİLİR. Sabit beş soru sorulsaydı
    /// çağrının ölçmediği şey de sorulur, cevabı hiçbir sonuca bağlanmazdı.
    /// </summary>
    private static List<GrantPublicQuestionDto> BuildQuestions(Grant grant)
    {
        var questions = new List<GrantPublicQuestionDto>();

        if (grant.EligibleCompanySizes != 0)
        {
            questions.Add(new GrantPublicQuestionDto
            {
                Rule = GrantEligibilityRule.CompanySize,
                Options = Enum.GetValues<CompanySize>()
                    .Select(s => new GrantPublicOptionDto { Value = ((int)s).ToString(), LabelKey = s.ToString() })
                    .ToList()
            });
        }
        if (grant.MinCompanyAgeYears.HasValue || grant.MaxCompanyAgeYears.HasValue)
        {
            questions.Add(new GrantPublicQuestionDto { Rule = GrantEligibilityRule.CompanyAge });
        }
        if (grant.MinRevenue.HasValue || grant.MaxRevenue.HasValue)
        {
            questions.Add(new GrantPublicQuestionDto { Rule = GrantEligibilityRule.Revenue });
        }
        if (grant.MinRdStaffCount.HasValue)
        {
            questions.Add(new GrantPublicQuestionDto
            {
                Rule = GrantEligibilityRule.RdStaffCount,
                Options =
                [
                    new GrantPublicOptionDto { Value = "0", LabelKey = "None" },
                    new GrantPublicOptionDto { Value = "1", LabelKey = "One" },
                    new GrantPublicOptionDto { Value = "3", LabelKey = "TwoToFive" },
                    new GrantPublicOptionDto { Value = "6", LabelKey = "SixPlus" }
                ]
            });
        }
        if (grant.MinStaffCount.HasValue)
        {
            questions.Add(new GrantPublicQuestionDto { Rule = GrantEligibilityRule.StaffCount });
        }
        if (grant.MinTrl.HasValue || grant.MaxTrl.HasValue)
        {
            questions.Add(new GrantPublicQuestionDto
            {
                Rule = GrantEligibilityRule.Trl,
                Options = Enumerable.Range(1, 9)
                    .Select(i => new GrantPublicOptionDto { Value = i.ToString(), LabelKey = "Trl" })
                    .ToList()
            });
        }
        if (grant.RequiresConsortium)
        {
            questions.Add(new GrantPublicQuestionDto
            {
                Rule = GrantEligibilityRule.Consortium,
                Options =
                [
                    new GrantPublicOptionDto { Value = "true", LabelKey = "Yes" },
                    new GrantPublicOptionDto { Value = "false", LabelKey = "No" }
                ]
            });
        }

        return questions;
    }

    public async Task<GrantPublicTestResultDto> EvaluateAsync(GrantPublicTestInput input)
    {
        var (call, grant) = await GetOpenCallAsync(input.CallId);
        var (result, _, _) = await ScoreAsync(call, grant, input);
        return result;
    }

    // ─────────────────────────────────────────────── talep

    public async Task<GrantLeadSubmittedDto> SubmitLeadAsync(SubmitGrantLeadInput input)
    {
        var (call, grant) = await GetOpenCallAsync(input.CallId);
        input.Answers.CallId = call.Id;

        var (result, heat, signals) = await ScoreAsync(call, grant, input.Answers);

        var lead = await _leadManager.CreateOrUpdateAsync(
            call.Id, input.FirmName, input.ContactName, input.Email,
            input.IpAddress, input.UserAgent);

        lead.SetContact(input.ContactTitle, input.Phone);
        lead.SetAnswers(
            input.Answers.Size, input.Answers.CompanyAgeYears, input.Answers.Sector,
            input.Answers.RdStaffCount, input.Answers.Trl, input.Answers.AnnualRevenue,
            input.Answers.HasConsortiumPartner);
        lead.SetScores(
            result.PassedRuleCount, result.TotalRuleCount, heat.MatchScore, heat.Heat.Score,
            result.EstimatedSupport, result.Difficulty,
            string.Join(",", signals.Select(s => (int)s)));

        await _leadManager.SaveAsync(lead);

        return new GrantLeadSubmittedDto { LeadId = lead.Id, HeatScore = lead.HeatScore };
    }

    public async Task<GrantMeetingPrefillDto> GetMeetingPrefillAsync(Guid leadId)
    {
        var lead = await _leadRepo.FindAsync(leadId)
                   ?? throw new BusinessException(PlatformDomainErrorCodes.GrantLeadNotFound);

        var (_, grant) = await GetOpenCallAsync(lead.GrantCallId);

        return new GrantMeetingPrefillDto
        {
            LeadId = lead.Id,
            FirmName = lead.FirmName,
            ContactName = lead.ContactName,
            Email = lead.Email,
            Phone = lead.Phone,
            GrantName = grant.Name,
            AlreadyRequested = lead.PreferredMeetingAt.HasValue
        };
    }

    public async Task RequestMeetingAsync(RequestGrantMeetingInput input)
    {
        var lead = await _leadRepo.FindAsync(input.LeadId)
                   ?? throw new BusinessException(PlatformDomainErrorCodes.GrantLeadNotFound);

        if (!input.Phone.IsNullOrWhiteSpace())
        {
            lead.SetContact(null, input.Phone);
        }

        lead.RequestMeeting(input.PreferredAt, input.Note);
        await _leadRepo.UpdateAsync(lead, autoSave: true);
    }

    // ─────────────────────────────────────────────── yardımcılar

    /// <summary>
    /// Skorlama: uygunluk, uyum, zorluk ve ısı tek yerden. Test ile talep aynı
    /// hesabı kullanır — ziyaretçinin gördüğü sonuç ile host'un gördüğü ısı
    /// farklı yollardan çıksaydı ikisi açıklanamaz biçimde ayrışırdı.
    /// </summary>
    private async Task<(GrantPublicTestResultDto Result,
                        (GrantLeadHeat Heat, int MatchScore) Heat,
                        IReadOnlyList<GrantLeadSignal> Signals)>
        ScoreAsync(GrantCall call, Grant grant, GrantPublicTestInput answers)
    {
        var today = Clock.Now.Date;
        var signals = ToFirmSignals(answers, today);

        var eligibility = _matcher.Evaluate(signals, grant, today);

        List<GrantCriteriaTag> tags;
        List<GrantDocumentRequirement> docs;
        using (_mtFilter.Disable())
        {
            tags = await _tagRepo.GetListAsync(t => t.GrantId == grant.Id && t.TenantId == null);
            docs = await _docRepo.GetListAsync(d => d.GrantId == grant.Id && d.TenantId == null);
        }

        var weights = await _weightResolver.ResolveAsync(grant.Id);
        var matchScore = (int)Math.Round((double)_matcher.Explain(signals, grant, tags, weights).Total);

        var stepCount = await GetStepCountAsync(grant);
        var days = DaysRemaining(call, today);
        var difficulty = _difficulty.Calculate(
            grant, docs.Count, docs.Any(d => d.RequiresESignature), stepCount, days);

        // Çoklu uygunluk: aynı cevaplarla başka açık çağrıya da uyuyor mu?
        var otherEligible = await CountOtherEligibleAsync(call.Id, signals, today);

        var heat = GrantLeadHeatCalculator.Calculate(
            grant, call, signals, eligibility, difficulty.Level, otherEligible, today);

        var measured = eligibility.Rules
            .Where(r => r.Outcome != GrantRuleOutcome.Unknown)
            .ToList();

        var result = new GrantPublicTestResultDto
        {
            CallId = call.Id,
            PassedRuleCount = measured.Count(r => r.Outcome == GrantRuleOutcome.Passed),
            TotalRuleCount = eligibility.Rules.Count,
            Rules = eligibility.Rules
                .Select(r => new GrantPublicRuleResultDto { Rule = r.Rule, Outcome = r.Outcome })
                .ToList(),
            EstimatedSupport = EstimateSupport(grant),
            Difficulty = difficulty.Level,
            DifficultyReasons = difficulty.Reasons.ToList(),
            BlockingRule = eligibility.Rules
                .FirstOrDefault(r => r.Outcome == GrantRuleOutcome.Failed)?.Rule,

            // 🔴 Dürüst değerlendirme: kolay çağrıda danışmanlık ÖNERİLMEZ. Her
            // ziyaretçiyi randevuya çağırmak lead kutusunu niteliksiz doldurur ve
            // tasarımın "gerçekten ihtiyacı olanları çekelim" kuralını bozar.
            RecommendConsulting = difficulty.Level >= ConsultingDifficultyFloor
                                  || heat.Score >= GrantLeadHeatCalculator.CallThreshold
        };

        return (result, (heat, matchScore), heat.Signals);
    }

    /// <summary>Tahmini destek = üst limit × destek oranı. Oran yoksa hesaplanmaz.</summary>
    private static decimal? EstimateSupport(Grant grant)
        => grant.MaxAmount.HasValue && grant.SupportRatePercent.HasValue
            ? Math.Round(grant.MaxAmount.Value * grant.SupportRatePercent.Value / 100m, 0)
            : null;

    private async Task<int> CountOtherEligibleAsync(Guid excludeCallId, FirmSignals signals, DateTime today)
    {
        var (calls, grants) = await ReadOpenCatalogAsync();
        var count = 0;

        foreach (var call in calls.Where(c => c.Id != excludeCallId))
        {
            if (!grants.TryGetValue(call.GrantId, out var grant)) { continue; }
            if (_matcher.Evaluate(signals, grant, today).Bucket != GrantEligibilityBucket.UygunDegil)
            {
                count++;
            }
        }

        return count;
    }

    private static FirmSignals ToFirmSignals(GrantPublicTestInput input, DateTime today)
        => new()
        {
            Size = input.Size,
            FoundedOn = input.CompanyAgeYears.HasValue ? today.AddYears(-input.CompanyAgeYears.Value) : null,
            StaffCount = input.StaffCount,
            RdStaffCount = input.RdStaffCount,
            AnnualRevenue = input.AnnualRevenue,
            Trl = input.Trl,
            HasConsortiumPartner = input.HasConsortiumPartner
        };

    /// <summary>
    /// 🔴 <see cref="CompanySize"/> bir [Flags] enum'u: değerleri 1, 2, 4, 8 — sıra
    /// numarası DEĞİL. Maske kaydırmayla (<c>1 &lt;&lt; (int)s</c>) çözülseydi Mikro
    /// için 2 test edilir ve bütün ölçekler bir kayarak yanlış eşleşirdi.
    /// </summary>
    private static IEnumerable<CompanySize> DecodeSizes(int mask)
        => Enum.GetValues<CompanySize>().Where(s => (mask & (int)s) != 0);

    private static int? DaysRemaining(GrantCall call, DateTime today)
        => call.Deadline.HasValue ? (call.Deadline.Value.Date - today).Days : null;

    private async Task<int> GetStepCountAsync(Grant grant)
    {
        if (grant.StageTemplateId == null) { return 0; }

        using (_mtFilter.Disable())
        {
            return (int)await _stepRepo.CountAsync(
                s => s.StageTemplateId == grant.StageTemplateId.Value && s.TenantId == null);
        }
    }

    private async Task<GrantPublicCallDto> MapCallAsync(GrantCall call, Grant grant, DateTime today)
    {
        List<GrantDocumentRequirement> docs;
        using (_mtFilter.Disable())
        {
            docs = await _docRepo.GetListAsync(d => d.GrantId == grant.Id && d.TenantId == null);
        }

        var days = DaysRemaining(call, today);

        return new GrantPublicCallDto
        {
            CallId = call.Id,
            GrantName = grant.Name,
            Issuer = grant.Issuer,
            Period = call.Period,
            MaxAmount = grant.MaxAmount,
            SupportRatePercent = grant.SupportRatePercent,
            Deadline = call.Deadline,
            DaysRemaining = days,
            Difficulty = _difficulty.Calculate(
                grant, docs.Count, docs.Any(d => d.RequiresESignature),
                await GetStepCountAsync(grant), days).Level,
            EligibleSizes = DecodeSizes(grant.EligibleCompanySizes).ToList()
        };
    }

    /// <summary>
    /// Host kataloğunun YAYINDAKİ çağrıları. Filtre kapatılır (anonim yolda kiracı
    /// çözülmüş olabilir) ve <c>TenantId == null</c> koşulu ELLE konur.
    /// </summary>
    private async Task<(List<GrantCall> Calls, Dictionary<Guid, Grant> Grants)> ReadOpenCatalogAsync()
    {
        using (_mtFilter.Disable())
        {
            var calls = await _callRepo.GetListAsync(
                c => c.TenantId == null && c.Status == GrantCallStatus.Acik);

            var ids = calls.Select(c => c.GrantId).Distinct().ToList();
            var grants = (await _grantRepo.GetListAsync(g => g.TenantId == null && ids.Contains(g.Id)))
                .ToDictionary(g => g.Id);

            return (calls, grants);
        }
    }

    private async Task<(GrantCall Call, Grant Grant)> GetOpenCallAsync(Guid callId)
    {
        using (_mtFilter.Disable())
        {
            var call = await _callRepo.FirstOrDefaultAsync(
                           c => c.Id == callId && c.TenantId == null && c.Status == GrantCallStatus.Acik)
                       ?? throw new BusinessException(PlatformDomainErrorCodes.GrantLeadCallNotOpen);

            var grant = await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null)
                        ?? throw new BusinessException(PlatformDomainErrorCodes.GrantLeadCallNotOpen);

            return (call, grant);
        }
    }
}
