using System;
using System.Threading.Tasks;
using Apya.Platform.Telemetry;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Auditing;
using Volo.Abp.AuditLogging;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Telemetry;

/// <summary>
/// Sistem Sağlığı 500'ün nedenini audit kaydının <c>Exceptions</c> alanından okur.
/// Alan yalnız genel hata cümlesini taşırsa neden sonradan bulunamaz.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ServerErrorAuditLogConverter_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly IAuditLogInfoToAuditLogConverter _converter;

    public ServerErrorAuditLogConverter_Tests()
    {
        _converter = GetRequiredService<IAuditLogInfoToAuditLogConverter>();
    }

    [Fact]
    public void Varsayilan_donusturucunun_yerini_alir()
    {
        _converter.ShouldBeOfType<ServerErrorAuditLogConverter>();
    }

    [Fact]
    public async Task Sunucu_hatasinda_istisna_turu_ve_yigin_izi_kayda_yazilir()
    {
        var auditLog = await _converter.ConvertAsync(NewInfo(500, Thrown(new InvalidOperationException("dizin bulunamadi"))));

        auditLog.Exceptions.ShouldContain(nameof(InvalidOperationException));
        auditLog.Exceptions.ShouldContain("dizin bulunamadi");
        auditLog.Exceptions.ShouldContain(nameof(Thrown));
    }

    [Fact]
    public async Task Reddedilen_istekte_yigin_izi_yazilmaz()
    {
        var auditLog = await _converter.ConvertAsync(NewInfo(403, Thrown(new BusinessException(message: "izin yok"))));

        auditLog.Exceptions.ShouldNotBeNullOrWhiteSpace();
        auditLog.Exceptions.ShouldNotContain(nameof(Thrown));
    }

    private static AuditLogInfo NewInfo(int httpStatusCode, Exception exception)
    {
        var info = new AuditLogInfo
        {
            ExecutionTime = DateTime.Now,
            HttpStatusCode = httpStatusCode
        };
        info.Exceptions.Add(exception);
        return info;
    }

    /// <summary>Yığın izi yalnız fırlatılmış istisnada oluşur.</summary>
    private static Exception Thrown(Exception exception)
    {
        try
        {
            throw exception;
        }
        catch (Exception caught)
        {
            return caught;
        }
    }
}
