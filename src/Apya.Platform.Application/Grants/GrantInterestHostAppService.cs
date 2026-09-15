using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp;
using Volo.Abp.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Grants;

/// <summary>
/// Host: İlgi Talepleri kutusu — kiracıların "İlgileniyorum" talepleri.
///
/// <para>🔴 HOST-ONLY. Talepler KİRACIYA ait olduğu için her okuma/yazma o kiracının
/// bağlamına geçilerek yapılır (emsal: <see cref="GrantApplicationHostAppService"/>).
/// Filtreyi kapatmak yerine bağlam değiştiriyoruz: <c>Disable()</c> kapsamı tüm
/// kiracılara açar ve yazma tarafında yanlış kiracıya kayıt düşürme riski doğar.</para>
///
/// <para>Başvuru BURADA doğar: kiracıya başvuru açtıran uç yok, süreç host'un
/// kararıyla başlar.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class GrantInterestHostAppService : PlatformAppService, IGrantInterestHostAppService
{
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantRecommendation, Guid> _recRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly ITenantRepository _tenantRepo;
    private readonly IIdentityUserRepository _userRepo;
    private readonly ICurrentTenant _currentTenant;
    private readonly GrantNotificationDispatcher _notifyDispatcher;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly FirmSignalsBuilder _signalsBuilder;
    private readonly GrantMatchManager _matcher;
    private readonly GrantMatchWeightResolver _weightResolver;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly IRepository<GrantMeetingProposal, Guid> _proposalRepo;

    public GrantInterestHostAppService(
        IRepository<GrantInterest, Guid> interestRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantRecommendation, Guid> recRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        ITenantRepository tenantRepo,
        IIdentityUserRepository userRepo,
        ICurrentTenant currentTenant,
        GrantNotificationDispatcher notifyDispatcher,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        FirmSignalsBuilder signalsBuilder,
        GrantMatchManager matcher,
        GrantMatchWeightResolver weightResolver,
        IDataFilter<IMultiTenant> mtFilter,
        IRepository<GrantMeetingProposal, Guid> proposalRepo)
    {
        _interestRepo = interestRepo;
        _appRepo = appRepo;
        _recRepo = recRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _tenantRepo = tenantRepo;
        _userRepo = userRepo;
        _currentTenant = currentTenant;
        _notifyDispatcher = notifyDispatcher;
        _criteriaRepo = criteriaRepo;
        _signalsBuilder = signalsBuilder;
        _matcher = matcher;
        _weightResolver = weightResolver;
        _mtFilter = mtFilter;
        _proposalRepo = proposalRepo;
    }

    public async Task<GrantInterestConsoleDto> GetAsync(bool onlyPending)
    {
        EnsureHostContext();
        return await BuildConsoleAsync(onlyPending);
    }

    public async Task<GrantInterestConsoleDto> StartReviewAsync(Guid interestId)
    {
        EnsureHostContext();

        var tenantId = await FindInterestTenantIdAsync(interestId);
        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestRepo.GetAsync(interestId);
            interest.StartReview(CurrentUser.Id, Clock.Now);
            await _interestRepo.UpdateAsync(interest, autoSave: true);
        }

        // Firmaya bildirim GİTMEZ: "incelemeye alındı" host'un iç triage adımıdır,
        // firmanın gördüğü durum zaten "talebiniz iletildi".
        return await BuildConsoleAsync(onlyPending: true);
    }

    public async Task<GrantInterestConsoleDto> StartApplicationAsync(Guid interestId)
    {
        EnsureHostContext();

        var tenantId = await FindInterestTenantIdAsync(interestId);
        Guid callId;

        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestRepo.GetAsync(interestId);

            // 🔴 Kapı YAN ETKİDEN ÖNCE: karara bağlanmış ya da firmanın geri çektiği talepte
            // başvuru yazılmadan durulur. Aşağıdaki MarkApplicationStarted da aynı kuralı
            // uygular ama başvuru ondan önce kaydedildiği için kaydı geri almak işlemin
            // geri sarılmasına kalırdı — firma ilgisini çekerken host sayfası açıksa bu yarış gerçek.
            if (!interest.IsPending)
            {
                throw new BusinessException(PlatformDomainErrorCodes.GrantInterestAlreadyAnswered);
            }

            // 19a · Havuzdaki fikrin çağrısı yok; başvuru ancak ilişkilendirildikten sonra açılır.
            interest.EnsureLinked();
            callId = interest.GrantCallId!.Value;

            // Başvuru KİRACININ bağlamında açılır; host bağlamında açılsaydı firma
            // kendi başvurusunu göremezdi. Aynı çağrıya ikinci başvuru açılmaz
            // (tenant+çağrı benzersiz): eski kayıt varsa talep ona bağlanır.
            var application = await _appRepo.FirstOrDefaultAsync(a => a.GrantCallId == callId);
            if (application == null)
            {
                application = new GrantApplication(GuidGenerator.Create(), tenantId, callId);
                await _appRepo.InsertAsync(application, autoSave: true);

                // Host bu çağrıyı bu firmaya göndermişse (B3), başvuruldu olarak işaretle.
                var rec = await _recRepo.FirstOrDefaultAsync(r => r.GrantCallId == callId);
                if (rec != null)
                {
                    rec.MarkApplied();
                    await _recRepo.UpdateAsync(rec, autoSave: true);
                }
            }

            interest.MarkApplicationStarted(application.Id, CurrentUser.Id, Clock.Now);
            await _interestRepo.UpdateAsync(interest, autoSave: true);
        }

        await NotifyAnsweredAsync(
            tenantId,
            callId,
            interestId,
            decision: L["Grants:Interest:Decision:Started"],
            reason: L["Grants:Interest:Decision:StartedHint"]);

        return await BuildConsoleAsync(onlyPending: true);
    }

    public async Task<GrantInterestConsoleDto> RejectAsync(RejectGrantInterestInput input)
    {
        EnsureHostContext();

        var tenantId = await FindInterestTenantIdAsync(input.InterestId);
        Guid callId;

        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestRepo.GetAsync(input.InterestId);
            // Red bildirimi çağrı adını taşır; havuz fikri Talepler akışına ait değil.
            interest.EnsureLinked();
            interest.Reject(input.Reason, CurrentUser.Id, Clock.Now);
            await _interestRepo.UpdateAsync(interest, autoSave: true);
            callId = interest.GrantCallId!.Value;
        }

        // Gerekçe METİN OLARAK gider: firmanın gördüğü cümle host'un yazdığıdır,
        // bildirimde özetlenip ekranda başka türlü görünmesi güveni bozardı.
        await NotifyAnsweredAsync(
            tenantId,
            callId,
            input.InterestId,
            decision: L["Grants:Interest:Decision:Rejected"],
            reason: input.Reason.Trim());

        return await BuildConsoleAsync(onlyPending: true);
    }

    // ---------- 18a · İnceleme ekranı ----------

    public async Task<GrantInterestReviewDto> GetReviewAsync(Guid interestId)
    {
        EnsureHostContext();

        var tenantId = (await FindInterestTenantIdAsync(interestId))!.Value;
        var tenant = await _tenantRepo.GetAsync(tenantId);

        GrantInterest interest;
        Dictionary<Guid, string> tenantUsers;
        int approvedGrantCount;
        GrantMeetingProposal? meeting;
        using (_currentTenant.Change(tenantId))
        {
            interest = await _interestRepo.GetAsync(interestId);
            meeting = (await _proposalRepo.GetListAsync(p => p.GrantInterestId == interestId))
                .OrderByDescending(p => p.CreationTime).FirstOrDefault();
            tenantUsers = (await _userRepo.GetListAsync()).ToDictionary(u => u.Id, DisplayName);
            approvedGrantCount = (await _appRepo.GetListAsync(a => a.ApprovedAmount != null)).Count;
        }

        // Katalog host verisidir: çağrı, program, kriterler host bağlamında okunur.
        // İnceleme ekranı çağrıya göre puanlar; havuz fikri kendi ekranında açılır (19a).
        interest.EnsureLinked();
        var call = await _callRepo.GetAsync(interest.GrantCallId!.Value);
        var grant = await _grantRepo.GetAsync(call.GrantId);
        var criteria = await _criteriaRepo.GetListAsync(t => t.GrantId == grant.Id);
        var weights = await _weightResolver.ResolveAsync(grant.Id);
        var today = Clock.Now.Date;

        var hostUsers = await _userRepo.GetListAsync();
        var row = ToRow(interest, tenantId, tenant.Name, call, grant.Name, tenantUsers, today);
        FillHostNames(row, hostUsers.ToDictionary(u => u.Id, DisplayName));

        var signals = await _signalsBuilder.BuildAsync(tenantId);
        var eligibility = _matcher.Evaluate(signals, grant, today);

        var dto = new GrantInterestReviewDto
        {
            Interest = row,
            Meeting = meeting == null ? null : GrantMeetingMapping.ToDto(meeting),
            ConsultantNote = interest.ConsultantNote,
            RequiresConsortium = grant.RequiresConsortium,
            MatchScore = _matcher.Explain(signals, grant, criteria, weights).Total,
            Bucket = eligibility.Bucket,
            PassedRuleCount = eligibility.Rules.Count(r => r.Outcome == GrantRuleOutcome.Passed),
            FailedRules = eligibility.Rules.Where(r => r.Outcome == GrantRuleOutcome.Failed).Select(r => r.Rule).ToList(),
            UnknownRules = eligibility.Rules.Where(r => r.Outcome == GrantRuleOutcome.Unknown).Select(r => r.Rule).ToList(),
            Size = signals.Size,
            NaceCodes = TagValues(signals, GrantCriteriaKind.NaceKodu),
            Sectors = TagValues(signals, GrantCriteriaKind.Sektor),
            Regions = TagValues(signals, GrantCriteriaKind.Bolge),
            AnnualRevenue = signals.AnnualRevenue,
            StaffCount = signals.StaffCount,
            RdStaffCount = signals.RdStaffCount,
            HasConsortiumPartner = signals.HasConsortiumPartner,
            ActiveProjectCount = signals.ActiveProjectCount,
            ApprovedGrantCount = approvedGrantCount,
            Consultants = await BuildConsultantsAsync(hostUsers)
        };

        // Ortak önerisi yalnız ortaklık gereken yerde: firma ortak arıyor ya da çağrı konsorsiyum istiyor.
        if (interest.NeedsPartner == true || grant.RequiresConsortium)
        {
            dto.PartnerSuggestions = await BuildPartnerSuggestionsAsync(interest, tenantId, grant, criteria, weights);
        }

        return dto;
    }

    public async Task<GrantInterestReviewDto> SaveNoteAsync(SaveGrantInterestNoteInput input)
    {
        EnsureHostContext();

        var tenantId = await FindInterestTenantIdAsync(input.InterestId);
        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestRepo.GetAsync(input.InterestId);
            interest.SetConsultantNote(input.Note);
            await _interestRepo.UpdateAsync(interest, autoSave: true);
        }

        return await GetReviewAsync(input.InterestId);
    }

    public async Task<GrantInterestReviewDto> AssignAsync(AssignGrantInterestInput input)
    {
        EnsureHostContext();

        // Host bağlamında aranır: kiracı kullanıcısı (firma çalışanı) danışman olarak atanamaz.
        if (input.UserId.HasValue)
        {
            var user = await _userRepo.FindAsync(input.UserId.Value);
            if (user == null || !user.IsActive)
            {
                throw new BusinessException(PlatformDomainErrorCodes.GrantInterestAssigneeNotFound);
            }
        }

        var tenantId = await FindInterestTenantIdAsync(input.InterestId);
        using (_currentTenant.Change(tenantId))
        {
            var interest = await _interestRepo.GetAsync(input.InterestId);
            interest.AssignTo(input.UserId);
            await _interestRepo.UpdateAsync(interest, autoSave: true);
        }

        return await GetReviewAsync(input.InterestId);
    }

    public async Task<GrantInterestReviewDto> ConfirmMeetingAsync(ConfirmGrantMeetingInput input)
    {
        EnsureHostContext();

        var (tenantId, interestId, callId, slot) = await AnswerMeetingAsync(input.ProposalId, (proposal, interest) =>
        {
            proposal.Confirm(input.SlotIndex, CurrentUser.Id, Clock.Now);
            // Saat verilen talep danışmanın elindedir: bekleyen talep incelemeye alınır, danışman üstlenir.
            if (interest.Status == GrantInterestStatus.Yeni)
            {
                interest.StartReview(CurrentUser.Id, Clock.Now);
            }
        });

        await NotifyMeetingAnsweredAsync(tenantId, callId, input.ProposalId,
            L["Grants:Meeting:Result:Confirmed", GrantMeetingMapping.SlotText(slot!.Value), GrantMeetingConsts.DurationMinutes]);
        return await GetReviewAsync(interestId);
    }

    public async Task<GrantInterestReviewDto> RequestOtherMeetingTimeAsync(RequestGrantMeetingTimeInput input)
    {
        EnsureHostContext();

        var (tenantId, interestId, callId, _) = await AnswerMeetingAsync(input.ProposalId,
            (proposal, _) => proposal.RequestOtherTime(input.Note, CurrentUser.Id, Clock.Now));

        await NotifyMeetingAnsweredAsync(tenantId, callId, input.ProposalId,
            L["Grants:Meeting:Result:OtherTime", input.Note.Trim()]);
        return await GetReviewAsync(interestId);
    }

    /// <summary>
    /// Öneri firmanın kiracısındadır: kimlikle süzgeç kapalı bulunur, değişiklik o kiracıda yazılır. Karara bağlanmış
    /// ya da geri çekilmiş talebin önerisi cevaplanmaz.
    /// </summary>
    private async Task<(Guid TenantId, Guid InterestId, Guid CallId, DateTime? ConfirmedSlot)> AnswerMeetingAsync(
        Guid proposalId, Action<GrantMeetingProposal, GrantInterest> answer)
    {
        GrantMeetingProposal? found;
        using (_mtFilter.Disable())
        {
            found = await _proposalRepo.FindAsync(proposalId);
        }

        if (found?.TenantId == null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.GrantMeetingNotPending);
        }

        var tenantId = found.TenantId.Value;
        using (_currentTenant.Change(tenantId))
        {
            var proposal = await _proposalRepo.GetAsync(proposalId);
            var interest = await _interestRepo.GetAsync(proposal.GrantInterestId);
            if (!interest.IsPending)
            {
                throw new BusinessException(PlatformDomainErrorCodes.GrantMeetingInterestClosed);
            }

            answer(proposal, interest);
            await _proposalRepo.UpdateAsync(proposal, autoSave: true);
            await _interestRepo.UpdateAsync(interest, autoSave: true);
            // Öneri yalnız çağrıya bağlı talepte açılır (GrantMeetingManager).
            return (tenantId, interest.Id, interest.GrantCallId!.Value, proposal.ConfirmedSlot);
        }
    }

    private async Task NotifyMeetingAnsweredAsync(Guid tenantId, Guid callId, Guid proposalId, string result)
    {
        await _notifyDispatcher.DispatchToTenantAsync(
            GrantNotificationTrigger.MeetingAnswered,
            tenantId,
            new Dictionary<string, string?>
            {
                ["{çağrı_adı}"] = await GetGrantNameAsync(callId),
                ["{görüşme_sonucu}"] = result
            },
            nameof(GrantMeetingProposal), proposalId);
    }

    /// <summary>
    /// Aynı çağrıya ilgi bildirmiş BAŞKA firmalar (firma başına son talep). Eşleştirme kaydı
    /// tutulmaz — danışman adayı görür, o talebin inceleme ekranına geçer.
    /// </summary>
    private async Task<List<GrantInterestPartnerSuggestionDto>> BuildPartnerSuggestionsAsync(
        GrantInterest interest, Guid tenantId, Grant grant, List<GrantCriteriaTag> criteria, GrantMatchWeightSet weights)
    {
        // 🔴 Talepler kiracılara dağınık; okuma için filtre bilinçli kapatılır (yazma yok).
        List<GrantInterest> others;
        using (_mtFilter.Disable())
        {
            others = await _interestRepo.GetListAsync(i =>
                i.GrantCallId == interest.GrantCallId
                && i.TenantId != null && i.TenantId != tenantId
                && (i.Status == GrantInterestStatus.Yeni
                    || i.Status == GrantInterestStatus.Inceleniyor
                    || i.Status == GrantInterestStatus.BasvuruAcildi));
        }

        if (others.Count == 0)
        {
            return new List<GrantInterestPartnerSuggestionDto>();
        }

        var tenantNames = (await _tenantRepo.GetListAsync()).ToDictionary(t => t.Id, t => t.Name);
        var result = new List<GrantInterestPartnerSuggestionDto>();
        foreach (var other in others.GroupBy(o => o.TenantId!.Value).Select(g => g.OrderByDescending(o => o.CreationTime).First()))
        {
            var signals = await _signalsBuilder.BuildAsync(other.TenantId);
            result.Add(new GrantInterestPartnerSuggestionDto
            {
                InterestId = other.Id,
                TenantId = other.TenantId!.Value,
                FirmName = tenantNames.GetValueOrDefault(other.TenantId.Value, string.Empty),
                Size = signals.Size,
                MatchScore = _matcher.Explain(signals, grant, criteria, weights).Total,
                NeedsPartner = other.NeedsPartner,
                Status = other.Status
            });
        }

        // O da ortak arayan önce, sonra uyum puanı.
        return result
            .OrderByDescending(s => s.NeedsPartner == true)
            .ThenByDescending(s => s.MatchScore)
            .Take(3)
            .ToList();
    }

    /// <summary>Devret listesi. Yük = üzerindeki bekleyen talep sayısı (tüm kiracılardan).</summary>
    private async Task<List<GrantConsultantDto>> BuildConsultantsAsync(List<IdentityUser> hostUsers)
    {
        List<GrantInterest> assigned;
        using (_mtFilter.Disable())
        {
            assigned = await _interestRepo.GetListAsync(i =>
                i.AssignedUserId != null
                && (i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor));
        }

        var load = assigned.GroupBy(i => i.AssignedUserId!.Value).ToDictionary(g => g.Key, g => g.Count());
        return hostUsers
            .Where(u => u.IsActive)
            .Select(u => new GrantConsultantDto { UserId = u.Id, Name = DisplayName(u), AssignedCount = load.GetValueOrDefault(u.Id) })
            .OrderBy(c => c.Name)
            .ToList();
    }

    private static List<string> TagValues(FirmSignals signals, GrantCriteriaKind kind)
        => signals.Tags.Where(t => t.Kind == kind).Select(t => t.Value).Distinct().ToList();

    // ---------- Yardımcılar ----------

    private async Task NotifyAnsweredAsync(
        Guid? tenantId, Guid callId, Guid interestId, string decision, string reason)
    {
        await _notifyDispatcher.DispatchToTenantAsync(
            GrantNotificationTrigger.InterestAnswered,
            tenantId,
            new Dictionary<string, string?>
            {
                ["{çağrı_adı}"] = await GetGrantNameAsync(callId),
                ["{karar}"] = decision,
                ["{gerekçe}"] = reason
            },
            nameof(GrantInterest), interestId);
    }

    /// <summary>
    /// Konsolun tamamı: KPI'lar her zaman tüm taleplerden, liste süzgece göre.
    /// Katalog host bağlamında bir kez okunur — kiracı bağlamına geçildiğinde
    /// filtre çağrıları eler ve program adı boş kalırdı.
    /// </summary>
    private async Task<GrantInterestConsoleDto> BuildConsoleAsync(bool onlyPending)
    {
        var calls = (await _callRepo.GetListAsync()).ToDictionary(c => c.Id);
        var grantIds = calls.Values.Select(c => c.GrantId).Distinct().ToList();
        var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id)))
            .ToDictionary(g => g.Id, g => g.Name);

        var today = Clock.Now.Date;
        var rows = new List<GrantInterestRowDto>();

        foreach (var tenant in await _tenantRepo.GetListAsync())
        {
            using (_currentTenant.Change(tenant.Id))
            {
                // 19a · Havuz fikirleri talep değildir; Fikir Havuzu ekranında yaşar.
                var interests = await _interestRepo.GetListAsync(i => i.GrantCallId != null);
                if (interests.Count == 0)
                {
                    continue;
                }

                var users = (await _userRepo.GetListAsync()).ToDictionary(u => u.Id, DisplayName);

                foreach (var interest in interests)
                {
                    var call = calls.GetValueOrDefault(interest.GrantCallId!.Value);
                    var grantName = call == null ? string.Empty : grants.GetValueOrDefault(call.GrantId, string.Empty);
                    rows.Add(ToRow(interest, tenant.Id, tenant.Name, call, grantName, users, today));
                }
            }
        }

        // İnceleyen danışman host kullanıcısıdır; adı host bağlamında çözülür.
        await FillReviewerNamesAsync(rows);

        var dto = new GrantInterestConsoleDto
        {
            NewCount = rows.Count(r => r.Status == GrantInterestStatus.Yeni),
            InReviewCount = rows.Count(r => r.Status == GrantInterestStatus.Inceleniyor),
            StartedCount = rows.Count(r => r.Status == GrantInterestStatus.BasvuruAcildi),
            RejectedCount = rows.Count(r => r.Status == GrantInterestStatus.UygunDegil)
        };

        // Bekleyenler önce, içlerinde en eski talep başta: sıradaki iş yukarıda dursun.
        dto.Items = rows
            .Where(r => !onlyPending || r.Status is GrantInterestStatus.Yeni or GrantInterestStatus.Inceleniyor)
            .OrderBy(r => r.Status is GrantInterestStatus.Yeni or GrantInterestStatus.Inceleniyor ? 0 : 1)
            .ThenBy(r => r.CreationTime)
            .ToList();

        return dto;
    }

    private async Task FillReviewerNamesAsync(List<GrantInterestRowDto> rows)
    {
        if (rows.All(r => r.ReviewedAt == null && r.AssignedUserId == null))
        {
            return;
        }

        var hostUsers = (await _userRepo.GetListAsync()).ToDictionary(u => u.Id, DisplayName);
        foreach (var row in rows)
        {
            FillHostNames(row, hostUsers);
        }
    }

    /// <summary>İnceleyen ve sorumlu danışman host kullanıcılarıdır; adları host bağlamında çözülür.</summary>
    private static void FillHostNames(GrantInterestRowDto row, Dictionary<Guid, string> hostUsers)
    {
        row.ReviewedByName = row.ReviewedByUserId.HasValue ? hostUsers.GetValueOrDefault(row.ReviewedByUserId.Value) : null;
        row.AssignedUserName = row.AssignedUserId.HasValue ? hostUsers.GetValueOrDefault(row.AssignedUserId.Value) : null;
    }

    private static GrantInterestRowDto ToRow(
        GrantInterest interest, Guid tenantId, string firmName, GrantCall? call, string grantName,
        Dictionary<Guid, string> tenantUsers, DateTime today)
        => new()
        {
            Id = interest.Id,
            TenantId = tenantId,
            FirmName = firmName,
            GrantCallId = interest.GrantCallId!.Value,
            GrantName = grantName,
            Period = call?.Period,
            Deadline = call?.Deadline,
            DaysRemaining = call?.Deadline == null ? null : (int)(call.Deadline.Value.Date - today).TotalDays,
            CreationTime = interest.CreationTime,
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
            Status = interest.Status,
            HostFeedback = interest.HostFeedback,
            RequestedByName = interest.RequestedByUserId.HasValue
                ? tenantUsers.GetValueOrDefault(interest.RequestedByUserId.Value)
                : null,
            ReviewedByUserId = interest.ReviewedByUserId,
            ReviewedAt = interest.ReviewedAt,
            GrantApplicationId = interest.GrantApplicationId,
            AssignedUserId = interest.AssignedUserId
        };

    /// <summary>Ad + soyad; ikisi de boşsa kullanıcı adı — satır isimsiz kalmasın.</summary>
    private static string DisplayName(IdentityUser user)
    {
        var full = $"{user.Name} {user.Surname}".Trim();
        return full.IsNullOrWhiteSpace() ? user.UserName : full;
    }

    private async Task<string?> GetGrantNameAsync(Guid callId)
    {
        var call = await _callRepo.FirstOrDefaultAsync(c => c.Id == callId);
        return call == null
            ? null
            : (await _grantRepo.FirstOrDefaultAsync(g => g.Id == call.GrantId))?.Name;
    }

    private async Task<Guid?> FindInterestTenantIdAsync(Guid interestId)
    {
        foreach (var tenant in await _tenantRepo.GetListAsync())
        {
            using (_currentTenant.Change(tenant.Id))
            {
                if (await _interestRepo.FindAsync(interestId) != null)
                {
                    return tenant.Id;
                }
            }
        }

        throw new BusinessException(PlatformDomainErrorCodes.GrantInterestNotFound);
    }

    private void EnsureHostContext()
    {
        if (_currentTenant.Id != null)
        {
            throw new AbpAuthorizationException();
        }
    }
}
