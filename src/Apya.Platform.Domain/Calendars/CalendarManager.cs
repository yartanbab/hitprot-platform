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
    private readonly IEnumerable<ICalendarProvider> _providers;
    private readonly IConfiguration _configuration;

    public CalendarManager(
        IRepository<ExternalCalendarAccount, Guid> accountRepository,
        IRepository<CalendarSyncMapping, Guid> mappingRepository,
        IEnumerable<ICalendarProvider> providers,
        IConfiguration configuration)
    {
        _accountRepository = accountRepository;
        _mappingRepository = mappingRepository;
        _providers         = providers;
        _configuration     = configuration;
    }

    public async Task SyncTaskToExternalCalendarsAsync(TaskItem task)
    {
        if (task.AssigneeId == null) return;

        var accounts = await _accountRepository.GetListAsync(x => x.UserId == task.AssigneeId && x.IsSyncEnabled);
        foreach (var account in accounts)
            await SyncToAccountAsync(account, task);
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
            Description = task.Description,
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
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Takvim senkronizasyon hatası. Provider={Provider}, AccountId={AccountId}",
                account.Provider, account.Id);
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
            account.AccessToken     = newAccess;
            account.RefreshToken    = newRefresh;
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
