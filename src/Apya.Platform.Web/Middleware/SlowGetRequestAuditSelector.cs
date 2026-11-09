using System;
using System.Threading.Tasks;
using Apya.Platform.Telemetry;
using Volo.Abp.Auditing;

namespace Apya.Platform.Web.Middleware;

/// <summary>
/// ABP, hatasız GET/HEAD isteklerini denetim kaydına yazmaz (<c>IsEnabledForGetRequests</c>
/// varsayılanı kapalı). Bu yüzden yavaş açılan sayfalar Sistem Sağlığı'na hiç ulaşmıyordu.
/// Bu seçici yalnız eşiği aşan GET/HEAD isteklerini kayda zorlar; hepsini açmak tabloyu
/// gereksiz büyütürdü.
///
/// <para>🔴 Seçici çalıştığında <see cref="AuditLogInfo.ExecutionDuration"/> henüz 0'dır —
/// ABP süreyi kayıt anında doldurur. Süre bu yüzden <see cref="AuditLogInfo.ExecutionTime"/>
/// (kapsam başında <c>Clock.Now</c>) ile şimdi arasından hesaplanır.</para>
///
/// <para>Hub bağlantıları dışarıda: HTTP/1.1 WebSocket bir GET'tir ve bağlantının açık
/// kaldığı süre "istek süresi" gibi görünür.</para>
/// </summary>
public static class SlowGetRequestAuditSelector
{
    public static Task<bool> ShouldAlwaysLogAsync(AuditLogInfo auditLog)
    {
        var now = auditLog.ExecutionTime.Kind == DateTimeKind.Utc ? DateTime.UtcNow : DateTime.Now;
        return Task.FromResult(IsSlowGetRequest(auditLog, now, TelemetryConsts.DefaultSlowEndpointThresholdMs));
    }

    internal static bool IsSlowGetRequest(AuditLogInfo auditLog, DateTime now, int thresholdMs)
    {
        var isGet = string.Equals(auditLog.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase)
                    || string.Equals(auditLog.HttpMethod, "HEAD", StringComparison.OrdinalIgnoreCase);
        if (!isGet || SlowRequestLoggingMiddleware.IsHubPath(auditLog.Url))
        {
            return false;
        }

        return (now - auditLog.ExecutionTime).TotalMilliseconds >= thresholdMs;
    }
}
