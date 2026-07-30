using System.Threading.Tasks;
using Apya.Platform.Telemetry.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Telemetry;

/// <summary>
/// İstemci hata raporlarının giriş kapısı. Oturum gerektirir ([Authorize]);
/// anonim trafiğe açılmaz.
/// </summary>
public interface ITelemetryAppService : IApplicationService
{
    /// <summary>
    /// Hatayı kaydeder. Aynı imzalı hata varsa yeni satır açmaz, sayacı artırır.
    /// Telemetri ayardan kapatılmışsa sessizce hiçbir şey yapmaz.
    /// </summary>
    Task ReportClientErrorAsync(ReportClientErrorDto input);
}
