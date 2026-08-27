using System;
using System.Linq;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.AuditLogging;
using Volo.Abp.Data;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Timing;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// /Admin/SystemHealth — uç derinleştirmesinden sonra sayfanın gerçekten basıldığını
/// doğrular. Asıl değeri şu: sayfa altı ayrı SQL toplama sorgusu çalıştırıyor;
/// biri bile çevrilemezse burada 500 döner.
///
/// Test host'u AddAlwaysAllowAuthorization kullanır → izin kapısı değil YAPI ölçülür.
/// Tablolar yalnız veri varken basıldığı için denetim kaydı tohumlanır.
/// </summary>
public class SystemHealthPage_Tests : PlatformWebTestBase
{
    private const string SlowUrl = "/qa-health/Liste";
    private const string FailingUrl = "/qa-health/Detay";

    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    /// <summary>
    /// Sayfanın uç tablolarını dolduracak en az veri: min çağrı eşiğini geçen bir
    /// yavaş uç + hata veren, kimlik taşıyan bir yol.
    /// </summary>
    private async Task SeedAuditLogsAsync()
    {
        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        var repository = GetRequiredService<IRepository<AuditLog, Guid>>();
        var guidGenerator = GetRequiredService<IGuidGenerator>();
        var clock = GetRequiredService<IClock>();

        using var uow = uowManager.Begin(requiresNew: true);

        if (await repository.GetCountAsync() > 0)
        {
            return; // aynı host birden çok test metodunu besliyor
        }

        AuditLog Build(string url, string method, int duration, int? status, string? exceptions) => new(
            id: guidGenerator.Create(),
            applicationName: "QA",
            tenantId: null,
            tenantName: null,
            userId: null,
            userName: null,
            executionTime: clock.Now.AddMinutes(-10),
            executionDuration: duration,
            clientIpAddress: null,
            clientName: null,
            clientId: null,
            correlationId: null,
            browserInfo: null,
            httpMethod: method,
            url: url,
            httpStatusCode: status,
            impersonatorUserId: null,
            impersonatorUserName: null,
            impersonatorTenantId: null,
            impersonatorTenantName: null,
            extraPropertyDictionary: new ExtraPropertyDictionary(),
            entityChanges: null,
            actions: null,
            exceptions: exceptions,
            comments: null);

        // Min çağrı eşiğini (5) geçsin ki "En Yavaş Uçlar" tablosu basılsın.
        for (var i = 0; i < 6; i++)
        {
            await repository.InsertAsync(Build(SlowUrl, "GET", 1500, 200, null));
        }

        // Yoldaki kimlik normalize edilip tek uca toplanmalı.
        await repository.InsertAsync(Build($"{FailingUrl}/{Guid.NewGuid()}", "POST", 30, 500, null));
        await repository.InsertAsync(Build($"{FailingUrl}/{Guid.NewGuid()}", "POST", 30, 500, null));

        await uow.CompleteAsync();
    }

    [Fact]
    public async Task Sayfa_basilir_ve_uc_tablolari_yeni_sutunlarla_gelir()
    {
        await SeedAuditLogsAsync();

        var html = await GetResponseAsStringAsync("/Admin/SystemHealth");
        var doc = Parse(html);

        // Kart başlıkları "sayfa" değil "uç" diyor: kimlik artık metot + normalize yol.
        html.ShouldContain("En Çok Hata Veren Uçlar");
        html.ShouldContain("En Yavaş Uçlar");
        html.ShouldContain("Kiracı Sağlığı");

        var slowest = doc.GetElementbyId("slowest-endpoints");
        slowest.ShouldNotBeNull("en yavaş uçlar kartı basılmadı");

        var headers = slowest!.SelectNodes(".//thead//th")?.Select(n => n.InnerText.Trim()).ToList();
        headers.ShouldNotBeNull("yavaş uç tablosu boş durumda kaldı — tohumlama yetmedi");
        headers!.ShouldContain("Metot");
        headers.ShouldContain("Yavaş");
        headers.ShouldContain("Hata");
    }

    [Fact]
    public async Task Yoldaki_kimlik_normalize_edilmis_olarak_basilir()
    {
        await SeedAuditLogsAsync();

        var html = await GetResponseAsStringAsync("/Admin/SystemHealth");
        var doc = Parse(html);

        var failing = doc.GetElementbyId("failing-pages");
        failing.ShouldNotBeNull();

        var rows = failing!.SelectNodes(".//tr[contains(@class,'apya-failing-page-row')]");
        rows.ShouldNotBeNull("hata veren uç satırı basılmadı");

        var row = rows!.Single(r => r.GetAttributeValue("data-url", "") == $"{FailingUrl}/{{id}}");

        // Satır tıklanınca detay modalı açılıyor; metot taşınmazsa GET ve POST
        // hataları tek uç gibi listelenir (bkz. Index.js).
        row.GetAttributeValue("data-http-method", "").ShouldBe("POST");
    }

    [Fact]
    public async Task Bayat_200000_satir_uyarisi_kalmadi()
    {
        // Toplama SQL'e indi; "en yeni 200.000 satır" kısıtı artık YOK. Metin kalırsa
        // panel kendisi hakkında yanlış bilgi verir.
        var html = await GetResponseAsStringAsync("/Admin/SystemHealth");

        html.ShouldNotContain("200.000");
    }

    [Fact]
    public async Task Pencere_secici_dort_secenegi_de_calisir()
    {
        foreach (var window in new[] { 7, 14, 30, 90 })
        {
            var html = await GetResponseAsStringAsync($"/Admin/SystemHealth?windowDays={window}");
            html.ShouldContain($"Son {window} Gün");
        }
    }
}
