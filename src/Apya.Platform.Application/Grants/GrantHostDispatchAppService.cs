using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Emailing;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 1c · Çağrı → Firma Eşleştirme ve Gönderim. Yalnız host bağlamında çalışır —
/// kiracılar arası veri okuma/yazma <see cref="ICurrentTenant.Change"/> ile yapılır.
///
/// <para>Gönderim İDEMPOTENTTİR: aynı firmaya aynı çağrı ikinci kez gönderilmez,
/// atlanan sayısı sonuçta bildirilir.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Create)]
public class GrantHostDispatchAppService : ApplicationService, IGrantHostDispatchAppService
{
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<GrantRecommendation, Guid> _recRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly FirmSignalsBuilder _signalsBuilder;
    private readonly GrantMatchManager _matcher;
    private readonly GrantMatchWeightResolver _weightResolver;
    private readonly ICurrentTenant _currentTenant;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly NotificationManager _notificationManager;
    private readonly IEmailSender _emailSender;

    public GrantHostDispatchAppService(
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<GrantRecommendation, Guid> recRepo,
        IRepository<GrantApplication, Guid> appRepo,
        ITenantRepository tenantRepo,
        IIdentityUserRepository userRepo,
        FirmSignalsBuilder signalsBuilder,
        GrantMatchManager matcher,
        GrantMatchWeightResolver weightResolver,
        ICurrentTenant currentTenant,
        IDataFilter<IMultiTenant> mtFilter,
        NotificationManager notificationManager,
        IEmailSender emailSender)
    {
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _criteriaRepo = criteriaRepo;
        _recRepo = recRepo;
        _appRepo = appRepo;
        _tenantRepo = tenantRepo;
        _userRepo = userRepo;
        _signalsBuilder = signalsBuilder;
        _matcher = matcher;
        _weightResolver = weightResolver;
        _currentTenant = currentTenant;
        _mtFilter = mtFilter;
        _notificationManager = notificationManager;
        _emailSender = emailSender;
    }

    public async Task<GrantDispatchConsoleDto> PreviewAsync(PreviewHostRecommendationInput input)
    {
        EnsureHostContext();

        var call = await _callRepo.GetAsync(input.GrantCallId);
        var grant = await _grantRepo.GetAsync(call.GrantId);
        var tags = await _criteriaRepo.GetListAsync(t => t.GrantId == grant.Id);
        var weights = await _weightResolver.ResolveAsync(grant.Id);
        var today = Clock.Now.Date;

        // 🔴 Öneri ve başvuru kayıtları KİRACIYA aittir; host bunları saymak için filtreyi
        // bilerek tüm kiracılara açar. TenantId == null koşulu KONMAZ — konursa host'un
        // kendi satırları gelir ve sayaç daima 0 çıkar.
        List<GrantRecommendation> sentRecs;
        List<GrantApplication> applications;
        using (_mtFilter.Disable())
        {
            sentRecs = await _recRepo.GetListAsync(r => r.GrantCallId == call.Id);
            applications = await _appRepo.GetListAsync(a => a.GrantCallId == call.Id);
        }
        var sentByTenant = sentRecs.Where(r => r.TenantId.HasValue).ToDictionary(r => r.TenantId!.Value);
        var appliedTenants = applications.Where(a => a.TenantId.HasValue).Select(a => a.TenantId!.Value).ToHashSet();

        var consultants = await BuildConsultantsAsync(sentRecs);
        var consultantNames = consultants.ToDictionary(c => c.UserId, c => c.Name);

        var tenants = await _tenantRepo.GetListAsync();
        var candidates = new List<HostRecommendationCandidateDto>();
        var consortiumOpportunity = 0;

        foreach (var tenant in tenants)
        {
            var signals = await _signalsBuilder.BuildAsync(tenant.Id);
            var eligibility = _matcher.Evaluate(signals, grant, today);

            // Danışmanlık fırsatı: TEK engeli konsorsiyum ortağı olan firmalar.
            // Süzgeçten bağımsız sayılır — fırsat kartı listeyi değil pazarı anlatır.
            if (IsConsortiumOnlyGap(eligibility))
            {
                consortiumOpportunity++;
            }

            if (!PassesFilter(input, signals, eligibility, tenant.Id, sentByTenant, appliedTenants))
            {
                continue;
            }

            var breakdown = _matcher.Explain(signals, grant, tags, weights);
            if (breakdown.Total < input.MinScore)
            {
                continue;
            }

            var warning = WarningRuleOf(eligibility);
            var (warnFirm, warnGrant) = warning.HasValue
                ? RuleValues(warning.Value, signals, grant, today)
                : (null, null);
            var sent = sentByTenant.GetValueOrDefault(tenant.Id);

            candidates.Add(new HostRecommendationCandidateDto
            {
                TenantId = tenant.Id,
                TenantName = tenant.Name,
                Score = breakdown.Total,
                Size = signals.Size,
                Bucket = eligibility.Bucket,
                PassedRules = eligibility.Rules
                    .Where(r => r.Outcome == GrantRuleOutcome.Passed)
                    .Select(r => r.Rule)
                    .OrderBy(r => r)
                    .ToList(),
                WarningRule = warning,
                WarningFirmValue = warnFirm,
                WarningGrantValue = warnGrant,
                Dimensions = breakdown.Dimensions
                    .Select(d => new GrantScoreDimensionDto
                    {
                        Dimension = d.Dimension,
                        Value = d.Value,
                        Weight = d.Weight
                    })
                    .ToList(),
                AlreadySent = sent != null,
                AlreadyApplied = appliedTenants.Contains(tenant.Id),
                AssignedUserId = sent?.AssignedUserId,
                AssignedUserName = sent?.AssignedUserId is { } uid
                    ? consultantNames.GetValueOrDefault(uid)
                    : null
            });
        }

        return new GrantDispatchConsoleDto
        {
            GrantCallId = call.Id,
            GrantId = grant.Id,
            GrantName = grant.Name,
            Issuer = grant.Issuer,
            Period = call.Period,
            Deadline = call.Deadline,
            DaysRemaining = call.Deadline.HasValue
                ? (int)(call.Deadline.Value.Date - today).TotalDays
                : null,
            MaxAmount = grant.MaxAmount,
            GrantMinMatchScore = grant.MinMatchScore,
            TotalFirms = tenants.Count,
            Candidates = candidates.OrderByDescending(c => c.Score).ThenBy(c => c.TenantName).ToList(),
            Consultants = consultants,
            ConsortiumOpportunityCount = consortiumOpportunity
        };
    }

    public async Task<GrantDispatchResultDto> SendAsync(SendHostRecommendationInput input)
    {
        EnsureHostContext();

        var call = await _callRepo.GetAsync(input.GrantCallId);
        var grant = await _grantRepo.GetAsync(call.GrantId);
        var title = $"Yeni hibe önerisi: {grant.Name}";
        var body = string.IsNullOrWhiteSpace(input.Note)
            ? $"{grant.Name} ({call.Period}) programı firmanız için önerildi."
            : input.Note!;

        var result = new GrantDispatchResultDto();

        foreach (var tenantId in input.TenantIds.Distinct())
        {
            using (_currentTenant.Change(tenantId))
            {
                var existing = await _recRepo.FirstOrDefaultAsync(r => r.GrantCallId == input.GrantCallId);
                if (existing != null)
                {
                    // İdempotent: aynı firmaya ikinci kez gönderilmez. Danışman ataması
                    // yine de güncellenir — host yeniden atama yapabilsin.
                    if (input.AssignedUserId.HasValue && existing.AssignedUserId != input.AssignedUserId)
                    {
                        existing.AssignedUserId = input.AssignedUserId;
                        await _recRepo.UpdateAsync(existing, autoSave: true);
                    }
                    result.SkippedCount++;
                    continue;
                }

                var rec = new GrantRecommendation(
                    GuidGenerator.Create(), tenantId, input.GrantCallId, GrantRecommendationSource.Host, input.Note)
                {
                    AssignedUserId = input.AssignedUserId
                };
                await _recRepo.InsertAsync(rec, autoSave: true);
                result.SentCount++;

                var users = await _userRepo.GetListAsync();
                foreach (var user in users.Where(u => u.IsActive))
                {
                    if (input.SendNotification)
                    {
                        await _notificationManager.PublishAsync(
                            user.Id, title, body, NotificationType.GrantRecommended, nameof(GrantCall), call.Id);
                        result.NotifiedUserCount++;
                    }
                    if (input.SendEmail && !string.IsNullOrWhiteSpace(user.Email))
                    {
                        await _emailSender.SendAsync(user.Email, title, body);
                        result.EmailCount++;
                    }
                }
            }
        }

        return result;
    }

    /// <summary>Tek engeli konsorsiyum olan firma — danışmanlık fırsatı kartının sayacı.</summary>
    private static bool IsConsortiumOnlyGap(GrantEligibilityResult eligibility)
    {
        var gaps = eligibility.Rules
            .Where(r => r.Outcome != GrantRuleOutcome.Passed)
            .Select(r => r.Rule)
            .ToList();
        return gaps.Count == 1 && gaps[0] == GrantEligibilityRule.Consortium;
    }

    private static bool PassesFilter(
        PreviewHostRecommendationInput input,
        FirmSignals signals,
        GrantEligibilityResult eligibility,
        Guid tenantId,
        IReadOnlyDictionary<Guid, GrantRecommendation> sentByTenant,
        IReadOnlySet<Guid> appliedTenants)
    {
        if (input.Sizes is > 0 && signals.Size.HasValue && ((int)signals.Size.Value & input.Sizes.Value) == 0)
        {
            return false;
        }
        if (input.BudgetMin.HasValue
            && (signals.TypicalProjectBudget == null || signals.TypicalProjectBudget < input.BudgetMin))
        {
            return false;
        }
        if (input.BudgetMax.HasValue
            && (signals.TypicalProjectBudget == null || signals.TypicalProjectBudget > input.BudgetMax))
        {
            return false;
        }
        if (input.Category.HasValue && signals.DominantCategory != input.Category)
        {
            return false;
        }
        if (input.OnlyEligible && eligibility.Bucket != GrantEligibilityBucket.Uygun)
        {
            return false;
        }
        if (input.ExcludeAlreadySent && sentByTenant.ContainsKey(tenantId))
        {
            return false;
        }
        if (input.ExcludeApplied && appliedTenants.Contains(tenantId))
        {
            return false;
        }
        return true;
    }

    /// <summary>Satır altındaki uyarı: önce eleyen, yoksa ölçülemeyen ilk şart.</summary>
    private static GrantEligibilityRule? WarningRuleOf(GrantEligibilityResult r)
    {
        var failed = r.Rules.Where(x => x.Outcome == GrantRuleOutcome.Failed).OrderBy(x => x.Rule).ToList();
        if (failed.Count > 0)
        {
            return failed[0].Rule;
        }
        var unknown = r.Rules.Where(x => x.Outcome == GrantRuleOutcome.Unknown).OrderBy(x => x.Rule).ToList();
        return unknown.Count > 0 ? unknown[0].Rule : null;
    }

    /// <summary>Host kullanıcıları ve üzerlerindeki açık öneri yükü.</summary>
    private async Task<List<GrantConsultantDto>> BuildConsultantsAsync(List<GrantRecommendation> callRecs)
    {
        var users = await _userRepo.GetListAsync();

        // Yük, YALNIZ bu çağrının önerilerinden değil tüm önerilerden sayılır.
        List<GrantRecommendation> allRecs;
        using (_mtFilter.Disable())
        {
            allRecs = await _recRepo.GetListAsync(
                r => r.AssignedUserId != null && r.Status != GrantRecommendationStatus.Dismissed);
        }
        var loadByUser = allRecs
            .GroupBy(r => r.AssignedUserId!.Value)
            .ToDictionary(g => g.Key, g => g.Count());

        return users
            .Where(u => u.IsActive)
            .Select(u => new GrantConsultantDto
            {
                UserId = u.Id,
                Name = string.IsNullOrWhiteSpace(u.Name) ? u.UserName : $"{u.Name} {u.Surname}".Trim(),
                AssignedCount = loadByUser.GetValueOrDefault(u.Id)
            })
            .OrderBy(c => c.AssignedCount)
            .ThenBy(c => c.Name)
            .ToList();
    }

    /// <summary>
    /// Uyarı satırı için (firmadaki değer, programın istediği) çifti. Metin üretilmez —
    /// istemci yerelleştirilmiş cümleyi bu değerlerle kurar (1e/9a ile aynı sözleşme).
    /// </summary>
    private static (string? FirmValue, string? GrantValue) RuleValues(
        GrantEligibilityRule rule, FirmSignals firm, Grant grant, DateTime today)
        => rule switch
        {
            GrantEligibilityRule.CompanySize => (
                firm.Size.HasValue ? ((int)firm.Size.Value).ToString() : null,
                grant.EligibleCompanySizes.ToString()),
            GrantEligibilityRule.CompanyAge => (
                firm.FoundedOn.HasValue ? YearsSince(firm.FoundedOn.Value, today).ToString() : null,
                Range(grant.MinCompanyAgeYears, grant.MaxCompanyAgeYears)),
            GrantEligibilityRule.Trl => (firm.Trl?.ToString(), Range(grant.MinTrl, grant.MaxTrl)),
            GrantEligibilityRule.StaffCount => (firm.StaffCount?.ToString(), grant.MinStaffCount?.ToString()),
            GrantEligibilityRule.RdStaffCount => (firm.RdStaffCount?.ToString(), grant.MinRdStaffCount?.ToString()),
            GrantEligibilityRule.Revenue => (
                firm.AnnualRevenue?.ToString(), Range(grant.MinRevenue, grant.MaxRevenue)),
            GrantEligibilityRule.Consortium => (
                firm.HasConsortiumPartner?.ToString().ToLowerInvariant(),
                grant.MinConsortiumPartners?.ToString() ?? "1"),
            _ => (null, null)
        };

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

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException("Bu işlem yalnızca host bağlamında yapılabilir.");
        }
    }
}
