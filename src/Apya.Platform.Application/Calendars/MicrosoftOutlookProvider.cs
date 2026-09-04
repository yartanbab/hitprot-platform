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

public class MicrosoftOutlookProvider : ICalendarProvider, ITransientDependency
{
    private readonly ILogger<MicrosoftOutlookProvider> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly CalendarTokenProtector _tokenProtector;

    private const string GraphBase     = "https://graph.microsoft.com/v1.0/me/events";
    private const string TokenEndpoint = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

    public CalendarProviderType ProviderType => CalendarProviderType.Outlook;

    public MicrosoftOutlookProvider(ILogger<MicrosoftOutlookProvider> logger, IHttpClientFactory httpClientFactory, CalendarTokenProtector tokenProtector)
    {
        _logger = logger;
        _httpClientFactory = httpClientFactory;
        _tokenProtector = tokenProtector;
    }

    public async Task<string> CreateEventAsync(ExternalCalendarAccount account, CalendarEvent eventData)
    {
        var client = BuildClient(_tokenProtector.Unprotect(account.AccessToken));
        var body = BuildGraphEventBody(eventData);
        var response = await client.PostAsync(GraphBase,
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));

        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        var id = json.GetProperty("id").GetString()!;
        _logger.LogInformation("Outlook Calendar: event created. EventId={EventId}, Email={Email}", id, account.ExternalEmail);
        return id;
    }

    public async Task UpdateEventAsync(ExternalCalendarAccount account, string externalEventId, CalendarEvent eventData)
    {
        var client = BuildClient(_tokenProtector.Unprotect(account.AccessToken));
        var body = BuildGraphEventBody(eventData);
        var response = await client.PatchAsync($"{GraphBase}/{externalEventId}",
            new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json"));

        response.EnsureSuccessStatusCode();
        _logger.LogInformation("Outlook Calendar: event updated. EventId={EventId}", externalEventId);
    }

    public async Task DeleteEventAsync(ExternalCalendarAccount account, string externalEventId)
    {
        var client = BuildClient(_tokenProtector.Unprotect(account.AccessToken));
        var response = await client.DeleteAsync($"{GraphBase}/{externalEventId}");

        if (response.StatusCode != System.Net.HttpStatusCode.NotFound)
            response.EnsureSuccessStatusCode();

        _logger.LogInformation("Outlook Calendar: event deleted. EventId={EventId}", externalEventId);
    }

    /// <summary>
    /// Aralıktaki etkinlikleri okur. <c>/calendarView</c> kullanılır (ham
    /// <c>/events</c> değil): tekrarlayan etkinlikleri Graph tek tek örneklere açar.
    /// </summary>
    public async Task<List<CalendarEvent>> GetEventsAsync(ExternalCalendarAccount account, DateTime start, DateTime end)
    {
        var client = BuildClient(_tokenProtector.Unprotect(account.AccessToken));
        // Graph ofsetsiz damgayı UTC sayar; yerel değeri çevirmeden göndermek pencereyi
        // saat farkı kadar kaydırıyordu (günün ilk/son saatleri kapsam dışı kalıyordu).
        var url = "https://graph.microsoft.com/v1.0/me/calendarView" +
                  $"?startDateTime={Uri.EscapeDataString(CalendarTimes.ToGraphUtc(start))}" +
                  $"&endDateTime={Uri.EscapeDataString(CalendarTimes.ToGraphUtc(end))}" +
                  "&$select=id,subject,start,end,isAllDay&$orderby=start/dateTime&$top=250";

        var response = await client.GetAsync(url);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<JsonElement>();

        var events = new List<CalendarEvent>();
        if (!json.TryGetProperty("value", out var items)) return events;

        foreach (var item in items.EnumerateArray())
        {
            var startTime = ReadGraphTime(item, "start");
            var endTime = ReadGraphTime(item, "end");
            if (startTime == null || endTime == null) continue;

            events.Add(new CalendarEvent
            {
                ExternalId = item.TryGetProperty("id", out var id) ? id.GetString() : null,
                Title      = item.TryGetProperty("subject", out var s) ? (s.GetString() ?? "(başlıksız)") : "(başlıksız)",
                StartTime  = startTime.Value,
                EndTime    = endTime.Value,
                IsAllDay   = item.TryGetProperty("isAllDay", out var allDay) && allDay.ValueKind == JsonValueKind.True
            });
        }

        _logger.LogDebug("Outlook Calendar: {Count} etkinlik okundu. Email={Email}", events.Count, account.ExternalEmail);
        return events;
    }

    private static DateTime? ReadGraphTime(JsonElement item, string property)
    {
        if (!item.TryGetProperty(property, out var node)) return null;
        if (!node.TryGetProperty("dateTime", out var dt)) return null;
        return dt.GetString() is { } text
               && DateTime.TryParse(text, null, System.Globalization.DateTimeStyles.RoundtripKind, out var parsed)
            ? parsed
            : null;
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
            ["client_secret"] = clientSecret,
            ["scope"]         = "Calendars.ReadWrite offline_access"
        });

        var response = await client.PostAsync(TokenEndpoint, form);
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<MsTokenResponse>();

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
            ["redirect_uri"]  = redirectUri,
            ["scope"]         = "Calendars.ReadWrite offline_access User.Read"
        });

        var tokenResp = await client.PostAsync(TokenEndpoint, form);
        tokenResp.EnsureSuccessStatusCode();
        var token = await tokenResp.Content.ReadFromJsonAsync<MsTokenResponse>();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token!.AccessToken);
        var me = await client.GetFromJsonAsync<JsonElement>("https://graph.microsoft.com/v1.0/me");
        var email = me.TryGetProperty("mail", out var mailProp)
            ? mailProp.GetString() ?? string.Empty
            : me.GetProperty("userPrincipalName").GetString() ?? string.Empty;

        return (token.AccessToken, token.RefreshToken ?? string.Empty,
                DateTime.UtcNow.AddSeconds(token.ExpiresIn - 60), email);
    }

    private HttpClient BuildClient(string accessToken)
    {
        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        return client;
    }

    /// <summary>
    /// Etkinlik gövdesi. Saatler UTC'ye ÇEVRİLİR: uygulamanın saatleri yereldir ama
    /// gövdedeki etiket "UTC" — çevirmeden gönderildiğinde etkinlik dış takvime saat
    /// farkı kadar (TR'de 3 saat) kaymış gidiyordu. Graph'ın <c>dateTime</c> alanı
    /// ofset taşımaz, saat dilimini ayrı alandan okur.
    /// </summary>
    private static object BuildGraphEventBody(CalendarEvent e) => new
    {
        subject = e.Title,
        body    = new { contentType = "text", content = e.Description ?? string.Empty },
        start   = new { dateTime = CalendarTimes.ToGraphUtc(e.StartTime), timeZone = "UTC" },
        end     = new { dateTime = CalendarTimes.ToGraphUtc(e.EndTime),   timeZone = "UTC" }
    };

    private class MsTokenResponse
    {
        [JsonPropertyName("access_token")]  public string AccessToken  { get; set; } = string.Empty;
        [JsonPropertyName("refresh_token")] public string? RefreshToken { get; set; }
        [JsonPropertyName("expires_in")]    public int ExpiresIn        { get; set; }
    }
}
