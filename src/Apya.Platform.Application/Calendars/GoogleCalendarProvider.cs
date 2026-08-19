using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Calendars;

public class GoogleCalendarProvider : ICalendarProvider, ITransientDependency
{
    private readonly ILogger<GoogleCalendarProvider> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly CalendarTokenProtector _tokenProtector;

    private const string CalendarApiBase = "https://www.googleapis.com/calendar/v3";
    private const string TokenEndpoint   = "https://oauth2.googleapis.com/token";

    public CalendarProviderType ProviderType => CalendarProviderType.Google;

    public GoogleCalendarProvider(ILogger<GoogleCalendarProvider> logger, IHttpClientFactory httpClientFactory, CalendarTokenProtector tokenProtector)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
        _tokenProtector = tokenProtector;
    }

    public async Task<string> CreateEventAsync(ExternalCalendarAccount account, CalendarEvent eventData)
    {
        var client = BuildClient(_tokenProtector.Unprotect(account.AccessToken));
        var body = BuildGoogleEventBody(eventData);
        var response = await client.PostAsync($"{CalendarApiBase}/calendars/primary/events",
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));

        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        var id = json.GetProperty("id").GetString()!;
        _logger.LogInformation("Google Calendar: event created. EventId={EventId}, Email={Email}", id, account.ExternalEmail);
        return id;
    }

    public async Task UpdateEventAsync(ExternalCalendarAccount account, string externalEventId, CalendarEvent eventData)
    {
        var client = BuildClient(_tokenProtector.Unprotect(account.AccessToken));
        var body = BuildGoogleEventBody(eventData);
        var response = await client.PatchAsync($"{CalendarApiBase}/calendars/primary/events/{externalEventId}",
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));

        response.EnsureSuccessStatusCode();
        _logger.LogInformation("Google Calendar: event updated. EventId={EventId}", externalEventId);
    }

    public async Task DeleteEventAsync(ExternalCalendarAccount account, string externalEventId)
    {
        var client = BuildClient(_tokenProtector.Unprotect(account.AccessToken));
        var response = await client.DeleteAsync($"{CalendarApiBase}/calendars/primary/events/{externalEventId}");

        if (response.StatusCode != System.Net.HttpStatusCode.NotFound)
            response.EnsureSuccessStatusCode();

        _logger.LogInformation("Google Calendar: event deleted. EventId={EventId}", externalEventId);
    }

    /// <summary>
    /// Aralıktaki etkinlikleri okur. <c>singleEvents=true</c> ile tekrarlayan
    /// etkinlikler tek tek örneklere açılır — takvim ızgarası RRULE yorumlamaz.
    /// </summary>
    public async Task<List<CalendarEvent>> GetEventsAsync(ExternalCalendarAccount account, DateTime start, DateTime end)
    {
        var client = BuildClient(_tokenProtector.Unprotect(account.AccessToken));
        var url = $"{CalendarApiBase}/calendars/primary/events" +
                  $"?timeMin={Uri.EscapeDataString(start.ToString("o"))}" +
                  $"&timeMax={Uri.EscapeDataString(end.ToString("o"))}" +
                  "&singleEvents=true&orderBy=startTime&maxResults=250";

        var response = await client.GetAsync(url);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        var events = new List<CalendarEvent>();
        if (!json.TryGetProperty("items", out var items)) return events;

        foreach (var item in items.EnumerateArray())
        {
            // İptal edilmiş örnekler start/end taşımaz.
            if (!item.TryGetProperty("start", out var startNode)) continue;
            if (!item.TryGetProperty("end", out var endNode)) continue;

            var (startTime, isAllDay) = ReadGoogleTime(startNode);
            var (endTime, _) = ReadGoogleTime(endNode);
            if (startTime == null || endTime == null) continue;

            events.Add(new CalendarEvent
            {
                ExternalId  = item.TryGetProperty("id", out var id) ? id.GetString() : null,
                Title       = item.TryGetProperty("summary", out var s) ? (s.GetString() ?? "(başlıksız)") : "(başlıksız)",
                Description = item.TryGetProperty("description", out var d) ? d.GetString() : null,
                StartTime   = startTime.Value,
                EndTime     = endTime.Value,
                IsAllDay    = isAllDay
            });
        }

        _logger.LogDebug("Google Calendar: {Count} etkinlik okundu. Email={Email}", events.Count, account.ExternalEmail);
        return events;
    }

    /// <summary>Google zaman düğümü: saatli etkinlikte <c>dateTime</c>, tüm gün olanda <c>date</c>.</summary>
    private static (DateTime? Time, bool IsAllDay) ReadGoogleTime(JsonElement node)
    {
        if (node.TryGetProperty("dateTime", out var dt) && dt.GetString() is { } dts
            && DateTime.TryParse(dts, null, System.Globalization.DateTimeStyles.RoundtripKind, out var parsed))
        {
            return (parsed, false);
        }
        if (node.TryGetProperty("date", out var d) && d.GetString() is { } ds
            && DateTime.TryParse(ds, out var day))
        {
            return (day, true);
        }
        return (null, false);
    }

    public async Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt)> RefreshTokenAsync(
        ExternalCalendarAccount account, string clientId, string clientSecret)
    {
        var refreshToken = _tokenProtector.Unprotect(account.RefreshToken);
        var client = _httpClientFactory.CreateClient();
        var form = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["grant_type"]    = "refresh_token",
            ["refresh_token"] = refreshToken,
            ["client_id"]     = clientId,
            ["client_secret"] = clientSecret
        });

        var response = await client.PostAsync(TokenEndpoint, form);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<GoogleTokenResponse>();

        return (json!.AccessToken, json.RefreshToken ?? refreshToken,
                DateTime.UtcNow.AddSeconds(json.ExpiresIn - 60));
    }

    public static async Task<(string AccessToken, string RefreshToken, DateTime ExpiresAt, string Email)>
        ExchangeCodeAsync(IHttpClientFactory factory, string code, string clientId, string clientSecret, string redirectUri)
    {
        var client = factory.CreateClient();
        var form = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["grant_type"]    = "authorization_code",
            ["code"]          = code,
            ["client_id"]     = clientId,
            ["client_secret"] = clientSecret,
            ["redirect_uri"]  = redirectUri
        });

        var tokenResp = await client.PostAsync(TokenEndpoint, form);
        tokenResp.EnsureSuccessStatusCode();
        var token = await tokenResp.Content.ReadFromJsonAsync<GoogleTokenResponse>();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token!.AccessToken);
        var userResp = await client.GetFromJsonAsync<JsonElement>("https://www.googleapis.com/oauth2/v2/userinfo");
        var email = userResp.GetProperty("email").GetString() ?? string.Empty;

        return (token.AccessToken, token.RefreshToken ?? string.Empty,
                DateTime.UtcNow.AddSeconds(token.ExpiresIn - 60), email);
    }

    private HttpClient BuildClient(string accessToken)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        return client;
    }

    private static object BuildGoogleEventBody(CalendarEvent e) => new
    {
        summary     = e.Title,
        description = e.Description,
        start       = new { dateTime = e.StartTime.ToString("o"), timeZone = "UTC" },
        end         = new { dateTime = e.EndTime.ToString("o"),   timeZone = "UTC" }
    };

    private class GoogleTokenResponse
    {
        [JsonPropertyName("access_token")]  public string AccessToken  { get; set; } = string.Empty;
        [JsonPropertyName("refresh_token")] public string? RefreshToken { get; set; }
        [JsonPropertyName("expires_in")]    public int ExpiresIn        { get; set; }
    }
}
