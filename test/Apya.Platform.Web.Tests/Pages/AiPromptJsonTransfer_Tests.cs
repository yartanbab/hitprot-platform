using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Prompts.Dtos;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// AI istemlerinin JSON aktarımı: künye + tek sürümün içeriği iner; içe aktarma YENİ istem açar,
/// içerik yayında olmayan ilk sürüm olur. Aynı kod bu ortamda varsa servis reddeder.
/// </summary>
public class AiPromptJsonTransfer_Tests : PlatformWebTestBase
{
    private const string Page = "/AiCenter/Prompts";

    private async Task<JsonElement> ImportAsync(byte[] file)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Page));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull();

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        content.Add(part, "file", "istem.json");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, Page + "?handler=Import") { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    [Fact]
    public async Task Istem_icerigiyle_yeni_ve_yayinda_olmayan_istem_olarak_acilir_ayni_kod_reddedilir()
    {
        var service = GetRequiredService<IPromptAppService>();
        var code = "aktarim-" + Guid.NewGuid().ToString("N")[..6];
        var source = await service.CreateAsync(new CreatePromptDto
        {
            Code = code, Name = "Aktarım istemi", Description = "Kaynak",
            SystemPrompt = "Sen bir hibe uzmanısın.", UserPromptTemplate = "Şunu özetle: {metin}", JsonSchema = "{\"type\":\"object\"}"
        });

        var file = await (await GetResponseAsync($"{Page}?handler=Export&id={source.Id}")).Content.ReadAsByteArrayAsync();
        var json = JsonNode.Parse(file)!;
        json["format"]!.GetValue<string>().ShouldBe("apya.ai-prompt");
        Encoding.UTF8.GetString(file).ShouldNotContain("apiKey", Case.Insensitive);

        // Aynı ortamda aynı kod: servis reddeder.
        var duplicate = await ImportAsync(file);
        duplicate.GetProperty("ok").GetBoolean().ShouldBeFalse();
        duplicate.GetProperty("message").GetString()!.ShouldContain("istem kodu zaten kullanımda");

        // Başka ortamı taklit et: kodu değiştir.
        var newCode = code + "-b";
        json["data"]!["code"] = newCode;
        var result = await ImportAsync(Encoding.UTF8.GetBytes(json.ToJsonString()));
        result.GetProperty("ok").GetBoolean().ShouldBeTrue(result.GetProperty("message").GetString());

        var copy = await service.GetAsync(result.GetProperty("id").GetGuid());
        copy.Code.ShouldBe(newCode);
        copy.Name.ShouldBe("Aktarım istemi");
        copy.ActiveVersionId.ShouldBeNull("içe aktarılan istem yayında olmamalı");
        var version = copy.Versions.Single();
        version.SystemPrompt.ShouldBe("Sen bir hibe uzmanısın.");
        version.UserPromptTemplate.ShouldBe("Şunu özetle: {metin}");
        version.JsonSchema.ShouldBe("{\"type\":\"object\"}");
    }
}
