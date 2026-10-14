using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Macros.Dtos;
using Apya.Platform.Notifications;
using Apya.Platform.Permissions;
using Apya.Platform.ReleaseNotes;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Macros;

/// <summary>
/// Makro Ekran haber akışı (bkz. <see cref="IMacroNewsAppService"/>). Üç kaynak, her biri kendi
/// kapısından: açık çağrılar hibe görme izniyle, sürüm notları sürüm notu servisinin kendi
/// görünürlük kuralıyla (paket + kitle + host onayı), sonuçlar kullanıcının kendi bildirimlerinden.
/// </summary>
[Authorize]
public class MacroNewsAppService : PlatformAppService, IMacroNewsAppService
{
    /// <summary>Bu kadar gün içindeki haber "yeni" sayılır.</summary>
    public const int NewWithinDays = 7;

    /// <summary>Sonuç bildirimleri bu kadar gün geriye bakar.</summary>
    public const int ResultLookbackDays = 60;

    public const int MaxResultCount = 50;

    private static readonly NotificationType[] ResultTypes =
    {
        NotificationType.GrantDecisionIssued,
        NotificationType.GrantAppealResolved
    };

    private readonly IRepository<GrantCall, Guid> _callRepository;
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IRepository<Notification, Guid> _notificationRepository;
    private readonly IReleaseNotePublicationAppService _releaseNotes;
    private readonly IDataFilter<IMultiTenant> _mtFilter;

    public MacroNewsAppService(
        IRepository<GrantCall, Guid> callRepository,
        IRepository<Grant, Guid> grantRepository,
        IRepository<Notification, Guid> notificationRepository,
        IReleaseNotePublicationAppService releaseNotes,
        IDataFilter<IMultiTenant> mtFilter)
    {
        _callRepository = callRepository;
        _grantRepository = grantRepository;
        _notificationRepository = notificationRepository;
        _releaseNotes = releaseNotes;
        _mtFilter = mtFilter;
    }

    public async Task<List<MacroNewsItemDto>> GetListAsync(int maxResultCount = 5)
    {
        var max = Math.Clamp(maxResultCount, 1, MaxResultCount);
        var now = Clock.Now;
        var items = new List<MacroNewsItemDto>();

        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Grants.Default))
        {
            items.AddRange(await GetOpenCallsAsync(now, max));
        }

        items.AddRange(await GetReleaseNotesAsync(max));

        if (CurrentUser.Id.HasValue)
        {
            items.AddRange(await GetResultsAsync(CurrentUser.Id.Value, max));
        }

        var newSince = now.Date.AddDays(-NewWithinDays);
        foreach (var item in items)
        {
            item.IsNew = item.Date >= newSince;
        }

        return items.OrderByDescending(item => item.Date).Take(max).ToList();
    }

    /// <summary>
    /// Başvuruya açık çağrılar, en yeni açılan önce. Katalog host verisi (TenantId null): kiracı
    /// süzgeci kapatılır ve TenantId koşulu ELLE konur — Disable() tek başına bütün kiracılara açar.
    /// "Açık" kuralı tek yerde: <see cref="GrantCall.IsOpenOn"/> (durum + son başvuru).
    /// </summary>
    private async Task<List<MacroNewsItemDto>> GetOpenCallsAsync(DateTime now, int max)
    {
        using (_mtFilter.Disable())
        {
            var calls = (await AsyncExecuter.ToListAsync((await _callRepository.GetQueryableAsync())
                    .Where(c => c.TenantId == null && c.Status == GrantCallStatus.Acik)))
                .Where(c => c.IsOpenOn(now))
                .OrderByDescending(c => c.OpenDate ?? c.CreationTime)
                .Take(max)
                .ToList();

            var grantIds = calls.Select(c => c.GrantId).Distinct().ToList();
            var grants = (await AsyncExecuter.ToListAsync((await _grantRepository.GetQueryableAsync())
                    .Where(g => g.TenantId == null && grantIds.Contains(g.Id))))
                .ToDictionary(g => g.Id);

            return calls.Where(c => grants.ContainsKey(c.GrantId)).Select(c =>
            {
                var grant = grants[c.GrantId];
                return new MacroNewsItemDto
                {
                    Kind = MacroNewsKind.Call,
                    Title = string.IsNullOrWhiteSpace(c.Period) ? grant.Name : grant.Name + " · " + c.Period,
                    Summary = c.Deadline.HasValue
                        ? L["Macros:News:CallDeadline", c.Deadline.Value.ToString("dd.MM.yyyy"),
                            (int)(c.Deadline.Value.Date - now.Date).TotalDays]
                        : L["Macros:News:CallOpen"],
                    Source = grant.Issuer,
                    Date = c.OpenDate ?? c.CreationTime,
                    Url = "/Grants/Detail?id=" + c.Id,
                    PosterFileName = grant.PosterFileName
                };
            }).ToList();
        }
    }

    /// <summary>
    /// Sürüm notları, sürüm notu servisinin görünürlük kuralıyla (paket, kitle, host onayı). Host
    /// onay bekleyen maddeleri de görür; haber olarak yalnız onaylı maddeler gösterilir.
    /// </summary>
    private async Task<List<MacroNewsItemDto>> GetReleaseNotesAsync(int max)
    {
        var tr = CultureInfo.GetCultureInfo("tr-TR");
        var history = await _releaseNotes.GetHistoryAsync();

        return history
            .Select(version => new { Version = version, Items = version.Items.Where(i => !i.IsPendingApproval).ToList() })
            .Where(x => x.Items.Count > 0)
            .Take(max)
            .Select(x => new MacroNewsItemDto
            {
                Kind = MacroNewsKind.Platform,
                Title = x.Items[0].Title,
                Summary = x.Items.Count > 1
                    ? L["Macros:News:ReleaseMore", x.Items.Count - 1]
                    : x.Version.Title,
                Source = x.Version.Version,
                Date = DateTime.TryParseExact(x.Version.Date, "d MMMM yyyy", tr, DateTimeStyles.None, out var date)
                    ? date
                    : DateTime.MinValue,
                Url = "/ReleaseNotes"
            })
            .ToList();
    }

    /// <summary>Kullanıcının karar ve itiraz sonucu bildirimleri (son 60 gün). LastOccurredAt UTC tutulur.</summary>
    private async Task<List<MacroNewsItemDto>> GetResultsAsync(Guid userId, int max)
    {
        var since = DateTime.UtcNow.AddDays(-ResultLookbackDays);
        var rows = await AsyncExecuter.ToListAsync((await _notificationRepository.GetQueryableAsync())
            .Where(n => n.UserId == userId && ResultTypes.Contains(n.Type) && n.LastOccurredAt >= since)
            .OrderByDescending(n => n.LastOccurredAt)
            .Take(max));

        return rows.Select(n => new MacroNewsItemDto
        {
            Kind = MacroNewsKind.Result,
            Title = n.Title,
            Summary = n.Body,
            Date = DateTime.SpecifyKind(n.LastOccurredAt, DateTimeKind.Utc).ToLocalTime(),
            Url = AppPathOrNull(NotificationTypeRegistry.BuildDeepLink(n.Type, n.EntityId)) ?? "/Notifications"
        }).ToList();
    }

    /// <summary>Açık yönlendirme olmasın: yalnız "/x" biçimli uygulama yolu.</summary>
    private static string? AppPathOrNull(string? url)
        => url != null && url.StartsWith('/') && !url.StartsWith("//") && !url.StartsWith("/\\") ? url : null;
}
