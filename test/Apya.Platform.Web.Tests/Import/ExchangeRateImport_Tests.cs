using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.ExchangeRates;
using ClosedXML.Excel;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>
/// Kurları Excel'den içe aktarma: satırlar "Yeni Kur Ekle"nin servisinden geçer ve elle girilmiş
/// kur olarak kaydedilir. Hedef boşsa TRY; dosyada aynı çift + gün iki kez olamaz.
/// </summary>
public class ExchangeRateImport_Tests : PlatformWebTestBase
{
    private const string Url = "/ExchangeRates/ImportModal";

    // Şablonun sütun sırası: Tarih, Para birimi, Hedef para birimi, Kur
    private async Task<byte[]> FilledTemplateAsync(params string?[][] rows)
    {
        var response = await GetResponseAsync(Url + "?handler=Template");
        using var wb = new XLWorkbook(new MemoryStream(await response.Content.ReadAsByteArrayAsync()));
        var ws = wb.Worksheet(1);
        ws.Cell(1, 1).GetString().ShouldEndWith(" *");
        for (var i = 0; i < rows.Length; i++)
        {
            for (var c = 0; c < rows[i].Length; c++)
            {
                if (rows[i][c] != null) ws.Cell(i + 2, c + 1).Value = rows[i][c]!;
            }
        }

        using var stream = new MemoryStream();
        wb.SaveAs(stream);
        return stream.ToArray();
    }

    private async Task<JsonElement> PostAsync(string handler, byte[] file)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Url));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull("pencerede antiforgery jetonu yok");

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        content.Add(part, "file", "kurlar.xlsx");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, Url + "?handler=" + handler) { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    [Fact]
    public async Task Gecerli_kurlar_elle_kaynakli_kaydedilir_hedef_bossa_TRY()
    {
        var file = await FilledTemplateAsync(
            ["03.02.2031", "USD", null, "34,5678"],
            ["03.02.2031", "eur", "USD", "1.085"]);

        var import = await PostAsync("Import", file);
        import.GetProperty("done").GetBoolean().ShouldBeTrue(import.GetProperty("message").GetString());

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var day = new DateTime(2031, 2, 3);
        var saved = await GetRequiredService<IRepository<ExchangeRate, Guid>>().GetListAsync(r => r.RateDate == day);
        saved.Count.ShouldBe(2);
        var usd = saved.Single(r => r.FromCurrency == "USD");
        usd.ToCurrency.ShouldBe("TRY");
        usd.Rate.ShouldBe(34.5678m);
        usd.Source.ShouldBe(ExchangeRateSource.Manual);
        var eur = saved.Single(r => r.FromCurrency == "EUR");
        eur.ToCurrency.ShouldBe("USD");
        eur.Rate.ShouldBe(1.085m);
    }

    [Fact]
    public async Task Onizleme_ayni_para_birimini_tekrari_sifir_kuru_ve_bozuk_kodu_satirda_gosterir()
    {
        var file = await FilledTemplateAsync(
            ["04.02.2031", "USD", "USD", "1"],
            ["04.02.2031", "EUR", null, "37"],
            ["04.02.2031", "EUR", "TRY", "38"],
            ["04.02.2031", "GBP", null, "0"],
            ["04.02.2031", "US", null, "10"]);

        var preview = await PostAsync("Preview", file);
        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        var rows = preview.GetProperty("rows");
        rows[0].GetProperty("errors").GetArrayLength().ShouldBe(1);
        rows[1].GetProperty("errors").GetArrayLength().ShouldBe(0);
        rows[2].GetProperty("errors").GetArrayLength().ShouldBe(1);
        rows[3].GetProperty("errors").GetArrayLength().ShouldBe(1);
        rows[4].GetProperty("errors").GetArrayLength().ShouldBe(1);

        (await PostAsync("Import", file)).GetProperty("done").GetBoolean().ShouldBeFalse();

        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var day = new DateTime(2031, 2, 4);
        (await GetRequiredService<IRepository<ExchangeRate, Guid>>().CountAsync(r => r.RateDate == day)).ShouldBe(0);
    }
}
