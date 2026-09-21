using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Grants;

/// <summary>
/// 6d · Tarihe bağlı iki hatırlatmayı üretir: eksik evrak (son başvuruya 7 / 3 / 1 gün)
/// ve rapor teslimi (30 / 14 / 3 gün).
///
/// <para>Günde bir koşar. "7 gün kaldı" koşulu o gün boyunca doğru kaldığı için
/// gönderim <see cref="GrantNotificationLog"/> ile işaretlenir; işaret olmasaydı
/// worker her turda aynı hatırlatmayı yeniden gönderirdi.</para>
///
/// <para>Eşikler AŞILDIĞINDA değil, TAM O GÜN yakalanır: kullanıcı 5. günde sisteme
/// hiç girmese bile 3. gün eşiği ayrıca ateşlenir, yani üç ayrı uyarı alır.</para>
/// </summary>
public class GrantDeadlineReminderWorker : AsyncPeriodicBackgroundWorkerBase
{
    /// <summary>Evrak eşikleri — son başvuruya kalan gün.</summary>
    public static readonly int[] DocumentDayMarks = [7, 3, 1];

    /// <summary>Rapor eşikleri — teslime kalan gün.</summary>
    public static readonly int[] ReportDayMarks = [30, 14, 3];

    /// <summary>
    /// 🔴 NTF-02: Dönüşüm eşikleri — karardan BU KADAR gün GEÇTİ ve proje hâlâ yok.
    ///
    /// <para>Diğer iki eşik kümesi geleceğe bakar ("son tarihe 7 gün kaldı"), bu
    /// geçmişe: onaylanmış başvurunun askıda kalma süresi. Üç eşik, diğerlerindeki
    /// gibi TAM O GÜN yakalanır; danışman 5. günde sisteme hiç girmese bile 7. gün
    /// eşiği ayrıca ateşlenir.</para>
    /// </summary>
    public static readonly int[] ConversionDayMarks = [3, 7, 14];

    /// <summary>
    /// 🔴 LIF-03: Bir turda en çok kaç çağrı otomatik kapatılır.
    ///
    /// <para>Kapanış zinciri çağrı başına firmalara bildirim gönderir. Sınır olmasaydı
    /// özellik canlıya çıktığı gün, tarihi geçtiği hâlde "Açık" kalmış TÜM çağrılar aynı
    /// turda kapanır ve firmaların kutusu tek seferde dolardı. Sınır yalnız BİRİKMİŞ
    /// devri yavaşlatır — günlük işleyişte tarihi geçen çağrı sayısı zaten tek hanelidir
    /// ve kalanlar ertesi gün kapanır.</para>
    /// </summary>
    public const int MaxAutoClosePerRun = 20;

    public GrantDeadlineReminderWorker(AbpAsyncTimer timer, IServiceScopeFactory serviceScopeFactory)
        : base(timer, serviceScopeFactory)
    {
        Timer.Period = 24 * 60 * 60 * 1000; // 24 saat
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var sp = workerContext.ServiceProvider;
        var clock = sp.GetRequiredService<IClock>();
        var today = clock.Now.Date;

        // 🔴 Kapanış ÖNCE koşar: tarihi geçmiş çağrı aynı turda hatırlatma da üretmesin.
        await RunAutoCloseAsync(sp, today);
        await RunDocumentRemindersAsync(sp, today);
        await RunReportRemindersAsync(sp, today);
        await RunConversionRemindersAsync(sp, today);
    }

    // ------------------------------------------------------------- kapanış

    /// <summary>
    /// 🔴 LIF-03: Son başvuru tarihi geçtiği hâlde "Açık" kalmış çağrıları kapatır ve
    /// var olan kapanış zincirini koşturur.
    ///
    /// <para>Kapanış bugüne kadar TAMAMEN ELLEydi: host unutunca tarihi geçmiş çağrı
    /// "Açık" görünmeye devam ediyor, karara bağlanmamış ilgi talepleri süresiz
    /// "Yeni/İnceleniyor"da kalıyor ve firmaya hiçbir cevap gitmiyordu.</para>
    ///
    /// <para>Zincirin kendisi yeniden yazılmadı: <see cref="GrantCallClosingManager"/>
    /// host elle kapattığında zaten koşuyor ve mükerrer bildirimi
    /// <see cref="GrantNotificationLog"/> engelliyor. Worker yalnız durumu çeker ve
    /// aynı zinciri çağırır — iki kapanış yolu böylece ayrışmaz.</para>
    /// </summary>
    private async Task RunAutoCloseAsync(IServiceProvider sp, DateTime today)
    {
        var callRepo = sp.GetRequiredService<IRepository<GrantCall, Guid>>();
        var closingManager = sp.GetRequiredService<GrantCallClosingManager>();
        var dataFilter = sp.GetRequiredService<IDataFilter<IMultiTenant>>();

        List<GrantCall> expired;
        using (dataFilter.Disable())
        {
            // Yalnız HOST kataloğu (TenantId == null) ve yalnız Acik. Taslak yayımlanmamıştır,
            // Planlandi henüz açılmamıştır — ikisinin de kapanış zinciri anlamsız olurdu.
            expired = (await callRepo.GetListAsync(c =>
                    c.TenantId == null
                    && c.Status == GrantCallStatus.Acik
                    && c.Deadline != null
                    && c.Deadline!.Value.Date < today))
                .OrderBy(c => c.Deadline)
                .Take(MaxAutoClosePerRun)
                .ToList();
        }

        foreach (var call in expired)
        {
            try
            {
                call.Status = GrantCallStatus.Kapandi;
                await callRepo.UpdateAsync(call, autoSave: true);

                var result = await closingManager.RunAsync(call.Id);

                Logger.LogInformation(
                    "Çağrı {CallId} son başvuru tarihi ({Deadline:dd.MM.yyyy}) geçtiği için otomatik kapatıldı. " +
                    "Kaçırılan talep: {Missed}, gönderilmemiş başvuru: {Unfinished}, bildirilen firma: {Notified}.",
                    call.Id, call.Deadline, result.MissedInterestCount,
                    result.UnfinishedApplicationCount, result.NotifiedFirmCount);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex,
                    "Çağrı {CallId} otomatik kapatılırken hata oluştu. Sonraki çağrıya geçiliyor.", call.Id);
            }
        }
    }

    // ------------------------------------------------------------- dönüşüm

    /// <summary>
    /// 🔴 NTF-02: Onaylanmış ama projeye dönüştürülmemiş başvuruları tarar.
    ///
    /// <para>Bu durumu bugüne kadar hiçbir iş taramıyordu: para bağlanmış bir
    /// başvuru süresiz askıda kalabiliyor, proje kurulmadığı için bütçe takibi ve
    /// tahsilat planı hiç işlemiyordu.</para>
    ///
    /// <para>Hatırlatma HOST'a gider: dönüşüm danışman eylemidir
    /// (<c>GrantApplicationConversionAppService.EnsureHostContext</c>), firmanın
    /// yapabileceği bir şey yok.</para>
    /// </summary>
    private async Task RunConversionRemindersAsync(IServiceProvider sp, DateTime today)
    {
        var decisionRepo = sp.GetRequiredService<IRepository<GrantDecision, Guid>>();
        var appRepo = sp.GetRequiredService<IRepository<GrantApplication, Guid>>();
        var callRepo = sp.GetRequiredService<IRepository<GrantCall, Guid>>();
        var grantRepo = sp.GetRequiredService<IRepository<Grant, Guid>>();
        var displayNames = sp.GetRequiredService<Apya.Platform.Tenants.TenantDisplayNameResolver>();
        var dataFilter = sp.GetRequiredService<IDataFilter<IMultiTenant>>();

        List<GrantDecision> decisions;
        List<GrantApplication> applications;
        List<GrantCall> calls;

        using (dataFilter.Disable())
        {
            // Reddedilen karar dönüşüm beklemiyor; kısmi onay bekliyor (tutar indirilerek kabul).
            var targets = ConversionDayMarks.Select(d => today.AddDays(-d)).ToList();
            decisions = await decisionRepo.GetListAsync(
                d => d.Outcome != GrantDecisionOutcome.Reddedildi
                     && targets.Contains(d.DecidedOn.Date));
            if (decisions.Count == 0)
            {
                return;
            }

            var appIds = decisions.Select(d => d.GrantApplicationId).Distinct().ToList();
            applications = await appRepo.GetListAsync(a => appIds.Contains(a.Id) && a.ProjectId == null);
            if (applications.Count == 0)
            {
                return;
            }

            var callIds = applications.Select(a => a.GrantCallId).Distinct().ToList();
            calls = await callRepo.GetListAsync(c => callIds.Contains(c.Id));

            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            foreach (var grant in await grantRepo.GetListAsync(g => grantIds.Contains(g.Id)))
            {
                _grantNames[grant.Id] = grant.Name;
            }
        }

        var appById = applications.ToDictionary(a => a.Id);
        var callById = calls.ToDictionary(c => c.Id);

        foreach (var decision in decisions)
        {
            if (!appById.TryGetValue(decision.GrantApplicationId, out var application))
            {
                continue;
            }

            var dayMark = (today - decision.DecidedOn.Date).Days;
            var grantId = callById.TryGetValue(application.GrantCallId, out var call) ? call.GrantId : Guid.Empty;

            var firmName = application.TenantId is { } tenantId
                ? await displayNames.GetAsync(tenantId)
                : string.Empty;

            await SendAsync(sp,
                GrantNotificationTrigger.ConversionPending,
                entityId: application.Id,
                dayMark: dayMark,
                // 🔴 HOST'a gider: dönüşümü yapabilecek olan danışmandır.
                tenantId: null,
                values: new Dictionary<string, string?>
                {
                    ["{firma_adı}"] = firmName,
                    ["{çağrı_adı}"] = GrantName(grantId),
                    ["{karar_tarihi}"] = decision.DecidedOn.ToString("dd.MM.yyyy"),
                    ["{bekleyen_gün}"] = dayMark.ToString()
                },
                entityType: nameof(GrantApplication));
        }
    }

    // ---------------------------------------------------------------- evrak

    private async Task RunDocumentRemindersAsync(IServiceProvider sp, DateTime today)
    {
        var appRepo = sp.GetRequiredService<IRepository<GrantApplication, Guid>>();
        var callRepo = sp.GetRequiredService<IRepository<GrantCall, Guid>>();
        var docRepo = sp.GetRequiredService<IRepository<GrantApplicationDocument, Guid>>();
        var grantRepo = sp.GetRequiredService<IRepository<Grant, Guid>>();
        var displayNames = sp.GetRequiredService<Apya.Platform.Tenants.TenantDisplayNameResolver>();
        var dataFilter = sp.GetRequiredService<IDataFilter<IMultiTenant>>();

        List<GrantCall> calls;
        List<GrantApplication> applications;
        List<GrantApplicationDocument> documents;

        using (dataFilter.Disable())
        {
            // Eşik günlerinden birine denk gelen çağrılar.
            var targets = DocumentDayMarks.Select(d => today.AddDays(d)).ToList();
            calls = await callRepo.GetListAsync(c => c.Deadline != null && targets.Contains(c.Deadline!.Value.Date));
            if (calls.Count == 0)
            {
                return;
            }

            var callIds = calls.Select(c => c.Id).ToList();
            applications = await appRepo.GetListAsync(
                a => callIds.Contains(a.GrantCallId) && a.SubmittedAt == null);
            if (applications.Count == 0)
            {
                return;
            }

            var appIds = applications.Select(a => a.Id).ToList();
            documents = await docRepo.GetListAsync(
                d => appIds.Contains(d.GrantApplicationId)
                     && d.Obligation == GrantDocumentObligation.Zorunlu
                     && d.Status != GrantDocumentStatus.Onaylandi);

            // 🔴 NTF-04: Burada "eksik evrak yoksa hiç çıkma" diye erken dönüş VARDI.
            // Tam da o durum — evrakları tamam ama başvurusu gönderilmemiş firma —
            // hatırlatma gerektiriyor; erken dönüş onu susturuyordu.

            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            _grantNames = (await grantRepo.GetListAsync(g => grantIds.Contains(g.Id)))
                .ToDictionary(g => g.Id, g => g.Name);
        }

        var callById = calls.ToDictionary(c => c.Id);

        foreach (var application in applications)
        {
            var call = callById[application.GrantCallId];
            var dayMark = (call.Deadline!.Value.Date - today).Days;

            var missing = documents.Where(d => d.GrantApplicationId == application.Id).ToList();

            if (missing.Count == 0)
            {
                // 🔴 NTF-04: Evrak tamam, başvuru hâlâ gönderilmedi. Ayrı tetikleyici
                // kullanılır çünkü evrak şablonunun gövdesi {eksik_evrak_sayısı} taşır
                // ve burada o sayı sıfırdır — "0 eksik evrak" diye giden bir hatırlatma
                // kullanıcıyı yanıltırdı.
                //
                // Alıcı SIRASI KİMDEYSE: gönderimi yapacak taraf odur. Firma tarafındaysa
                // kiracıya, danışmandaysa host'a gider.
                await SendAsync(sp,
                    GrantNotificationTrigger.SubmissionDeadlineNear,
                    entityId: application.Id,
                    dayMark: dayMark,
                    tenantId: application.PendingParty == GrantPartyRole.Firma
                        ? application.TenantId
                        : null,
                    values: new Dictionary<string, string?>
                    {
                        // Firmaya giderken kendi adı gereksiz, host'a giderken şart;
                        // host şablona ekleyebilsin diye her hâlükârda ÇÖZÜLÜR — boş
                        // geçilseydi host metne yazdığı token ham görünürdü.
                        ["{firma_adı}"] = application.TenantId is { } tenantId
                            ? await displayNames.GetAsync(tenantId)
                            : string.Empty,
                        ["{çağrı_adı}"] = GrantName(call.GrantId),
                        ["{son_tarih}"] = call.Deadline!.Value.ToString("dd.MM.yyyy"),
                        ["{kalan_gün}"] = dayMark.ToString()
                    },
                    entityType: nameof(GrantApplication));
                continue;
            }

            // Hatırlatma, eksik evrakın sorumlusuna gider. Firma tarafındaki eksikler
            // kiracıya, danışman/kurum tarafındakiler host'a düşer.
            var forFirm = missing.Any(d => d.UploaderParty == GrantPartyRole.Firma);

            await SendAsync(sp,
                GrantNotificationTrigger.DocumentDeadlineNear,
                entityId: application.Id,
                dayMark: dayMark,
                tenantId: forFirm ? application.TenantId : null,
                values: new Dictionary<string, string?>
                {
                    ["{çağrı_adı}"] = GrantName(call.GrantId),
                    ["{eksik_evrak_sayısı}"] = missing.Count.ToString(),
                    ["{son_tarih}"] = call.Deadline!.Value.ToString("dd.MM.yyyy"),
                    ["{kalan_gün}"] = dayMark.ToString()
                },
                entityType: nameof(GrantApplication));
        }
    }

    // ---------------------------------------------------------------- rapor

    private async Task RunReportRemindersAsync(IServiceProvider sp, DateTime today)
    {
        var reportRepo = sp.GetRequiredService<IRepository<GrantReport, Guid>>();
        var appRepo = sp.GetRequiredService<IRepository<GrantApplication, Guid>>();
        var callRepo = sp.GetRequiredService<IRepository<GrantCall, Guid>>();
        var grantRepo = sp.GetRequiredService<IRepository<Grant, Guid>>();
        var dataFilter = sp.GetRequiredService<IDataFilter<IMultiTenant>>();

        List<GrantReport> reports;
        List<GrantApplication> applications;
        List<GrantCall> calls;

        using (dataFilter.Disable())
        {
            var targets = ReportDayMarks.Select(d => today.AddDays(d)).ToList();
            reports = await reportRepo.GetListAsync(
                r => r.DueDate != null
                     && targets.Contains(r.DueDate!.Value.Date)
                     && r.Status != GrantReportStatus.Onaylandi);
            if (reports.Count == 0)
            {
                return;
            }

            var appIds = reports.Select(r => r.GrantApplicationId).Distinct().ToList();
            applications = await appRepo.GetListAsync(a => appIds.Contains(a.Id));
            var callIds = applications.Select(a => a.GrantCallId).Distinct().ToList();
            calls = await callRepo.GetListAsync(c => callIds.Contains(c.Id));

            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            foreach (var grant in await grantRepo.GetListAsync(g => grantIds.Contains(g.Id)))
            {
                _grantNames[grant.Id] = grant.Name;
            }
        }

        var appById = applications.ToDictionary(a => a.Id);
        var callById = calls.ToDictionary(c => c.Id);

        foreach (var report in reports)
        {
            if (!appById.TryGetValue(report.GrantApplicationId, out var application))
            {
                continue;
            }

            var dayMark = (report.DueDate!.Value.Date - today).Days;
            var grantId = callById.TryGetValue(application.GrantCallId, out var call) ? call.GrantId : Guid.Empty;

            await SendAsync(sp,
                GrantNotificationTrigger.ReportDeadlineNear,
                entityId: report.Id,
                dayMark: dayMark,
                tenantId: application.TenantId,
                values: new Dictionary<string, string?>
                {
                    ["{çağrı_adı}"] = GrantName(grantId),
                    ["{rapor_adı}"] = report.Title,
                    ["{son_tarih}"] = report.DueDate!.Value.ToString("dd.MM.yyyy"),
                    ["{kalan_gün}"] = dayMark.ToString()
                },
                entityType: nameof(GrantApplication),
                // Derin link uygulama ekranına gider; ekran başvuru kimliğiyle açılır.
                deepLinkEntityId: application.Id);
        }
    }

    // ---------------------------------------------------------------- ortak

    private Dictionary<Guid, string> _grantNames = new();

    private string GrantName(Guid grantId)
        => _grantNames.TryGetValue(grantId, out var name) ? name : string.Empty;

    private async Task SendAsync(
        IServiceProvider sp,
        GrantNotificationTrigger trigger,
        Guid entityId,
        int dayMark,
        Guid? tenantId,
        Dictionary<string, string?> values,
        string entityType,
        Guid? deepLinkEntityId = null)
    {
        var logRepo = sp.GetRequiredService<IRepository<GrantNotificationLog, Guid>>();
        var dispatcher = sp.GetRequiredService<GrantNotificationDispatcher>();
        var currentTenant = sp.GetRequiredService<ICurrentTenant>();
        var userRepo = sp.GetRequiredService<IIdentityUserRepository>();
        var guids = sp.GetRequiredService<IGuidGenerator>();
        var clock = sp.GetRequiredService<IClock>();
        var dataFilter = sp.GetRequiredService<IDataFilter<IMultiTenant>>();

        bool already;
        using (dataFilter.Disable())
        {
            already = await logRepo.AnyAsync(
                l => l.Trigger == trigger && l.EntityId == entityId && l.DayMark == dayMark);
        }

        if (already)
        {
            return;
        }

        try
        {
            using (currentTenant.Change(tenantId))
            {
                var userIds = (await userRepo.GetListAsync())
                    .Where(u => u.IsActive).Select(u => u.Id).ToList();

                var sent = await dispatcher.DispatchAsync(
                    trigger, userIds, values, entityType, deepLinkEntityId ?? entityId);

                // Şablon kapalıysa işaret BIRAKILMAZ: host şablonu sonradan açtığında
                // hatırlatma o günkü eşikte yine gitsin.
                if (!sent)
                {
                    return;
                }

                await logRepo.InsertAsync(
                    new GrantNotificationLog(guids.Create(), tenantId, trigger, entityId, dayMark, clock.Now),
                    autoSave: true);
            }
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex,
                "Hibe hatırlatması gönderilemedi. Tetikleyici: {Trigger}, Kayıt: {EntityId}", trigger, entityId);
        }
    }
}
