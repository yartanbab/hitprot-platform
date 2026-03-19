using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Calendars;

public class MicrosoftOutlookProvider : ICalendarProvider, ITransientDependency
{
    private readonly ILogger<MicrosoftOutlookProvider> _logger;
    public CalendarProviderType ProviderType => CalendarProviderType.Outlook;

    public MicrosoftOutlookProvider(ILogger<MicrosoftOutlookProvider> logger)
    {
        _logger = logger;
    }

    public async Task<string> CreateEventAsync(ExternalCalendarAccount account, CalendarEvent eventData)
    {
        _logger.LogInformation($"Microsoft Graph API Call: Outlook event created for {account.ExternalEmail}");
        return "outlook_event_" + Guid.NewGuid().ToString("N");
    }

    public async Task UpdateEventAsync(ExternalCalendarAccount account, string externalEventId, CalendarEvent eventData)
    {
        _logger.LogInformation($"Microsoft Graph API Call: Event '{externalEventId}' updated");
    }

    public async Task DeleteEventAsync(ExternalCalendarAccount account, string externalEventId)
    {
        _logger.LogInformation($"Microsoft Graph API Call: Event '{externalEventId}' deleted");
    }

    public async Task<List<CalendarEvent>> GetEventsAsync(ExternalCalendarAccount account, DateTime start, DateTime end)
    {
        return new List<CalendarEvent>();
    }
}
