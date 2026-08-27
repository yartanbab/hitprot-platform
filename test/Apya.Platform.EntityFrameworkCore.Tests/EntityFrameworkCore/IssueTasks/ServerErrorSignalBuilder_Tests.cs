using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.IssueTasks;
using Shouldly;
using Volo.Abp.AuditLogging;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.IssueTasks;

/// <summary>
/// Görev otomasyonunun beslendiği sinyal. Buradaki ölçüt yanlışsa sonuç sessiz ve
/// pahalıdır: işçi eşiği aşan her uçtan <b>kendiliğinden</b> görev açar.
/// <para>
/// ABP yetki/doğrulama/bulunamadı istisnalarını da audit satırının <c>Exceptions</c>
/// alanına yazar; 4xx elenmezse bir kullanıcının tekrar tekrar 403 aldığı uç
/// "sunucu hatası" sanılıp görev listesine düşerdi.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class ServerErrorSignalBuilder_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ServerErrorSignalBuilder _builder;
    private readonly IRepository<AuditLog, Guid> _auditLogRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly IClock _clock;

    public ServerErrorSignalBuilder_Tests()
    {
        _builder            = GetRequiredService<ServerErrorSignalBuilder>();
        _auditLogRepository = GetRequiredService<IRepository<AuditLog, Guid>>();
        _guidGenerator      = GetRequiredService<IGuidGenerator>();
        _clock              = GetRequiredService<IClock>();
    }

    /// <summary>Paylaşılan veritabanında testler birbirinin sayımını bozmasın.</summary>
    private static string NewPrefix() => "/qa-signal-" + Guid.NewGuid().ToString("N")[..8];

    private async Task InsertAuditAsync(string url, int? statusCode, string? exceptions)
    {
        var entity = new AuditLog(
            id: _guidGenerator.Create(),
            applicationName: "QA",
            tenantId: null,
            tenantName: null,
            userId: null,
            userName: null,
            executionTime: _clock.Now.AddMinutes(-5),
            executionDuration: 13,
            clientIpAddress: null,
            clientName: null,
            clientId: null,
            correlationId: null,
            browserInfo: null,
            httpMethod: "GET",
            url: url,
            httpStatusCode: statusCode,
            impersonatorUserId: null,
            impersonatorUserName: null,
            impersonatorTenantId: null,
            impersonatorTenantName: null,
            extraPropertyDictionary: new ExtraPropertyDictionary(),
            entityChanges: null,
            actions: null,
            exceptions: exceptions,
            comments: null);

        await _auditLogRepository.InsertAsync(entity, autoSave: true);
    }

    [Fact]
    public async Task Yetki_reddi_alan_uc_otomatik_goreve_donusmez()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();
            var rejected = $"{prefix}/Yetkisiz";
            var failing  = $"{prefix}/Patlayan";

            // Eşiği (3) rahatça aşacak kadar 403 — yine de sinyal ÜRETMEMELİ.
            for (var i = 0; i < 5; i++)
            {
                await InsertAuditAsync(
                    rejected, 403, "Volo.Authorization.AbpAuthorizationException: qa");
            }

            for (var i = 0; i < 5; i++)
            {
                await InsertAuditAsync(failing, 500, "System.InvalidOperationException: qa");
            }

            var endpoints = await _builder.FindFailingEndpointsAsync(
                windowDays: 7, minOccurrences: 3, maxResults: 50);

            endpoints.Any(e => e.Url == rejected)
                .ShouldBeFalse("403 uç otomasyona sinyal vermemeli");
            endpoints.Any(e => e.Url == failing)
                .ShouldBeTrue("5xx uç sinyal vermeye devam etmeli");

            // Elle "göreve dönüştür" yolu da aynı ölçüde: 403 için kaynak yoktur.
            (await _builder.BuildAsync(rejected, "GET", 7)).ShouldBeNull();
            (await _builder.BuildAsync(failing, "GET", 7)).ShouldNotBeNull();
        });
    }
}
