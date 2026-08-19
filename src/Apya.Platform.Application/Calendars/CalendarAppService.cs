using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Apya.Platform.Settings;
using Apya.Platform.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Calendars;

[Authorize]
public class CalendarAppService : ApplicationService, ICalendarAppService
{
    private readonly IRepository<ExternalCalendarAccount, Guid> _accountRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly CalendarManager _calendarManager;
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly CalendarTokenProtector _tokenProtector;
    private readonly IDistributedCache _distributedCache;
    private readonly CalendarFeedProvider _feedProvider;
    private readonly ITaskAppService _taskAppService;
    private readonly IRepository<CalendarSyncLogEntry, Guid> _syncLogRepository;
    private readonly IRepository<IcalSubscription, Guid> _icalRepository;
    private readonly IcalSubscriptionFetcher _icalFetcher;
    private readonly Volo.Abp.SettingManagement.ISettingManager _settingManager;

    public CalendarAppService(
        IRepository<ExternalCalendarAccount, Guid> accountRepository,
        IRepository<TaskItem, Guid> taskRepository,
        CalendarManager calendarManager,
        IConfiguration configuration,
        IHttpClientFactory httpClientFactory,
        CalendarTokenProtector tokenProtector,
        IDistributedCache distributedCache,
        CalendarFeedProvider feedProvider,
        ITaskAppService taskAppService,
        IRepository<CalendarSyncLogEntry, Guid> syncLogRepository,
        IRepository<IcalSubscription, Guid> icalRepository,
        IcalSubscriptionFetcher icalFetcher,
        Volo.Abp.SettingManagement.ISettingManager settingManager)
    {
        _feedProvider       = feedProvider;
        _taskAppService     = taskAppService;
        _syncLogRepository  = syncLogRepository;
        _icalRepository     = icalRepository;
        _icalFetcher        = icalFetcher;
        _settingManager     = settingManager;
        _accountRepository = accountRepository;
        _taskRepository    = taskRepository;
        _calendarManager   = calendarManager;
        _configuration     = configuration;
        _httpClientFactory = httpClientFactory;
        _tokenProtector    = tokenProtector;
        _distributedCache  = distributedCache;
    }

    // SEC-012: OAuth 'state' CSRF token'ı için kullanıcı-bağlı sunucu-taraflı anahtar.
    private static string OAuthStateCacheKey(Guid userId) => $"calendar-oauth-state:{userId}";

    public Task<CalendarFeedDto> GetFeedAsync(GetCalendarFeedInput input)
    {
        return _feedProvider.BuildAsync(input);
    }

    /// <summary>
    /// Öğeyi başka güne taşır. Yalnız görev taşınabilir; diğer kaynaklar bir muhasebe
    /// ya da kurum kaydının tarihidir ve takvimden değiştirilmez (feed'de
    /// <c>CanReschedule=false</c> döner, ekran da sürüklemeye izin vermez — bu kontrol
    /// istemciye güvenmemek içindir).
    /// <para>
    /// Gün farkı SUNUCUDA hesaplanır ve görevin kendi <c>DeferAsync</c>'ine devredilir:
    /// gizlilik kontrolü, başlangıç/bitiş tutarlılığı ve dış takvim senkronu tek yerde
    /// kalsın diye takvim kendi güncelleme yolunu açmaz.
    /// </para>
    /// </summary>
    public async Task RescheduleItemAsync(RescheduleCalendarItemInput input)
    {
        EnsureReschedulable(input.Source);

        var task = await _taskRepository.GetAsync(input.SourceId);
        var basis = (task.DueDate ?? Clock.Now).Date;
        var days = (int)(input.NewDate.Date - basis).TotalDays;

        if (days == 0) return;

        await _taskAppService.DeferAsync(input.SourceId, days);
    }

    public async Task CompleteItemAsync(CompleteCalendarItemInput input)
    {
        if (input.Source != CalendarSourceType.Task)
        {
            throw new BusinessException(message: "Bu öğe takvimden tamamlanamaz.");
        }

        await _taskAppService.UpdateStatusAsync(input.SourceId, Tasks.TaskStatus.Done);
    }

    public async Task<CalendarExternalEventsDto> GetExternalEventsAsync(GetCalendarFeedInput input)
    {
        var from = input.From.Date;
        var to = input.To.Date.AddDays(1); // bitiş günü dahil

        var results = await _calendarManager.GetExternalEventsAsync(CurrentUser.Id!.Value, from, to);
        var dto = new CalendarExternalEventsDto();

        foreach (var result in results)
        {
            dto.Accounts.Add(new ExternalCalendarStatusDto
            {
                AccountId  = result.AccountId,
                Provider   = result.Provider,
                Email      = result.Email,
                EventCount = result.Events.Count,
                Error      = result.Error
            });

            foreach (var ev in result.Events)
            {
                dto.Items.Add(new CalendarItemDto
                {
                    // Dış etkinliğin kimliği Guid değil (sağlayıcı string'i) — anahtar
                    // hesap + dış id'den türetilir ki hesaplar arası çakışmasın.
                    Key       = $"{(int)CalendarSourceType.ExternalEvent}:{result.AccountId}:{ev.ExternalId ?? ev.StartTime.Ticks.ToString()}",
                    Source    = CalendarSourceType.ExternalEvent,
                    SourceId  = result.AccountId,
                    Title     = ev.Title,
                    Date      = ev.StartTime.Date,
                    StartTime = ev.IsAllDay ? null : ev.StartTime,
                    EndTime   = ev.IsAllDay ? null : ev.EndTime,
                    IsAllDay  = ev.IsAllDay,
                    Subtitle  = result.Email,
                    Risk      = CalendarRiskLevel.None,
                    // Dış etkinlik APYA'da salt-okunurdur: buradan taşınmaz, kapatılmaz.
                    IsDone        = false,
                    CanReschedule = false
                });
            }
        }

        // iCal abonelikleri de aynı katmandan gelir: ekran için "dış etkinlik" hepsi
        // birdir, farkı sağlayıcısı değil salt-okunur olmasıdır.
        await AppendIcalSubscriptionsAsync(dto, from, to);

        return dto;
    }

    /// <summary>
    /// Abone olunan .ics takvimlerini besler. Abonelik başına TOLERANSLI: biri
    /// yanıt vermezse o satır hata durumuna düşer, diğerleri gelmeye devam eder.
    /// </summary>
    private async Task AppendIcalSubscriptionsAsync(CalendarExternalEventsDto dto, DateTime from, DateTime to)
    {
        var subscriptions = await _icalRepository.GetListAsync(x => x.UserId == CurrentUser.Id && x.IsEnabled);

        foreach (var subscription in subscriptions)
        {
            var status = new ExternalCalendarStatusDto
            {
                AccountId = subscription.Id,
                Provider  = CalendarProviderType.ICloud, // ICS aboneliği: sağlayıcıya bağlı değil
                Email     = subscription.DisplayName,
                Error     = subscription.LastError
            };
            dto.Accounts.Add(status);

            try
            {
                var events = await _icalFetcher.FetchAsync(subscription, from, to);
                status.EventCount = events.Count;
                status.Error      = null;

                foreach (var ev in events)
                {
                    dto.Items.Add(new CalendarItemDto
                    {
                        Key       = $"{(int)CalendarSourceType.ExternalEvent}:{subscription.Id}:{ev.ExternalId}",
                        Source    = CalendarSourceType.ExternalEvent,
                        SourceId  = subscription.Id,
                        Title     = ev.Title,
                        Date      = ev.StartTime.Date,
                        StartTime = ev.IsAllDay ? null : ev.StartTime,
                        EndTime   = ev.IsAllDay ? null : ev.EndTime,
                        IsAllDay  = ev.IsAllDay,
                        Subtitle  = subscription.DisplayName,
                        Risk      = CalendarRiskLevel.None,
                        // Tek yönlü abonelik: APYA'dan taşınamaz, kapatılamaz.
                        CanReschedule = false
                    });
                }
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex, "iCal aboneliği okunamadı. Id={Id}", subscription.Id);
                status.Error = "Bağlantı yanıt vermiyor.";
            }
        }
    }

    public Task<List<CalendarTeamLoadDto>> GetTeamLoadAsync(GetCalendarFeedInput input)
        => _feedProvider.BuildTeamLoadAsync(input);

    /* ── Tercihler ve toplu erteleme (Faz 7) ───────────────────────────────── */

    public async Task<CalendarPreferencesDto> GetPreferencesAsync()
    {
        var capacityRaw = await SettingProvider.GetOrNullAsync(PlatformSettings.Calendar.DailyCapacityHours);
        var sourcesRaw  = await SettingProvider.GetOrNullAsync(PlatformSettings.Calendar.Sources);
        var setupRaw    = await SettingProvider.GetOrNullAsync(PlatformSettings.Calendar.SetupCompleted);

        return new CalendarPreferencesDto
        {
            DailyCapacityHours = ParseCapacity(capacityRaw),
            Sources            = ParseSources(sourcesRaw),
            SetupCompleted     = string.Equals(setupRaw, "true", StringComparison.OrdinalIgnoreCase)
        };
    }

    public async Task UpdatePreferencesAsync(UpdateCalendarPreferencesInput input)
    {
        // 0 = kapasite takibi KAPALI. Negatif değer anlamsız, sıfıra çekilir.
        var capacity = input.DailyCapacityHours is > 0 ? input.DailyCapacityHours.Value : 0m;
        await _settingManager.SetForCurrentUserAsync(
            PlatformSettings.Calendar.DailyCapacityHours,
            capacity.ToString(System.Globalization.CultureInfo.InvariantCulture));

        // Dış etkinlik bir kaynak seçimi DEĞİL (hesap bağlantısına bağlı) — ayıklanır.
        var sources = (input.Sources ?? new List<CalendarSourceType>())
            .Where(s => CalendarSources.Internal.Contains(s))
            .Distinct()
            .Select(s => (int)s);
        await _settingManager.SetForCurrentUserAsync(
            PlatformSettings.Calendar.Sources, string.Join(",", sources));

        await _settingManager.SetForCurrentUserAsync(
            PlatformSettings.Calendar.SetupCompleted, input.SetupCompleted ? "true" : "false");
    }

    /// <summary>
    /// Toplu erteleme. Öğeler TEK TEK uygulanır ve her biri kendi sonucunu döner:
    /// biri (ör. silinmiş bir görev) patlarsa diğerleri uygulanmış kalmalı — kullanıcı
    /// on öğeyi ertelerken birinin hatası yüzünden dokuzunu kaybetmesin.
    /// </summary>
    public async Task<List<BulkRescheduleResultDto>> BulkRescheduleAsync(List<RescheduleCalendarItemInput> items)
    {
        var results = new List<BulkRescheduleResultDto>();

        foreach (var item in items ?? new List<RescheduleCalendarItemInput>())
        {
            try
            {
                await RescheduleItemAsync(item);
                results.Add(new BulkRescheduleResultDto { SourceId = item.SourceId, Succeeded = true });
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex, "Toplu ertelemede öğe taşınamadı. SourceId={SourceId}", item.SourceId);
                results.Add(new BulkRescheduleResultDto
                {
                    SourceId  = item.SourceId,
                    Succeeded = false,
                    Error     = ex is BusinessException ? ex.Message : "Taşınamadı."
                });
            }
        }

        return results;
    }

    private static decimal? ParseCapacity(string? raw)
        => decimal.TryParse(raw, System.Globalization.NumberStyles.Number,
               System.Globalization.CultureInfo.InvariantCulture, out var value) && value > 0
            ? value
            : null;

    /* ── Senkron ayarları (Faz 5) ─────────────────────────────────────────── */

    private const int SyncLogPageSize = 20;

    public async Task<CalendarSyncSettingsDto> GetSyncSettingsAsync()
    {
        var accounts = await _accountRepository.GetListAsync(x => x.UserId == CurrentUser.Id);
        var dto = new CalendarSyncSettingsDto
        {
            Accounts = accounts.Select(ToSyncAccountDto).ToList()
        };

        if (accounts.Count == 0) return dto;

        var accountIds = accounts.Select(a => a.Id).ToList();
        var logQuery = await _syncLogRepository.GetQueryableAsync();
        var entries = await AsyncExecuter.ToListAsync(
            logQuery.Where(e => accountIds.Contains(e.ExternalCalendarAccountId))
                    .OrderByDescending(e => e.CreationTime)
                    .Take(SyncLogPageSize));

        dto.Log = entries.Select(e => new CalendarSyncLogEntryDto
        {
            Id         = e.Id,
            AccountId  = e.ExternalCalendarAccountId,
            Kind       = e.Kind,
            Message    = e.Message,
            ItemCount  = e.ItemCount,
            OccurredAt = e.CreationTime
        }).ToList();

        return dto;
    }

    public async Task UpdateSyncRulesAsync(UpdateCalendarSyncRulesInput input)
    {
        var account = await _accountRepository.GetAsync(input.AccountId);
        if (account.UserId != CurrentUser.Id) throw new UnauthorizedAccessException();

        account.IsSyncEnabled  = input.IsSyncEnabled;
        account.ConflictRule   = input.ConflictRule;
        // Dış takvim etkinliği bir KAYNAK değil, hedeftir: kendi kendine yazılamaz.
        account.SyncSources    = string.Join(',', (input.SyncSources ?? new List<CalendarSourceType>())
            .Where(s => s != CalendarSourceType.ExternalEvent)
            .Distinct()
            .Select(s => (int)s));
        account.SyncProjectIds = string.Join(',', (input.SyncProjectIds ?? new List<Guid>()).Distinct());

        await _accountRepository.UpdateAsync(account);
    }

    private static CalendarSyncAccountDto ToSyncAccountDto(ExternalCalendarAccount a) => new()
    {
        Id             = a.Id,
        Provider       = a.Provider,
        ExternalEmail  = a.ExternalEmail,
        IsSyncEnabled  = a.IsSyncEnabled,
        LastSyncTime   = a.LastSyncTime,
        ConflictRule   = a.ConflictRule,
        SyncSources    = ParseSources(a.SyncSources),
        SyncProjectIds = ParseGuids(a.SyncProjectIds)
    };

    /// <summary>
    /// "1,2,6" → kaynak listesi. BOŞ = yalnız görev: mevcut hesaplar kural
    /// tanımlanana kadar eski davranışta kalsın, sessizce her şeyi göndermeye başlamasın.
    /// </summary>
    private static List<CalendarSourceType> ParseSources(string? csv)
    {
        if (string.IsNullOrWhiteSpace(csv))
        {
            return new List<CalendarSourceType> { CalendarSourceType.Task };
        }

        return csv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                  .Select(part => int.TryParse(part, out var value) ? (CalendarSourceType?)value : null)
                  .Where(s => s != null && CalendarSources.Internal.Contains(s.Value))
                  .Select(s => s!.Value)
                  .Distinct()
                  .ToList();
    }

    private static List<Guid> ParseGuids(string? csv)
    {
        if (string.IsNullOrWhiteSpace(csv)) return new List<Guid>();

        return csv.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                  .Select(part => Guid.TryParse(part, out var value) ? (Guid?)value : null)
                  .Where(g => g != null)
                  .Select(g => g!.Value)
                  .Distinct()
                  .ToList();
    }

    private static void EnsureReschedulable(CalendarSourceType source)
    {
        if (source == CalendarSourceType.Task) return;

        throw new BusinessException(message: source switch
        {
            CalendarSourceType.Invoice => "Fatura vadesi takvimden değiştirilemez.",
            CalendarSourceType.Grant   => "Hibe son tarihi takvimden değiştirilemez.",
            _                          => "Bu öğenin tarihi takvimden değiştirilemez."
        });
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
            existing.AccessToken     = _tokenProtector.Protect(input.AccessToken);
            existing.RefreshToken    = _tokenProtector.Protect(input.RefreshToken);
            existing.TokenExpiryTime = input.TokenExpiryTime;
            await _accountRepository.UpdateAsync(existing);
        }
        else
        {
            var account = new ExternalCalendarAccount(GuidGenerator.Create(), CurrentUser.Id!.Value, input.Provider, input.ExternalEmail)
            {
                AccessToken     = _tokenProtector.Protect(input.AccessToken),
                RefreshToken    = _tokenProtector.Protect(input.RefreshToken),
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

        // SEC-012: kriptografik rastgele state token'ı üret, kullanıcıya bağlı sunucu-taraflı
        // cache'e yaz (tek kullanımlık, 10 dk); callback bunu doğrular. State = "{provider}.{token}".
        var stateToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        await _distributedCache.SetStringAsync(
            OAuthStateCacheKey(CurrentUser.Id!.Value),
            stateToken,
            new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10) });
        var state = Uri.EscapeDataString($"{(int)provider}.{stateToken}");

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

    /// <summary>OAuth callback'ten gelen code'u token'a çevirip hesabı bağlar. State token'ı
    /// (SEC-012) auth başlangıcında saklanan kullanıcı-bağlı, tek kullanımlık değerle doğrulanır.</summary>
    public async Task ExchangeCodeAndConnectAsync(CalendarProviderType provider, string code, string redirectUri, string stateToken)
    {
        // SEC-012: account-linking CSRF savunması — state auth başlangıcındaki token'la eşleşmeli.
        var cacheKey = OAuthStateCacheKey(CurrentUser.Id!.Value);
        var expectedToken = await _distributedCache.GetStringAsync(cacheKey);
        await _distributedCache.RemoveAsync(cacheKey); // tek kullanımlık: replay engelle
        if (string.IsNullOrEmpty(expectedToken)
            || string.IsNullOrEmpty(stateToken)
            || !CryptographicOperations.FixedTimeEquals(
                   Encoding.UTF8.GetBytes(expectedToken),
                   Encoding.UTF8.GetBytes(stateToken)))
        {
            Logger.LogWarning("Takvim OAuth state doğrulaması başarısız (CSRF şüphesi). Provider={Provider}", provider);
            throw new BusinessException(message: "Takvim bağlantısı doğrulanamadı (geçersiz oturum durumu).");
        }

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
