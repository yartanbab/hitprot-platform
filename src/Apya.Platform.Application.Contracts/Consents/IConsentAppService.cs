using System.Threading.Tasks;
using Apya.Platform.Consents.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Consents;

/// <summary>
/// Rıza omurgası uygulama servisi. HTTP API olarak AÇILMAZ (RemoteService kapalı):
/// yazma yalnız Web sınırından (IP/UA sunucuda yakalanarak) in-process çağrılır,
/// analiz ise admin Razor sayfasından çağrılır. Böylece oturumsuz uç spoofing'e kapalı.
/// </summary>
public interface IConsentAppService : IApplicationService
{
    /// <summary>Bir rıza kaydı ekler.</summary>
    Task RecordAsync(RecordConsentInput input);

    /// <summary>Admin analiz özetini üretir (izin: Consents.Default).</summary>
    Task<ConsentAnalyticsDto> GetAnalyticsAsync(ConsentAnalyticsFilter filter);
}
