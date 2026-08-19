using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Tasks;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Calendars;

/// <summary>
/// Salt-okunur iCal abonelik bağlantısı: <c>/ical/u/{token}.ics</c>.
/// <para>
/// Bağlantının kendisi paroladır. Token düz saklanmaz — arama SHA-256 özetiyle,
/// kullanıcıya tekrar gösterim şifreli kopyadan yapılır. "Yeniden üret" eski
/// bağlantıyı anında öldürür.
/// </para>
/// <para>
/// KAPSAM: beslemeye YALNIZ kullanıcıya atanmış, son tarihi olan görevler girer.
/// Fatura/gider gibi izne bağlı finans kayıtları bilerek DIŞARIDA: bağlantı
/// oturumsuz açılır, sızması hâlinde mali veri paylaşılmış olurdu.
/// </para>
/// </summary>
[Authorize]
public class IcalFeedAppService : ApplicationService, IIcalFeedAppService
{
    private readonly IRepository<CalendarFeedToken, Guid> _tokenRepository;
    private readonly IRepository<TaskItem, Guid> _taskRepository;
    private readonly CalendarTokenProtector _protector;
    private readonly IcalWriter _writer;

    /// <summary>Beslemenin kapsadığı pencere — geçmiş dolduran istemcileri boğmamak için.</summary>
    private const int PastDays = 90;
    private const int FutureDays = 365;
    private const int MaxItems = 1000;

    public IcalFeedAppService(
        IRepository<CalendarFeedToken, Guid> tokenRepository,
        IRepository<TaskItem, Guid> taskRepository,
        CalendarTokenProtector protector,
        IcalWriter writer)
    {
        _tokenRepository = tokenRepository;
        _taskRepository  = taskRepository;
        _protector       = protector;
        _writer          = writer;
    }

    /// <summary>Kullanıcının abonelik bağlantısı — yoksa üretilir.</summary>
    public async Task<IcalFeedTokenDto> GetOrCreateAsync()
    {
        var existing = await _tokenRepository.FirstOrDefaultAsync(x => x.UserId == CurrentUser.Id);
        if (existing != null)
        {
            return ToDto(existing, _protector.Unprotect(existing.TokenProtected));
        }

        var (token, hash) = NewToken();
        var entity = new CalendarFeedToken(
            GuidGenerator.Create(), CurrentTenant.Id, CurrentUser.Id!.Value, hash, _protector.Protect(token));
        await _tokenRepository.InsertAsync(entity, autoSave: true);

        return ToDto(entity, token);
    }

    /// <summary>Token'ı yeniler — sızdığından şüphelenilen eski bağlantı anında ölür.</summary>
    public async Task<IcalFeedTokenDto> RegenerateAsync()
    {
        var entity = await _tokenRepository.FirstOrDefaultAsync(x => x.UserId == CurrentUser.Id);
        var (token, hash) = NewToken();

        if (entity == null)
        {
            entity = new CalendarFeedToken(
                GuidGenerator.Create(), CurrentTenant.Id, CurrentUser.Id!.Value, hash, _protector.Protect(token));
            await _tokenRepository.InsertAsync(entity, autoSave: true);
        }
        else
        {
            entity.Rotate(hash, _protector.Protect(token));
            await _tokenRepository.UpdateAsync(entity, autoSave: true);
        }

        return ToDto(entity, token);
    }

    /// <summary>
    /// Anonim uç için gövde üretir. Token bulunamazsa null döner — çağıran 404 verir
    /// (var/yok bilgisini sızdıran farklı yanıtlar üretilmez).
    /// </summary>
    [AllowAnonymous]
    public async Task<string?> RenderAsync(string token)
    {
        if (string.IsNullOrWhiteSpace(token)) return null;

        var hash = Hash(token);
        var entity = await _tokenRepository.FirstOrDefaultAsync(x => x.TokenHash == hash);
        if (entity == null) return null;

        var today = Clock.Now.Date;
        var from = today.AddDays(-PastDays);
        var to = today.AddDays(FutureDays);

        // Token'ın sahibine ATANMIŞ görevler — izin sorgusu yok, kapsam zaten kişiseldir.
        var query = await _taskRepository.GetQueryableAsync();
        var tasks = await AsyncExecuter.ToListAsync(
            query.Where(t => t.AssigneeId == entity.UserId
                             && t.DueDate != null
                             && t.DueDate >= from
                             && t.DueDate <= to
                             && !t.IsPrivate)
                 .OrderBy(t => t.DueDate)
                 .Take(MaxItems));

        var items = tasks.Select(t => new CalendarItemDto
        {
            Key      = $"{(int)CalendarSourceType.Task}:{t.Id}",
            Source   = CalendarSourceType.Task,
            SourceId = t.Id,
            Title    = t.Title,
            Date     = t.DueDate!.Value.Date,
            IsDone   = t.Status == Apya.Platform.Tasks.TaskStatus.Done
        });

        var body = _writer.Build(items, "APYA Takvim", Clock.Now);

        entity.MarkAccessed(Clock.Now);
        await _tokenRepository.UpdateAsync(entity, autoSave: true);

        return body;
    }

    private static (string Token, string Hash) NewToken()
    {
        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(24)).ToLowerInvariant();
        return (token, Hash(token));
    }

    private static string Hash(string token)
        => Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    private static IcalFeedTokenDto ToDto(CalendarFeedToken entity, string token) => new()
    {
        Token          = token,
        Path           = $"/ical/u/{token}.ics",
        LastAccessedAt = entity.LastAccessedAt
    };
}
