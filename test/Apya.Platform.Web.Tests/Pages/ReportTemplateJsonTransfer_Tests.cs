using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Rapor şablonunun JSON aktarımı: künye ve bölüm düzeni (sıra, açık/kapalı) indirilir, YENİ kendi
/// şablonu olarak açılır. Başka ekranın dosyası reddedilir.
/// </summary>
public class ReportTemplateJsonTransfer_Tests : PlatformWebTestBase
{
    private const string Page = "/Documents/ReportBuilder";

    private async Task<JsonElement> ImportAsync(byte[] file)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Page));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull("derleyici sayfasında antiforgery jetonu yok");

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        content.Add(part, "file", "sablon.json");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, Page + "?handler=ImportTemplate") { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    [Fact]
    public async Task Sablon_bolum_duzeniyle_yeni_sablon_olarak_acilir()
    {
        var service = GetRequiredService<IReportTemplateAppService>();
        var name = "Aktarım şablonu " + Guid.NewGuid().ToString("N")[..6];
        var source = await service.CreateAsync(new CreateUpdateReportTemplateDto
        {
            Name = name, Recipient = ReportRecipient.Institution, Issuer = "KOSGEB", Order = 7
        });
        // İlk iki bölümün yerini değiştir, ilkini kapat.
        var ordered = source.Sections.OrderBy(s => s.Order).ToList();
        source = await service.UpdateSectionsAsync(new UpdateReportSectionsDto
        {
            TemplateId = source.Id,
            Sections = ordered.Select((s, i) => new ReportSectionOrderDto
            {
                SectionId = s.Id,
                Order = i == 0 ? 2 : i == 1 ? 1 : s.Order,
                IsEnabled = i != 0 && s.IsEnabled
            }).ToList()
        });

        var file = await (await GetResponseAsync($"{Page}?handler=ExportTemplate&id={source.Id}")).Content.ReadAsByteArrayAsync();
        JsonDocument.Parse(file).RootElement.GetProperty("format").GetString().ShouldBe("apya.report-template");

        var result = await ImportAsync(file);
        result.GetProperty("ok").GetBoolean().ShouldBeTrue(result.GetProperty("message").GetString());
        var copyId = result.GetProperty("id").GetGuid();
        copyId.ShouldNotBe(source.Id);

        var copy = (await service.GetListAsync()).Single(t => t.Id == copyId);
        copy.Name.ShouldBe(name);
        copy.Issuer.ShouldBe("KOSGEB");
        copy.IsSystem.ShouldBeFalse();
        foreach (var s in source.Sections)
        {
            var c = copy.Sections.Single(x => x.SectionKey == s.SectionKey);
            c.IsEnabled.ShouldBe(s.IsEnabled, $"{s.SectionKey} açık/kapalı aynı olmalı");
            c.Order.ShouldBe(s.Order, $"{s.SectionKey} sırası aynı olmalı");
        }
    }

    [Fact]
    public async Task Form_dosyasi_sablon_olarak_alinmaz()
    {
        var formFile = Encoding.UTF8.GetBytes("{\"format\":\"apya.form\",\"version\":1,\"data\":{\"title\":\"x\",\"blocks\":[]}}");

        var result = await ImportAsync(formFile);

        result.GetProperty("ok").GetBoolean().ShouldBeFalse();
        result.GetProperty("message").GetString()!.ShouldContain("rapor şablonu dosyası değil");
    }
}
