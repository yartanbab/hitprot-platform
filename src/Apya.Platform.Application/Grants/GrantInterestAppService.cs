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
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Tenants;

namespace Apya.Platform.Grants;

/// <summary>
/// Kiracı: çağrıya ilgi bildirme ("İlgileniyorum") ve kendi taleplerini izleme.
///
/// <para>🔴 Başvuruyu kiracı AÇMAZ. Talep host'un kutusuna düşer; süreç orada
/// başlatılır (<see cref="GrantInterestHostAppService"/>). Kiracıya doğrudan
/// başvuru açtıran uç HİÇ YOK — olsaydı bu kapı REST üzerinden atlanabilirdi.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class GrantInterestAppService : PlatformAppService, IGrantInterestAppService
{
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantBookmark, Guid> _bookmarkRepo;
    private readonly TenantDisplayNameResolver _displayNames;
    private readonly GrantNotificationDispatcher _notifyDispatcher;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly IRepository<GrantMeetingProposal, Guid> _proposalRepo;
    private readonly GrantMeetingManager _meetingManager;

    public GrantInterestAppService(
        IRepository<GrantInterest, Guid> interestRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantBookmark, Guid> bookmarkRepo,
        TenantDisplayNameResolver displayNames,
        GrantNotificationDispatcher notifyDispatcher,
        IDataFilter<IMultiTenant> mtFilter,
        IRepository<GrantMeetingProposal, Guid> proposalRepo,
        GrantMeetingManager meetingManager)
    {
        _interestRepo = interestRepo;
        _appRepo = appRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _bookmarkRepo = bookmarkRepo;
        _displayNames = displayNames;
        _notifyDispatcher = notifyDispatcher;
        _mtFilter = mtFilter;
        _proposalRepo = proposalRepo;
        _meetingManager = meetingManager;
    }

    public async Task<MyGrantInterestDto> ExpressAsync(ExpressGrantInterestInput input)
    {
        // Yalnız HOST kataloğuna ilgi bildirilebilir. Filtre kapalıyken TenantId koşulu
        // elle konmazsa kiracı, başka kiracının çağrı Id'siyle kendine talep açabilir.
        GrantCall? call;
        Grant? grant = null;
        using (_mtFilter.Disable())
        {
            call = await _callRepo.FirstOrDefaultAsync(
                c => c.Id == input.GrantCallId && c.TenantId == null);
            if (call != null)
            {
                grant = await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId && g.TenantId == null);
            }
        }
        if (call == null || grant == null)
        {
            throw new EntityNotFoundException(typeof(GrantCall), input.GrantCallId);
        }

        // Ortak sorusu yalnız konsorsiyum şartlı çağrıda sorulur ve orada cevapsız geçilemez:
        // danışmanın ilk bakacağı eksik budur. Şartsız çağrıda gelen cevap SAKLANMAZ —
        // soru ekranda hiç görünmediyse "ortak arıyor" diye bir bilgi de yoktur.
        if (grant.RequiresConsortium && input.NeedsPartner == null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInterestPartnerAnswerRequired);
        }
        var needsPartner = grant.RequiresConsortium ? input.NeedsPartner : null;

        // Süren talep ya da açılmış başvuru varsa ikincisi yazılmaz. Uygun bulunmayan
        // talep ise kapıyı KAPATMAZ: firma durumunu düzeltip yeniden bildirebilir,
        // eski gerekçe geçmişte kalsın diye YENİ satır açılır.
        var pending = await _interestRepo.FirstOrDefaultAsync(
            i => i.GrantCallId == input.GrantCallId
                 && (i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor));
        var hasApplication = await _appRepo.FirstOrDefaultAsync(a => a.GrantCallId == input.GrantCallId) != null;
        if (pending != null || hasApplication)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantInterestAlreadyOpen);
        }

        var interest = new GrantInterest(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            input.GrantCallId,
            CurrentUser.Id,
            input.Note,
            input.EstimatedBudget,
            input.TargetStartDate,
            needsPartner,
            needsPartner == false ? input.PartnerName : null);

        interest.SetIdeaDetails(input);

        await _interestRepo.InsertAsync(interest, autoSave: true);

        // İlgi bildirilen çağrı takip listesine düşer (tur 14): son tarih ve metin
        // değişikliği bildirimleri takip listesinden akar. Zaten takipteyse ikinci satır açılmaz.
        if (await _bookmarkRepo.FirstOrDefaultAsync(b => b.GrantCallId == input.GrantCallId) == null)
        {
            await _bookmarkRepo.InsertAsync(
                new GrantBookmark(GuidGenerator.Create(), CurrentTenant.Id, input.GrantCallId), autoSave: true);
        }

        var catalog = await ResolveCatalogAsync(new[] { interest.GrantCallId });
        await NotifyHostAsync(interest, catalog);

        return MapMine(interest, catalog);
    }

    public async Task<MyGrantInterestDto> ShareIdeaAsync(ShareGrantIdeaInput input)
    {
        // Fikir bir firmanındır; host havuza firma adına Fikir Havuzu ekranından girer.
        if (CurrentTenant.Id == null)
        {
            throw new AbpAuthorizationException();
        }

        // Mükerrer kapısı YOK: çağrı başına tek süren talep kuralı havuza uymaz — firmanın
        // birbirinden bağımsız birkaç fikri olabilir. Takip listesi de yok, çağrı yok.
        var interest = new GrantInterest(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            grantCallId: null,
            CurrentUser.Id,
            input.Note,
            input.EstimatedBudget,
            input.TargetStartDate);
        interest.SetIdeaDetails(input);

        await _interestRepo.InsertAsync(interest, autoSave: true);

        return MapMine(interest, new Dictionary<Guid, (string Name, string? Period)>());
    }

    public async Task<List<MyGrantInterestDto>> GetMineAsync()
    {
        // "İlgi Taleplerim" çağrıya bırakılan talepleri listeler; havuz fikri Hibe Yolculuğum'da.
        var interests = await _interestRepo.GetListAsync(i => i.GrantCallId != null);
        if (interests.Count == 0)
        {
            return new List<MyGrantInterestDto>();
        }

        var catalog = await ResolveCatalogAsync(interests.Select(i => i.GrantCallId));
        return interests
            .OrderByDescending(i => i.CreationTime)
            .Select(i => MapMine(i, catalog))
            .ToList();
    }

    public async Task<MyGrantInterestDto> WithdrawAsync(Guid id)
    {
        // Kiracı filtresi açık: başka firmanın talebi bulunmaz, "yok" sayılır.
        var interest = await _interestRepo.FirstOrDefaultAsync(i => i.Id == id)
                       ?? throw new BusinessException(PlatformDomainErrorCodes.GrantInterestNotFound);

        interest.Withdraw(Clock.Now);
        await _interestRepo.UpdateAsync(interest, autoSave: true);

        var catalog = await ResolveCatalogAsync(new[] { interest.GrantCallId });
        return MapMine(interest, catalog);
    }

    public async Task<GrantMeetingDto> ProposeMeetingAsync(ProposeGrantMeetingInput input)
    {
        // Kiracı filtresi açık: başka firmanın talebi bulunmaz, "yok" sayılır.
        var interest = await _interestRepo.FirstOrDefaultAsync(i => i.Id == input.InterestId)
                       ?? throw new BusinessException(PlatformDomainErrorCodes.GrantInterestNotFound);

        var proposal = await _meetingManager.ProposeAsync(interest, input.Slots, CurrentUser.Id);
        await _proposalRepo.InsertAsync(proposal, autoSave: true);

        var catalog = await ResolveCatalogAsync(new[] { interest.GrantCallId });
        await _notifyDispatcher.DispatchToTenantAsync(
            GrantNotificationTrigger.MeetingProposed,
            tenantId: null,
            new Dictionary<string, string?>
            {
                ["{firma_adı}"] = await GetFirmNameAsync(),
                ["{çağrı_adı}"] = CallName(catalog, interest),
                ["{önerilen_saatler}"] = GrantMeetingMapping.SlotsText(proposal.Slots)
            },
            nameof(GrantMeetingProposal), proposal.Id);

        return GrantMeetingMapping.ToDto(proposal);
    }

    /// <summary>
    /// Talebi HOST'a duyurur — kutuyu birinin açmasını beklemeyelim diye.
    ///
    /// <para>Alıcı kiracı değil host kullanıcılarıdır: <c>tenantId: null</c> ile
    /// gönderilir, dispatcher host bağlamına geçip etkin kullanıcıları toplar.</para>
    ///
    /// <para>Bildirim akışı KIRMAZ: şablon kapalıysa dispatcher sessizce <c>false</c>
    /// döner, talep yine de kaydedilmiştir.</para>
    /// </summary>
    private async Task NotifyHostAsync(
        GrantInterest interest, Dictionary<Guid, (string Name, string? Period)> catalog)
    {
        var values = new Dictionary<string, string?>
        {
            ["{firma_adı}"] = await GetFirmNameAsync(),
            ["{çağrı_adı}"] = CallName(catalog, interest),
            // Not boşsa token ham "{firma_notu}" olarak gitmesin diye açık bir karşılık yazılır.
            ["{firma_notu}"] = interest.Note ?? L["Grants:Notify:Trigger:InterestReceived:NoNote"]
        };

        await _notifyDispatcher.DispatchToTenantAsync(
            GrantNotificationTrigger.InterestReceived,
            tenantId: null,
            values,
            nameof(GrantInterest), interest.Id);
    }

    /// <summary>
    /// Kurumun adı — resmî unvan, yoksa kiracı adı (<see cref="TenantDisplayNameResolver"/>).
    /// <see cref="ICurrentTenant.Name"/> kullanılmaz: o, unvandan türetilmiş kısa anahtardır
    /// ve istek dışı bağlamlarda (arka plan işi, test) boş da gelebiliyor.
    /// </summary>
    private async Task<string?> GetFirmNameAsync()
    {
        var tenantId = CurrentTenant.Id;
        return tenantId == null ? null : await _displayNames.GetAsync(tenantId.Value);
    }

    /// <summary>Çağrı → (program adı, dönem). Katalog host'ta yaşıyor: filtre kapatılır.</summary>
    private async Task<Dictionary<Guid, (string Name, string? Period)>> ResolveCatalogAsync(
        IEnumerable<Guid?> callIds)
    {
        var ids = callIds.Where(id => id.HasValue).Select(id => id!.Value).Distinct().ToList();
        var map = new Dictionary<Guid, (string, string?)>();

        using (_mtFilter.Disable())
        {
            var calls = await _callRepo.GetListAsync(c => ids.Contains(c.Id) && c.TenantId == null);
            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id) && g.TenantId == null))
                .ToDictionary(g => g.Id, g => g.Name);

            foreach (var call in calls)
            {
                map[call.Id] = (grants.GetValueOrDefault(call.GrantId, string.Empty), call.Period);
            }
        }

        return map;
    }

    private static string? CallName(Dictionary<Guid, (string Name, string? Period)> catalog, GrantInterest interest)
        => interest.GrantCallId is { } callId && catalog.TryGetValue(callId, out var call) ? call.Name : null;

    private static MyGrantInterestDto MapMine(
        GrantInterest interest, Dictionary<Guid, (string Name, string? Period)> catalog)
    {
        var (name, period) = interest.GrantCallId is { } callId && catalog.TryGetValue(callId, out var found)
            ? found
            : (Name: string.Empty, Period: (string?)null);
        return new MyGrantInterestDto
        {
            Id = interest.Id,
            GrantCallId = interest.GrantCallId,
            GrantName = name,
            Period = period,
            CreationTime = interest.CreationTime,
            Status = interest.Status,
            Note = interest.Note,
            EstimatedBudget = interest.EstimatedBudget,
            TargetStartDate = interest.TargetStartDate,
            NeedsPartner = interest.NeedsPartner,
            PartnerName = interest.PartnerName,
            ProblemStatement = interest.ProblemStatement,
            TargetAudience = interest.TargetAudience,
            PlannedActivities = interest.PlannedActivities,
            DurationAndPartners = interest.DurationAndPartners,
            SupportNeeds = interest.SupportNeeds,
            PriorExperience = interest.PriorExperience,
            TeamStructure = interest.TeamStructure,
            Stakeholders = interest.Stakeholders,
            WithdrawnAt = interest.WithdrawnAt,
            HostFeedback = interest.HostFeedback,
            GrantApplicationId = interest.GrantApplicationId
        };
    }
}
