using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 19a · Host "Fikir Havuzu" · 20a havuz taraması ve çağrıyla ilişkilendirme.
///
/// <para>🔴 Okuma filtre BİLEREK kapalı yapılır (emsal: Talepler) ve TenantId koşulu elle konur.
/// Yazma ise firmanın bağlamına GEÇİLEREK yapılır: <c>Disable()</c> kapsamında açılan kayıt
/// yanlış kiracıya düşebilirdi.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantIdeaPoolAppService : PlatformAppService, IGrantIdeaPoolAppService
{
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantBookmark, Guid> _bookmarkRepo;
    private readonly FirmSignalsBuilder _signalsBuilder;
    private readonly GrantMatchManager _matcher;
    private readonly GrantMatchWeightResolver _weightResolver;
    private readonly GrantNotificationDispatcher _notifyDispatcher;

    public GrantIdeaPoolAppService(
        IRepository<GrantInterest, Guid> interestRepo,
        ITenantRepository tenantRepo,
        IIdentityUserRepository userRepo,
        IDataFilter<IMultiTenant> mtFilter,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantBookmark, Guid> bookmarkRepo,
        FirmSignalsBuilder signalsBuilder,
        GrantMatchManager matcher,
        GrantMatchWeightResolver weightResolver,
        GrantNotificationDispatcher notifyDispatcher)
    {
        _interestRepo = interestRepo;
        _tenantRepo = tenantRepo;
        _userRepo = userRepo;
        _mtFilter = mtFilter;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _criteriaRepo = criteriaRepo;
        _appRepo = appRepo;
        _bookmarkRepo = bookmarkRepo;
        _signalsBuilder = signalsBuilder;
        _matcher = matcher;
        _weightResolver = weightResolver;
        _notifyDispatcher = notifyDispatcher;
    }

    public async Task<GrantIdeaPoolDto> GetListAsync(GetGrantIdeaPoolInput input)
    {
        EnsureHostContext();

        var ideas = await LoadPendingIdeasAsync();
        var tenants = await _tenantRepo.GetListAsync();
        var firmNames = tenants.ToDictionary(t => t.Id, t => t.Name);
        var creators = await LoadCreatorNamesAsync(ideas);

        // 20a · Açık çağrılar anlık taranır (kayıt tutulmaz): fikir başına eşiği geçen çağrılar, güçlüden zayıfa.
        var calls = await LoadCallContextsAsync(await LoadOpenCallsAsync());
        var signals = await LoadSignalsAsync(ideas);
        var busy = await LoadBusyPairsAsync(calls.Select(c => c.Call.Id).ToList());
        var matches = ideas.ToDictionary(
            i => i.Id,
            i => calls
                .Where(c => !busy.Contains((i.TenantId!.Value, c.Call.Id)))
                .Select(c => (Call: c, Match: Score(i, c, signals[i.TenantId!.Value])))
                .Where(x => x.Match.IsMatch)
                .OrderByDescending(x => x.Match.Total)
                .ToList());

        var filtered = ideas.Where(i => input.Source == null || i.Source == input.Source);
        filtered = input.Sort switch
        {
            GrantIdeaPoolSort.Budget => filtered.OrderByDescending(i => i.EstimatedBudget.HasValue).ThenByDescending(i => i.EstimatedBudget).ThenByDescending(i => i.CreationTime),
            GrantIdeaPoolSort.Match => filtered.OrderByDescending(i => matches[i.Id].Count > 0 ? matches[i.Id][0].Match.Total : -1).ThenByDescending(i => i.CreationTime),
            _ => filtered.OrderByDescending(i => i.CreationTime)
        };

        return new GrantIdeaPoolDto
        {
            TotalCount = ideas.Count,
            AwaitingMatchCount = matches.Values.Count(m => m.Count > 0),
            Items = filtered.Select(i =>
            {
                var row = Fill(new GrantIdeaRowDto(), i, firmNames, creators);
                var found = matches[i.Id];
                if (found.Count > 0)
                {
                    var (best, match) = found[0];
                    row.BestMatch = new GrantIdeaCallMatchDto
                    {
                        GrantCallId = best.Call.Id, GrantName = best.Grant.Name, Period = best.Call.Period, Score = match.Total
                    };
                    row.OtherMatchCount = found.Count - 1;
                }
                return row;
            }).ToList(),
            Firms = tenants
                .OrderBy(t => t.Name)
                .Select(t => new GrantRequestOptionDto { Id = t.Id, Name = t.Name })
                .ToList()
        };
    }

    public async Task<GrantCallIdeaMatchesDto> GetCallMatchesAsync(Guid grantCallId)
    {
        EnsureHostContext();

        var call = await _callRepo.GetAsync(grantCallId);
        var context = (await LoadCallContextsAsync(new List<GrantCall> { call })).Single();
        var busy = await LoadBusyPairsAsync(new List<Guid> { call.Id });
        var ideas = (await LoadPendingIdeasAsync()).Where(i => !busy.Contains((i.TenantId!.Value, call.Id))).ToList();

        var firmNames = (await _tenantRepo.GetListAsync()).ToDictionary(t => t.Id, t => t.Name);
        var creators = await LoadCreatorNamesAsync(ideas);
        var signals = await LoadSignalsAsync(ideas);

        var items = ideas.Select(i =>
            {
                var match = Score(i, context, signals[i.TenantId!.Value]);
                var dto = Fill(new GrantIdeaMatchDto(), i, firmNames, creators);
                dto.Score = match.Total;
                dto.TextScore = match.TextScore;
                dto.FirmScore = match.FirmScore;
                dto.IsMatch = match.IsMatch;
                dto.MatchedTerms = match.MatchedTerms.ToList();
                dto.BudgetFits = match.BudgetFits;
                return dto;
            })
            .OrderByDescending(d => d.Score)
            .ThenByDescending(d => d.CreationTime)
            .ToList();

        return new GrantCallIdeaMatchesDto
        {
            GrantCallId = call.Id,
            IsOpen = IsOpen(call),
            MatchCount = items.Count(d => d.IsMatch),
            Threshold = GrantIdeaMatcher.Threshold,
            Items = items
        };
    }

    public async Task<GrantIdeaLinkResultDto> LinkAsync(LinkGrantIdeasInput input)
    {
        EnsureHostContext();

        var call = await _callRepo.GetAsync(input.GrantCallId);
        // Taslak ya da planlanan çağrı firmaya görünmez: "uygun çağrı açıldı" bildirimi boşa düşerdi.
        if (!IsOpen(call))
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantIdeaCallNotOpen);
        }

        var context = (await LoadCallContextsAsync(new List<GrantCall> { call })).Single();
        var ids = input.InterestIds.Distinct().ToList();
        List<GrantInterest> ideas;
        using (_mtFilter.Disable())
        {
            ideas = await _interestRepo.GetListAsync(i => ids.Contains(i.Id) && i.TenantId != null);
        }

        var firmNames = (await _tenantRepo.GetListAsync()).ToDictionary(t => t.Id, t => t.Name);
        var consultant = CurrentUser.Id.HasValue ? await _userRepo.FindAsync(CurrentUser.Id.Value) : null;
        var result = new GrantIdeaLinkResultDto { SkippedCount = ids.Count - ideas.Count };

        foreach (var idea in ideas)
        {
            var tenantId = idea.TenantId!.Value;
            // Başka sekmede bağlanmış ya da firmanın geri çektiği fikir atlanır; toplu işlem yarıda kesilmez.
            if (!idea.IsPoolIdea || !idea.IsPending)
            {
                result.SkippedCount++;
                continue;
            }

            var match = Score(idea, context, await _signalsBuilder.BuildAsync(tenantId));

            // Yazma firmanın bağlamında: takip kaydı ABP'nin TenantId'yi kurulurken ataması için kapsam içinde doğar.
            using (CurrentTenant.Change(tenantId))
            {
                // Çağrı başına tek süren talep kuralı ilişkilendirmede de geçerli.
                var open = await _interestRepo.FirstOrDefaultAsync(i => i.GrantCallId == call.Id
                    && (i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor));
                if (open != null || await _appRepo.FirstOrDefaultAsync(a => a.GrantCallId == call.Id) != null)
                {
                    result.SkippedCount++;
                    continue;
                }

                idea.LinkToCall(call.Id, CurrentUser.Id, Clock.Now);
                await _interestRepo.UpdateAsync(idea, autoSave: true);

                if (await _bookmarkRepo.FirstOrDefaultAsync(b => b.GrantCallId == call.Id) == null)
                {
                    await _bookmarkRepo.InsertAsync(new GrantBookmark(GuidGenerator.Create(), tenantId, call.Id), autoSave: true);
                }
            }

            await _notifyDispatcher.DispatchToTenantAsync(
                GrantNotificationTrigger.IdeaLinked,
                tenantId,
                new Dictionary<string, string?>
                {
                    ["{firma_adı}"] = firmNames.GetValueOrDefault(tenantId),
                    ["{fikir}"] = Excerpt(idea.Note),
                    ["{çağrı_adı}"] = context.Grant.Name,
                    ["{eşleşme}"] = "%" + match.Total,
                    ["{danışman}"] = consultant == null ? null : DisplayName(consultant),
                    ["{son_tarih}"] = call.Deadline?.ToString("dd.MM.yyyy")
                },
                nameof(GrantCall), call.Id);

            result.LinkedCount++;
        }

        return result;
    }

    public async Task<GrantIdeaDetailDto> GetAsync(Guid id)
    {
        EnsureHostContext();

        GrantInterest? idea;
        using (_mtFilter.Disable())
        {
            idea = await _interestRepo.FirstOrDefaultAsync(i => i.Id == id && i.TenantId != null && i.GrantCallId == null);
        }
        if (idea == null)
        {
            throw new EntityNotFoundException(typeof(GrantInterest), id);
        }

        var tenant = await _tenantRepo.GetAsync(idea.TenantId!.Value);
        var creators = await LoadCreatorNamesAsync(new List<GrantInterest> { idea });
        var dto = Fill(new GrantIdeaDetailDto(), idea, new Dictionary<Guid, string> { [tenant.Id] = tenant.Name }, creators);
        dto.ProblemStatement = idea.ProblemStatement;
        dto.TargetAudience = idea.TargetAudience;
        dto.PlannedActivities = idea.PlannedActivities;
        dto.DurationAndPartners = idea.DurationAndPartners;
        dto.SupportNeeds = idea.SupportNeeds;
        dto.PriorExperience = idea.PriorExperience;
        dto.TeamStructure = idea.TeamStructure;
        dto.Stakeholders = idea.Stakeholders;
        return dto;
    }

    public async Task<GrantIdeaDetailDto> CreateAsync(CreateGrantIdeaInput input)
    {
        EnsureHostContext();

        var tenant = await _tenantRepo.FindAsync(input.TenantId);
        if (tenant == null)
        {
            throw new EntityNotFoundException(typeof(Tenant), input.TenantId);
        }

        Guid id;
        // Kayıt firmanın bağlamında KURULUR: ABP TenantId'yi nesne oluşurken atar.
        using (CurrentTenant.Change(tenant.Id))
        {
            // Talep eden yok (null): cevap bildirimleri firma kullanıcısına gider, danışmana değil.
            // Giren danışman CreatorId'de durur.
            var idea = new GrantInterest(
                GuidGenerator.Create(),
                tenant.Id,
                grantCallId: null,
                requestedByUserId: null,
                input.Note,
                input.EstimatedBudget,
                input.TargetStartDate,
                source: GrantInterestSource.Consultant);
            idea.SetIdeaDetails(input);
            idea.RecordEnteredBy(CurrentUser.Id);

            await _interestRepo.InsertAsync(idea, autoSave: true);
            id = idea.Id;
        }

        return await GetAsync(id);
    }

    private sealed record CallContext(GrantCall Call, Grant Grant, List<GrantCriteriaTag> Tags, GrantMatchWeightSet Weights);

    private async Task<List<GrantInterest>> LoadPendingIdeasAsync()
    {
        using (_mtFilter.Disable())
        {
            return await _interestRepo.GetListAsync(i =>
                i.TenantId != null
                && i.GrantCallId == null
                && (i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor));
        }
    }

    /// <summary>Firmaya görünen çağrı: yayında ve son tarihi geçmemiş.</summary>
    private bool IsOpen(GrantCall call)
        => call.Status == GrantCallStatus.Acik && (call.Deadline == null || call.Deadline.Value.Date >= Clock.Now.Date);

    /// <summary>Host kataloğu (host bağlamında okunur).</summary>
    private async Task<List<GrantCall>> LoadOpenCallsAsync()
        => (await _callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik)).Where(IsOpen).ToList();

    /// <summary>Çağrı başına program, etiketler ve ağırlıklar — program başına bir kez.</summary>
    private async Task<List<CallContext>> LoadCallContextsAsync(List<GrantCall> calls)
    {
        var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
        var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id))).ToDictionary(g => g.Id);
        var tags = (await _criteriaRepo.GetListAsync(t => grantIds.Contains(t.GrantId)))
            .GroupBy(t => t.GrantId).ToDictionary(g => g.Key, g => g.ToList());
        var weights = new Dictionary<Guid, GrantMatchWeightSet>();
        foreach (var grantId in grants.Keys)
        {
            weights[grantId] = await _weightResolver.ResolveAsync(grantId);
        }

        return calls
            .Where(c => grants.ContainsKey(c.GrantId))
            .Select(c => new CallContext(c, grants[c.GrantId], tags.GetValueOrDefault(c.GrantId) ?? new List<GrantCriteriaTag>(), weights[c.GrantId]))
            .ToList();
    }

    /// <summary>Firma sinyali firma başına bir kez kurulur (profil + proje geçmişi okur).</summary>
    private async Task<Dictionary<Guid, FirmSignals>> LoadSignalsAsync(List<GrantInterest> ideas)
    {
        var signals = new Dictionary<Guid, FirmSignals>();
        foreach (var tenantId in ideas.Select(i => i.TenantId!.Value).Distinct())
        {
            signals[tenantId] = await _signalsBuilder.BuildAsync(tenantId);
        }

        return signals;
    }

    /// <summary>
    /// (firma, çağrı) çiftleri: firmanın o çağrıda süren talebi ya da başvurusu var. Fikir bu çağrıya
    /// bağlanamaz, eşleşme olarak da gösterilmez.
    /// </summary>
    private async Task<HashSet<(Guid TenantId, Guid CallId)>> LoadBusyPairsAsync(List<Guid> callIds)
    {
        using (_mtFilter.Disable())
        {
            var interests = await _interestRepo.GetListAsync(i =>
                i.TenantId != null && i.GrantCallId != null && callIds.Contains(i.GrantCallId.Value)
                && (i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor));
            var applications = await _appRepo.GetListAsync(a => a.TenantId != null && callIds.Contains(a.GrantCallId));

            return interests.Select(i => (i.TenantId!.Value, i.GrantCallId!.Value))
                .Concat(applications.Select(a => (a.TenantId!.Value, a.GrantCallId)))
                .ToHashSet();
        }
    }

    /// <summary>Etiketsiz programda firma skoru hep 0 döner ("hedeflenmemiş program eşleşmez"): ölçülemedi sayılır.</summary>
    private GrantIdeaMatch Score(GrantInterest idea, CallContext context, FirmSignals signals)
        => GrantIdeaMatcher.Match(idea, context.Grant, context.Tags,
            context.Tags.Count == 0 ? null : _matcher.Explain(signals, context.Grant, context.Tags, context.Weights).Total);

    /// <summary>Bildirimde fikir tırnak içinde anılır; uzun metin cümleyi boğmasın.</summary>
    private static string? Excerpt(string? text)
    {
        const int max = 120;
        var trimmed = text?.Trim();
        return trimmed == null || trimmed.Length <= max ? trimmed : trimmed[..max].TrimEnd() + "…";
    }

    /// <summary>Giren kişi firma kullanıcısı ya da host kullanıcısı olabilir: filtre kapalı, Id ile.</summary>
    private async Task<Dictionary<Guid, string>> LoadCreatorNamesAsync(List<GrantInterest> ideas)
    {
        var ids = ideas.Where(i => i.CreatorId.HasValue).Select(i => i.CreatorId!.Value).Distinct().ToList();
        if (ids.Count == 0)
        {
            return new Dictionary<Guid, string>();
        }

        using (_mtFilter.Disable())
        {
            return (await _userRepo.GetListByIdsAsync(ids)).ToDictionary(u => u.Id, DisplayName);
        }
    }

    private static T Fill<T>(T row, GrantInterest idea, Dictionary<Guid, string> firmNames, Dictionary<Guid, string> creators)
        where T : GrantIdeaRowDto
    {
        row.Id = idea.Id;
        row.TenantId = idea.TenantId!.Value;
        row.FirmName = firmNames.GetValueOrDefault(idea.TenantId.Value, string.Empty);
        row.Idea = idea.Note;
        row.Source = idea.Source;
        row.CreatorName = idea.CreatorId.HasValue ? creators.GetValueOrDefault(idea.CreatorId.Value) : null;
        row.CreationTime = idea.CreationTime;
        row.EstimatedBudget = idea.EstimatedBudget;
        row.TargetStartDate = idea.TargetStartDate;
        return row;
    }

    /// <summary>Ad + soyad; ikisi de boşsa kullanıcı adı.</summary>
    private static string DisplayName(IdentityUser user)
    {
        var full = $"{user.Name} {user.Surname}".Trim();
        return string.IsNullOrWhiteSpace(full) ? user.UserName : full;
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException();
        }
    }
}
