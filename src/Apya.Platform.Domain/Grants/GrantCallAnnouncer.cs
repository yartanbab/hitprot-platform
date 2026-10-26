using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// Yeni çağrı duyurusunun ("<see cref="GrantNotificationTrigger.CallPublished"/>") tek çıkış kapısı.
///
/// <para>Duyuru bugüne kadar yalnız <c>GrantParameterAppService.PublishAsync</c> içinden çıkıyordu.
/// Çağrı başka yoldan "Açık" olunca — veritabanına dışarıdan eklenen kayıt, katalog tohumu, host'un
/// çağrıyı doğrudan "Açık" oluşturması ya da düzenleyip "Açık"a çekmesi — firmaya hiçbir şey gitmiyordu.
/// Bu sınıf duyuruyu olayın <b>kaynağından</b> değil <b>durumundan</b> türetir: açık ve henüz
/// duyurulmamış her çağrı, nasıl açılmış olursa olsun, <see cref="AnnounceUnannouncedAsync"/> turunda
/// yakalanır.</para>
///
/// <para>İşaretleme <see cref="GrantNotificationLog"/> ile, iki düzeyde:
/// firma başına satır (çağrı + kiracıdan türetilen anahtar, kapanış zinciriyle aynı kural) aynı
/// firmaya ikinci duyuruyu engeller; host satırı (<c>EntityId = çağrı</c>, <c>TenantId = null</c>)
/// "bu çağrı işlendi" der ve tarama sorgusunun anahtarıdır. Şema değişmez.</para>
///
/// <para>🔴 Birikmiş devir: tarama ilk kez çalıştığında kataloğun bütün açık çağrıları "duyurulmamış"
/// görünür. Hepsini duyurmak firmaların kutusunu tek seferde doldururdu. Bu yüzden
/// <see cref="AnnounceWindowDays"/> günden eski çağrı duyurulmadan yalnız işaretlenir; bir turda en çok
/// <see cref="MaxAnnouncePerRun"/> çağrı duyurulur (LIF-03 ile aynı gerekçe), kalanı sonraki tura kalır.</para>
/// </summary>
public class GrantCallAnnouncer : DomainService
{
    /// <summary>Çağrı bu kadar günden eskiyse (son değişiklik ya da oluşturma) duyurulmaz, yalnız işaretlenir.</summary>
    public const int AnnounceWindowDays = 7;

    /// <summary>Bir taramada en çok kaç çağrı duyurulur.</summary>
    public const int MaxAnnouncePerRun = 20;

    /// <summary>Duyuru eşik taşımaz; günlük anahtarında sabit.</summary>
    private const int DayMark = 0;

    private readonly IRepository<GrantCall, Guid> _callRepo;
    private readonly IRepository<Grant, Guid> _grantRepo;
    private readonly IRepository<GrantNotificationLog, Guid> _logRepo;
    private readonly GrantAudienceResolver _audience;
    private readonly GrantNotificationDispatcher _dispatcher;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public GrantCallAnnouncer(
        IRepository<GrantCall, Guid> callRepo,
        IRepository<Grant, Guid> grantRepo,
        IRepository<GrantNotificationLog, Guid> logRepo,
        GrantAudienceResolver audience,
        GrantNotificationDispatcher dispatcher,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _callRepo = callRepo;
        _grantRepo = grantRepo;
        _logRepo = logRepo;
        _audience = audience;
        _dispatcher = dispatcher;
        _mtFilter = mtFilter;
    }

    /// <summary>
    /// Çağrıyı uygunluk eşiğini geçen firmalara duyurur ve işler. Daha önce duyuru almış firma atlanır.
    /// </summary>
    /// <returns>Bu çağrıda duyuru alan firma sayısı.</returns>
    public async Task<int> AnnounceAsync(Grant grant, GrantCall call, DateTime now)
    {
        var daysLeft = call.Deadline.HasValue
            ? Math.Max(0, (call.Deadline.Value.Date - now.Date).Days).ToString()
            : null;

        var notified = 0;
        foreach (var (tenantId, firmName) in await _audience.ResolveAsync(grant))
        {
            var logKey = GrantCallClosingManager.LogKeyOf(call.Id, tenantId);
            using (CurrentTenant.Change(tenantId))
            {
                if (await _logRepo.AnyAsync(x =>
                        x.Trigger == GrantNotificationTrigger.CallPublished && x.EntityId == logKey))
                {
                    continue;
                }
            }

            var sent = await _dispatcher.DispatchToTenantAsync(
                GrantNotificationTrigger.CallPublished,
                tenantId,
                new Dictionary<string, string?>
                {
                    ["{firma_adı}"] = firmName,
                    ["{çağrı_adı}"] = grant.Name,
                    ["{son_tarih}"] = call.Deadline?.ToString("dd.MM.yyyy"),
                    ["{kalan_gün}"] = daysLeft
                },
                nameof(GrantCall), call.Id);

            if (!sent)
            {
                continue;
            }

            using (CurrentTenant.Change(tenantId))
            {
                await _logRepo.InsertAsync(
                    new GrantNotificationLog(GuidGenerator.Create(), tenantId, GrantNotificationTrigger.CallPublished, logKey, DayMark, now),
                    autoSave: true);
            }
            notified++;
        }

        await MarkProcessedAsync(call.Id, now);
        return notified;
    }

    /// <summary>
    /// Çağrıyı duyurmadan "işlendi" sayar. Yayın akışında aynı programın ikinci taslağı
    /// (duyuru en yakın son tarihliyi anlatır) ve taramada pencereden eski çağrı için.
    /// </summary>
    public async Task MarkProcessedAsync(Guid callId, DateTime now)
    {
        using (CurrentTenant.Change(null))
        {
            if (await _logRepo.AnyAsync(x =>
                    x.Trigger == GrantNotificationTrigger.CallPublished && x.EntityId == callId && x.TenantId == null))
            {
                return;
            }

            await _logRepo.InsertAsync(
                new GrantNotificationLog(GuidGenerator.Create(), null, GrantNotificationTrigger.CallPublished, callId, DayMark, now),
                autoSave: true);
        }
    }

    /// <summary>
    /// Tek seferlik taban işaretinin anahtarı (host satırı, <c>EntityId</c> olarak). Gerçek bir çağrı
    /// kimliğiyle çakışmaz; taramanın "işlenmiş" kümesinde zararsızca durur.
    /// </summary>
    public static readonly Guid BaselineMarkerId = Guid.Parse("ba5e11e0-0805-4000-8000-000000000805");

    /// <summary>
    /// 🔴 İlk yayın tabanı (kullanıcı kararı 2026-10-26): tarama canlıya ilk indiğinde katalogdaki açık
    /// çağrıların çoğu <see cref="AnnounceWindowDays"/> penceresinin içindeydi (24 Ekim tohumu + yeni tohum)
    /// ve hepsi firmalara duyurulacaktı. Taban işareti yoksa o an açık olan bütün host çağrıları duyurulmadan
    /// "işlendi" sayılır ve işaret yazılır; yalnız bir kez çalışır, sonra açılan çağrılar normal duyurulur.
    /// Henüz açılış tarihi gelmemiş çağrılar işaretlenmez: açıldıklarında gerçekten yenidirler.
    /// </summary>
    /// <returns>Sessizce işaretlenen çağrı sayısı; taban daha önce kurulduysa 0.</returns>
    public async Task<int> MarkBaselineOnceAsync(DateTime now)
    {
        List<Guid> open;
        HashSet<Guid> processed;
        using (_mtFilter.Disable())
        {
            if (await _logRepo.AnyAsync(x =>
                    x.Trigger == GrantNotificationTrigger.CallPublished && x.TenantId == null && x.EntityId == BaselineMarkerId))
            {
                return 0;
            }

            // 🔴 Disable() tüm kiracılara açar; host kataloğu TenantId == null koşuluyla ELLE seçilir.
            open = (await _callRepo.GetListAsync(c =>
                    c.TenantId == null
                    && c.Status == GrantCallStatus.Acik
                    && (c.OpenDate == null || c.OpenDate <= now)
                    && (c.Deadline == null || c.Deadline >= now.Date)))
                .Select(c => c.Id)
                .ToList();

            processed = (await _logRepo.GetListAsync(x =>
                    x.Trigger == GrantNotificationTrigger.CallPublished && x.TenantId == null))
                .Select(x => x.EntityId)
                .ToHashSet();
        }

        var marks = open
            .Where(id => !processed.Contains(id))
            .Select(id => new GrantNotificationLog(GuidGenerator.Create(), null, GrantNotificationTrigger.CallPublished, id, DayMark, now))
            .Append(new GrantNotificationLog(GuidGenerator.Create(), null, GrantNotificationTrigger.CallPublished, BaselineMarkerId, DayMark, now))
            .ToList();

        using (CurrentTenant.Change(null))
        {
            await _logRepo.InsertManyAsync(marks, autoSave: true);
        }

        Logger.LogInformation("Çağrı duyurusu tabanı kuruldu: {Count} açık çağrı duyurulmadan işaretlendi.", marks.Count - 1);
        return marks.Count - 1;
    }

    /// <summary>
    /// Tarama: host kataloğunda bugün açık olup henüz işlenmemiş çağrıları bulur; pencere içindekileri
    /// duyurur, eskileri yalnız işaretler. Bir çağrının hatası diğerlerini durdurmaz.
    /// </summary>
    /// <returns>Duyurulan çağrı sayısı.</returns>
    public async Task<int> AnnounceUnannouncedAsync(DateTime now)
    {
        List<GrantCall> candidates;
        HashSet<Guid> processed;
        using (_mtFilter.Disable())
        {
            // 🔴 Disable() tüm kiracılara açar; host kataloğu TenantId == null koşuluyla ELLE seçilir.
            candidates = await _callRepo.GetListAsync(c =>
                c.TenantId == null
                && c.Status == GrantCallStatus.Acik
                && (c.OpenDate == null || c.OpenDate <= now)
                && (c.Deadline == null || c.Deadline >= now.Date));

            processed = (await _logRepo.GetListAsync(x =>
                    x.Trigger == GrantNotificationTrigger.CallPublished && x.TenantId == null))
                .Select(x => x.EntityId)
                .ToHashSet();
        }

        var pending = candidates
            .Where(c => !processed.Contains(c.Id))
            .OrderBy(c => c.LastModificationTime ?? c.CreationTime)
            .ToList();

        var windowStart = now.AddDays(-AnnounceWindowDays);
        var announced = 0;
        foreach (var call in pending)
        {
            try
            {
                if ((call.LastModificationTime ?? call.CreationTime) < windowStart)
                {
                    await MarkProcessedAsync(call.Id, now);
                    continue;
                }

                if (announced >= MaxAnnouncePerRun)
                {
                    break;
                }

                var grant = await _grantRepo.GetAsync(call.GrantId);
                var notified = await AnnounceAsync(grant, call, now);
                announced++;
                Logger.LogInformation(
                    "Duyurulmamış açık çağrı yakalandı ve duyuruldu. Çağrı: {CallId} ({GrantName}), firma: {Notified}.",
                    call.Id, grant.Name, notified);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Çağrı {CallId} duyurulurken hata oluştu; sonraki çağrıya geçiliyor.", call.Id);
            }
        }

        return announced;
    }
}
