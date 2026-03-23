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

    // Hesap bağlama için Auth URL'ini getir (Redirect için)
    Task<string> GetAuthUrlAsync(CalendarProviderType provider);

    // Zorla senkronizasyon başlat
    Task ForceSyncAsync(Guid id);
}
