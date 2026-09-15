using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// 21a/22 · Host Çağrılar. Kart başına çağrı + programı; sayılar mevcut hesaplardan gelir:
/// tamamlanma ve eksik alanlar <see cref="GrantParameterAppService"/>'in, eşleşen firma aynı
/// servisin canlı önizlemesiyle aynı değerlendiricinin (<see cref="GrantMatchManager.Evaluate"/>)
/// sonucudur — iki ekran farklı sayı göstermesin.
///
/// <para>🔴 Firma profilleri ve ilgi talepleri kiracılara aittir; sayım için filtre BİLEREK
/// kapalı okunur (emsal: parametre önizlemesi, pipeline). Ekrana yalnız sayı çıkar, firma adı çıkmaz.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantCallBoardAppService : PlatformAppService, IGrantCallBoardAppService
{
    private static readonly StringComparer TurkishOrder = StringComparer.Create(new CultureInfo("tr-TR"), ignoreCase: true);

    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<GrantEligibleCostItem, Guid> _costItemRepo;
    private readonly IRepository<GrantDocumentRequirement, Guid> _documentRepo;
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly IRepository<FirmProfile, Guid> _profileRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly GrantMatchManager _matcher;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantCallBoardAppService(
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<GrantEligibleCostItem, Guid> costItemRepo,
        IRepository<GrantDocumentRequirement, Guid> documentRepo,
        IRepository<GrantInterest, Guid> interestRepo,
        IRepository<FirmProfile, Guid> profileRepo,
        ITenantRepository tenantRepo,
        GrantMatchManager matcher,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _grantRepo = grantRepo;
        _callRepo = callRepo;
        _criteriaRepo = criteriaRepo;
        _costItemRepo = costItemRepo;
        _documentRepo = documentRepo;
        _interestRepo = interestRepo;
        _profileRepo = profileRepo;
        _tenantRepo = tenantRepo;
        _matcher = matcher;
        _mtFilter = mtFilter;
    }

    public async Task<GrantCallBoardDto> GetAsync(GetGrantCallBoardInput input)
    {
        EnsureHostContext();

        var today = Clock.Now.Date;
        var grants = (await _grantRepo.GetListAsync(g => g.TenantId == null)).ToDictionary(g => g.Id);
        // Programı silinmiş çağrı karta çıkmaz: adı, afişi, tutarı programdan gelir.
        var calls = (await _callRepo.GetListAsync(c => c.TenantId == null))
            .Where(c => grants.ContainsKey(c.GrantId))
            .ToList();
        var grantsWithCall = calls.Select(c => c.GrantId).ToHashSet();

        var live = calls.Where(c => c.Status is GrantCallStatus.Acik or GrantCallStatus.Planlandi).ToList();
        var closed = calls.Where(c => c.Status == GrantCallStatus.Kapandi).ToList();
        var drafts = calls.Where(c => c.Status == GrantCallStatus.Taslak).ToList();
        var callless = grants.Values.Where(g => !grantsWithCall.Contains(g.Id)).ToList();

        var dto = new GrantCallBoardDto
        {
            LiveCount = live.Count,
            ClosedCount = closed.Count,
            DraftCount = drafts.Count + callless.Count,
            Issuers = grants.Values
                .Select(g => g.Issuer)
                .Where(i => !string.IsNullOrWhiteSpace(i))
                .Distinct(TurkishOrder)
                .OrderBy(i => i, TurkishOrder)
                .ToList()
        };

        var cards = input.Tab == GrantCallBoardTab.Draft
            ? drafts.Select(c => NewCard(grants[c.GrantId], c, today))
                .Concat(callless.Select(g => NewCard(g, null, today)))
                .ToList()
            : (input.Closed ? closed : live).Select(c => NewCard(grants[c.GrantId], c, today)).ToList();

        if (!string.IsNullOrWhiteSpace(input.Issuer))
        {
            cards = cards.Where(c => TurkishOrder.Equals(c.Issuer, input.Issuer.Trim())).ToList();
        }

        if (input.Tab == GrantCallBoardTab.Draft)
        {
            await FillCompletionAsync(cards, grants);
        }
        else
        {
            await FillReachAsync(cards, grants, today);
        }

        dto.Items = Sort(cards, input.Sort, input.Tab == GrantCallBoardTab.Live && input.Closed);
        return dto;
    }

    private static GrantCallCardDto NewCard(Grant grant, GrantCall? call, DateTime today) => new()
    {
        GrantId = grant.Id,
        GrantCallId = call?.Id,
        GrantName = grant.Name,
        Issuer = grant.Issuer,
        Period = call?.Period,
        Reference = call?.Reference,
        Status = call?.Status,
        OpenDate = call?.OpenDate,
        Deadline = call?.Deadline,
        DaysRemaining = call?.Deadline == null ? null : (call.Deadline.Value.Date - today).Days,
        PosterFileName = grant.PosterFileName,
        MinAmount = grant.MinAmount,
        MaxAmount = grant.MaxAmount,
        SupportRatePercent = grant.SupportRatePercent,
        CreationTime = call?.CreationTime ?? grant.CreationTime
    };

    /// <summary>Taslak kart: tamamlanma yüzdesi ve yayını engelleyen alanlar — Parametreler'le aynı hesap.</summary>
    private async Task FillCompletionAsync(List<GrantCallCardDto> cards, Dictionary<Guid, Grant> grants)
    {
        var grantIds = cards.Select(c => c.GrantId).Distinct().ToList();
        if (grantIds.Count == 0)
        {
            return;
        }

        var tags = (await _criteriaRepo.GetListAsync(t => grantIds.Contains(t.GrantId)))
            .GroupBy(t => t.GrantId).ToDictionary(g => g.Key, g => g.Count());
        var costItems = (await _costItemRepo.GetListAsync(c => grantIds.Contains(c.GrantId)))
            .GroupBy(c => c.GrantId).ToDictionary(g => g.Key, g => g.Count());
        var documents = (await _documentRepo.GetListAsync(d => grantIds.Contains(d.GrantId)))
            .GroupBy(d => d.GrantId).ToDictionary(g => g.Key, g => g.Count());

        foreach (var card in cards)
        {
            var grant = grants[card.GrantId];
            var tagCount = tags.GetValueOrDefault(grant.Id);
            card.CompletionPercent = GrantParameterAppService.CalculateCompletionPercent(
                grant, tagCount, costItems.GetValueOrDefault(grant.Id), documents.GetValueOrDefault(grant.Id));
            card.MissingRequiredFields = GrantParameterAppService.FindMissingRequiredFields(grant, tagCount);
        }
    }

    /// <summary>Yayındaki kart: şartları karşılayan firma sayısı (program başına bir kez) ve ilgi sayısı.</summary>
    private async Task FillReachAsync(List<GrantCallCardDto> cards, Dictionary<Guid, Grant> grants, DateTime today)
    {
        if (cards.Count == 0)
        {
            return;
        }

        var callIds = cards.Select(c => c.GrantCallId!.Value).ToList();
        var tenants = await _tenantRepo.GetListAsync();

        List<FirmProfile> profiles;
        Dictionary<Guid, int> interests;
        using (_mtFilter.Disable())
        {
            profiles = await _profileRepo.GetListAsync();
            interests = (await _interestRepo.GetListAsync(
                    i => callIds.Contains(i.GrantCallId) && i.Status != GrantInterestStatus.GeriCekildi))
                .GroupBy(i => i.GrantCallId)
                .ToDictionary(g => g.Key, g => g.Count());
        }

        var profileByTenant = profiles
            .Where(p => p.TenantId.HasValue)
            .GroupBy(p => p.TenantId!.Value)
            .ToDictionary(g => g.Key, g => g.First());
        var signals = tenants
            .Select(t => GrantParameterAppService.ToSignals(profileByTenant.GetValueOrDefault(t.Id)))
            .ToList();

        var matching = cards
            .Select(c => c.GrantId)
            .Distinct()
            .ToDictionary(id => id, id => signals.Count(s => _matcher.Evaluate(s, grants[id], today).IsConfirmed));

        foreach (var card in cards)
        {
            card.MatchingFirmCount = matching[card.GrantId];
            card.InterestCount = interests.GetValueOrDefault(card.GrantCallId!.Value);
        }
    }

    private static List<GrantCallCardDto> Sort(List<GrantCallCardDto> cards, GrantCallBoardSort sort, bool closed)
    {
        return sort switch
        {
            GrantCallBoardSort.Newest => cards.OrderByDescending(c => c.CreationTime).ToList(),
            GrantCallBoardSort.Name => cards.OrderBy(c => c.GrantName, TurkishOrder).ThenBy(c => c.Period).ToList(),
            // Tarihsiz kart en sonda; kapanmışta en son kapanan başta.
            _ => closed
                ? cards.OrderBy(c => c.Deadline == null).ThenByDescending(c => c.Deadline).ToList()
                : cards.OrderBy(c => c.Deadline == null).ThenBy(c => c.Deadline).ToList()
        };
    }

    private void EnsureHostContext()
    {
        if (CurrentTenant.Id != null)
        {
            throw new AbpAuthorizationException();
        }
    }
}
