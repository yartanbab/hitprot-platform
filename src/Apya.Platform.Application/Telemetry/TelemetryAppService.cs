using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Settings;
using Apya.Platform.Telemetry.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Volo.Abp;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Settings;
using Volo.Abp.Timing;

namespace Apya.Platform.Telemetry;

/// <summary>
/// İstemci hata raporlarının giriş kapısı.
/// <para>
/// Oturum ŞART ([Authorize]) — anonim trafiğe açık bir yazma ucu bırakılmaz.
/// İzin gerektirmez: her kullanıcının tarayıcısındaki hata raporlanabilmeli.
/// </para>
/// </summary>
[Authorize]
public class TelemetryAppService : ApplicationService, ITelemetryAppService
{
    private readonly IRepository<ClientError, Guid> _clientErrorRepository;
    private readonly IClock _clock;

    public TelemetryAppService(
        IRepository<ClientError, Guid> clientErrorRepository,
        IClock clock)
    {
        _clientErrorRepository = clientErrorRepository;
        _clock = clock;
    }

    public async Task<Guid?> ReportClientErrorAsync(ReportClientErrorDto input)
    {
        // Ayardan kapatılmışsa sessizce çık — istemciye hata dönmemeli, aksi halde
        // hata raporlama denemesi kullanıcıya ikinci bir hata olarak görünür.
        // KRİTİK: setting .WithProviders(Global) ile kısıtlı → DefaultValueSettingValueProvider
        // zincirden ÇIKARILIYOR, GetAsync<T>'nin kendi varsayılanı (default(bool)=false)
        // kullanılıyor. Bu yüzden burada AÇIK varsayılan (true) vermek ŞART; yoksa hiç
        // override yazılmamış tenant'larda telemetri sessizce hep kapalı gelir.
        if (!await SettingProvider.GetAsync(PlatformSettings.Telemetry.Enabled, true))
        {
            return null;
        }

        if (input.Message.IsNullOrWhiteSpace())
        {
            return null;
        }

        var fingerprint = ClientErrorFingerprint.Compute(input.Message, input.StackTrace, input.PageUrl);
        var now = _clock.Now;
        var userId = CurrentUser.Id;

        var existing = await FindByFingerprintAsync(fingerprint);

        if (existing is not null)
        {
            existing.RegisterOccurrence(now, userId, input.PageUrl, input.BreadcrumbJson);
            await _clientErrorRepository.UpdateAsync(existing, autoSave: true);
            return existing.Id;
        }

        var clientError = new ClientError(
            GuidGenerator.Create(),
            CurrentTenant.Id,
            fingerprint,
            input.Source,
            Truncate(input.Message, ClientErrorConsts.MaxMessageLength)!, // Message üstte boş/whitespace kontrolünden geçti.
            now)
        {
            StackTrace = Truncate(input.StackTrace, ClientErrorConsts.MaxStackTraceLength),
            PageUrl = Truncate(input.PageUrl, ClientErrorConsts.MaxPageUrlLength),
            UserAgent = Truncate(input.UserAgent, ClientErrorConsts.MaxUserAgentLength),
            ScreenResolution = Truncate(input.ScreenResolution, ClientErrorConsts.MaxScreenSizeLength),
            AppVersion = Truncate(input.AppVersion, ClientErrorConsts.MaxAppVersionLength),
            BreadcrumbJson = Truncate(input.BreadcrumbJson, ClientErrorConsts.MaxBreadcrumbLength),
            LastUserId = userId
        };

        try
        {
            await _clientErrorRepository.InsertAsync(clientError, autoSave: true);
            return clientError.Id;
        }
        catch (Exception ex)
        {
            // Yarış durumu: aynı hatayı iki kullanıcı aynı anda raporlarsa
            // (TenantId, Fingerprint) unique index'i ikinci INSERT'i reddeder.
            // Kayıt artık var demektir → sayaç artırmaya düş.
            Logger.LogDebug(ex, "İstemci hatası eklenemedi, mevcut kayda düşülüyor. Fingerprint={Fingerprint}", fingerprint);

            var raced = await FindByFingerprintAsync(fingerprint);
            if (raced is not null)
            {
                raced.RegisterOccurrence(now, userId, input.PageUrl, input.BreadcrumbJson);
                await _clientErrorRepository.UpdateAsync(raced, autoSave: true);
                return raced.Id;
            }

            return null;
        }
    }

    private async Task<ClientError?> FindByFingerprintAsync(string fingerprint)
    {
        var query = (await _clientErrorRepository.GetQueryableAsync())
            .Where(e => e.Fingerprint == fingerprint);

        return await AsyncExecuter.FirstOrDefaultAsync(query);
    }

    private static string? Truncate(string? value, int maxLength)
    {
        if (value is null)
        {
            return null;
        }

        return value.Length <= maxLength ? value : value.Substring(0, maxLength);
    }
}
