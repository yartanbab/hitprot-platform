using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Apya.Platform.DataTransfers;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.TenantManagement;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Transfer;

/// <summary>
/// İşlem geçmişi: dışa aktarma ve içe aktarma kayıt bırakır (satır sayılarıyla); şablon indirme ve
/// önizleme bırakmaz. Reddedilen içe aktarma "kaydedilmedi" olarak, hatalı satır sayısıyla yazılır.
/// Kayıt kiracıya aittir: kiracının işlemi host geçmişinde görünmez.
/// </summary>
public class DataTransferHistory_Tests : PlatformWebTestBase
{
    private readonly string _code = Guid.NewGuid().ToString("N")[..6];

    private async Task<List<DataTransferRun>> RunsAsync(Guid? tenantId, string module)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        {
            return (await GetRequiredService<IRepository<DataTransferRun, Guid>>().GetListAsync(r => r.ModuleKey == module))
                .OrderBy(r => r.CreationTime).ToList();
        }
    }

    private async Task<string> PostImportAsync(string handler, string csvBody)
    {
        const string modal = "/ExchangeRates/ImportModal";
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(modal));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']").GetAttributeValue("value", "");
        var header = Encoding.UTF8.GetString(await (await GetResponseAsync(modal + "?handler=Template&format=csv")).Content.ReadAsByteArrayAsync())
            .TrimStart('﻿').TrimEnd();

        using var content = new MultipartFormDataContent();
        content.Add(new ByteArrayContent(Encoding.UTF8.GetBytes(header + "\r\n" + csvBody)), "file", "kurlar.csv");
        content.Add(new StringContent(token), "__RequestVerificationToken");
        using var request = new HttpRequestMessage(HttpMethod.Post, modal + "?handler=" + handler) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        response.IsSuccessStatusCode.ShouldBeTrue();
        return await response.Content.ReadAsStringAsync();
    }

    [Fact]
    public async Task Ice_aktarma_kaydi_satir_sayilariyla_yazilir_onizleme_ve_sablon_yazilmaz()
    {
        var before = (await RunsAsync(null, "exchange-rates")).Count;
        var currency = "Z" + new string(_code.Where(char.IsLetter).Concat("QW").Take(2).ToArray()).ToUpperInvariant();

        // Şablon ve önizleme işlem değildir.
        await PostImportAsync("Preview", $"05.01.2032;{currency};TRY;41,5");
        (await RunsAsync(null, "exchange-rates")).Count.ShouldBe(before);

        // Reddedilen dosya: iki satırdan biri hatalı, hiçbiri yazılmaz.
        await PostImportAsync("Import", $"05.01.2032;{currency};TRY;41,5\r\n06.01.2032;{currency};TRY;abc");
        var rejected = (await RunsAsync(null, "exchange-rates")).Last();
        rejected.Direction.ShouldBe(DataTransferDirection.Import);
        rejected.Succeeded.ShouldBeFalse();
        rejected.TotalRows.ShouldBe(2);
        rejected.FailedRows.ShouldBe(1);
        rejected.SucceededRows.ShouldBe(0);
        rejected.Format.ShouldBe("csv");
        rejected.FileName.ShouldBe("kurlar.csv");

        await PostImportAsync("Import", $"05.01.2032;{currency};TRY;41,5\r\n06.01.2032;{currency};TRY;42");
        var saved = (await RunsAsync(null, "exchange-rates")).Last();
        saved.Succeeded.ShouldBeTrue();
        saved.TotalRows.ShouldBe(2);
        saved.SucceededRows.ShouldBe(2);
        saved.FailedRows.ShouldBe(0);
        (await RunsAsync(null, "exchange-rates")).Count.ShouldBe(before + 2);

        // Dışa aktarma: dosya adı, biçim ve satır sayısı.
        await GetResponseAsync($"/ExchangeRates?handler=Excel&format=csv&fromCurrency={currency}");
        var exported = (await RunsAsync(null, "exchange-rates")).Last();
        exported.Direction.ShouldBe(DataTransferDirection.Export);
        exported.Succeeded.ShouldBeTrue();
        exported.Format.ShouldBe("csv");
        exported.TotalRows.ShouldBe(2);
        exported.FileName!.ShouldEndWith(".csv");

        // Geçmiş sekmesi kaydı gösterir.
        var html = await GetResponseAsStringAsync("/DataTransfer?tab=history");
        html.ShouldContain("data-transfer-run=\"exchange-rates\"");
        html.ShouldContain("kurlar.csv");
    }

    [Fact]
    public async Task Kendi_duzenini_yazan_ve_ayar_aktarimi_da_kayda_girer_sayfa_acilisi_girmez()
    {
        var before = (await RunsAsync(null, "tenants")).Count;

        // Liste ekranını açmak aktarım değildir.
        await GetResponseAsync("/TenantManagement/Tenants");
        (await RunsAsync(null, "tenants")).Count.ShouldBe(before);

        await GetResponseAsync("/TenantManagement/Tenants?handler=Excel");
        var run = (await RunsAsync(null, "tenants")).Last();
        run.Format.ShouldBe("xlsx");
        run.TotalRows.ShouldNotBeNull();

        // JSON ayar aktarımı satır bildirmez; kayıt yine düşer.
        var jsonBefore = (await RunsAsync(null, "grant-notification-templates")).Count;
        await GetResponseAsync("/Grants/NotificationTemplates?handler=Export");
        var json = (await RunsAsync(null, "grant-notification-templates")).Last();
        (await RunsAsync(null, "grant-notification-templates")).Count.ShouldBe(jsonBefore + 1);
        json.Format.ShouldBe("json");
        json.TotalRows.ShouldBeNull();
    }

    [Fact]
    public async Task Kiracinin_islemi_host_gecmisinde_gorunmez()
    {
        var tenant = await GetRequiredService<ITenantManager>().CreateAsync("gecmis-" + _code);
        await GetRequiredService<ITenantRepository>().InsertAsync(tenant, autoSave: true);
        var hostBefore = (await RunsAsync(null, "tasks")).Count;

        await WithTenantClientAsync(tenant.Id, async client =>
        {
            (await client.GetAsync("/Tasks?handler=Excel&format=csv")).IsSuccessStatusCode.ShouldBeTrue();
            (await client.GetStringAsync("/DataTransfer?tab=history")).ShouldContain("data-transfer-run=\"tasks\"");
        });

        (await RunsAsync(tenant.Id, "tasks")).Count.ShouldBe(1);
        (await RunsAsync(null, "tasks")).Count.ShouldBe(hostBefore);
    }
}
