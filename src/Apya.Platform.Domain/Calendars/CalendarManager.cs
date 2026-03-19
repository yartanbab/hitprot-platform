using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Apya.Platform.Tasks;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;

namespace Apya.Platform.Calendars;

/// <summary>
/// Takvim senkronizasyonunun ana iş mantığını (Business Logic) yürüten servis.
/// </summary>
public class CalendarManager : DomainService
{
    private readonly IRepository<ExternalCalendarAccount, Guid> _accountRepository;
    private readonly IRepository<CalendarSyncMapping, Guid> _mappingRepository;
    private readonly IEnumerable<ICalendarProvider> _providers;

    public CalendarManager(
        IRepository<ExternalCalendarAccount, Guid> accountRepository,
        IRepository<CalendarSyncMapping, Guid> mappingRepository,
        IEnumerable<ICalendarProvider> providers)
    {
        _accountRepository = accountRepository;
        _mappingRepository = mappingRepository;
        _providers = providers;
    }

    /// <summary>
    /// Bir görevi kullanıcının bağlı tüm takvimlerine senkronize eder.
    /// </summary>
    public async Task SyncTaskToExternalCalendarsAsync(TaskItem task)
    {
        if (task.AssigneeId == null) return;

        // 1. Kullanıcının aktif takvim hesaplarını bul
        var accounts = await _accountRepository.GetListAsync(x => x.UserId == task.AssigneeId && x.IsSyncEnabled);
        
        foreach (var account in accounts)
        {
            await SyncToAccountAsync(account, task);
        }
    }

    private async Task SyncToAccountAsync(ExternalCalendarAccount account, TaskItem task)
    {
        var provider = _providers.FirstOrDefault(x => x.ProviderType == account.Provider);
        if (provider == null) return;

        // Daha önce bu görev-hesap ikilisi eşleşmiş mi?
        var mapping = await _mappingRepository.FirstOrDefaultAsync(x => 
            x.TaskId == task.Id && x.ExternalCalendarAccountId == account.Id);

        var eventData = new CalendarEvent
        {
            Title = task.Title,
            Description = task.Description,
            StartTime = task.StartDate,
            EndTime = task.DueDate ?? task.StartDate.AddHours(1)
        };

        try 
        {
            if (mapping == null)
            {
                // Yeni kayıt oluştur
                var externalId = await provider.CreateEventAsync(account, eventData);
                await _mappingRepository.InsertAsync(new CalendarSyncMapping(task.Id, externalId, account.Id));
            }
            else 
            {
                // Var olanı güncelle
                await provider.UpdateEventAsync(account, mapping.ExternalEventId, eventData);
                mapping.LastSyncedAt = DateTime.Now;
                await _mappingRepository.UpdateAsync(mapping);
            }
        }
        catch (Exception ex)
        {
            // Loglama yapılmalı. Belki token geçersizdir.
            Logger.LogError($"Takvim senkronizasyon hatası ({account.Provider}): {ex.Message}");
        }
    }

    public async Task DeleteTaskFromExternalCalendarsAsync(Guid taskId)
    {
        var mappings = await _mappingRepository.GetListAsync(x => x.TaskId == taskId);
        foreach (var mapping in mappings)
        {
            var account = await _accountRepository.GetAsync(mapping.ExternalCalendarAccountId);
            var provider = _providers.FirstOrDefault(x => x.ProviderType == account.Provider);
            if (provider != null)
            {
                try {
                    await provider.DeleteEventAsync(account, mapping.ExternalEventId);
                } catch { /* Ignored */ }
            }
            await _mappingRepository.DeleteAsync(mapping);
        }
    }
}
