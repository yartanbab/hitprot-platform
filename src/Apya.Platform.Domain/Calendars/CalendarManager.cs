using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Apya.Platform.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Calendars;

public class CalendarManager : DomainService
{
    private readonly IRepository<ExternalCalendarAccount, Guid> _accountRepository;
    private readonly IRepository<CalendarSyncMapping, Guid> _mappingRepository;
    private readonly IRepository<CalendarSyncLogEntry, Guid> _syncLogRepository;
    private readonly IEnumerable<ICalendarProvider> _providers;
    private readonly IConfiguration _configuration;
    private readonly CalendarTokenProtector _tokenProtector;

    public CalendarManager(
        IRepository<ExternalCalendarAccount, Guid> accountRepository,
        IRepository<CalendarSyncMapping, Guid> mappingRepository,
        IRepository<CalendarSyncLogEntry, Guid> syncLogRepository,
        IEnumerable<ICalendarProvider> providers,
        IConfiguration configuration,
        CalendarTokenProtector tokenProtector)
    {
        _accountRepository = accountRepository;
        _mappingRepository = mappingRepository;
        _syncLogRepository = syncLogRepository;
        _providers         = providers;
        _configuration     = configuration;
        _tokenProtector    = tokenProtector;
    }

    public async Task SyncTaskToExternalCalendarsAsync(TaskItem task)
    {
        if (task.AssigneeId == null) return;

        var accounts = await _accountRepository.GetListAsync(x => x.UserId == task.AssigneeId && x.IsSyncEnabled);
        foreach (var account in accounts)
        {
            // Faz 5: hesap başına kurallar. Kural dışı kalan görev sessizce atlanır —
            // ayar ekranındaki seçimin gerçekten bir karşılığı olsun diye.
            if (!AllowsSource(account, CalendarSourceType.Task)) continue;
            if (!AllowsProject(account, task.ProjectId)) continue;

            await SyncToAccountAsync(account, task);
        }
    }

    /// <summary>
    /// Hesabın kaynak süzgeci. BOŞ = yalnız görev: kural tanımlanmamış eski hesaplar
    /// birden bire fatura/gider göndermeye başlamasın.
    /// </summary>
    private static bool AllowsSource(ExternalCalendarAccount account, CalendarSourceType source)
    {
        if (string.IsNullOrWhiteSpace(account.SyncSources))
            return source == CalendarSourceType.Task;

        return account.SyncSources
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Any(part => int.TryParse(part, out var value) && value == (int)source);
    }

    /// <summary>Proje süzgeci. BOŞ = süzgeç yok (tüm projeler).</summary>
    private static bool AllowsProject(ExternalCalendarAccount account, Guid? projectId)
    {
        if (string.IsNullOrWhiteSpace(account.SyncProjectIds)) return true;
        if (projectId == null) return false; // süzgeç varken projesiz öğe kapsam dışı

        return account.SyncProjectIds
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Any(part => Guid.TryParse(part, out var value) && value == projectId.Value);
    }

    /// <summary>Senkron günlüğüne satır yazar. Günlük yazımı senkronu ASLA düşürmez.</summary>
    private async Task WriteLogAsync(ExternalCalendarAccount account, CalendarSyncLogKind kind, string message, int itemCount = 0)
    {
        try
        {
            await _syncLogRepository.InsertAsync(new CalendarSyncLogEntry(
                GuidGenerator.Create(), CurrentTenant.Id, account.Id, kind, message, itemCount));
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "Senkron günlüğü yazılamadı. AccountId={AccountId}", account.Id);
        }
    }

    private async Task SyncToAccountAsync(ExternalCalendarAccount account, TaskItem task)
    {
        var provider = _providers.FirstOrDefault(x => x.ProviderType == account.Provider);
        if (provider == null) return;

        account = await EnsureFreshTokenAsync(account, provider);

        var mapping = await _mappingRepository.FirstOrDefaultAsync(x =>
            x.TaskId == task.Id && x.ExternalCalendarAccountId == account.Id);

        var eventData = new CalendarEvent
        {
            Title       = task.Title,
            Description = task.Description, // string? — CalendarEvent.Description artık string?
            StartTime   = task.StartDate,
            EndTime     = task.DueDate ?? task.StartDate.AddHours(1)
        };

        try
        {
            if (mapping == null)
            {
                var externalId = await provider.CreateEventAsync(account, eventData);
                await _mappingRepository.InsertAsync(new CalendarSyncMapping(task.Id, externalId, account.Id, Clock.Now));
            }
            else
            {
                await provider.UpdateEventAsync(account, mapping.ExternalEventId, eventData);
                mapping.LastSyncedAt = Clock.Now;
                await _mappingRepository.UpdateAsync(mapping);
            }

            await WriteLogAsync(account, CalendarSyncLogKind.Written, $"“{task.Title}” yazıldı.", 1);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Takvim senkronizasyon hatası. Provider={Provider}, AccountId={AccountId}",
                account.Provider, account.Id);

            // Kullanıcı bir öğenin neden dış takvimde olmadığını yalnız buradan görebilir.
            await WriteLogAsync(account, CalendarSyncLogKind.Error,
                $"“{task.Title}” yazılamadı — bağlantı yenilenmeli.", 1);
        }
    }

    public async Task DeleteTaskFromExternalCalendarsAsync(Guid taskId)
    {
        var mappings = await _mappingRepository.GetListAsync(x => x.TaskId == taskId);
        if (mappings.Count == 0) return;

        var accountIds = mappings.Select(m => m.ExternalCalendarAccountId).Distinct().ToList();
        var accounts   = await _accountRepository.GetListAsync(a => accountIds.Contains(a.Id));
        var accountMap = accounts.ToDictionary(a => a.Id);

        foreach (var mapping in mappings)
        {
            if (accountMap.TryGetValue(mapping.ExternalCalendarAccountId, out var account))
            {
                var provider = _providers.FirstOrDefault(x => x.ProviderType == account.Provider);
                if (provider != null)
                {
                    try { await provider.DeleteEventAsync(account, mapping.ExternalEventId); }
                    catch (Exception ex)
                    {
                        Logger.LogWarning(ex, "Harici takvimden etkinlik silinemedi. AccountId={AccountId}, EventId={EventId}",
                            mapping.ExternalCalendarAccountId, mapping.ExternalEventId);
                    }
                }
            }
            await _mappingRepository.DeleteAsync(mapping);
        }
    }

    /// <summary>
    /// Kullanıcının bağlı hesaplarından aralıktaki etkinlikleri okur.
    /// <para>
    /// Hesap başına TOLERANSLI: biri patlarsa (yetki süresi doldu, ağ hatası) o hesabın
    /// satırı <c>Error</c> ile döner, diğerleri okunmaya devam eder. Takvimin tamamı
    /// tek bir bozuk bağlantı yüzünden boş kalmaz — tasarımın "bağlantı bozuk" durumu
    /// bu sonucun üzerine kurulur.
    /// </para>
    /// </summary>
    public async Task<List<ExternalEventFetchResult>> GetExternalEventsAsync(Guid userId, DateTime start, DateTime end)
    {
        var accounts = await _accountRepository.GetListAsync(x => x.UserId == userId && x.IsSyncEnabled);
        var results = new List<ExternalEventFetchResult>();

        foreach (var account in accounts)
        {
            var result = new ExternalEventFetchResult
            {
                AccountId = account.Id,
                Provider  = account.Provider,
                Email     = account.ExternalEmail
            };
            results.Add(result);

            var provider = _providers.FirstOrDefault(x => x.ProviderType == account.Provider);
            if (provider == null)
            {
                result.Error = "Bu sağlayıcı için okuma desteği yok.";
                continue;
            }

            try
            {
                var fresh = await EnsureFreshTokenAsync(account, provider);
                result.Events = await provider.GetEventsAsync(fresh, start, end);
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex, "Dış takvim etkinlikleri okunamadı. AccountId={AccountId}", account.Id);
                result.Error = "Bağlantı yenilenmeli — etkinlikler okunamadı.";
            }
        }

        return results;
    }

    // ── Token yenileme ────────────────────────────────────────────────────────

    private async Task<ExternalCalendarAccount> EnsureFreshTokenAsync(ExternalCalendarAccount account, ICalendarProvider provider)
    {
        // 5 dakika tampon ile kontrol
        if (account.TokenExpiryTime.HasValue && account.TokenExpiryTime.Value > Clock.Now.AddMinutes(5))
            return account;

        var sectionKey   = account.Provider == CalendarProviderType.Google ? "Google" : "Outlook";
        var clientId     = _configuration[$"Calendars:{sectionKey}:ClientId"];
        var clientSecret = _configuration[$"Calendars:{sectionKey}:ClientSecret"];

        // SimulateAuth modunda (client secret yok) atla
        if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
            return account;

        try
        {
            var (newAccess, newRefresh, expiresAt) = await provider.RefreshTokenAsync(account, clientId, clientSecret);
            account.AccessToken     = _tokenProtector.Protect(newAccess);
            account.RefreshToken    = _tokenProtector.Protect(newRefresh);
            account.TokenExpiryTime = expiresAt;
            await _accountRepository.UpdateAsync(account);
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "Token yenileme başarısız. AccountId={AccountId}", account.Id);
        }

        return account;
    }
}
