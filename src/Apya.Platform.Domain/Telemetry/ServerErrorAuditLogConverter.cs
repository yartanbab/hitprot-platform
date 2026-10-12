using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Volo.Abp.AspNetCore.ExceptionHandling;
using Volo.Abp.Auditing;
using Volo.Abp.AuditLogging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.ExceptionHandling;
using Volo.Abp.Guids;
using Volo.Abp.Json;

namespace Apya.Platform.Telemetry;

/// <summary>
/// Sunucu hatasında (5xx) audit kaydının <c>Exceptions</c> alanına istisna türünü ve
/// yığın izini de yazar.
/// <para>
/// ABP bu alanı istemciye dönen hata zarfıyla AYNI ayarla doldurur; ayrıntı istemciye
/// kapalı olduğu için kayıtta yalnız "beklenmedik bir hata oluştu" cümlesi kalıyor ve
/// Sistem Sağlığı 500'ün nedenini gösteremiyordu. Burada yalnız KAYIT ayrıntılanır —
/// istemciye dönen yanıt değişmez.
/// </para>
/// <para>
/// 5xx dışındaki kayıtlar (iş kuralı, yetki, doğrulama reddi) bilerek olduğu gibi
/// bırakılır: nedeni mesajında yazar, yığın izi tabloyu şişirmekten başka işe yaramaz.
/// </para>
/// </summary>
[Dependency(ReplaceServices = true)]
[ExposeServices(typeof(IAuditLogInfoToAuditLogConverter))]
public class ServerErrorAuditLogConverter : IAuditLogInfoToAuditLogConverter, ITransientDependency
{
    private readonly AuditLogInfoToAuditLogConverter _plain;
    private readonly AuditLogInfoToAuditLogConverter _detailed;

    public ServerErrorAuditLogConverter(
        IGuidGenerator guidGenerator,
        IExceptionToErrorInfoConverter exceptionToErrorInfoConverter,
        IJsonSerializer jsonSerializer,
        IOptions<AbpExceptionHandlingOptions> exceptionHandlingOptions,
        AuditLogEntityTypeFullNameConverter auditLogEntityTypeFullNameConverter)
    {
        _plain = new AuditLogInfoToAuditLogConverter(
            guidGenerator, exceptionToErrorInfoConverter, jsonSerializer, exceptionHandlingOptions,
            auditLogEntityTypeFullNameConverter);

        _detailed = new AuditLogInfoToAuditLogConverter(
            guidGenerator, exceptionToErrorInfoConverter, jsonSerializer,
            Options.Create(new AbpExceptionHandlingOptions
            {
                SendExceptionsDetailsToClients = true,
                SendStackTraceToClients = true
            }),
            auditLogEntityTypeFullNameConverter);
    }

    public Task<AuditLog> ConvertAsync(AuditLogInfo auditLogInfo)
    {
        return auditLogInfo.HttpStatusCode >= 500
            ? _detailed.ConvertAsync(auditLogInfo)
            : _plain.ConvertAsync(auditLogInfo);
    }
}
