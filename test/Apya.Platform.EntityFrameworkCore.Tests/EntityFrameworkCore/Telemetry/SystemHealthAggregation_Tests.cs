using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Telemetry;
using Apya.Platform.Telemetry.Dtos;
using Shouldly;
using Volo.Abp.AuditLogging;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Timing;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Telemetry;

/// <summary>
/// Sağlık motorunun sözleşmesi. İki şeyi birden kanıtlar:
/// <list type="number">
/// <item>Toplama sorguları gerçekten <b>SQL'e çevrilebiliyor</b> — gruplama artık
/// bellekte değil veritabanında yapılıyor, çevrilemeyen bir ifade burada patlar.</item>
/// <item>Matematik doğru — normalize edilmiş uç yeniden gruplanırken ağırlıklı
/// ortalama korunuyor, sunucu hatası ile performans ihlali ayrık kalıyor.</item>
/// </list>
/// <para>
/// Her test kendi URL önekiyle çalışır: koleksiyon aynı SQLite bağlantısını
/// paylaşıyor, sabit yol kullanan iki test birbirinin sayımını bozardı.
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class SystemHealthAggregation_Tests : PlatformEntityFrameworkCoreTestBase
{
    private readonly ISystemHealthAppService _systemHealth;
    private readonly IRepository<AuditLog, Guid> _auditLogRepository;
    private readonly IRepository<ClientError, Guid> _clientErrorRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly IClock _clock;

    public SystemHealthAggregation_Tests()
    {
        _systemHealth          = GetRequiredService<ISystemHealthAppService>();
        _auditLogRepository    = GetRequiredService<IRepository<AuditLog, Guid>>();
        _clientErrorRepository = GetRequiredService<IRepository<ClientError, Guid>>();
        _guidGenerator         = GetRequiredService<IGuidGenerator>();
        _clock                 = GetRequiredService<IClock>();
    }

    /// <summary>Her testin kendi ad alanı — paylaşılan veritabanında çakışmasın.</summary>
    private static string NewPrefix() => "/qa-" + Guid.NewGuid().ToString("N")[..8];

    private async Task InsertAuditAsync(
        string url,
        string httpMethod = "GET",
        int durationMs = 10,
        int? statusCode = 200,
        bool withException = false,
        Guid? userId = null,
        DateTime? executionTime = null)
    {
        // AuditLogInfo yolu kullanılmıyor: Exceptions orada List<Exception> ve salt
        // okunur; entity'nin kendi ctor'u exception METNİNİ doğrudan alıyor, testin
        // ihtiyacı da bu.
        var entity = new AuditLog(
            id: _guidGenerator.Create(),
            applicationName: "QA",
            tenantId: null,
            tenantName: null,
            userId: userId,
            userName: null,
            executionTime: executionTime ?? _clock.Now.AddMinutes(-5),
            executionDuration: durationMs,
            clientIpAddress: null,
            clientName: null,
            clientId: null,
            correlationId: null,
            browserInfo: null,
            httpMethod: httpMethod,
            url: url,
            httpStatusCode: statusCode,
            impersonatorUserId: null,
            impersonatorUserName: null,
            impersonatorTenantId: null,
            impersonatorTenantName: null,
            extraPropertyDictionary: new ExtraPropertyDictionary(),
            entityChanges: null,
            actions: null,
            exceptions: withException ? "System.InvalidOperationException: qa-patladi" : null,
            comments: null);

        await _auditLogRepository.InsertAsync(entity, autoSave: true);
    }

    [Fact]
    public async Task Ozet_sorgulari_veritabaninda_calisir()
    {
        // Çeviri kanıtı: GetAsync altı ayrı toplama sorgusu çalıştırıyor. Bunlardan
        // biri bile SQL'e çevrilemezse burada InvalidOperationException düşer.
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();
            await InsertAuditAsync($"{prefix}/tek", durationMs: 40);

            var health = await _systemHealth.GetAsync(7);

            health.WindowDays.ShouldBe(7);
            health.SlowThresholdMs.ShouldBe(TelemetryConsts.DefaultSlowEndpointThresholdMs);
            health.EndpointMinCallCount.ShouldBe(TelemetryConsts.DefaultEndpointMinCallCount);
            health.ServerRequestCount.ShouldBeGreaterThanOrEqualTo(1);
            health.ErrorTrend.ShouldNotBeEmpty();
        });
    }

    [Fact]
    public async Task Yoldaki_kimlikler_tek_uca_toplanir_ve_ortalama_agirlikli_kalir()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();

            // Aynı rota, üç FARKLI proje kimliği. Normalizasyon olmadan bunlar üç
            // ayrı "uç" sayılır ve hiçbiri min çağrı eşiğini geçemez.
            await InsertAuditAsync($"{prefix}/Detay/{Guid.NewGuid()}", durationMs: 100);
            await InsertAuditAsync($"{prefix}/Detay/{Guid.NewGuid()}", durationMs: 200);
            await InsertAuditAsync($"{prefix}/Detay/{Guid.NewGuid()}", durationMs: 300);

            var health = await _systemHealth.GetAsync(7);

            var endpoint = health.SlowestEndpoints
                .Concat(EndpointsFromFailingPages(health))
                .FirstOrDefault(e => e.Url == $"{prefix}/Detay/{{id}}");

            // Min çağrı eşiği 5 olduğu için 3 çağrı "en yavaş" listesine giremez;
            // gruplamanın doğruluğunu ham istatistikten değil, aşağıdaki testten
            // okuyoruz. Burada kanıtlanan: yol GERÇEKTEN birleşiyor.
            var issues = await _systemHealth.GetIssuesAsync(new GetHealthIssueListInput
            {
                WindowDays = 7,
                Filter = prefix
            });

            issues.Items.ShouldBeEmpty("hata da yavaşlık da yok — olay listesinde görünmemeli");
            endpoint.ShouldBeNull("3 çağrı min eşiğin (5) altında");
        });
    }

    [Fact]
    public async Task Min_cagri_esigini_gecen_uc_agirlikli_ortalamayla_listelenir()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();

            // 5 çağrı: 4×100ms + 1×600ms → toplam 1000ms, ağırlıklı ortalama 200ms.
            // Grup ortalamalarının ortalaması alınsaydı (100+600)/2 = 350 çıkardı.
            for (var i = 0; i < 4; i++)
            {
                await InsertAuditAsync($"{prefix}/Liste/{Guid.NewGuid()}", durationMs: 100);
            }
            await InsertAuditAsync($"{prefix}/Liste/{Guid.NewGuid()}", durationMs: 600);

            var health = await _systemHealth.GetAsync(7);

            var endpoint = health.SlowestEndpoints.FirstOrDefault(e => e.Url == $"{prefix}/Liste/{{id}}");

            endpoint.ShouldNotBeNull("5 çağrı min eşiği karşılıyor");
            endpoint!.CallCount.ShouldBe(5);
            endpoint.AverageDurationMs.ShouldBe(200);
            endpoint.MaxDurationMs.ShouldBe(600);
            endpoint.HttpMethod.ShouldBe("GET");
            endpoint.ErrorCount.ShouldBe(0);
            endpoint.SlowCallCount.ShouldBe(0, "600ms varsayılan 1000ms eşiğinin altında");
        });
    }

    [Fact]
    public async Task Ayni_yolda_GET_ve_POST_ayri_uctur()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();

            for (var i = 0; i < 5; i++)
            {
                await InsertAuditAsync($"{prefix}/Kayit", "GET", durationMs: 50);
            }
            for (var i = 0; i < 5; i++)
            {
                await InsertAuditAsync($"{prefix}/Kayit", "POST", durationMs: 400);
            }

            var health = await _systemHealth.GetAsync(7);

            var rows = health.SlowestEndpoints.Where(e => e.Url == $"{prefix}/Kayit").ToList();

            rows.Count.ShouldBe(2, "metot uç kimliğinin parçasıdır");
            rows.Single(r => r.HttpMethod == "GET").AverageDurationMs.ShouldBe(50);
            rows.Single(r => r.HttpMethod == "POST").AverageDurationMs.ShouldBe(400);
        });
    }

    [Fact]
    public async Task Sunucu_hatasi_ve_performans_ihlali_ayriktir()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();
            var slow = TelemetryConsts.DefaultSlowEndpointThresholdMs + 500;

            // Hem YAVAŞ hem HATALI: yalnız sunucu hatası sayılmalı, ayrıca performans
            // ihlali olarak ikinci satır açmamalı.
            await InsertAuditAsync($"{prefix}/Patlayan", durationMs: slow, statusCode: 500);

            // Yalnız yavaş: performans ihlali.
            await InsertAuditAsync($"{prefix}/Yavas", durationMs: slow, statusCode: 200);

            var issues = await _systemHealth.GetIssuesAsync(new GetHealthIssueListInput
            {
                WindowDays = 7,
                Filter = prefix
            });

            var kinds = issues.Items.ToDictionary(i => i.Where!, i => i.Kind);

            kinds[$"{prefix}/Patlayan"].ShouldBe(HealthIssueKind.ServerError);
            kinds[$"{prefix}/Yavas"].ShouldBe(HealthIssueKind.Performance);
            issues.Items.Count(i => i.Where == $"{prefix}/Patlayan").ShouldBe(1, "tek arıza iki satır olmamalı");
        });
    }

    /// <summary>
    /// 2xx dönerken istisna yazılmışsa ortada gerçekten bir anormallik vardır.
    /// <b>4xx bunun istisnasıdır</b> — orada istisna beklenen akışın parçasıdır,
    /// bkz. <see cref="Dortyuzler_sunucu_hatasi_degil_reddedilen_istektir"/>.
    /// </summary>
    [Fact]
    public async Task Exception_yazilmis_istek_5xx_olmasa_da_hatadir()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();
            await InsertAuditAsync($"{prefix}/Sessiz", statusCode: 200, withException: true);

            var issues = await _systemHealth.GetIssuesAsync(new GetHealthIssueListInput
            {
                WindowDays = 7,
                Filter = prefix
            });

            issues.Items.ShouldHaveSingleItem();
            issues.Items[0].Kind.ShouldBe(HealthIssueKind.ServerError);
        });
    }

    /// <summary>
    /// 4xx, sunucunun DOĞRU çalıştığı anlamına gelir: isteği geri çevirmiştir.
    /// ABP <c>AbpAuthorizationException</c> (403) · <c>EntityNotFoundException</c> (404)
    /// · <c>AbpValidationException</c> (400) istisnalarını da audit satırının
    /// <c>Exceptions</c> alanına yazdığı için bunlar eskiden "sunucu hatası" sayılıyor
    /// ve sağlık oranını şişiriyordu (yerel veride hataların %39'u).
    /// </summary>
    [Fact]
    public async Task Dortyuzler_sunucu_hatasi_degil_reddedilen_istektir()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();

            // Sayaç paylaşılan veritabanında birikiyor; mutlak değer değil FARK ölçülür.
            var before = (await _systemHealth.GetAsync(7)).ServerErrorCount;

            await InsertAuditAsync($"{prefix}/Yetkisiz", statusCode: 403, withException: true);
            await InsertAuditAsync($"{prefix}/Yok",      statusCode: 404, withException: true);
            await InsertAuditAsync($"{prefix}/Patlayan", statusCode: 500, withException: true);

            var issues = await _systemHealth.GetIssuesAsync(new GetHealthIssueListInput
            {
                WindowDays = 7,
                Filter = prefix
            });

            var kinds = issues.Items.ToDictionary(i => i.Where!, i => i.Kind);

            kinds[$"{prefix}/Yetkisiz"].ShouldBe(HealthIssueKind.RequestRejected);
            kinds[$"{prefix}/Yok"].ShouldBe(HealthIssueKind.RequestRejected);
            kinds[$"{prefix}/Patlayan"].ShouldBe(HealthIssueKind.ServerError);

            issues.RejectedCount.ShouldBe(2);
            issues.ServerCount.ShouldBe(1);

            // Üç kayıt girildi, sağlık sayacı YALNIZ 5xx kadar artmalı.
            var after = (await _systemHealth.GetAsync(7)).ServerErrorCount;
            (after - before).ShouldBe(1);
        });
    }

    [Fact]
    public async Task Sunucu_olayinda_etkilenen_kullanici_sayilir_trend_dolar()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();
            var first = Guid.NewGuid();
            var second = Guid.NewGuid();

            await InsertAuditAsync($"{prefix}/Coklu", statusCode: 500, userId: first);
            await InsertAuditAsync($"{prefix}/Coklu", statusCode: 500, userId: first);
            await InsertAuditAsync($"{prefix}/Coklu", statusCode: 500, userId: second);
            // Anonim istek: kullanıcı sayısına GİRMEZ ama oluşum sayılır.
            await InsertAuditAsync($"{prefix}/Coklu", statusCode: 500, userId: null);

            var issues = await _systemHealth.GetIssuesAsync(new GetHealthIssueListInput
            {
                WindowDays = 7,
                Filter = prefix
            });

            var issue = issues.Items.ShouldHaveSingleItem();
            issue.OccurrenceCount.ShouldBe(4);
            issue.AffectedUserCount.ShouldBe(2, "anonim istek benzersiz kullanıcı değildir");
            issue.Trend.ShouldNotBeNull();
            issue.Trend!.Count.ShouldBe(10);
            issue.Trend.Sum().ShouldBe(4, "kovaların toplamı oluşum sayısına eşit olmalı");
        });
    }

    [Fact]
    public async Task Istemci_hatasinda_olculemeyen_alanlar_null_doner()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var token = Guid.NewGuid().ToString("N")[..8];

            var error = new ClientError(
                Guid.NewGuid(),
                tenantId: null,
                fingerprint: Guid.NewGuid().ToString("N")[..32],
                ClientErrorSource.UnhandledRejection,
                $"qa-{token} promise reddi",
                _clock.Now.AddHours(-2));

            error.OccurrenceCount = 7;
            await _clientErrorRepository.InsertAsync(error, autoSave: true);

            var issues = await _systemHealth.GetIssuesAsync(new GetHealthIssueListInput
            {
                WindowDays = 7,
                Filter = $"qa-{token}"
            });

            var issue = issues.Items.ShouldHaveSingleItem();
            issue.Kind.ShouldBe(HealthIssueKind.ClientPromise, "kanal ClientErrorSource ile aynı sayısal değer");
            issue.OccurrenceCount.ShouldBe(7);
            issue.ClientErrorId.ShouldBe(error.Id);

            // Şema değiştirilmedi: bu iki alan ölçülemiyor ve SIFIR değil NULL döner.
            issue.AffectedUserCount.ShouldBeNull();
            issue.Trend.ShouldBeNull();
        });
    }

    [Fact]
    public async Task Pencerenin_sonunda_baslayan_ariza_regresyon_isaretlenir()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();

            // 30 günlük pencerede bugün başlamış arıza → son %20'nin içinde.
            await InsertAuditAsync($"{prefix}/Yeni", statusCode: 500,
                executionTime: _clock.Now.AddMinutes(-10));

            // Aynı pencerede 25 gün önce başlamış arıza → regresyon DEĞİL.
            await InsertAuditAsync($"{prefix}/Eski", statusCode: 500,
                executionTime: _clock.Now.AddDays(-25));

            var issues = await _systemHealth.GetIssuesAsync(new GetHealthIssueListInput
            {
                WindowDays = 30,
                Filter = prefix
            });

            issues.Items.Single(i => i.Where == $"{prefix}/Yeni").IsRegression.ShouldBeTrue();
            issues.Items.Single(i => i.Where == $"{prefix}/Eski").IsRegression.ShouldBeFalse();
        });
    }

    [Fact]
    public async Task Uc_detayi_normalize_yolla_sorgulanir()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();
            var id = Guid.NewGuid();

            await InsertAuditAsync($"{prefix}/Detay/{id}", "POST", statusCode: 500);

            // Panel normalize yolu gösterir; detay sorgusu ham satırla EŞİT DEĞİLDİR
            // ve önek daraltması + bellekte eşleştirme ile bulunmalıdır.
            var errors = await _systemHealth.GetServerErrorsAsync(new GetServerErrorListInput
            {
                Url = $"{prefix}/Detay/{{id}}",
                HttpMethod = "POST",
                WindowDays = 7
            });

            errors.ShouldHaveSingleItem();
            errors[0].Url.ShouldBe($"{prefix}/Detay/{id}", "detayda SOMUT adres görünmeli");
            errors[0].HttpStatusCode.ShouldBe(500);
        });
    }

    [Fact]
    public async Task Metot_farki_uc_detayini_ayirir()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();

            await InsertAuditAsync($"{prefix}/Ikili", "GET", statusCode: 500);
            await InsertAuditAsync($"{prefix}/Ikili", "POST", statusCode: 500);

            var getErrors = await _systemHealth.GetServerErrorsAsync(new GetServerErrorListInput
            {
                Url = $"{prefix}/Ikili",
                HttpMethod = "GET",
                WindowDays = 7
            });

            getErrors.ShouldHaveSingleItem();
            getErrors[0].HttpMethod.ShouldBe("GET");
        });
    }

    [Fact]
    public async Task Kanal_suzgeci_istemci_kaynagina_cevrilir()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var token = Guid.NewGuid().ToString("N")[..8];

            foreach (var source in new[] { ClientErrorSource.JsError, ClientErrorSource.AjaxError })
            {
                var error = new ClientError(
                    Guid.NewGuid(),
                    tenantId: null,
                    fingerprint: Guid.NewGuid().ToString("N")[..32],
                    source,
                    $"qa-{token} {source}",
                    _clock.Now.AddHours(-1));

                await _clientErrorRepository.InsertAsync(error, autoSave: true);
            }

            // Kanal süzgeci SQL'de IN'e çevrilmeli; çevrilemezse burada patlar.
            var issues = await _systemHealth.GetIssuesAsync(new GetHealthIssueListInput
            {
                WindowDays = 7,
                Filter = $"qa-{token}",
                Kinds = new List<HealthIssueKind> { HealthIssueKind.ClientAjax }
            });

            issues.Items.ShouldHaveSingleItem().Kind.ShouldBe(HealthIssueKind.ClientAjax);
        });
    }

    [Fact]
    public async Task Istemci_hatasinin_cevresindeki_sunucu_kayitlari_bulunur()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();
            var seenAt = _clock.Now.AddHours(-3);

            var error = new ClientError(
                Guid.NewGuid(),
                tenantId: null,
                fingerprint: Guid.NewGuid().ToString("N")[..32],
                ClientErrorSource.AjaxError,
                "istek 500 döndü",
                seenAt);

            await _clientErrorRepository.InsertAsync(error, autoSave: true);

            // Pencere içinde (±2 sn) ve pencere dışında birer kayıt.
            await InsertAuditAsync($"{prefix}/Yakin", statusCode: 500,
                executionTime: seenAt.AddSeconds(-1));
            await InsertAuditAsync($"{prefix}/Uzak", statusCode: 500,
                executionTime: seenAt.AddSeconds(-30));

            var correlations = await _systemHealth.GetCorrelatedServerErrorsAsync(new GetCorrelationInput
            {
                ClientErrorId = error.Id,
                WindowSeconds = 2
            });

            // Host kaydında TenantId iki tarafta da null: SQL'de NULL = NULL YANLIŞ'tır,
            // eşleşme ancak EF null semantiğini doğru kurduğunda gelir.
            correlations.ShouldContain(c => c.Url == $"{prefix}/Yakin");
            correlations.ShouldNotContain(c => c.Url == $"{prefix}/Uzak");

            var near = correlations.Single(c => c.Url == $"{prefix}/Yakin");
            near.OffsetSeconds.ShouldBe(-1, tolerance: 0.5);
        });
    }

    [Fact]
    public async Task Cip_sayaclari_kanal_suzgecinden_bagimsiz_kalir()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();
            var token  = prefix[1..];

            await InsertAuditAsync($"{prefix}/Patlayan", statusCode: 500);
            await InsertAuditAsync($"{prefix}/Yavas", durationMs: TelemetryConsts.DefaultSlowEndpointThresholdMs + 200);

            var error = new ClientError(
                Guid.NewGuid(), tenantId: null, fingerprint: Guid.NewGuid().ToString("N")[..32],
                ClientErrorSource.JsError, $"{token} tarayici hatasi", _clock.Now.AddHours(-1));
            await _clientErrorRepository.InsertAsync(error, autoSave: true);

            // Yalnız sunucu kanalı istendi: liste tek satır dönmeli AMA çipler
            // kapsamdaki üç kanalı da saymalı, yoksa çip kendi kendini gizlerdi.
            var result = await _systemHealth.GetIssuesAsync(new GetHealthIssueListInput
            {
                WindowDays = 7,
                Filter = token,
                Kinds = new List<HealthIssueKind> { HealthIssueKind.ServerError }
            });

            result.Items.ShouldHaveSingleItem().Kind.ShouldBe(HealthIssueKind.ServerError);
            result.TotalCount.ShouldBe(1, "süzgeçten geçen olay sayısı");

            result.ServerCount.ShouldBe(1);
            result.PerformanceCount.ShouldBe(1, "kanal süzgeci çip sayacını etkilememeli");
            result.ClientCount.ShouldBe(1, "kanal süzgeci çip sayacını etkilememeli");
            result.OpenCount.ShouldBe(3);
        });
    }

    [Fact]
    public async Task Istemci_kaniti_ize_ve_korelasyona_sahip_olusumlara_degil()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();
            var seenAt = _clock.Now.AddHours(-2);

            var error = new ClientError(
                Guid.NewGuid(), tenantId: null, fingerprint: Guid.NewGuid().ToString("N")[..32],
                ClientErrorSource.JsError, "patladi", seenAt)
            {
                StackTrace = "at Foo()\n at Bar()",
                BreadcrumbJson = "[]",
                UserAgent = "Chrome 139",
                PageUrl = $"{prefix}/Sayfa"
            };
            await _clientErrorRepository.InsertAsync(error, autoSave: true);

            await InsertAuditAsync($"{prefix}/Yakin", statusCode: 500, executionTime: seenAt.AddSeconds(-1));

            var detail = await _systemHealth.GetIssueDetailAsync(new GetHealthIssueDetailInput
            {
                Kind = HealthIssueKind.ClientJs,
                ClientErrorId = error.Id,
                WindowDays = 7
            });

            detail.Issue.ShouldNotBeNull();
            detail.StackTrace.ShouldNotBeNullOrWhiteSpace();
            detail.BreadcrumbJson.ShouldBe("[]");
            detail.Environment.ShouldContain(f => f.Label == "Tarayıcı");
            detail.Correlations.ShouldContain(c => c.Url == $"{prefix}/Yakin");
            detail.Facts.Count.ShouldBe(5, "olgu şeridi beş hücreli");

            // Bu iki bölüm istemci kanalında ÖLÇÜLMÜYOR → sekme hiç çizilmemeli.
            detail.Occurrences.ShouldBeEmpty();
            detail.AffectedTenants.ShouldBeEmpty();
        });
    }

    [Fact]
    public async Task Sunucu_kaniti_olusumlara_ve_etkilenenlere_sahip_ize_degil()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();

            await InsertAuditAsync($"{prefix}/Ucu/{Guid.NewGuid()}", "POST", statusCode: 500, withException: true);
            await InsertAuditAsync($"{prefix}/Ucu/{Guid.NewGuid()}", "POST", statusCode: 500, withException: true);

            var detail = await _systemHealth.GetIssueDetailAsync(new GetHealthIssueDetailInput
            {
                Kind = HealthIssueKind.ServerError,
                Url = $"{prefix}/Ucu/{{id}}",
                HttpMethod = "POST",
                WindowDays = 7
            });

            detail.Issue.ShouldNotBeNull();
            detail.Issue!.OccurrenceCount.ShouldBe(2, "iki farklı kimlik tek uca toplanmalı");
            detail.Occurrences.Count.ShouldBe(2);
            detail.AffectedTenants.ShouldHaveSingleItem().RequestCount.ShouldBe(2);

            // Sunucu kanalında "yığın izi"nin karşılığı exception metnidir.
            detail.StackTrace.ShouldNotBeNullOrWhiteSpace();

            // Bu ikisi sunucu kanalında YOK → sekme çizilmemeli.
            detail.BreadcrumbJson.ShouldBeNull();
            detail.Correlations.ShouldBeEmpty();
        });
    }

    [Fact]
    public async Task Performans_kanitinda_yigin_izi_yoktur()
    {
        await WithUnitOfWorkAsync(async () =>
        {
            var prefix = NewPrefix();
            var slow = TelemetryConsts.DefaultSlowEndpointThresholdMs + 700;

            await InsertAuditAsync($"{prefix}/Agir", durationMs: slow, statusCode: 200);

            var detail = await _systemHealth.GetIssueDetailAsync(new GetHealthIssueDetailInput
            {
                Kind = HealthIssueKind.Performance,
                Url = $"{prefix}/Agir",
                HttpMethod = "GET",
                WindowDays = 7
            });

            detail.Issue!.Kind.ShouldBe(HealthIssueKind.Performance);
            detail.Issue.AverageDurationMs.ShouldBe(slow);
            detail.Occurrences.ShouldHaveSingleItem();

            // Yavaş ama hatasız istekte exception yok → "Stack trace" sekmesi çizilmez.
            detail.StackTrace.ShouldBeNullOrWhiteSpace();
        });
    }

    /// <summary>Hata veren uçlar da uç istatistiğidir; iki listeyi birlikte tarar.</summary>
    private static IEnumerable<HealthEndpointStatDto> EndpointsFromFailingPages(SystemHealthDto health)
        => health.TopFailingPages.Select(p => new HealthEndpointStatDto
        {
            Url = p.Url,
            HttpMethod = p.HttpMethod,
            CallCount = p.TotalCount,
            ErrorCount = p.ErrorCount,
            ErrorRate = p.ErrorRate
        });
}
