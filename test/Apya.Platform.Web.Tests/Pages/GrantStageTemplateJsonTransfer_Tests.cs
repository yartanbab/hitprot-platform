using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Hibe aşama şablonunun JSON aktarımı (host): adımlar sırası, sahibi ve sabit aşama eşlemesiyle
/// indirilir; YENİ şablon olarak açılır, varsayılan YAPILMAZ.
/// </summary>
public class GrantStageTemplateJsonTransfer_Tests : PlatformWebTestBase
{
    private const string Page = "/Grants/StageTemplates";

    private async Task<JsonElement> ImportAsync(byte[] file)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Page));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull();

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        content.Add(part, "file", "asama.json");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, Page + "?handler=Import") { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    [Fact]
    public async Task Sablon_adimlariyla_yeni_ve_varsayilan_olmayan_sablon_olarak_acilir()
    {
        var service = GetRequiredService<IGrantStageTemplateAppService>();
        var name = "Aktarım akışı " + Guid.NewGuid().ToString("N")[..6];
        var source = await service.CreateAsync(new CreateUpdateGrantStageTemplateDto
        {
            Name = name,
            Description = "Kaynak",
            IsDefault = true,
            StepsCarryIds = true,
            Steps =
            [
                new GrantStageTemplateStepDto { Order = 1, Name = "Ön inceleme", Owner = GrantPartyRole.Danisman, ReminderDays = 3 },
                new GrantStageTemplateStepDto { Order = 2, Name = "Evrak toplama", Owner = GrantPartyRole.Firma, RequiredDocumentsNote = "Faaliyet belgesi" }
            ]
        });

        var file = await (await GetResponseAsync($"{Page}?handler=Export&id={source.Id}")).Content.ReadAsByteArrayAsync();
        var json = JsonDocument.Parse(file).RootElement;
        json.GetProperty("format").GetString().ShouldBe("apya.grant-stage-template");
        json.GetProperty("data").TryGetProperty("isDefault", out _).ShouldBeFalse();

        var result = await ImportAsync(file);
        result.GetProperty("ok").GetBoolean().ShouldBeTrue(result.GetProperty("message").GetString());
        var copy = await service.GetAsync(result.GetProperty("id").GetGuid());

        copy.Id.ShouldNotBe(source.Id);
        copy.Name.ShouldBe(name);
        copy.IsDefault.ShouldBeFalse();
        var steps = copy.Steps.OrderBy(s => s.Order).ToList();
        steps.Select(s => s.Name).ShouldBe(new[] { "Ön inceleme", "Evrak toplama" });
        steps[0].Owner.ShouldBe(GrantPartyRole.Danisman);
        steps[0].ReminderDays.ShouldBe(3);
        steps[1].RequiredDocumentsNote.ShouldBe("Faaliyet belgesi");
        steps.Select(s => s.Id).ShouldNotContain(source.Steps[0].Id);
        (await service.GetAsync(source.Id)).IsDefault.ShouldBeTrue("kaynak varsayılan kalmalı");
    }
}
