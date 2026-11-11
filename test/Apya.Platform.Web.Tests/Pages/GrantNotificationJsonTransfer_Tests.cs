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
/// Bildirim şablonlarının JSON aktarımı: önizleme YAZMAZ, neyin değişeceğini listeler; onaydan sonra
/// eşleşen metin değişir, eksik rol kopyası eklenir. Dosyada olmayan şablona dokunulmaz.
/// </summary>
public class GrantNotificationJsonTransfer_Tests : PlatformWebTestBase
{
    private const string Page = "/Grants/NotificationTemplates";

    private async Task<JsonElement> PostAsync(string handler, byte[] file)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(Page));
        var token = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull();

        using var content = new MultipartFormDataContent();
        var part = new ByteArrayContent(file);
        part.Headers.ContentType = new MediaTypeHeaderValue("application/json");
        content.Add(part, "file", "bildirim.json");
        content.Add(new StringContent(token.GetAttributeValue("value", "")), "__RequestVerificationToken");

        using var request = new HttpRequestMessage(HttpMethod.Post, $"{Page}?handler={handler}") { Content = content };
        request.Headers.Add("X-Requested-With", "XMLHttpRequest");
        var response = await Client.SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();
        response.IsSuccessStatusCode.ShouldBeTrue(body);
        return JsonDocument.Parse(body).RootElement.Clone();
    }

    [Fact]
    public async Task Onizleme_yazmaz_onaydan_sonra_metin_doner_eksik_rol_kopyasi_eklenir()
    {
        var service = GetRequiredService<IGrantNotificationTemplateAppService>();
        var general = (await service.GetAsync()).Templates
            .First(t => t.Audience == GrantNotificationAudience.Genel && !t.IsEscalation && t.DuplicableAudiences.Count > 0);
        var audience = general.DuplicableAudiences[0];
        var code = Guid.NewGuid().ToString("N")[..6];

        // Kaynak durum: rol kopyası özel metinle; Genel kendi metniyle.
        var copy = (await service.DuplicateAsync(new DuplicateGrantNotificationTemplateInput { Id = general.Id, Audience = audience }))
            .Templates.Single(t => t.Trigger == general.Trigger && t.Audience == audience && !t.IsEscalation);
        await service.SaveAsync(new SaveGrantNotificationTemplateInput
        {
            Id = copy.Id, Subject = "Kopya konu " + code, Body = copy.Body, IsEnabled = copy.IsEnabled, InApp = copy.InApp, Email = copy.Email
        });

        var file = await (await GetResponseAsync($"{Page}?handler=Export")).Content.ReadAsByteArrayAsync();
        JsonDocument.Parse(file).RootElement.GetProperty("format").GetString().ShouldBe("apya.grant-notification-templates");

        // Hedef ortamı taklit et: kopya yok, Genel'in konusu değişmiş.
        await service.DeleteAsync(copy.Id);
        await service.SaveAsync(new SaveGrantNotificationTemplateInput
        {
            Id = general.Id, Subject = "Bozulmuş konu " + code, Body = general.Body, IsEnabled = general.IsEnabled, InApp = general.InApp, Email = general.Email
        });

        var preview = await PostAsync("Preview", file);
        preview.GetProperty("ok").GetBoolean().ShouldBeTrue(preview.GetProperty("message").GetString());
        var actions = preview.GetProperty("rows").EnumerateArray().Select(r => r.GetProperty("action").GetString()).ToList();
        actions.ShouldContain("Değişecek");
        actions.ShouldContain("Eklenecek");
        (await service.GetAsync()).Templates.Single(t => t.Id == general.Id).Subject.ShouldBe("Bozulmuş konu " + code, "önizleme yazmamalı");

        var import = await PostAsync("Import", file);
        import.GetProperty("ok").GetBoolean().ShouldBeTrue(import.GetProperty("message").GetString());

        var after = (await service.GetAsync()).Templates;
        after.Single(t => t.Id == general.Id).Subject.ShouldBe(general.Subject);
        after.Single(t => t.Trigger == general.Trigger && t.Audience == audience && !t.IsEscalation).Subject.ShouldBe("Kopya konu " + code);
    }

    [Fact]
    public async Task Ayni_dosya_ikinci_kez_degisiklik_getirmez()
    {
        var file = await (await GetResponseAsync($"{Page}?handler=Export")).Content.ReadAsByteArrayAsync();

        var preview = await PostAsync("Preview", file);

        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        preview.GetProperty("rows").GetArrayLength().ShouldBe(0);
        preview.GetProperty("message").GetString()!.ShouldContain("değişecek bir şey yok");
    }
}
