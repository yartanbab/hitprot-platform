using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundWorkers;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Emailing;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Threading;
using Volo.Abp.Timing;
using Volo.Abp.Uow;

namespace Apya.Platform.Notifications;

/// <summary>
/// Günde bir kez, e-postası açık kategorilerdeki okunmamış bildirimleri tek
/// özet iletisinde toplar. Kritik olanlar zaten anında gönderildiği için
/// burada tekrar edilmez.
/// </summary>
public class NotificationDigestWorker : AsyncPeriodicBackgroundWorkerBase
{
    public NotificationDigestWorker(
            AbpAsyncTimer timer,
            IServiceScopeFactory serviceScopeFactory
        ) : base(timer, serviceScopeFactory)
    {
        Timer.Period = 24 * 60 * 60 * 1000; // 24 saat
    }

    [UnitOfWork]
    protected override async Task DoWorkAsync(PeriodicBackgroundWorkerContext workerContext)
    {
        var notificationRepository = workerContext.ServiceProvider.GetRequiredService<IRepository<Notification, Guid>>();
        var preferenceRepository   = workerContext.ServiceProvider.GetRequiredService<IRepository<NotificationPreference, Guid>>();
        var userRepository         = workerContext.ServiceProvider.GetRequiredService<IIdentityUserRepository>();
        var emailSender            = workerContext.ServiceProvider.GetRequiredService<IEmailSender>();
        var clock                  = workerContext.ServiceProvider.GetRequiredService<IClock>();
        var dataFilter             = workerContext.ServiceProvider.GetRequiredService<IDataFilter<IMultiTenant>>();
        var currentTenant          = workerContext.ServiceProvider.GetRequiredService<ICurrentTenant>();

        var since = clock.Now.AddHours(-NotificationConsts.DigestWindowHours);

        List<NotificationPreference> emailPreferences;
        List<Notification> candidates;

        // Tüm tenant'ları tek turda tara; gönderim doğru tenant bağlamında yapılır.
        using (dataFilter.Disable())
        {
            emailPreferences = await preferenceRepository.GetListAsync(p => p.Email);
            if (emailPreferences.Count == 0)
                return;

            var userIds = emailPreferences.Select(p => p.UserId).Distinct().ToList();

            candidates = await notificationRepository.GetListAsync(n =>
                !n.IsRead &&
                n.LastOccurredAt >= since &&
                n.Severity < NotificationSeverity.Critical &&   // kritik olan anında gitti
                userIds.Contains(n.UserId));
        }

        if (candidates.Count == 0)
            return;

        // (kullanıcı, kategori) çiftinden e-posta açık olanları seç
        var allowed = emailPreferences
            .Select(p => (p.UserId, p.Category))
            .ToHashSet();

        var perUser = candidates
            .Where(n => allowed.Contains((n.UserId, n.Category)))
            .GroupBy(n => new { n.TenantId, n.UserId });

        foreach (var group in perUser)
        {
            try
            {
                using (currentTenant.Change(group.Key.TenantId))
                {
                    var user = await userRepository.FindAsync(group.Key.UserId);
                    if (user == null || user.Email.IsNullOrWhiteSpace())
                        continue;

                    await emailSender.SendAsync(user.Email, "Bildirim özeti", BuildBody(group.ToList()));
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, "Bildirim özeti gönderilemedi. UserId: {UserId}", group.Key.UserId);
            }
        }
    }

    private static string BuildBody(List<Notification> notifications)
    {
        var builder = new StringBuilder();
        builder.Append("<p>Son ").Append(NotificationConsts.DigestWindowHours)
               .Append(" saatte okunmamış ").Append(notifications.Count)
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
