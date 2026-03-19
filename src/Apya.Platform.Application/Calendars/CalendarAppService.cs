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

    public CalendarAppService(
        IRepository<ExternalCalendarAccount, Guid> accountRepository,
        CalendarManager calendarManager)
    {
        _accountRepository = accountRepository;
        _calendarManager = calendarManager;
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

    public async Task ForceSyncAsync(Guid id)
    {
        // Önemli: Gerçek bir task repository ile tam senkronizasyon gerektirir... 
        // Bu metod şimdilik boş bırakılabilir veya basitçe bir log atabilir.
    }
}
