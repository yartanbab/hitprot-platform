using Apya.Platform.Permissions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Apya.Platform.DynamicAssets.Webhooks;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Calendars;

/// <summary>
/// .ics aboneliklerinin yönetimi.
/// <para>
/// GÜVENLİK: adres KULLANICIDAN gelir ve sunucudan çekilir — webhook'larla birebir
/// aynı SSRF tehdidi. Aynı koruma kullanılır: şema/IP doğrulaması
/// (<see cref="WebhookUrlGuard.ValidateOrThrow"/>) + bağlantı anında IP denetimi
/// yapan "IcalClient" (DNS-rebinding'e karşı, yönlendirme kapalı).
/// </para>
/// </summary>
[Authorize(PlatformPermissions.Calendars.Default)]
public class IcalSubscriptionAppService : ApplicationService, IIcalSubscriptionAppService
{
    private readonly IRepository<IcalSubscription, Guid> _repository;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IcalReader _reader;
    private readonly IExceptionToErrorInfoConverter _errorInfoConverter;

    /// <summary>İndirilebilecek en büyük dosya — şişkin takvim belleği doldurmasın.</summary>
    private const int MaxBytes = 5 * 1024 * 1024;

    /// <summary>Doğrulama/okuma penceresi: geçmiş bir yıl, gelecek bir yıl.</summary>
    private const int WindowDays = 365;

    private const string ProbeFailedText = "Bağlantı okunamadı — adresi kontrol edin.";

    public IcalSubscriptionAppService(
        IRepository<IcalSubscription, Guid> repository,
        IHttpClientFactory httpClientFactory,
        IcalReader reader,
        IExceptionToErrorInfoConverter errorInfoConverter)
    {
        _repository        = repository;
        _httpClientFactory = httpClientFactory;
        _reader            = reader;
        _errorInfoConverter = errorInfoConverter;
    }

    public async Task<List<IcalSubscriptionDto>> GetListAsync()
    {
        var list = await _repository.GetListAsync(x => x.UserId == CurrentUser.Id);
        return list.OrderBy(x => x.DisplayName).Select(ToDto).ToList();
    }

    public async Task<IcalProbeResultDto> ProbeAsync(string url)
    {
        try
        {
            EnsureUrlAllowed(url);
            var (content, count, name) = await FetchAndCountAsync(url);
            return new IcalProbeResultDto
            {
                IsValid       = true,
                EventCount    = count,
                SuggestedName = name
            };
        }
        catch (BusinessException ex)
        {
            // Kodla atılan istisnanın ex.Message'ı .NET'in İngilizce varsayılanıdır (CAL-15).
            return new IcalProbeResultDto { IsValid = false, Error = _errorInfoConverter.UserText(ex, ProbeFailedText) };
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "iCal doğrulaması başarısız. Url={Url}", url);
            return new IcalProbeResultDto { IsValid = false, Error = ProbeFailedText };
        }
    }

    public async Task<IcalSubscriptionDto> AddAsync(AddIcalSubscriptionInput input)
    {
        EnsureUrlAllowed(input.Url);

        // Kaydetmeden ÖNCE doğrula: kullanıcı listede ölü bir satır bulmasın.
        var (_, count, suggested) = await FetchAndCountAsync(input.Url);

        var entity = new IcalSubscription(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            CurrentUser.Id!.Value,
            input.Url,
            string.IsNullOrWhiteSpace(input.DisplayName) ? (suggested ?? "Takvim") : input.DisplayName,
            input.Color,
            input.RefreshMinutes);

        entity.MarkFetched(Clock.Now, count);
        await _repository.InsertAsync(entity, autoSave: true);

        return ToDto(entity);
    }

    public async Task<IcalSubscriptionDto> UpdateAsync(Guid id, AddIcalSubscriptionInput input)
    {
        var entity = await GetOwnedAsync(id);
        EnsureUrlAllowed(input.Url);

        entity.Update(input.Url, input.DisplayName, input.Color, input.RefreshMinutes);
        await _repository.UpdateAsync(entity, autoSave: true);

        return ToDto(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await GetOwnedAsync(id);
        await _repository.DeleteAsync(entity, autoSave: true);
    }

    public async Task<IcalSubscriptionDto> RefreshAsync(Guid id)
    {
        var entity = await GetOwnedAsync(id);

        try
        {
            var (_, count, _) = await FetchAndCountAsync(entity.Url);
            entity.MarkFetched(Clock.Now, count);
        }
        catch (Exception ex)
        {
            Logger.LogWarning(ex, "iCal aboneliği yenilenemedi. Id={Id}", id);
            // Hata SATIRDA kalır: abonelik silinmez, kullanıcı düzeltebilsin.
            entity.MarkFailed(Clock.Now, "Bağlantı yanıt vermiyor — link yenilenmiş olabilir.");
        }

        await _repository.UpdateAsync(entity, autoSave: true);
        return ToDto(entity);
    }

    /// <summary>
    /// SSRF denetimi webhook'larla AYNI (<see cref="WebhookUrlGuard.ValidateOrThrow"/>); yalnız kullanıcıya
    /// dönen kod takvimin kodudur — "Geçersiz webhook adresi" metni takvim ekranında yanlış terimdi.
    /// </summary>
    private static void EnsureUrlAllowed(string? url)
    {
        try
        {
            WebhookUrlGuard.ValidateOrThrow(url);
        }
        catch (BusinessException ex) when (ex.Code == PlatformDomainErrorCodes.WebhookTargetUrlNotAllowed)
        {
            throw new BusinessException(PlatformDomainErrorCodes.CalendarIcalUrlNotAllowed);
        }
    }

    private async Task<IcalSubscription> GetOwnedAsync(Guid id)
    {
        var entity = await _repository.GetAsync(id);
        if (entity.UserId != CurrentUser.Id) throw new UnauthorizedAccessException();
        return entity;
    }

    private async Task<(string Content, int Count, string? Name)> FetchAndCountAsync(string url)
    {
        var client = _httpClientFactory.CreateClient("IcalClient");
        using var response = await client.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            throw new BusinessException(message: $"Bağlantı {(int)response.StatusCode} döndü.");
        }

        if (response.Content.Headers.ContentLength is > MaxBytes)
        {
            throw new BusinessException(message: "Takvim dosyası çok büyük (5 MB üstü).");
        }

        var content = await response.Content.ReadAsStringAsync();
        if (!content.Contains("BEGIN:VCALENDAR", StringComparison.OrdinalIgnoreCase))
        {
            throw new BusinessException(message: "Adres bir takvim dosyası değil.");
        }

        var today = Clock.Now.Date;
        var events = _reader.Read(content, today.AddDays(-WindowDays), today.AddDays(WindowDays));

        return (content, events.Count, ReadCalendarName(content));
    }

    /// <summary>X-WR-CALNAME — çoğu takvim dosyası görünen adı burada taşır.</summary>
    private static string? ReadCalendarName(string content)
    {
        foreach (var line in content.Split('\n'))
        {
            if (!line.StartsWith("X-WR-CALNAME", StringComparison.OrdinalIgnoreCase)) continue;
            var index = line.IndexOf(':');
            if (index > 0 && index < line.Length - 1) return line[(index + 1)..].Trim();
        }
        return null;
    }

    private static IcalSubscriptionDto ToDto(IcalSubscription e) => new()
    {
        Id             = e.Id,
        Url            = e.Url,
        DisplayName    = e.DisplayName,
        Color          = e.Color,
        RefreshMinutes = e.RefreshMinutes,
        IsEnabled      = e.IsEnabled,
        LastFetchedAt  = e.LastFetchedAt,
        LastEventCount = e.LastEventCount,
        LastError      = e.LastError
    };
}
