using System;
using System.Threading.Tasks;
using Apya.Platform.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities.Events;
using Volo.Abp.EventBus;

namespace Apya.Platform.Calendars;

/// <summary>
/// Görevlerdeki değişiklikleri (Oluşturma, Güncelleme, Silme) dinleyip 
/// takvim senkronizasyonunu tetikleyen handler.
/// </summary>
public class CalendarTaskEventHandler : 
    ILocalEventHandler<EntityCreatedEventData<TaskItem>>,
    ILocalEventHandler<EntityUpdatedEventData<TaskItem>>,
    ILocalEventHandler<EntityDeletedEventData<TaskItem>>,
    ITransientDependency
{
    private readonly CalendarManager _calendarManager;

    public CalendarTaskEventHandler(CalendarManager calendarManager)
    {
        _calendarManager = calendarManager;
    }

    public async Task HandleEventAsync(EntityCreatedEventData<TaskItem> eventData)
    {
        // Yeni görev oluşturulduğunda takvime ekle
        await _calendarManager.SyncTaskToExternalCalendarsAsync(eventData.Entity);
    }

    public async Task HandleEventAsync(EntityUpdatedEventData<TaskItem> eventData)
    {
        // Görev güncellendiğinde takvimi güncelle
        await _calendarManager.SyncTaskToExternalCalendarsAsync(eventData.Entity);
    }

    public async Task HandleEventAsync(EntityDeletedEventData<TaskItem> eventData)
    {
        // Görev silindiğinde takvimden de çıkar
        await _calendarManager.DeleteTaskFromExternalCalendarsAsync(eventData.Entity.Id);
    }
}
