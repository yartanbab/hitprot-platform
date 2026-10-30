using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Settings;
using Microsoft.Extensions.Localization;
using Volo.Abp.Domain.Services;
using Volo.Abp.Identity;
using Volo.Abp.Localization;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Grants;

/// <summary>
/// Faz 3 · Yönetici özeti (kullanıcı kararı 10-29). Her iş günü 08:00'de (Türkiye) bekleyen hibe işleri tek
/// bildirimde toplanır: firma yöneticisine kendi firmasında bekleyenler, host yöneticisine danışman tarafında
/// bekleyenler danışman bazında ve 14 gündür yanıt vermeyen firmalar. Bekleyen iş yoksa özet gitmez.
///
/// <para>Bekleyen iş Faz 2'nin bulucusundan okunur (<see cref="GrantEscalationManager.FindPendingAsync"/>);
/// sayılan iş türleri aynıdır. Metin tek paragraftır: bildirim gövdesi hem ekranda hem e-postada satır sonu
/// korumuyor.</para>
///
/// <para>Son gönderim günü KALICIDIR (<see cref="PlatformSettings.Notifications.LastManagerDigestDate"/>):
/// uygulama yeniden başlasa da özet aynı gün ikinci kez gitmez ya da 08:00 kaçtıysa gün içinde yetişir.</para>
/// </summary>
public class GrantManagerDigestSender : DomainService
{
    public const int SendHour = 8;
    public const int MaxItems = 10;
    public const int SilentFirmDays = 14;

    private readonly GrantEscalationManager _escalations;
    private readonly GrantNotificationDispatcher _dispatcher;
    private readonly ISettingManager _settingManager;
    private readonly IIdentityUserRepository _userRepo;
    private readonly IStringLocalizer<PlatformResource> _l;

    public GrantManagerDigestSender(
        GrantEscalationManager escalations,
        GrantNotificationDispatcher dispatcher,
        ISettingManager settingManager,
        IIdentityUserRepository userRepo,
        IStringLocalizer<PlatformResource> l)
    {
        _escalations = escalations;
        _dispatcher = dispatcher;
        _settingManager = settingManager;
        _userRepo = userRepo;
        _l = l;
    }

    /// <summary>Vakti geldiyse özetleri gönderir.</summary>
    /// <param name="utcNow">Zamanlama: Türkiye 2016'dan beri sabit UTC+3.</param>
    /// <param name="now">Uygulama saati (kayıtların zamanı bununla tutulur); bekleme günleri bununla sayılır.</param>
    /// <returns>Gönderilen özet sayısı; vakti gelmediyse <c>null</c>.</returns>
    public async Task<int?> RunAsync(DateTime utcNow, DateTime now)
    {
        var turkey = utcNow.AddHours(3);
        if (turkey.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday || turkey.Hour < SendHour)
        {
            return null;
        }

        var today = turkey.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        if (await _settingManager.GetOrNullGlobalAsync(PlatformSettings.Notifications.LastManagerDigestDate) == today)
        {
            return null;
        }

        // Damga gönderimle aynı iş biriminde: ikisi birlikte kalıcı olur ya da birlikte geri alınır.
        await _settingManager.SetGlobalAsync(PlatformSettings.Notifications.LastManagerDigestDate, today);

        var allWork = GrantNotificationTriggerRegistry.All
            .Where(GrantNotificationTriggerRegistry.IsEscalatable)
            .ToDictionary(t => t, _ => 1);
        var pending = await _escalations.FindPendingAsync(allWork, now);
        if (pending.Count == 0)
        {
            return 0;
        }

        int Days(GrantPendingAction a) => (int)(now - a.Since).TotalDays;

        var sent = 0;
        using (CultureHelper.Use("tr"))
        {
            // --- Firma yöneticileri: yalnız kendi firmasında bekleyenler (kullanıcı kararı 10-29).
            foreach (var firm in pending.Where(a => a.ActingSide == GrantPartyRole.Firma && a.TenantId != null)
                         .GroupBy(a => a.TenantId))
            {
                var items = firm.ToList();
                var summary = string.Join(" · ", items
                    .GroupBy(a => a.Trigger)
                    .OrderBy(g => (int)g.Key)
                    .Select(g => _l["Grants:Notify:Digest:Group", TriggerName(g.Key), g.Count(), g.Max(Days)].Value));

                if (await _dispatcher.SendDigestAsync(GrantNotificationAudience.FirmaYoneticisi, firm.Key,
                        Values(items, summary, a => FirmItemSubject(a), Days)))
                {
                    sent++;
                }
            }

            // --- Host yöneticisi: danışman bazında + 14 gündür yanıt vermeyen firmalar.
            var hostItems = pending.Where(a => a.ActingSide == GrantPartyRole.Danisman).ToList();
            var silentFirms = pending
                .Where(a => a.ActingSide == GrantPartyRole.Firma && Days(a) >= SilentFirmDays)
                .Select(a => a.TenantId)
                .Distinct()
                .Count();

            if (hostItems.Count > 0 || silentFirms > 0)
            {
                var parts = new List<string>();
                foreach (var group in hostItems.GroupBy(a => a.AssignedUserId).OrderByDescending(g => g.Count()))
                {
                    parts.Add(_l["Grants:Notify:Digest:Consultant",
                        await ConsultantNameAsync(group.Key), group.Count(), group.Max(Days)].Value);
                }

                if (silentFirms > 0)
                {
                    parts.Add(_l["Grants:Notify:Digest:SilentFirms", silentFirms].Value);
                }

                if (await _dispatcher.SendDigestAsync(GrantNotificationAudience.HostYoneticisi, null,
                        Values(hostItems, string.Join(" · ", parts), a => a.Values.GetValueOrDefault("{firma_adı}"), Days)))
                {
                    sent++;
                }
            }
        }

        return sent;
    }

    private Dictionary<string, string?> Values(
        List<GrantPendingAction> items, string summary, Func<GrantPendingAction, string?> subject, Func<GrantPendingAction, int> days)
    {
        var longest = items.OrderByDescending(days).ToList();
        var list = string.Join("; ", longest.Take(MaxItems)
            .Select(a => _l["Grants:Notify:Digest:Item", subject(a) ?? string.Empty, TriggerName(a.Trigger), days(a)].Value));
        if (longest.Count > MaxItems)
        {
            list += " " + _l["Grants:Notify:Digest:More", longest.Count - MaxItems].Value;
        }

        return new Dictionary<string, string?>
        {
            ["{toplam}"] = items.Count.ToString(CultureInfo.InvariantCulture),
            ["{en_eski_gün}"] = items.Count == 0 ? "0" : items.Max(days).ToString(CultureInfo.InvariantCulture),
            ["{özet}"] = summary,
            ["{liste}"] = list
        };
    }

    /// <summary>Firma kendi firmasını bilir: maddede çağrı (ve varsa evrak) yazılır.</summary>
    private static string? FirmItemSubject(GrantPendingAction a)
    {
        var call = a.Values.GetValueOrDefault("{çağrı_adı}");
        var document = a.Values.GetValueOrDefault("{evrak_adı}");
        return document == null ? call : $"{call} / {document}";
    }

    private string TriggerName(GrantNotificationTrigger trigger) => _l[$"Grants:Notify:Trigger:{trigger}:Name"];

    private async Task<string> ConsultantNameAsync(Guid? userId)
    {
        if (userId is not { } id)
        {
            return _l["Grants:Notify:Digest:Unassigned"];
        }

        using (CurrentTenant.Change(null))
        {
            var user = await _userRepo.FindAsync(id);
            if (user == null)
            {
                return _l["Grants:Notify:Digest:Unassigned"];
            }

            var fullName = $"{user.Name} {user.Surname}".Trim();
            return fullName.Length > 0 ? fullName : user.UserName;
        }
    }
}
