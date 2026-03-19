using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Calendars;

public interface ICalendarAppService : IApplicationService
{
    // Bağlı hesapları getir
    Task<List<CalendarAccountDto>> GetMyAccountsAsync();

    // Yeni hesap bağla
    Task ConnectAccountAsync(ConnectCalendarInput input);

    // Bağlantıyı kopar
    Task DisconnectAccountAsync(Guid id);

    // Zorla senkronizasyon başlat
    Task ForceSyncAsync(Guid id);
}
