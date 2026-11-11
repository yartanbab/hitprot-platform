using System;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Prompts.Dtos;
using Apya.Platform.Ai.Workflows;
using Apya.Platform.Ai.Workflows.Dtos;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// AI iş akışlarının JSON aktarımı: istem KODLA taşınır, webhook yükü boş yazılır; içe aktarma YENİ
/// ve KAPALI iş akışı açar, kuralları sırasıyla ekler, istemi aynı kodla bulursa bağlar.
/// </summary>
public class AiWorkflowJsonTransfer_Tests : PlatformWebTestBase
{
    private const string Page = "/AiCenter/Workflows";

    private async Task<JsonElement> ImportAsync(byte[] file)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Page));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull();

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        content.Add(part, "file", "akis.json");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, Page + "?handler=Import") { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    [Fact]
    public async Task Is_akisi_kapali_acilir_istem_kodla_baglanir_webhook_yuku_tasinmaz()
    {
        var code = "akis-" + Guid.NewGuid().ToString("N")[..6];
        var prompt = await GetRequiredService<IPromptAppService>().CreateAsync(new CreatePromptDto
        {
            Code = code, Name = "Akış istemi", SystemPrompt = "s", UserPromptTemplate = "u"
        });

        var service = GetRequiredService<IAiWorkflowAppService>();
        var source = await service.CreateAsync(new CreateUpdateAiWorkflowDto { Name = "Aktarım akışı " + code, PromptId = prompt.Id, IsActive = true });
        await service.AddRuleAsync(source.Id, new CreateWorkflowRuleDto
        {
            JsonPath = "$.score", Operator = RuleOperator.GreaterThan, CompareValue = "80", ActionType = WorkflowActionType.Approve
        });
        await service.AddRuleAsync(source.Id, new CreateWorkflowRuleDto
        {
            JsonPath = "$.score", Operator = RuleOperator.LessThan, CompareValue = "20", ActionType = WorkflowActionType.Webhook,
            ActionPayload = "{\"url\":\"https://ornek.test/kanca?token=GIZLI-" + code + "\"}"
        });

        var file = await (await GetResponseAsync($"{Page}?handler=Export&id={source.Id}")).Content.ReadAsByteArrayAsync();
        var text = Encoding.UTF8.GetString(file);
        JsonDocument.Parse(file).RootElement.GetProperty("format").GetString().ShouldBe("apya.ai-workflow");
        text.ShouldContain(code);
        text.ShouldNotContain("GIZLI-", Case.Sensitive);

        var result = await ImportAsync(file);
        result.GetProperty("ok").GetBoolean().ShouldBeTrue(result.GetProperty("message").GetString());
        result.GetProperty("message").GetString()!.ShouldContain("KAPALI");

        var copy = await service.GetAsync(result.GetProperty("id").GetGuid());
        copy.Id.ShouldNotBe(source.Id);
        copy.IsActive.ShouldBeFalse();
        copy.PromptId.ShouldBe(prompt.Id);
        copy.DocumentId.ShouldBeNull();
        var rules = copy.Rules.OrderBy(r => r.Order).ToList();
        rules.Count.ShouldBe(2);
        rules[0].ActionType.ShouldBe(WorkflowActionType.Approve);
        rules[0].CompareValue.ShouldBe("80");
        rules[1].ActionType.ShouldBe(WorkflowActionType.Webhook);
        rules[1].ActionPayload.ShouldBeNullOrEmpty();
    }

    [Theory]
    [InlineData("{\"name\":null,\"rules\":[]}")]
    [InlineData("{\"name\":\"Elle düzenlenmiş\",\"rules\":null}")]
    public async Task Elle_bosaltilmis_alan_500_vermez_okunamadi_der(string data)
    {
        var file = Encoding.UTF8.GetBytes(
            "{\"format\":\"apya.ai-workflow\",\"version\":1,\"exportedAt\":\"2026-11-11T00:00:00\",\"data\":" + data + "}");

        var result = await ImportAsync(file);

        result.GetProperty("ok").GetBoolean().ShouldBeFalse();
        result.GetProperty("message").GetString().ShouldNotBeNullOrWhiteSpace();
    }
}
