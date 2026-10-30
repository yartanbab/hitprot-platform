using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Tenants;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Faz 2 · Kademeli yükseltme. Tetikleyicinin beklediği iş yükseltme şablonundaki gün sayısı kadar
/// yapılmazsa bildirim işi bekleyen tarafa (hatırlatma), o tarafın yöneticisine ve — firma işi beklerken —
/// danışmana gider.
///
/// <para>Bekleyen iş kayıtların durumundan TÜRETİLİR (<see cref="GrantPendingAction"/>); iş yapıldığı anda
/// listeden düşer, ayrıca "kapat" demek gerekmez. Aynı kademe aynı bekleme için bir kez gider: tekrar
/// koruması <see cref="GrantNotificationLog"/>'tadır ve iş yeniden beklemeye girerse (ör. ikinci revizyon)
/// kademeler baştan sayılır.</para>
///
/// <para>Eşik "tam o gün" değil "en az o kadar gün"dür: son tarih hatırlatıcısı bir gün koşmazsa o günün
/// hatırlatması hiç gitmiyordu; burada geciken tur kaçan kademeyi yetiştirir.</para>
/// </summary>
public class GrantEscalationManager : DomainService
{
    /// <summary>
    /// Gönderim kaydında yükseltmenin işareti: 1000 + kitle. Hatırlatıcıların gün işaretleriyle (7/3/1,
    /// 30/14/3) karışmasın diye ayrı aralıkta; kitle başına tek kayıt.
    /// </summary>
    public const int DayMarkBase = 1000;

    public static int DayMarkOf(GrantNotificationAudience audience) => DayMarkBase + (int)audience;

    private readonly GrantNotificationDispatcher _dispatcher;
    private readonly IRepository<GrantNotificationLog, Guid> _logRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantApplicationDocument, Guid> _docRepo;
    private readonly IRepository<GrantApplicationDocumentVersion, Guid> _versionRepo;
    private readonly IRepository<GrantApplicationActivity, Guid> _activityRepo;
    private readonly IRepository<GrantDecision, Guid> _decisionRepo;
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly IRepository<GrantMeetingProposal, Guid> _proposalRepo;
    private readonly IRepository<GrantRecommendation, Guid> _recRepo;
    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly TenantDisplayNameResolver _tenantNames;
    private readonly IDataFilter _dataFilter;
    private readonly IStringLocalizer<PlatformResource> _l;

    private readonly Dictionary<Guid, string?> _firmNames = new();
    private readonly Dictionary<Guid, string?> _callNames = new();

    public GrantEscalationManager(
        GrantNotificationDispatcher dispatcher,
        IRepository<GrantNotificationLog, Guid> logRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantApplicationDocument, Guid> docRepo,
        IRepository<GrantApplicationDocumentVersion, Guid> versionRepo,
        IRepository<GrantApplicationActivity, Guid> activityRepo,
        IRepository<GrantDecision, Guid> decisionRepo,
        IRepository<GrantInterest, Guid> interestRepo,
        IRepository<GrantMeetingProposal, Guid> proposalRepo,
        IRepository<GrantRecommendation, Guid> recRepo,
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        TenantDisplayNameResolver tenantNames,
        IDataFilter dataFilter,
        IStringLocalizer<PlatformResource> l)
    {
        _dispatcher = dispatcher;
        _logRepo = logRepo;
        _appRepo = appRepo;
        _docRepo = docRepo;
        _versionRepo = versionRepo;
        _activityRepo = activityRepo;
        _decisionRepo = decisionRepo;
        _interestRepo = interestRepo;
        _proposalRepo = proposalRepo;
        _recRepo = recRepo;
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _tenantNames = tenantNames;
        _dataFilter = dataFilter;
        _l = l;
    }

    /// <summary>Vadesi gelen yükseltmeleri gönderir.</summary>
    /// <returns>Gönderilen yükseltme sayısı.</returns>
    public async Task<int> RunAsync(DateTime now)
    {
        var templates = await _dispatcher.GetEnabledEscalationsAsync();
        if (templates.Count == 0)
        {
            return 0;
        }

        var byTrigger = templates
            .GroupBy(t => t.Trigger)
            .ToDictionary(g => g.Key, g => g.OrderBy(t => t.AfterDays).ToList());

        var pending = await FindPendingAsync(
            byTrigger.ToDictionary(p => p.Key, p => p.Value.Min(t => t.AfterDays!.Value)), now);

        var sent = 0;
        foreach (var action in pending)
        {
            var waited = (int)(now - action.Since).TotalDays;
            foreach (var template in byTrigger[action.Trigger].Where(t => t.AfterDays <= waited))
            {
                if (await TrySendAsync(template, action, waited, now))
                {
                    sent++;
                }
            }
        }

        return sent;
    }

    private async Task<bool> TrySendAsync(
        GrantNotificationTemplate template, GrantPendingAction action, int waited, DateTime now)
    {
        var dayMark = DayMarkOf(template.Audience);

        GrantNotificationLog? log;
        using (_dataFilter.Disable<IMultiTenant>())
        {
            log = await _logRepo.FirstOrDefaultAsync(
                l => l.Trigger == action.Trigger && l.EntityId == action.EntityId && l.DayMark == dayMark);
        }

        // Bu bekleme için zaten gitti. Kayıt daha eskiyse iş arada yapılıp yeniden beklemeye girmiştir.
        if (log != null && log.SentAt >= action.Since)
        {
            return false;
        }

        var values = new Dictionary<string, string?>(action.Values)
        {
            ["{bekleyen_gün}"] = waited.ToString()
        };

        try
        {
            // Alıcı yoksa (ör. kiracıda yönetici yok) işaret BIRAKILMAZ: sonradan biri eklenirse yine gitsin.
            if (!await _dispatcher.SendEscalationAsync(template, action, values))
            {
                return false;
            }
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "Hibe yükseltmesi gönderilemedi. Tetikleyici: {Trigger}, Kayıt: {EntityId}",
                action.Trigger, action.EntityId);
            return false;
        }

        if (log == null)
        {
            await _logRepo.InsertAsync(
                new GrantNotificationLog(GuidGenerator.Create(), action.TenantId, action.Trigger, action.EntityId, dayMark, now),
                autoSave: true);
        }
        else
        {
            log.MarkSent(now);
            await _logRepo.UpdateAsync(log, autoSave: true);
        }

        return true;
    }

    // ------------------------------------------------------------------ bekleyen işler

    /// <param name="minDays">Tetikleyici başına en kısa yükseltme süresi; daha yeni bekleyen iş hiç okunmaz.</param>
    public async Task<List<GrantPendingAction>> FindPendingAsync(
        IReadOnlyDictionary<GrantNotificationTrigger, int> minDays, DateTime now)
    {
        bool Wants(GrantNotificationTrigger t) => minDays.ContainsKey(t);
        DateTime Cutoff(GrantNotificationTrigger t) => now.AddDays(-minDays[t]);

        var result = new List<GrantPendingAction>();

        // Bütün firmaların kayıtları taranır; gönderim ayrı yapılır (alıcı listeleri kiracı süzgeciyle çıkar).
        using (_dataFilter.Disable<IMultiTenant>())
        {
            if (Wants(GrantNotificationTrigger.DocumentRevisionRequested) || Wants(GrantNotificationTrigger.DocumentUploaded)
                || Wants(GrantNotificationTrigger.HandedOver) || Wants(GrantNotificationTrigger.ApplicationSubmitted))
            {
                await AddApplicationWorkAsync(result, Wants, Cutoff);
            }

            if (Wants(GrantNotificationTrigger.InterestReceived) || Wants(GrantNotificationTrigger.IdeaShared))
            {
                await AddInterestWorkAsync(result, Wants, Cutoff);
            }

            if (Wants(GrantNotificationTrigger.MeetingProposed))
            {
                var cutoff = Cutoff(GrantNotificationTrigger.MeetingProposed);
                foreach (var p in await _proposalRepo.GetListAsync(
                             p => p.Status == GrantMeetingStatus.Bekliyor && p.CreationTime <= cutoff))
                {
                    result.Add(new GrantPendingAction(
                        GrantNotificationTrigger.MeetingProposed, p.Id, nameof(GrantMeetingProposal), p.Id,
                        p.TenantId, GrantPartyRole.Danisman, null, p.CreationTime,
                        await FirmAndCallAsync(p.TenantId, p.GrantCallId)));
                }
            }

            if (Wants(GrantNotificationTrigger.RecommendationSent))
            {
                await AddRecommendationWorkAsync(result, Cutoff(GrantNotificationTrigger.RecommendationSent), now);
            }
        }

        return result;
    }

    /// <summary>
    /// Başvuruya bağlı işler: revizyon/inceleme bekleyen evrak, sıra devri, gönderilmiş ama aşaması
    /// ilerletilmemiş başvuru. Projeye dönmüş ya da reddedilmiş başvuruda iş beklenmez.
    /// </summary>
    private async Task AddApplicationWorkAsync(
        List<GrantPendingAction> result,
        Func<GrantNotificationTrigger, bool> wants,
        Func<GrantNotificationTrigger, DateTime> cutoff)
    {
        var apps = (await _appRepo.GetListAsync(a => a.ProjectId == null)).ToDictionary(a => a.Id);
        if (apps.Count == 0)
        {
            return;
        }

        var decisions = await _decisionRepo.GetListAsync();
        var decided = decisions.Select(d => d.GrantApplicationId).ToHashSet();
        var rejected = decisions.Where(d => d.Outcome == GrantDecisionOutcome.Reddedildi)
            .Select(d => d.GrantApplicationId).ToHashSet();
        apps = apps.Where(p => !rejected.Contains(p.Key)).ToDictionary(p => p.Key, p => p.Value);

        // --- Evrak
        if (wants(GrantNotificationTrigger.DocumentRevisionRequested) || wants(GrantNotificationTrigger.DocumentUploaded))
        {
            var docs = await _docRepo.GetListAsync(d =>
                d.Status == GrantDocumentStatus.RevizyonIstendi || d.Status == GrantDocumentStatus.Incelemede);
            var reviewIds = docs.Where(d => d.Status == GrantDocumentStatus.Incelemede).Select(d => d.Id).ToList();
            var versions = wants(GrantNotificationTrigger.DocumentUploaded) && reviewIds.Count > 0
                ? await _versionRepo.GetListAsync(v => reviewIds.Contains(v.DocumentId))
                : [];

            foreach (var doc in docs)
            {
                if (!apps.TryGetValue(doc.GrantApplicationId, out var app))
                {
                    continue;
                }

                if (doc.Status == GrantDocumentStatus.RevizyonIstendi
                    && wants(GrantNotificationTrigger.DocumentRevisionRequested)
                    && doc.StatusChangedAt is { } requestedAt
                    && requestedAt <= cutoff(GrantNotificationTrigger.DocumentRevisionRequested))
                {
                    result.Add(new GrantPendingAction(
                        GrantNotificationTrigger.DocumentRevisionRequested, doc.Id, nameof(GrantApplication), app.Id,
                        app.TenantId, GrantPartyRole.Firma, app.AssignedUserId, requestedAt,
                        await DocumentValuesAsync(app, doc)));
                }

                if (doc.Status == GrantDocumentStatus.Incelemede && wants(GrantNotificationTrigger.DocumentUploaded))
                {
                    // Yalnız firmanın yüklediği evrak danışman incelemesi bekler.
                    var latest = versions.FirstOrDefault(v => v.DocumentId == doc.Id && v.VersionNo == doc.LatestVersionNo);
                    if (latest is { UploaderRole: GrantPartyRole.Firma }
                        && latest.CreationTime <= cutoff(GrantNotificationTrigger.DocumentUploaded))
                    {
                        result.Add(new GrantPendingAction(
                            GrantNotificationTrigger.DocumentUploaded, doc.Id, nameof(GrantApplication), app.Id,
                            app.TenantId, GrantPartyRole.Danisman, app.AssignedUserId, latest.CreationTime,
                            await DocumentValuesAsync(app, doc)));
                    }
                }
            }
        }

        // --- Sıra devri ve gönderim
        if (!wants(GrantNotificationTrigger.HandedOver) && !wants(GrantNotificationTrigger.ApplicationSubmitted))
        {
            return;
        }

        var appIds = apps.Keys.ToList();
        var activities = (await _activityRepo.GetListAsync(a =>
                appIds.Contains(a.GrantApplicationId)
                && (a.Kind == GrantActivityKind.HandedOver || a.Kind == GrantActivityKind.StageMoved)))
            .ToLookup(a => a.GrantApplicationId);

        foreach (var app in apps.Values)
        {
            var acts = activities[app.Id].ToList();

            if (wants(GrantNotificationTrigger.HandedOver)
                && app.SubmittedAt == null
                && app.PendingParty is GrantPartyRole.Firma or GrantPartyRole.Danisman
                && acts.Where(a => a.Kind == GrantActivityKind.HandedOver).MaxBy(a => a.CreationTime) is { } handover
                && handover.CreationTime <= cutoff(GrantNotificationTrigger.HandedOver))
            {
                var values = await FirmAndCallAsync(app.TenantId, app.GrantCallId);
                values["{sıradaki_taraf}"] = _l[$"Grants:Notify:Escalation:Side:{app.PendingParty}"];
                result.Add(new GrantPendingAction(
                    GrantNotificationTrigger.HandedOver, app.Id, nameof(GrantApplication), app.Id,
                    app.TenantId, app.PendingParty, app.AssignedUserId, handover.CreationTime, values));
            }

            if (wants(GrantNotificationTrigger.ApplicationSubmitted)
                && app.SubmittedAt is { } submittedAt
                && submittedAt <= cutoff(GrantNotificationTrigger.ApplicationSubmitted)
                && !decided.Contains(app.Id)
                && !acts.Any(a => a.Kind == GrantActivityKind.StageMoved && a.CreationTime > submittedAt))
            {
                result.Add(new GrantPendingAction(
                    GrantNotificationTrigger.ApplicationSubmitted, app.Id, nameof(GrantApplication), app.Id,
                    app.TenantId, GrantPartyRole.Danisman, app.AssignedUserId, submittedAt,
                    await FirmAndCallAsync(app.TenantId, app.GrantCallId)));
            }
        }
    }

    /// <summary>Yanıt bekleyen ilgi talebi (kesin yanıta kadar) ve yanıtlanmamış havuz fikri.</summary>
    private async Task AddInterestWorkAsync(
        List<GrantPendingAction> result,
        Func<GrantNotificationTrigger, bool> wants,
        Func<GrantNotificationTrigger, DateTime> cutoff)
    {
        var interests = await _interestRepo.GetListAsync(i =>
            i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor);

        foreach (var i in interests)
        {
            // Kullanıcı kararı 10-29: incelemeye almak işi bitirmez, kesin yanıt (başvuru açıldı / uygun değil) bitirir.
            if (i.GrantCallId is { } callId
                && wants(GrantNotificationTrigger.InterestReceived)
                && i.CreationTime <= cutoff(GrantNotificationTrigger.InterestReceived))
            {
                result.Add(new GrantPendingAction(
                    GrantNotificationTrigger.InterestReceived, i.Id, nameof(GrantInterest), i.Id,
                    i.TenantId, GrantPartyRole.Danisman, null, i.CreationTime,
                    await FirmAndCallAsync(i.TenantId, callId)));
            }

            if (i.GrantCallId == null
                && i.Status == GrantInterestStatus.Yeni
                && wants(GrantNotificationTrigger.IdeaShared)
                && i.CreationTime <= cutoff(GrantNotificationTrigger.IdeaShared))
            {
                result.Add(new GrantPendingAction(
                    GrantNotificationTrigger.IdeaShared, i.Id, nameof(GrantInterest), i.Id,
                    i.TenantId, GrantPartyRole.Danisman, null, i.CreationTime,
                    new Dictionary<string, string?>
                    {
                        ["{firma_adı}"] = await FirmNameAsync(i.TenantId),
                        ["{fikir}"] = Excerpt(i.Note)
                    }));
            }
        }
    }

    /// <summary>
    /// Firmaya önerilen ve henüz tepki verilmemiş (ilgi bildirilmemiş, reddedilmemiş) açık çağrı. Çağrı
    /// kapanınca ya da son tarih geçince iş düşer.
    /// </summary>
    private async Task AddRecommendationWorkAsync(List<GrantPendingAction> result, DateTime cutoff, DateTime now)
    {
        var recs = await _recRepo.GetListAsync(r =>
            (r.Status == GrantRecommendationStatus.New || r.Status == GrantRecommendationStatus.Seen)
            && r.CreationTime <= cutoff);
        if (recs.Count == 0)
        {
            return;
        }

        var callIds = recs.Select(r => r.GrantCallId).Distinct().ToList();
        var openCalls = (await _callRepo.GetListAsync(c => callIds.Contains(c.Id)))
            .Where(c => c.Status == GrantCallStatus.Acik && (c.Deadline == null || c.Deadline >= now))
            .Select(c => c.Id)
            .ToHashSet();
        var reacted = (await _interestRepo.GetListAsync(i => i.GrantCallId != null && callIds.Contains(i.GrantCallId.Value)))
            .Select(i => (i.TenantId, i.GrantCallId!.Value))
            .ToHashSet();

        foreach (var r in recs.Where(r => openCalls.Contains(r.GrantCallId) && !reacted.Contains((r.TenantId, r.GrantCallId))))
        {
            result.Add(new GrantPendingAction(
                GrantNotificationTrigger.RecommendationSent, r.Id, nameof(GrantCall), r.GrantCallId,
                r.TenantId, GrantPartyRole.Firma, r.AssignedUserId, r.CreationTime,
                await FirmAndCallAsync(r.TenantId, r.GrantCallId)));
        }
    }

    // ------------------------------------------------------------------ değişkenler

    private async Task<Dictionary<string, string?>> DocumentValuesAsync(GrantApplication app, GrantApplicationDocument doc)
    {
        var values = await FirmAndCallAsync(app.TenantId, app.GrantCallId);
        values["{evrak_adı}"] = doc.Name;
        return values;
    }

    private async Task<Dictionary<string, string?>> FirmAndCallAsync(Guid? tenantId, Guid callId)
        => new()
        {
            ["{firma_adı}"] = await FirmNameAsync(tenantId),
            ["{çağrı_adı}"] = await CallNameAsync(callId)
        };

    private async Task<string?> FirmNameAsync(Guid? tenantId)
    {
        if (tenantId is not { } id)
        {
            return null;
        }

        if (!_firmNames.TryGetValue(id, out var name))
        {
            _firmNames[id] = name = await _tenantNames.GetAsync(id);
        }

        return name;
    }

    /// <summary>İlk bildirimlerdeki gibi programın adı.</summary>
    private async Task<string?> CallNameAsync(Guid callId)
    {
        if (!_callNames.TryGetValue(callId, out var name))
        {
            var call = await _callRepo.FindAsync(callId);
            name = call == null ? null : (await _grantRepo.FindAsync(call.GrantId))?.Name;
            _callNames[callId] = name;
        }

        return name;
    }

    /// <summary>Fikir uzun metinse cümleyi boğmasın (ilk bildirimdeki kısaltmayla aynı).</summary>
    private static string? Excerpt(string? note)
    {
        const int max = 120;
        var trimmed = note?.Trim();
        return trimmed == null || trimmed.Length <= max ? trimmed : trimmed[..max].TrimEnd() + "…";
    }
}
