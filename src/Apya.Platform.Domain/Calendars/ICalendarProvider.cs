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
    /// <summary>Dış servisteki etkinlik kimliği — YALNIZ okuma yolunda dolar
    /// (<see cref="ICalendarProvider.GetEventsAsync"/>). Yazma yolunda null.</summary>
    public string? ExternalId { get; set; }

    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAllDay { get; set; }
}

/// <summary>
/// Bir dış hesaptan etkinlik çekme sonucu. Hata FIRLATILMAZ, taşınır: bir hesabın
/// yetkisi dolduğunda takvimin tamamı düşmemeli — o hesap satırı hata durumuna
/// düşer, diğer kaynaklar görünmeye devam eder.
/// </summary>
public class ExternalEventFetchResult
{
    public Guid AccountId { get; set; }

    public CalendarProviderType Provider { get; set; }

    public string Email { get; set; } = string.Empty;

    public List<CalendarEvent> Events { get; set; } = new();

    /// <summary>Null = başarılı. Doluysa kullanıcıya gösterilecek hata.</summary>
    public string? Error { get; set; }
}
