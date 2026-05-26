using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Apya.Platform.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Calendars;

[Authorize]
public class CalendarAppService : ApplicationService, ICalendarAppService
{
    private readonly IRepository<ExternalCalendarAccount, Guid> _accountRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly CalendarManager _calendarManager;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;

    public CalendarAppService(
        IRepository<ExternalCalendarAccount, Guid> accountRepository,
        IRepository<TaskItem, Guid> taskRepository,
        CalendarManager calendarManager,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory)
    {
        _accountRepository = accountRepository;
        _taskRepository    = taskRepository;
        _calendarManager   = calendarManager;
        _configuration     = configuration;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<List<CalendarAccountDto>> GetMyAccountsAsync()
    {
        var accounts = await _accountRepository.GetListAsync(x => x.UserId == CurrentUser.Id);
        return accounts.Select(a => new CalendarAccountDto
        {
            Id            = a.Id,
            Provider      = a.Provider,
            ExternalEmail = a.ExternalEmail,
            IsSyncEnabled = a.IsSyncEnabled,
            LastSyncTime  = a.LastSyncTime
        }).ToList();
    }

    public async Task ConnectAccountAsync(ConnectCalendarInput input)
    {
        var existing = await _accountRepository.FirstOrDefaultAsync(x =>
            x.UserId == CurrentUser.Id &&
            x.Provider == input.Provider &&
            x.ExternalEmail == input.ExternalEmail);

        if (existing != null)
        {
            existing.AccessToken     = input.AccessToken;
            existing.RefreshToken    = input.RefreshToken;
            existing.TokenExpiryTime = input.TokenExpiryTime;
            await _accountRepository.UpdateAsync(existing);
        }
        else
        {
            var account = new ExternalCalendarAccount(GuidGenerator.Create(), CurrentUser.Id!.Value, input.Provider, input.ExternalEmail)
            {
                AccessToken     = input.AccessToken,
                RefreshToken    = input.RefreshToken,
                TokenExpiryTime = input.TokenExpiryTime
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
            return $"/Calendars/SimulateAuth?provider={(int)provider}";

        var selfUrl     = _configuration["App:SelfUrl"]?.TrimEnd('/') ?? throw new InvalidOperationException("App:SelfUrl eksik.");
        var redirectUri = Uri.EscapeDataString($"{selfUrl}/Calendars/Callback");
        var state       = (int)provider;

        if (provider == CalendarProviderType.Google)
            return $"https://accounts.google.com/o/oauth2/v2/auth" +
                   $"?client_id={clientId}&response_type=code" +
                   $"&scope={Uri.EscapeDataString("https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email")}" +
                   $"&access_type=offline&prompt=consent&state={state}&redirect_uri={redirectUri}";

        return $"https://login.microsoftonline.com/common/oauth2/v2.0/authorize" +
               $"?client_id={clientId}&response_type=code" +
               $"&scope={Uri.EscapeDataString("Calendars.ReadWrite offline_access User.Read")}" +
               $"&state={state}&redirect_uri={redirectUri}";
    }

    /// <summary>OAuth callback'ten gelen code'u token'a çevirip hesabı bağlar.</summary>
    public async Task ExchangeCodeAndConnectAsync(CalendarProviderType provider, string code, string redirectUri)
    {
        var sectionKey   = provider == CalendarProviderType.Google ? "Google" : "Outlook";
        var clientId     = _configuration[$"Calendars:{sectionKey}:ClientId"] ?? string.Empty;
        var clientSecret = _configuration[$"Calendars:{sectionKey}:ClientSecret"] ?? string.Empty;

        string accessToken, refreshToken, email;
        DateTime expiresAt;

        if (provider == CalendarProviderType.Google)
        {
            (accessToken, refreshToken, expiresAt, email) =
                await GoogleCalendarProvider.ExchangeCodeAsync(_httpClientFactory, code, clientId, clientSecret, redirectUri);
        }
        else
        {
            (accessToken, refreshToken, expiresAt, email) =
                await MicrosoftOutlookProvider.ExchangeCodeAsync(_httpClientFactory, code, clientId, clientSecret, redirectUri);
        }

        await ConnectAccountAsync(new ConnectCalendarInput
        {
            Provider        = provider,
            ExternalEmail   = email,
            AccessToken     = accessToken,
            RefreshToken    = refreshToken,
            TokenExpiryTime = expiresAt
        });
    }

    public async Task ForceSyncAsync(Guid id)
    {
        var account = await _accountRepository.GetAsync(id);
        if (account.UserId != CurrentUser.Id) throw new UnauthorizedAccessException();

        var tasks = await _taskRepository.GetListAsync(t => t.AssigneeId == account.UserId && t.DueDate != null);
        foreach (var task in tasks)
            await _calendarManager.SyncTaskToExternalCalendarsAsync(task);

        account.LastSyncTime = Clock.Now;
        await _accountRepository.UpdateAsync(account);
    }
}
