using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Ai.Providers;
using Apya.Platform.Ai.Tenants;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// ADM-14 · AI Ayarları (/TenantManagement/AiSettings). Sağlayıcı serbest metindi: yazım hatası ("opnai")
/// kaydediliyor, hata ancak AI çağrısında çıkıyordu; doğrulama hatası alan altında görünmüyor, kayıttan sonra
/// "kaydedildi" denmiyordu. Artık sağlayıcı kayıtlı sağlayıcılardan seçilir, servis bilinmeyen adı kodla
/// reddeder, hata alanın altında ve kayıt onayı ekranda.
/// </summary>
public class AiSettingsPage_Tests : PlatformWebTestBase
{
    private const string Url = "/TenantManagement/AiSettings";
    private const string ProviderField = "Input.PreferredProvider";

    private readonly ITenantAiSettingsAppService _service;

    public AiSettingsPage_Tests()
    {
        _service = GetRequiredService<ITenantAiSettingsAppService>();
    }

    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    private static string Text(HtmlNode? node) => WebUtility.HtmlDecode(node?.InnerText ?? string.Empty).Trim();

    /// <summary>Kayıt onayı. Kabukta başka role=status bölgeleri de var; uyarı kutusuyla daraltılır.</summary>
    private static HtmlNode? SavedAlert(HtmlDocument doc)
        => doc.DocumentNode.SelectSingleNode("//div[@role='status' and contains(@class,'alert-success')]");

    private static string FieldError(HtmlDocument doc, string field)
        => Text(doc.DocumentNode.SelectSingleNode($"//span[@data-valmsg-for='{field}']"));

    private async Task<HttpResponseMessage> PostAsync(params (string Key, string Value)[] fields)
    {
        var token = Parse(await GetResponseAsStringAsync(Url)).DocumentNode
            .SelectSingleNode("//input[@name='__RequestVerificationToken']");
        token.ShouldNotBeNull("Sayfada antiforgery jetonu yok — POST kurulamaz.");

        var form = new List<KeyValuePair<string, string>>
        {
            new("__RequestVerificationToken", token!.GetAttributeValue("value", ""))
        };
        form.AddRange(fields.Select(f => new KeyValuePair<string, string>(f.Key, f.Value)));

        return await Client.PostAsync(Url, new FormUrlEncodedContent(form));
    }

    /// <summary>Servis okuması tuzağı gizleyebilir: yeni iş biriminde doğrudan depodan okunur.</summary>
    private async Task<TenantAiSettings> ReadStoredAsync()
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        var entity = await GetRequiredService<IRepository<TenantAiSettings, Guid>>().FirstAsync(x => x.TenantId == null);
        await uow.CompleteAsync();
        return entity;
    }

    [Fact]
    public async Task Saglayici_alani_kayitli_saglayicilardan_secim_listesidir()
    {
        var doc = Parse(await GetResponseAsStringAsync(Url));

        var select = doc.DocumentNode.SelectSingleNode($"//select[@name='{ProviderField}']");
        select.ShouldNotBeNull("sağlayıcı seçim listesi olmalı");
        doc.DocumentNode.SelectSingleNode($"//input[@name='{ProviderField}']").ShouldBeNull("serbest metin alanı kalmamalı");

        var options = select!.SelectNodes(".//option").ToList();
        options.Select(o => o.GetAttributeValue("value", "")).ShouldBe(await _service.GetProviderNamesAsync());
        options.Select(Text).ShouldBe(new[] { "OpenAI", "Claude", "Gemini", "DeepSeek" });

        // Kayıtlı değer (yeni satırın varsayılanı) seçili gelir; yer tutucu basılmaz.
        options.Single(o => o.Attributes.Contains("selected")).GetAttributeValue("value", "").ShouldBe("openai");
    }

    [Fact]
    public async Task Dogrulama_mesaji_yerleri_basilir()
    {
        var doc = Parse(await GetResponseAsStringAsync(Url));

        foreach (var field in new[] { ProviderField, "Input.PreferredModel", "Input.MonthlyTokenQuota" })
        {
            doc.DocumentNode.SelectSingleNode($"//span[@data-valmsg-for='{field}']")
                .ShouldNotBeNull($"{field} için alan altı mesaj yeri yok");
        }

        var tenantSelect = doc.DocumentNode.SelectSingleNode("//select[@name='TenantId']");
        tenantSelect.ShouldNotBeNull();
        var id = tenantSelect!.GetAttributeValue("id", "");
        id.ShouldBe("AiTenantSelect");
        doc.DocumentNode.SelectSingleNode($"//label[@for='{id}']").ShouldNotBeNull("kiracı seçicinin etiketi bağlı olmalı");

        // Geçersiz kayıtlı sağlayıcıda boş seçim, kota sıfırlamayı istemci doğrulamasına takmasın.
        doc.DocumentNode.SelectSingleNode("//button[contains(@formaction,'handler=Reset')]")!
            .Attributes.Contains("formnovalidate").ShouldBeTrue();
    }

    [Fact]
    public async Task Gecerli_kayit_yonlenir_ve_kaydedildi_mesaji_gorunur()
    {
        var response = await PostAsync(
            (ProviderField, "claude"),
            ("Input.PreferredModel", "qa-ux-model"),
            ("Input.MonthlyTokenQuota", "5000"),
            ("Input.IsEnabled", "true"));

        response.StatusCode.ShouldBe(HttpStatusCode.Redirect);

        var stored = await ReadStoredAsync();
        stored.PreferredProvider.ShouldBe("claude");
        stored.PreferredModel.ShouldBe("qa-ux-model");
        stored.MonthlyTokenQuota.ShouldBe(5000);

        var doc = Parse(await GetResponseAsStringAsync(response.Headers.Location!.ToString()));
        Text(SavedAlert(doc)).ShouldBe("Ayarlar kaydedildi.");
        doc.DocumentNode.SelectSingleNode($"//select[@name='{ProviderField}']/option[@selected]")!
            .GetAttributeValue("value", "").ShouldBe("claude");

        // Onay bir kez görünür.
        SavedAlert(Parse(await GetResponseAsStringAsync(Url))).ShouldBeNull();
    }

    [Fact]
    public async Task Bilinmeyen_saglayici_ayni_sayfada_alan_alti_hata_verir_kayit_degismez()
    {
        var response = await PostAsync(
            (ProviderField, "opnai"),
            ("Input.PreferredModel", "qa-ux-model"),
            ("Input.MonthlyTokenQuota", "5000"),
            ("Input.IsEnabled", "true"));

        // 500 (istisna) ya da 302 (kaydedildi) değil: form aynı sayfada yeniden çizilir.
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        var doc = Parse(await response.Content.ReadAsStringAsync());

        var error = FieldError(doc, ProviderField);
        error.ShouldContain("kayıtlı bir AI sağlayıcısı değil");
        error.ShouldContain("opnai");
        doc.DocumentNode.SelectSingleNode("//input[@name='Input.PreferredModel']")!
            .GetAttributeValue("value", "").ShouldBe("qa-ux-model", "yazılan değer korunmalı");
        // Geçersiz değer listede yok: boş yer tutucu basılır, sessizce ilk sağlayıcı seçilmez.
        doc.DocumentNode.SelectSingleNode($"//select[@name='{ProviderField}']/option[@value='']").ShouldNotBeNull();
        SavedAlert(doc).ShouldBeNull();

        var stored = await ReadStoredAsync();
        stored.PreferredProvider.ShouldBe("openai", "reddedilen kayıt yazılmamalı");
        stored.PreferredModel.ShouldBe("gpt-4o-mini", "reddedilen kayıttan model yazılmamalı");
    }

    [Fact]
    public async Task Bos_saglayici_ayni_sayfada_zorunlu_alan_mesaji_verir()
    {
        var response = await PostAsync(
            (ProviderField, ""),
            ("Input.PreferredModel", "qa-ux-model"),
            ("Input.MonthlyTokenQuota", "5000"),
            ("Input.IsEnabled", "true"));

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        var doc = Parse(await response.Content.ReadAsStringAsync());

        FieldError(doc, ProviderField).ShouldNotBeNullOrWhiteSpace();
        (await ReadStoredAsync()).PreferredModel.ShouldBe("gpt-4o-mini", "geçersiz form kaydedilmemeli");
    }

    [Fact]
    public async Task Servis_bilinmeyen_saglayiciyi_kodla_reddeder_ve_kanonik_adi_saklar()
    {
        await _service.UpdateAsync(null, new UpdateTenantAiSettingsDto { PreferredProvider = " OpenAI ", PreferredModel = "m1" });
        (await ReadStoredAsync()).PreferredProvider.ShouldBe("openai");

        var ex = await Should.ThrowAsync<BusinessException>(() =>
            _service.UpdateAsync(null, new UpdateTenantAiSettingsDto { PreferredProvider = "anthropic", PreferredModel = "m2" }));

        ex.Code.ShouldBe(PlatformDomainErrorCodes.AiProviderUnknown);
        ex.Data["Provider"].ShouldBe("anthropic");
        (await ReadStoredAsync()).PreferredModel.ShouldBe("m1", "reddedilen çağrı varlığa dokunmamalı");
    }

    /// <summary>AI Merkezi'ndeki tür listesi ile çalıştırılabilir sağlayıcılar ayrışırsa düşer.</summary>
    [Fact]
    public async Task Kayitli_saglayicilar_AI_Merkezi_turleriyle_birebir()
    {
        (await _service.GetProviderNamesAsync())
            .ShouldBe(Enum.GetNames<AiProviderType>().Select(n => n.ToLowerInvariant()), ignoreOrder: true);
    }

    [Fact]
    public async Task Kayitli_deger_gecersizse_bos_secim_ve_uyari_basilir()
    {
        await _service.GetAsync(null); // satırı açar
        using (var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true))
        {
            var repository = GetRequiredService<IRepository<TenantAiSettings, Guid>>();
            var entity = await repository.FirstAsync(x => x.TenantId == null);
            entity.SetProvider("anthropic", "qa-ux-eski-model"); // serbest metin döneminden kalan kayıt
            await repository.UpdateAsync(entity, autoSave: true);
            await uow.CompleteAsync();
        }

        var html = await GetResponseAsStringAsync(Url);
        var doc = Parse(html);

        var options = doc.DocumentNode.SelectNodes($"//select[@name='{ProviderField}']/option").ToList();
        options.First().GetAttributeValue("value", "x").ShouldBe("", "ilk seçenek boş yer tutucu olmalı");
        Text(options.First()).ShouldBe("Sağlayıcı seçin…");
        options.Where(o => o.Attributes.Contains("selected")).Select(o => o.GetAttributeValue("value", "x"))
            .ShouldAllBe(v => v == "", "geçersiz kayıt sessizce bir sağlayıcıya eşlenmemeli");
        options.Skip(1).Select(o => o.GetAttributeValue("value", "")).ShouldBe(await _service.GetProviderNamesAsync());
        WebUtility.HtmlDecode(html).ShouldContain("Kayıtlı sağlayıcı “anthropic” geçerli değil");
    }
}
