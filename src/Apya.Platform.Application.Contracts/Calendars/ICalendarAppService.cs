using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Calendars;

public interface ICalendarAppService : IApplicationService
{
    /// <summary>
    /// Takvimin tek veri ucu: verilen aralıktaki tüm kaynakları (görev, fatura, hibe,
    /// gider, gelir, kasa hareketi) tek şekle indirger. İzin verilmeyen kaynak
    /// sorgulanmaz, ray satırında <c>IsAvailable=false</c> döner.
    /// </summary>
    Task<CalendarFeedDto> GetFeedAsync(GetCalendarFeedInput input);

    Task<List<CalendarAccountDto>> GetMyAccountsAsync();
    Task ConnectAccountAsync(ConnectCalendarInput input);
    Task DisconnectAccountAsync(Guid id);
    Task<string> GetAuthUrlAsync(CalendarProviderType provider);
    Task ExchangeCodeAndConnectAsync(CalendarProviderType provider, string code, string redirectUri, string stateToken);
    Task ForceSyncAsync(Guid id);
}
