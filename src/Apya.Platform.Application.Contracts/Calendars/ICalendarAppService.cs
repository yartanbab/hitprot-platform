using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Calendars;

public interface ICalendarAppService : IApplicationService
{
    Task<List<CalendarAccountDto>> GetMyAccountsAsync();
    Task ConnectAccountAsync(ConnectCalendarInput input);
    Task DisconnectAccountAsync(Guid id);
    Task<string> GetAuthUrlAsync(CalendarProviderType provider);
    Task ExchangeCodeAndConnectAsync(CalendarProviderType provider, string code, string redirectUri);
    Task ForceSyncAsync(Guid id);
}
