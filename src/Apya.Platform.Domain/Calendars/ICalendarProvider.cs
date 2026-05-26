using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Apya.Platform.Calendars;

public interface ICalendarProvider
{
    CalendarProviderType ProviderType { get; }

    Task<string> CreateEventAsync(ExternalCalendarAccount account, CalendarEvent eventData);
    Task UpdateEventAsync(ExternalCalendarAccount account, string externalEventId, CalendarEvent eventData);
    Task DeleteEventAsync(ExternalCalendarAccount account, string externalEventId);
    Task<List<CalendarEvent>> GetEventsAsync(ExternalCalendarAccount account, DateTime start, DateTime end);

    /// <summary>Access token yenile ve yeni (accessToken, refreshToken, expiresAt) döndür.</summary>
    Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)> RefreshTokenAsync(
        ExternalCalendarAccount account, string clientId, string clientSecret);
}

public class CalendarEvent
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAllDay { get; set; }
}
