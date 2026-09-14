using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Microsoft.Extensions.Localization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>Kapanış zincirinin host'a dönen özeti.</summary>
public sealed record GrantCallClosingResult(int MissedInterestCount, int UnfinishedApplicationCount, int NotifiedFirmCount);

/// <summary>
/// 18b · Çağrı kapanınca çalışan SABİT zincir (kullanıcı kararı: çağrı başına ayar yok).
///
/// <list type="number">
/// <item>Karara bağlanmamış ilgi talepleri <see cref="GrantInterestStatus.Kacirildi"/> olur; gerekçe otomatik yazılır.</item>
/// <item>Talebi yanıtlanmamış ya da başvurusu gönderilmemiş her firmaya TEK bildirim: çağrı kapandı,
/// yazdıkları kayıtlı, profiline uyan iki açık çağrı.</item>
/// </list>
///
/// <para>Takip listesi için iş yok: kiracı akışı zaten yalnız açık çağrıları listeler. "Yeni dönem açılınca
/// haber ver" aboneliği ve danışman özeti bu zincirde YOK (abonelik kaydı tutulmuyor).</para>
///
/// <para>Bildirim <see cref="GrantNotificationLog"/> ile işaretlenir: host çağrıyı yeniden açıp tekrar
/// kapatırsa aynı firmaya ikinci kez gitmez.</para>
/// </summary>
public class GrantCallClosingManager : DomainService
{
    /// <summary>Kapanış bildirimi eşik taşımaz; log anahtarında sabit.</summary>
    private const int ClosingDayMark = 0;

    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantCriteriaTag, Guid> _criteriaRepo;
    private readonly IRepository<GrantInterest, Guid> _interestRepo;
    private readonly IRepository<GrantApplication, Guid> _appRepo;
    private readonly IRepository<GrantNotificationLog, Guid> _logRepo;
    private readonly FirmSignalsBuilder _signalsBuilder;
    private readonly GrantMatchManager _matcher;
    private readonly GrantMatchWeightResolver _weightResolver;
    private readonly GrantNotificationDispatcher _dispatcher;
    private readonly IDataFilter<IMultiTenant> _mtFilter;
    private readonly IStringLocalizer<PlatformResource> _l;

    public GrantCallClosingManager(
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantCriteriaTag, Guid> criteriaRepo,
        IRepository<GrantInterest, Guid> interestRepo,
        IRepository<GrantApplication, Guid> appRepo,
        IRepository<GrantNotificationLog, Guid> logRepo,
        FirmSignalsBuilder signalsBuilder,
        GrantMatchManager matcher,
        GrantMatchWeightResolver weightResolver,
        GrantNotificationDispatcher dispatcher,
        IDataFilter<IMultiTenant> mtFilter,
        IStringLocalizer<PlatformResource> l)
    {
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _criteriaRepo = criteriaRepo;
        _interestRepo = interestRepo;
        _appRepo = appRepo;
        _logRepo = logRepo;
        _signalsBuilder = signalsBuilder;
        _matcher = matcher;
        _weightResolver = weightResolver;
        _dispatcher = dispatcher;
        _mtFilter = mtFilter;
        _l = l;
    }

    /// <summary>Host bağlamında çağrılır; çağrı zaten Kapandı durumuna geçirilmiş olmalı.</summary>
    public async Task<GrantCallClosingResult> RunAsync(Guid callId)
    {
        var call = await _callRepo.GetAsync(callId);
        var grant = await _grantRepo.GetAsync(call.GrantId);
        var now = Clock.Now;

        // 🔴 Talepler ve başvurular kiracılara dağınık: OKUMA için filtre bilinçli kapatılır,
        // YAZMA her kaydın kendi kiracı bağlamında yapılır.
        List<GrantInterest> pending;
        List<GrantApplication> unfinished;
        using (_mtFilter.Disable())
        {
            pending = await _interestRepo.GetListAsync(i =>
                i.GrantCallId == callId && i.TenantId != null
                && (i.Status == GrantInterestStatus.Yeni || i.Status == GrantInterestStatus.Inceleniyor));
            unfinished = await _appRepo.GetListAsync(a =>
                a.GrantCallId == callId && a.TenantId != null && a.SubmittedAt == null && a.ProjectId == null);
        }

        var reason = _l["Grants:CallClose:MissedReason", now.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture)].Value;
        foreach (var interest in pending)
        {
            using (CurrentTenant.Change(interest.TenantId))
            {
                var tracked = await _interestRepo.GetAsync(interest.Id);
                tracked.MarkMissed(reason, now);
                await _interestRepo.UpdateAsync(tracked, autoSave: true);
            }
        }

        var tenantIds = pending.Select(i => i.TenantId!.Value)
            .Concat(unfinished.Select(a => a.TenantId!.Value))
            .Distinct()
            .ToList();

        var notified = 0;
        if (tenantIds.Count > 0)
        {
            var similar = await LoadOpenCatalogAsync(callId);
            foreach (var tenantId in tenantIds)
            {
                if (await NotifyAsync(tenantId, call, grant, similar, now))
                {
                    notified++;
                }
            }
        }

        return new GrantCallClosingResult(pending.Count, unfinished.Count, notified);
    }

    private async Task<bool> NotifyAsync(Guid tenantId, GrantCall call, Grant grant, OpenCatalog catalog, DateTime now)
    {
        var logKey = LogKeyOf(call.Id, tenantId);
        using (CurrentTenant.Change(tenantId))
        {
            if (await _logRepo.FirstOrDefaultAsync(x =>
                    x.Trigger == GrantNotificationTrigger.CallClosed && x.EntityId == logKey) != null)
            {
                return false;
            }
        }

        var suggestions = await SimilarCallsTextAsync(tenantId, catalog);
        var sent = await _dispatcher.DispatchToTenantAsync(
            GrantNotificationTrigger.CallClosed,
            tenantId,
            new Dictionary<string, string?>
            {
                ["{çağrı_adı}"] = grant.Name,
                ["{benzer_çağrılar}"] = suggestions
            },
            nameof(GrantCall), call.Id);

        if (sent)
        {
            using (CurrentTenant.Change(tenantId))
            {
                await _logRepo.InsertAsync(
                    new GrantNotificationLog(GuidGenerator.Create(), tenantId, GrantNotificationTrigger.CallClosed, logKey, ClosingDayMark, now),
                    autoSave: true);
            }
        }

        return sent;
    }

    /// <summary>
    /// 🔴 Günlüğün benzersiz indeksi (Trigger, EntityId, DayMark) kiracıyı İÇERMEZ: hatırlatmalarda
    /// konu kayıt (başvuru/rapor) zaten kiracıya özgüdür. Çağrı ise bütün firmalarda ortak olduğundan
    /// ikinci firmanın kaydı indekse çarpıyordu. Anahtar çağrı + kiracıdan sabit türetilir; şema değişmez.
    /// </summary>
    internal static Guid LogKeyOf(Guid callId, Guid tenantId)
    {
        var bytes = new byte[32];
        callId.TryWriteBytes(bytes.AsSpan(0, 16));
        tenantId.TryWriteBytes(bytes.AsSpan(16, 16));
        return new Guid(MD5.HashData(bytes));
    }

    /// <summary>"TÜBİTAK 1501 (%94), Teknoyatırım (%79)" — profile göre en uyumlu iki açık çağrı.</summary>
    private async Task<string> SimilarCallsTextAsync(Guid tenantId, OpenCatalog catalog)
    {
        if (catalog.Calls.Count == 0)
        {
            return _l["Grants:CallClose:NoSimilar"].Value;
        }

        var signals = await _signalsBuilder.BuildAsync(tenantId);
        var top = catalog.Calls
            .Select(c =>
            {
                var g = catalog.Grants[c.GrantId];
                var score = _matcher.Explain(signals, g, catalog.Tags.GetValueOrDefault(g.Id, new List<GrantCriteriaTag>()), catalog.Weights[g.Id]).Total;
                return (Name: g.Name, Score: score);
            })
            .OrderByDescending(x => x.Score)
            .Take(2)
            .ToList();

        return string.Join(", ", top.Select(x => $"{x.Name} (%{x.Score})"));
    }

    private sealed record OpenCatalog(
        List<GrantCall> Calls,
        Dictionary<Guid, Grant> Grants,
        Dictionary<Guid, List<GrantCriteriaTag>> Tags,
        Dictionary<Guid, GrantMatchWeightSet> Weights);

    private async Task<OpenCatalog> LoadOpenCatalogAsync(Guid closedCallId)
    {
        var calls = await _callRepo.GetListAsync(c => c.Status == GrantCallStatus.Acik && c.Id != closedCallId && c.TenantId == null);
        var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
        var grants = (await _grantRepo.GetListAsync(g => grantIds.Contains(g.Id) && g.TenantId == null)).ToDictionary(g => g.Id);
        calls = calls.Where(c => grants.ContainsKey(c.GrantId)).ToList();
        var tags = (await _criteriaRepo.GetListAsync(t => grantIds.Contains(t.GrantId) && t.TenantId == null))
            .GroupBy(t => t.GrantId).ToDictionary(g => g.Key, g => g.ToList());
        var weights = await _weightResolver.ResolveManyAsync(grants.Keys);
        return new OpenCatalog(calls, grants, tags, weights);
    }
}
