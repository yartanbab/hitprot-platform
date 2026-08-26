using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Notifications;
using Apya.Platform.Settings;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus.Local;
using Volo.Abp.Identity;
using Volo.Abp.Linq;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Settings;
using Volo.Abp.Timing;

namespace Apya.Platform.Tenants;

/// <summary>Bir turun sonucu — log ve testler için.</summary>
public class SubscriptionExpiryResult
{
    /// <summary>"Süreniz doluyor" bildirimi gönderilen abonelik sayısı.</summary>
    public int Warned { get; set; }

    /// <summary>Ek süreye (grace) alınan abonelik sayısı.</summary>
    public int MovedToGrace { get; set; }

    /// <summary>Basic'e indirilen kiracı sayısı.</summary>
    public int Downgraded { get; set; }

    /// <summary>Süresi dolduğu hâlde ayar kapalı olduğu için indirilMEyen abonelik sayısı.</summary>
    public int DowngradeSkipped { get; set; }
}

/// <summary>
/// Paket süresi işleyicisinin TÜM mantığı. Zamanlayıcıdan (<c>SubscriptionExpiryWorker</c>)
/// bilerek ayrı durur: testler bir turu worker'ı ayağa kaldırmadan doğrudan çalıştırabilsin.
///
/// <para>Bir turda üç iş yapılır — uyarı, ek süreye alma, Basic'e indirme. Kiracı başına
/// hata yakalanır: bir kiracıdaki sorun turun tamamını düşürmez.</para>
///
/// <para>Abonelik satırı HİÇ OLMAYAN kiracı bu taramaya girmez (süresiz sayılır). Bu,
/// özellik devreye girmeden önce kurulmuş kiracıların kendiliğinden düşmemesini sağlar.</para>
/// </summary>
public class SubscriptionExpiryProcessor : ITransientDependency
{
    private readonly IRepository<TenantSubscription, Guid> _subscriptionRepository;
    private readonly IRepository<TenantProfile, Guid> _tenantProfileRepository;
    private readonly TenantSubscriptionManager _subscriptionManager;
    private readonly TenantPackageManager _packageManager;
    private readonly ISettingProvider _settingProvider;
    private readonly NotificationManager _notificationManager;
    private readonly IdentityUserManager _userManager;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly ICurrentTenant _currentTenant;
    private readonly ILocalEventBus _localEventBus;
    private readonly IAsyncQueryableExecuter _asyncExecuter;
    private readonly IClock _clock;
    private readonly IStringLocalizer<PlatformResource> _l;
    private readonly ILogger<SubscriptionExpiryProcessor> _logger;

    public SubscriptionExpiryProcessor(
        IRepository<TenantSubscription, Guid> subscriptionRepository,
        IRepository<TenantProfile, Guid> tenantProfileRepository,
        TenantSubscriptionManager subscriptionManager,
        TenantPackageManager packageManager,
        ISettingProvider settingProvider,
        NotificationManager notificationManager,
        IdentityUserManager userManager,
        IIdentityRoleRepository roleRepository,
        ICurrentTenant currentTenant,
        ILocalEventBus localEventBus,
        IAsyncQueryableExecuter asyncExecuter,
        IClock clock,
        IStringLocalizer<PlatformResource> l,
        ILogger<SubscriptionExpiryProcessor> logger)
    {
        _subscriptionRepository = subscriptionRepository;
        _tenantProfileRepository = tenantProfileRepository;
        _subscriptionManager = subscriptionManager;
        _packageManager = packageManager;
        _settingProvider = settingProvider;
        _notificationManager = notificationManager;
        _userManager = userManager;
        _roleRepository = roleRepository;
        _currentTenant = currentTenant;
        _localEventBus = localEventBus;
        _asyncExecuter = asyncExecuter;
        _clock = clock;
        _l = l;
        _logger = logger;
    }

    public async Task<SubscriptionExpiryResult> RunAsync()
    {
        var result = new SubscriptionExpiryResult();
        var now = _clock.Now;

        // Ayarlar Global provider'a KISITLI tanımlı: DefaultValueSettingValueProvider
        // zincirde olmadığı için varsayılan AÇIKÇA geçilmeli, yoksa boş/0 döner.
        var autoDowngrade = await _settingProvider.GetAsync(
            PlatformSettings.Subscription.AutoDowngradeEnabled,
            PlatformSettingDefaults.SubscriptionAutoDowngradeEnabled);

        var graceDays = Math.Clamp(
            await _settingProvider.GetAsync(
                PlatformSettings.Subscription.GraceDays,
                PlatformSettingDefaults.SubscriptionGraceDays),
            0,
            PlatformSettingDefaults.SubscriptionGraceMaxDays);

        var warningDays = ParseWarningDays(
            await _settingProvider.GetOrNullAsync(PlatformSettings.Subscription.WarningDays));

        // Tek sorgu hem uyarı hem düşürme adaylarını getirir: en geniş uyarı eşiği kadar
        // ileriye bakılır. Ek süredeki satırların bitişi zaten geçmiştir, ufka dahildirler.
        var horizon = now.AddDays(warningDays.Count > 0 ? warningDays.Max() : 0);

        var queryable = await _subscriptionRepository.GetQueryableAsync();
        var candidates = await _asyncExecuter.ToListAsync(
            queryable.Where(s =>
                s.EndDate != null
                && s.EndDate <= horizon
                && (s.Status == SubscriptionStatus.Active || s.Status == SubscriptionStatus.InGrace)));

        if (candidates.Count == 0)
        {
            return result;
        }

        foreach (var subscription in candidates)
        {
            try
            {
                await ProcessOneAsync(subscription, now, autoDowngrade, graceDays, warningDays, result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "TenantId={TenantId}: abonelik süresi işlenirken hata oluştu. Sonraki kiracıya geçiliyor.",
                    subscription.TenantId);
            }
        }

        _logger.LogInformation(
            "Abonelik süre turu: {Warned} uyarı, {Grace} ek süre, {Downgraded} indirme, {Skipped} atlandı.",
            result.Warned, result.MovedToGrace, result.Downgraded, result.DowngradeSkipped);

        return result;
    }

    private async Task ProcessOneAsync(
        TenantSubscription subscription,
        DateTime now,
        bool autoDowngrade,
        int graceDays,
        IReadOnlyList<int> warningDays,
        SubscriptionExpiryResult result)
    {
        // Sorgu EndDate != null süzüyor; ek süredeyse GraceEndsAt geçerli tarihtir.
        var effectiveEnd = subscription.EffectiveEndDate!.Value;

        if (now < effectiveEnd)
        {
            if (await TryWarnAsync(subscription, effectiveEnd, now, warningDays))
            {
                result.Warned++;
            }
            return;
        }

        // Süre doldu. Ek süre tanımlıysa önce oraya alınır — paket HÂLÂ açık kalır.
        if (subscription.Status == SubscriptionStatus.Active && graceDays > 0)
        {
            subscription.MarkInGrace(subscription.EndDate!.Value.AddDays(graceDays));

            // Ek süre bildirimi "0 gün kaldı" sayılır: eşik takibi sıfırlanınca daha küçük
            // bir eşik kalmadığı için ek süre boyunca ikinci bir uyarı gitmez.
            subscription.MarkWarned(0);
            await _subscriptionRepository.UpdateAsync(subscription, autoSave: true);

            await NotifyTenantAdminsAsync(
                subscription.TenantId,
                _l["Notification:SubscriptionExpiring:Title"],
                _l["Notification:SubscriptionExpiring:BodyGrace",
                    subscription.PackageCode.ToString(),
                    FormatDate(subscription.GraceEndsAt!.Value)],
                NotificationType.SubscriptionExpiring);

            result.MovedToGrace++;
            return;
        }

        if (!autoDowngrade)
        {
            // Ayar kapalıyken paket DEĞİŞMEZ; uyarılar gitmeye devam eder. Host özelliği
            // açtığında bu kiracılar ilk turda indirilir.
            result.DowngradeSkipped++;
            return;
        }

        await DowngradeAsync(subscription, now);
        result.Downgraded++;
    }

    /// <summary>
    /// Uyarı eşiği geldiyse bildirim gönderir. Aynı eşik dönem başına bir kez gider;
    /// daha küçük bir eşiğe (7 → 1) inilince yeniden uyarılır.
    /// </summary>
    private async Task<bool> TryWarnAsync(
        TenantSubscription subscription,
        DateTime effectiveEnd,
        DateTime now,
        IReadOnlyList<int> warningDays)
    {
        if (warningDays.Count == 0)
        {
            return false;
        }

        var daysRemaining = (int)Math.Ceiling((effectiveEnd - now).TotalDays);

        // Uygulanabilir eşiklerin EN KÜÇÜĞÜ: 5 gün kala {7} → 7; 1 gün kala {7,1} → 1.
        var applicable = warningDays.Where(d => daysRemaining <= d).ToList();
        if (applicable.Count == 0)
        {
            return false;
        }

        var threshold = applicable.Min();
        if (subscription.LastWarningDaysBefore != null
            && threshold >= subscription.LastWarningDaysBefore.Value)
        {
            return false;
        }

        subscription.MarkWarned(threshold);
        await _subscriptionRepository.UpdateAsync(subscription, autoSave: true);

        await NotifyTenantAdminsAsync(
            subscription.TenantId,
            _l["Notification:SubscriptionExpiring:Title"],
            _l["Notification:SubscriptionExpiring:Body",
                subscription.PackageCode.ToString(),
                FormatDate(effectiveEnd),
                Math.Max(daysRemaining, 0)],
            NotificationType.SubscriptionExpiring);

        await _localEventBus.PublishAsync(new SubscriptionExpiringEto
        {
            TenantId = subscription.TenantId,
            SubscriptionId = subscription.Id,
            PackageCode = subscription.PackageCode,
            EndDate = subscription.EndDate!.Value,
            DaysRemaining = Math.Max(daysRemaining, 0),
            AutoRenew = subscription.AutoRenew,
            ExternalReference = subscription.ExternalReference
        });

        return true;
    }

    /// <summary>
    /// Kiracıyı Basic'e indirir: abonelik satırını kapatır, profili çeker, paketi uygular
    /// ve yerine SÜRESİZ bir Basic aboneliği açar (kiracı bir daha bu taramaya girmez).
    /// </summary>
    private async Task DowngradeAsync(TenantSubscription subscription, DateTime now)
    {
        var profile = await _tenantProfileRepository.FirstOrDefaultAsync(
            p => p.TenantId == subscription.TenantId);

        var currentPackage = profile?.PackageCode ?? PackageCode.Basic;
        var alreadyBasic = currentPackage == PackageCode.Basic;

        // ÖNCE kapat: StartAsync yürürlükteki satırı Supersede eder; bu satır Expired
        // olduktan sonra "yürürlükte" sayılmaz ve tarihçede doğru sebeple kalır.
        subscription.Expire(now);
        await _subscriptionRepository.UpdateAsync(subscription, autoSave: true);

        if (!alreadyBasic)
        {
            if (profile != null)
            {
                profile.SetPackage(PackageCode.Basic);
                await _tenantProfileRepository.UpdateAsync(profile, autoSave: true);
            }

            // Feature setini yazar ve izin tavanı önbelleğini geçersizleştirir; tavan
            // dışında kalan izinler bundan sonra IsGrantedAsync'te false döner (grant
            // kayıtları SİLİNMEZ — kiracı yükseltilirse yetkiler aynen geri gelir).
            await _packageManager.ApplyPackageAsync(subscription.TenantId, PackageCode.Basic);
        }

        await _subscriptionManager.StartAsync(
            subscription.TenantId,
            PackageCode.Basic,
            SubscriptionPeriod.Unlimited,
            SubscriptionSource.AutoDowngrade);

        await _localEventBus.PublishAsync(new SubscriptionExpiredEto
        {
            TenantId = subscription.TenantId,
            SubscriptionId = subscription.Id,
            PreviousPackageCode = subscription.PackageCode,
            EndDate = subscription.EndDate!.Value,
            GraceEndedAt = subscription.GraceEndsAt,
            ExternalReference = subscription.ExternalReference
        });

        if (!alreadyBasic)
        {
            await NotifyTenantAdminsAsync(
                subscription.TenantId,
                _l["Notification:SubscriptionDowngraded:Title"],
                _l["Notification:SubscriptionDowngraded:Body", subscription.PackageCode.ToString()],
                NotificationType.SubscriptionDowngraded);
        }

        _logger.LogInformation(
            "TenantId={TenantId}: {Package} paketinin süresi doldu, Basic pakete indirildi.",
            subscription.TenantId, subscription.PackageCode);
    }

    /// <summary>
    /// Bildirimi kiracının statik admin rolündeki kullanıcılara gönderir. Statik rolü
    /// olmayan kiracıda (özel rol setiyle kurulmuş) sessizce atlanır — paket değişikliği
    /// yine de uygulanır, yalnız haber verilemez.
    /// </summary>
    private async Task NotifyTenantAdminsAsync(
        Guid tenantId,
        string title,
        string body,
        NotificationType type)
    {
        using (_currentTenant.Change(tenantId))
        {
            var adminRole = (await _roleRepository.GetListAsync()).FirstOrDefault(r => r.IsStatic);
            if (adminRole == null)
            {
                _logger.LogWarning(
                    "TenantId={TenantId}: statik admin rolü yok, abonelik bildirimi gönderilemedi.",
                    tenantId);
                return;
            }

            var admins = await _userManager.GetUsersInRoleAsync(adminRole.Name);
            foreach (var admin in admins)
            {
                await _notificationManager.PublishAsync(admin.Id, title, body, type);
            }
        }
    }

    private static string FormatDate(DateTime value)
        => value.ToString("dd.MM.yyyy", CultureInfo.GetCultureInfo("tr-TR"));

    /// <summary>"7,1" → [7, 1]. Bozuk/negatif değerler sessizce elenir; boş ayar = uyarı yok.</summary>
    private static IReadOnlyList<int> ParseWarningDays(string? raw)
    {
        raw ??= PlatformSettingDefaults.SubscriptionWarningDays;

        return raw
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(part => int.TryParse(part, out var n) ? n : -1)
            .Where(n => n > 0)
            .Distinct()
            .OrderByDescending(n => n)
            .ToList();
    }
}
