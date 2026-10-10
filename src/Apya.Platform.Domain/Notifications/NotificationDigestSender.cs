using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.Settings;
using Microsoft.Extensions.Logging;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Emailing;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Notifications;

/// <summary>
/// Günlük bildirim özetini gönderir: e-postası açık kategorilerdeki okunmamış bildirimler tek
/// iletide toplanır. Kritik olanlar anında gittiği için burada tekrar edilmez.
///
/// <para>NTF-10 · Son özetin zamanı KALICIDIR (<see cref="PlatformSettings.Notifications.LastDigestAt"/>).
/// Eskiden işçi "uygulama açıldıktan 24 saat sonra, son 24 saate bak" diye çalışıyordu: uygulama
/// yeniden başlayınca sayaç sıfırlanıyor, özet gecikiyor ve pencerenin dışında kalan bildirimler
/// hiçbir özete girmiyordu. Artık pencere "son özetten bu yana"dır; özet, sonuncusunun üzerinden
/// <see cref="NotificationConsts.DigestWindowHours"/> saat geçmeden yeniden gönderilmez.</para>
///
/// <para>Gönderim işçiden AYRI: işçiyi testten elle çağırmak tuzaklı, bu sınıf düz bir servis
/// olarak ölçülebilir (bkz. DocumentFileExpiryScanner).</para>
/// </summary>
public class NotificationDigestSender : ITransientDependency
{
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly IRepository<NotificationPreference, Guid> _preferenceRepository;
    private readonly IIdentityUserRepository _userRepository;
    private readonly IEmailSender _emailSender;
    private readonly IDataFilter<IMultiTenant> _dataFilter;
    private readonly ICurrentTenant _currentTenant;
    private readonly ISettingManager _settingManager;
    private readonly ILogger<NotificationDigestSender> _logger;

    public NotificationDigestSender(
        IRepository<Notification, Guid> notificationRepository,
        IRepository<NotificationPreference, Guid> preferenceRepository,
        IIdentityUserRepository userRepository,
        IEmailSender emailSender,
        IDataFilter<IMultiTenant> dataFilter,
        ICurrentTenant currentTenant,
        ISettingManager settingManager,
        ILogger<NotificationDigestSender> logger)
    {
        _notificationRepository = notificationRepository;
        _preferenceRepository = preferenceRepository;
        _userRepository = userRepository;
        _emailSender = emailSender;
        _dataFilter = dataFilter;
        _currentTenant = currentTenant;
        _settingManager = settingManager;
        _logger = logger;
    }

    /// <summary>
    /// Vakti geldiyse özeti kuyruğa alır. Dönen değer kuyruğa alınan ileti sayısıdır;
    /// vakti gelmediyse <c>null</c>.
    /// </summary>
    /// <param name="utcNow">LastOccurredAt UTC tutulduğu için pencere de UTC hesaplanır.</param>
    public async Task<int?> RunAsync(DateTime utcNow)
    {
        var window = TimeSpan.FromHours(NotificationConsts.DigestWindowHours);
        var last = await GetLastDigestAtAsync();

        if (last.HasValue && utcNow - last.Value < window)
        {
            return null;
        }

        // İlk çalışmada geriye bir pencere kadar bakılır; sonrasında "son özetten bu yana".
        var since = last ?? utcNow - window;

        // Damga gönderimle AYNI iş biriminde yazılır: kuyruk kaydı da veritabanında olduğu için
        // ikisi birlikte kalıcı olur ya da birlikte geri alınır.
        await _settingManager.SetGlobalAsync(
            PlatformSettings.Notifications.LastDigestAt,
            utcNow.ToString("O", CultureInfo.InvariantCulture));

        List<NotificationPreference> emailPreferences;
        List<Notification> candidates;

        // Tüm tenant'ları tek turda tara; gönderim doğru tenant bağlamında yapılır.
        using (_dataFilter.Disable())
        {
            emailPreferences = await _preferenceRepository.GetListAsync(p => p.Digest);
            if (emailPreferences.Count == 0)
            {
                return 0;
            }

            var userIds = emailPreferences.Select(p => p.UserId).Distinct().ToList();

            candidates = await _notificationRepository.GetListAsync(n =>
                !n.IsRead &&
                n.LastOccurredAt >= since &&
                n.Severity < NotificationSeverity.Critical &&   // kritik olan anında gitti
                userIds.Contains(n.UserId));
        }

        if (candidates.Count == 0)
        {
            return 0;
        }

        // (kullanıcı, kategori) çiftinden e-posta açık olanları seç
        var allowed = emailPreferences
            .Select(p => (p.UserId, p.Category))
            .ToHashSet();

        var perUser = candidates
            .Where(n => allowed.Contains((n.UserId, n.Category)))
            .GroupBy(n => new { n.TenantId, n.UserId });

        var queued = 0;
        foreach (var group in perUser)
        {
            try
            {
                using (_currentTenant.Change(group.Key.TenantId))
                {
                    var user = await _userRepository.FindAsync(group.Key.UserId);
                    if (user == null || user.Email.IsNullOrWhiteSpace())
                    {
                        continue;
                    }

                    // Kuyruğa alınır (anlık bildirim e-postaları gibi). Doğrudan gönderimde geçici
                    // bir SMTP hatası o günün özetini tamamen düşürüyordu; kuyruk yeniden dener.
                    await _emailSender.QueueAsync(user.Email, "Bildirim özeti", BuildBody(group.ToList()));
                    queued++;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Bildirim özeti gönderilemedi. UserId: {UserId}", group.Key.UserId);
            }
        }

        return queued;
    }

    private async Task<DateTime?> GetLastDigestAtAsync()
    {
        var raw = await _settingManager.GetOrNullGlobalAsync(PlatformSettings.Notifications.LastDigestAt);

        return DateTime.TryParse(raw, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var parsed)
            ? parsed.ToUniversalTime()
            : null;
    }

    private static string BuildBody(List<Notification> notifications)
    {
        var builder = new StringBuilder();
        builder.Append("<p>Son özetten bu yana okunmamış ").Append(notifications.Count)
               .Append(" bildiriminiz var:</p><ul>");

        foreach (var n in notifications.OrderByDescending(n => n.LastOccurredAt))
        {
            builder.Append("<li><strong>")
                   .Append(System.Net.WebUtility.HtmlEncode(n.Title))
                   .Append("</strong>");

            if (n.OccurrenceCount > 1)
                builder.Append(" (").Append(n.OccurrenceCount).Append(')');

            builder.Append("<br>")
                   .Append(System.Net.WebUtility.HtmlEncode(n.Body))
                   .Append("</li>");
        }

        builder.Append("</ul>");
        return builder.ToString();
    }
}
