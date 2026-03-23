using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Calendars;

[Authorize]
public class CalendarAppService : ApplicationService, ICalendarAppService
{
    private readonly IRepository<ExternalCalendarAccount, Guid> _accountRepository;
    private readonly CalendarManager _calendarManager;

    private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;

    public CalendarAppService(
        IRepository<ExternalCalendarAccount, Guid> accountRepository,
        CalendarManager calendarManager,
        Microsoft.Extensions.Configuration.IConfiguration configuration)
    {
        _accountRepository = accountRepository;
        _calendarManager = calendarManager;
        _configuration = configuration;
    }

    public async Task<List<CalendarAccountDto>> GetMyAccountsAsync()
    {
        var accounts = await _accountRepository.GetListAsync(x => x.UserId == CurrentUser.Id);
        return accounts.Select(a => new CalendarAccountDto
        {
            Id = a.Id,
            Provider = a.Provider,
            ExternalEmail = a.ExternalEmail,
            IsSyncEnabled = a.IsSyncEnabled,
            LastSyncTime = a.LastSyncTime
        }).ToList();
    }

    public async Task ConnectAccountAsync(ConnectCalendarInput input)
    {
        // 1. Zaten aynı email ile bağlı mı kontrol et (basit kontrol)
        var existing = await _accountRepository.FirstOrDefaultAsync(x => 
            x.UserId == CurrentUser.Id && 
            x.Provider == input.Provider && 
            x.ExternalEmail == input.ExternalEmail);

        if (existing != null)
        {
            existing.AccessToken = input.AccessToken;
            existing.RefreshToken = input.RefreshToken;
            await _accountRepository.UpdateAsync(existing);
        }
        else 
        {
            var account = new ExternalCalendarAccount(
                GuidGenerator.Create(),
                CurrentUser.Id!.Value,
                input.Provider,
                input.ExternalEmail
            )
            {
                AccessToken = input.AccessToken,
                RefreshToken = input.RefreshToken
            };
            await _accountRepository.InsertAsync(account);
        }
    }

    public async Task DisconnectAccountAsync(Guid id)
    {
        var account = await _accountRepository.GetAsync(id);
        if (account.UserId != CurrentUser.Id) throw new UnauthorizedAccessException();

        await _accountRepository.DeleteAsync(account);
    }

    public async Task<string> GetAuthUrlAsync(CalendarProviderType provider)
    {
        var clientId = provider == CalendarProviderType.Google 
            ? _configuration["Calendars:Google:ClientId"]
            : _configuration["Calendars:Outlook:ClientId"];

        if (string.IsNullOrEmpty(clientId))
        {
            // Client ID yoksa bir simülatör sayfasına yönlendirelim ki kullanıcı textbox'la uğraşmasın
            return $"/Calendars/SimulateAuth?provider={(int)provider}";
        }

        // Örn: Google Auth URL (Parametreler appsettings'ten alınmalı gerçek hayatta)
        if (provider == CalendarProviderType.Google)
        {
            return $"https://accounts.google.com/o/oauth2/v2/auth?client_id={clientId}&response_type=code&scope=https://www.googleapis.com/auth/calendar.events&access_type=offline&redirect_uri=https://localhost:44386/api/app/calendar/callback";
        }
        
        return $"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={clientId}&response_type=code&scope=Calendars.ReadWrite&redirect_uri=https://localhost:44386/api/app/calendar/callback";
    }

    public async Task ForceSyncAsync(Guid id)
    {
        // Önemli: Gerçek bir task repository ile tam senkronizasyon gerektirir... 
        // Bu metod şimdilik boş bırakılabilir veya basitçe bir log atabilir.
    }
}
