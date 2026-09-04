using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Telemetry.Dtos;
using Apya.Platform.Web.Pages.Admin.SystemHealth;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Sistem Sağlığı olayının "agent'a kopyala" özeti. Kritik nokta ÖLÇÜM DÜRÜSTLÜĞÜ:
/// kırpılan bölüm kırpıldığını, ölçülmeyen alan ölçülmediğini söylemeli — ajan eksik
/// listeyi tam sanıp "başka oluşum yok" diye akıl yürütmesin.
/// </summary>
public class HealthIssueSummary_Tests
{
    private static HealthIssueDto ServerIssue() => new()
    {
        Key               = "4|GET|/api/app/task/{id}",
        Kind              = HealthIssueKind.ServerError,
        Title             = "Sunucu hatası: GET /api/app/task/{id}",
        Where             = "/api/app/task/{id}",
        HttpMethod        = "GET",
        HttpStatusCode    = 500,
        AverageDurationMs = 812.4,
        TenantName        = "Acme",
        OccurrenceCount   = 12,
        AffectedUserCount = 3,
        FirstSeenAt       = new DateTime(2026, 9, 3, 9, 15, 0),
        LastSeenAt        = new DateTime(2026, 9, 3, 12, 20, 0)
    };

    [Fact]
    public void Sunucu_olayinin_kunyesi_ve_kaniti_ozete_girer()
    {
        var summary = HealthIssueSummaryBuilder.Build(new HealthIssueDetailDto
        {
            Issue      = ServerIssue(),
            StackTrace = "System.NullReferenceException: Object reference not set",
            Environment = new List<HealthFactDto>
            {
                new() { Label = "Son kullanıcı", Value = "admin" }
            },
            Occurrences = new List<ServerErrorDetailDto>
            {
                new()
                {
                    ExecutionTime     = new DateTime(2026, 9, 3, 12, 20, 0),
                    ExecutionDuration = 812,
                    HttpStatusCode    = 500,
                    UserName          = "admin",
                    Url               = "/api/app/task/7"
                }
            }
        }, 7);

        summary.ShouldContain("Sunucu hatası: GET /api/app/task/{id}");
        summary.ShouldContain("GET /api/app/task/{id} → 500");
        summary.ShouldContain("Oluşum: 12 · Etkilenen kullanıcı: 3");
        summary.ShouldContain("Ortalama süre: 812.4 ms");
        summary.ShouldContain("Pencere: son 7 gün");
        summary.ShouldContain("### Hata metni");
        summary.ShouldContain("NullReferenceException");
        summary.ShouldContain("Son kullanıcı: admin");
        summary.ShouldContain("/api/app/task/7");
    }

    [Fact]
    public void Olculmeyen_alan_sifir_degil_olculmuyor_yazar()
    {
        var issue = ServerIssue();
        issue.Kind              = HealthIssueKind.ClientJs;
        issue.AffectedUserCount = null;   // istemci kanalı kullanıcı sayacı tutmuyor
        issue.AverageDurationMs = null;   // tarayıcıda süre ölçülmüyor

        var summary = HealthIssueSummaryBuilder.Build(new HealthIssueDetailDto { Issue = issue }, 7);

        summary.ShouldContain("Etkilenen kullanıcı: ölçülmüyor");
        summary.ShouldNotContain("Ortalama süre:");
    }

    [Fact]
    public void Kirpilan_bolum_kirpildigini_soyler()
    {
        var detail = new HealthIssueDetailDto
        {
            Issue      = ServerIssue(),
            StackTrace = new string('x', 5000),
            Occurrences = Enumerable.Range(0, 25).Select(i => new ServerErrorDetailDto
            {
                ExecutionTime     = new DateTime(2026, 9, 3, 12, 0, 0).AddMinutes(i),
                ExecutionDuration = 500,
                HttpStatusCode    = 500,
                Url               = "/api/app/task/" + i
            }).ToList()
        };

        var summary = HealthIssueSummaryBuilder.Build(detail, 7);

        summary.ShouldContain("karakterde kırpıldı");
        summary.ShouldContain("### Oluşumlar (10/25 gösteriliyor)");
        summary.ShouldNotContain("/api/app/task/24");
    }

    [Fact]
    public void Davranis_izinin_SON_adimlari_tutulur()
    {
        var crumbs = string.Join(",", Enumerable.Range(0, 20).Select(i =>
            $"{{\"t\":{new DateTimeOffset(new DateTime(2026, 9, 3, 12, 0, 0, DateTimeKind.Utc)).ToUnixTimeMilliseconds()},\"y\":\"click\",\"l\":\"adim-{i}\"}}"));

        var summary = HealthIssueSummaryBuilder.Build(new HealthIssueDetailDto
        {
            Issue          = ServerIssue(),
            BreadcrumbJson = "[" + crumbs + "]"
        }, 7);

        // Hataya en yakın adımlar sondakiler; baştan kırpılır.
        summary.ShouldContain("adim-19");
        summary.ShouldContain("adim-5");
        summary.ShouldNotContain("adim-4");
        summary.ShouldContain("### Davranış izi (15/20 gösteriliyor)");
    }

    [Fact]
    public void Tablo_hucresindeki_dikey_cizgi_kacirilir()
    {
        var summary = HealthIssueSummaryBuilder.Build(new HealthIssueDetailDto
        {
            Issue = ServerIssue(),
            Occurrences = new List<ServerErrorDetailDto>
            {
                new() { ExecutionTime = DateTime.Now, Url = "/api/app/task?f=a|b" }
            }
        }, 7);

        summary.ShouldContain("/api/app/task?f=a\\|b");
    }

    [Fact]
    public void Liste_kunyesi_her_olay_icin_tek_satir_uretir()
    {
        var list = new HealthIssueListDto
        {
            TotalCount = 40,
            Items = new List<HealthIssueDto>
            {
                ServerIssue(),
                new()
                {
                    Kind            = HealthIssueKind.RequestRejected,
                    Title           = "Reddedilen istek: GET /Dashboard",
                    Where           = "/Dashboard",
                    HttpMethod      = "GET",
                    HttpStatusCode  = 403,
                    OccurrenceCount = 8,
                    AffectedUserCount = 1,
                    TenantName      = "Host",
                    LastSeenAt      = new DateTime(2026, 9, 3, 12, 22, 0)
                }
            }
        };

        var summary = HealthIssueSummaryBuilder.BuildList(list, 7);

        summary.ShouldContain("40 kayıttan 2 tanesi");
        summary.ShouldContain("- [Sunucu · 500] Sunucu hatası: GET /api/app/task/{id}");
        summary.ShouldContain("- [İstek reddi · 403] Reddedilen istek: GET /Dashboard");
        summary.ShouldContain("· 8 oluşum · 1 kullanıcı");
        summary.Split('\n').Count(line => line.StartsWith("- [")).ShouldBe(2);
    }
}
