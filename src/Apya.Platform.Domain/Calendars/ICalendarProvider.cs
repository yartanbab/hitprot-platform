using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Apya.Platform.Calendars;

public interface ICalendarProvider
{
    CalendarProviderType ProviderType { get; }

    // Dış takvime etkinlik ekle
    Task<string> CreateEventAsync(ExternalCalendarAccount account, CalendarEvent eventData);

    // Etkinliği güncelle
    Task UpdateEventAsync(ExternalCalendarAccount account, string externalEventId, CalendarEvent eventData);

    // Etkinliği sil
    Task DeleteEventAsync(ExternalCalendarAccount account, string externalEventId);

    // Belirli bir aralıktaki tüm etkinlikleri getir (Synchronization için)
    Task<List<CalendarEvent>> GetEventsAsync(ExternalCalendarAccount account, DateTime start, DateTime end);
}

public class CalendarEvent
{
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAllDay { get; set; }
}
