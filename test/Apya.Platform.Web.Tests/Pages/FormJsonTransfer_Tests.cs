using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Formun JSON aktarımı: tanım indirilir, başka yerde YENİ taslak form olarak açılır. Alanların
/// koşul bağı (visibleWhen.blockId) kopyada yeni alan kimliğini gösterir; yanlış dosya reddedilir.
/// </summary>
public class FormJsonTransfer_Tests : PlatformWebTestBase
{
    private readonly string _code = Guid.NewGuid().ToString("N")[..6];

    private async Task<DocumentDto> SeedFormAsync()
        => await GetRequiredService<IFormAppService>().CreateAsync(new CreateUpdateFormDto
        {
            Title = "Aktarım formu " + _code,
            Description = "Açıklama " + _code,
            Blocks =
            [
                new CreateBlockDto { ClientId = "soru1", Type = BlockType.Select, Order = 1, Content = "Katılacak mısınız?", Settings = "{\"options\":[\"Evet\",\"Hayır\"]}" },
                new CreateBlockDto { Type = BlockType.ShortText, Order = 2, Content = "Kaç kişi?", Settings = "{\"visibleWhen\":{\"blockId\":\"soru1\",\"op\":\"eq\",\"value\":\"Evet\"}}" }
            ]
        });

    private async Task<JsonElement> ImportAsync(byte[] file)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync("/DynamicAssets"));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull();

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        content.Add(part, "file", "form.json");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, "/DynamicAssets?handler=Import") { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    [Fact]
    public async Task Indirilen_form_yeni_taslak_olarak_acilir_kosul_yeni_alani_gosterir()
    {
        var source = await SeedFormAsync();

        var response = await GetResponseAsync($"/DynamicAssets?handler=Export&id={source.Id}");
        response.Content.Headers.ContentType!.MediaType.ShouldBe("application/json");
        var file = await response.Content.ReadAsByteArrayAsync();
        var json = JsonDocument.Parse(file).RootElement;
        json.GetProperty("format").GetString().ShouldBe("apya.form");
        json.GetProperty("version").GetInt32().ShouldBe(1);
        json.GetProperty("data").GetProperty("blocks").GetArrayLength().ShouldBe(2);
        Encoding.UTF8.GetString(file).ShouldNotContain("publishSettings", Case.Insensitive);

        var result = await ImportAsync(file);
        result.GetProperty("ok").GetBoolean().ShouldBeTrue(result.GetProperty("message").GetString());
        var copyId = result.GetProperty("id").GetGuid();
        copyId.ShouldNotBe(source.Id);

        var copy = await GetRequiredService<IFormAppService>().GetAsync(copyId);
        copy.Title.ShouldBe(source.Title);
        copy.Description.ShouldBe(source.Description);
        copy.Status.ShouldBe(FormStatus.Draft);
        var blocks = copy.Blocks.OrderBy(b => b.Order).ToList();
        blocks.Count.ShouldBe(2);
        blocks.Select(b => b.Id).ShouldNotContain(source.Blocks[0].Id);

        var condition = JsonDocument.Parse(blocks[1].Settings).RootElement.GetProperty("visibleWhen").GetProperty("blockId").GetString();
        condition.ShouldBe(blocks[0].Id.ToString(), "koşul kopyadaki ilk alanı göstermeli, kaynağınkini değil");
    }

    [Fact]
    public async Task Baska_ekranin_dosyasi_ve_bozuk_dosya_reddedilir()
    {
        var wrong = Encoding.UTF8.GetBytes("{\"format\":\"apya.report-template\",\"version\":1,\"data\":{\"title\":\"x\"}}");
        var r1 = await ImportAsync(wrong);
        r1.GetProperty("ok").GetBoolean().ShouldBeFalse();
        r1.GetProperty("message").GetString()!.ShouldContain("form dosyası değil");

        var broken = Encoding.UTF8.GetBytes("bu json değil");
        var r2 = await ImportAsync(broken);
        r2.GetProperty("ok").GetBoolean().ShouldBeFalse();
    }
}
