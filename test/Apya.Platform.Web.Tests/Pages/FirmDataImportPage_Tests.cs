using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Tenants;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// /CompanyProfile/DataImport — "Belgeden doldur". Okuma kaydı doğrudan kurulur (yapay zekâ
/// çağrılmaz; okuma servisi EF testlerinde sınanır); burada önerilerin çizimi ve kararın
/// tarayıcının göndereceği formla verilmesi sınanır.
/// </summary>
public class FirmDataImportPage_Tests : PlatformWebTestBase
{
    private static readonly Guid Cofinancing = FirmParameterCatalog.CofinancingCapacityId;

    [Fact]
    public async Task Host_baglaminda_bilgi_notu_gosterir()
    {
        var html = HtmlEntity.DeEntitize(await GetResponseAsStringAsync("/CompanyProfile/DataImport"));

        html.ShouldContain("Platform yönetim hesabının kurumsal verisi yoktur");
    }

    [Fact]
    public async Task Oneriler_alinti_sayfa_ve_mevcut_degerle_cizilir_bekleyenler_Kurumsal_Veriler_de_duyurulur()
    {
        var tenantId = await CreateTenantAsync();
        await SetValueAsync(tenantId, Cofinancing, 100_000m);
        var extractionId = await SeedExtractionAsync(tenantId);

        await WithTenantClientAsync(tenantId, async client =>
        {
            var doc = Load(await client.GetStringAsync("/CompanyProfile/DataImport?id=" + extractionId));

            var card = doc.DocumentNode.SelectSingleNode("//*[@data-firm-suggestion='cofinancing_capacity']");
            card.ShouldNotBeNull();
            card.GetAttributeValue("data-firm-suggestion-status", "").ShouldBe(nameof(FirmDataSuggestionStatus.Beklemede));
            Text(card, "data-firm-suggestion-excerpt").ShouldContain("Es finansman kapasitemiz 250000 TL");
            Text(card, "data-firm-suggestion-excerpt").ShouldContain("2. sayfa");
            Text(card, "data-firm-suggestion-value").ShouldContain("250");
            Text(card, "data-firm-suggestion-value").ShouldContain("TL");
            Text(card, "data-firm-suggestion-current").ShouldContain("100");
            Text(card, "data-firm-suggestion-current").ShouldContain("Elle girildi");
            card.SelectSingleNode(".//button[@data-firm-suggestion-accept]").ShouldNotBeNull();
            card.SelectSingleNode(".//button[@data-firm-suggestion-reject]").ShouldNotBeNull();

            var list = Load(await client.GetStringAsync("/CompanyProfile/DataImport"));
            HtmlEntity.DeEntitize(list.DocumentNode.SelectSingleNode("//*[@data-firm-import-history]").InnerText)
                .ShouldContain("faaliyet-raporu.pdf");
            HtmlEntity.DeEntitize(list.DocumentNode.SelectSingleNode("//*[@data-firm-import-pending]").InnerText)
                .ShouldContain("2 öneri bekliyor");

            var data = Load(await client.GetStringAsync("/CompanyProfile/Data"));
            HtmlEntity.DeEntitize(data.DocumentNode.SelectSingleNode("//*[@data-firm-data-pending]").InnerText)
                .ShouldContain("2 öneri onayınızı bekliyor");
        });
    }

    [Fact]
    public async Task Duzeltilerek_onaylanan_deger_yazilir_reddedilen_yazilmaz()
    {
        var tenantId = await CreateTenantAsync();
        var extractionId = await SeedExtractionAsync(tenantId);

        await WithTenantClientAsync(tenantId, async client =>
        {
            var url = "/CompanyProfile/DataImport?id=" + extractionId;

            // Tarayıcı gibi: kartın formu, düzeltilmiş değerle "Onayla".
            var (action, fields) = ReadSuggestionForm(await client.GetStringAsync(url), "cofinancing_capacity");
            Set(fields, "rawValue", "200000");
            (await client.PostAsync(action, new FormUrlEncodedContent(fields))).StatusCode.ShouldBe(HttpStatusCode.Redirect);

            // "Reddet" düğmesi kendi formaction'ına gönderir.
            var html = await client.GetStringAsync(url);
            var (_, goalFields) = ReadSuggestionForm(html, "strategic_goals");
            var reject = WebUtility.HtmlDecode(Load(html).DocumentNode
                .SelectSingleNode("//*[@data-firm-suggestion='strategic_goals']//button[@data-firm-suggestion-reject]")
                .GetAttributeValue("formaction", ""));
            (await client.PostAsync(reject, new FormUrlEncodedContent(goalFields))).StatusCode.ShouldBe(HttpStatusCode.Redirect);

            var after = Load(await client.GetStringAsync(url));
            after.DocumentNode.SelectSingleNode("//*[@data-firm-suggestion='cofinancing_capacity']")
                .GetAttributeValue("data-firm-suggestion-status", "").ShouldBe(nameof(FirmDataSuggestionStatus.DuzenlenerekKabul));
            after.DocumentNode.SelectSingleNode("//*[@data-firm-suggestion='strategic_goals']")
                .GetAttributeValue("data-firm-suggestion-status", "").ShouldBe(nameof(FirmDataSuggestionStatus.Red));
            after.DocumentNode.SelectSingleNode("//button[@data-firm-suggestion-accept]").ShouldBeNull("karar verilen öneride düğme yok");

            (await client.GetStringAsync("/CompanyProfile/Data")).ShouldNotContain("data-firm-data-pending");
        });

        var values = await ValuesAsync(tenantId);
        values.ShouldHaveSingleItem().ValueNumber.ShouldBe(200_000m);
        values.Single().Source.ShouldBe(FirmParameterSource.Kullanici);
    }

    [Fact]
    public async Task Kurala_uymayan_duzeltme_hata_olarak_gosterilir_oneri_bekler()
    {
        var tenantId = await CreateTenantAsync();
        var extractionId = await SeedExtractionAsync(tenantId);

        await WithTenantClientAsync(tenantId, async client =>
        {
            var url = "/CompanyProfile/DataImport?id=" + extractionId;
            var (action, fields) = ReadSuggestionForm(await client.GetStringAsync(url), "cofinancing_capacity");
            Set(fields, "rawValue", "-5");
            (await client.PostAsync(action, new FormUrlEncodedContent(fields))).StatusCode.ShouldBe(HttpStatusCode.Redirect);

            var after = Load(await client.GetStringAsync(url));
            HtmlEntity.DeEntitize(after.DocumentNode.SelectSingleNode("//*[@data-firm-import-error]").InnerText)
                .ShouldContain("\"Eş finansman kapasitesi (TL)\" en az 0 olabilir.");
            after.DocumentNode.SelectSingleNode("//*[@data-firm-suggestion='cofinancing_capacity']")
                .GetAttributeValue("data-firm-suggestion-status", "").ShouldBe(nameof(FirmDataSuggestionStatus.Beklemede));
        });

        (await ValuesAsync(tenantId)).ShouldBeEmpty();
    }

    [Fact]
    public async Task Aydinlatma_onayi_olmadan_yukleme_reddedilir()
    {
        var tenantId = await CreateTenantAsync();

        await WithTenantClientAsync(tenantId, async client =>
        {
            // Antiforgery jetonu oturuma bağlıdır; Kurumsal Veriler formundan alınır
            // (yükleme formu yalnız paketinde yapay zekâ olan kuruma çizilir).
            var token = Load(await client.GetStringAsync("/CompanyProfile/Data")).DocumentNode
                .SelectSingleNode("//form[@method='post']//input[@name='__RequestVerificationToken']")
                .GetAttributeValue("value", "");

            using var content = new MultipartFormDataContent
            {
                { new StringContent(token), "__RequestVerificationToken" },
                { new ByteArrayContent(new byte[] { 37, 80, 68, 70 }), "Document", "rapor.pdf" }
            };
            var response = await client.PostAsync("/CompanyProfile/DataImport", content);

            response.StatusCode.ShouldBe(HttpStatusCode.OK);
            HtmlEntity.DeEntitize(await response.Content.ReadAsStringAsync())
                .ShouldContain("aydınlatma metnini onaylamalısınız");
        });

        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        {
            (await GetRequiredService<IRepository<FirmDataExtraction, Guid>>().GetCountAsync()).ShouldBe(0);
        }
    }

    // --- Yardımcılar ---

    private async Task<Guid> CreateTenantAsync()
    {
        var created = await GetRequiredService<ITenantProfileAppService>().CreateTenantWithProfileAsync(new CreateTenantExtendedDto
        {
            Name = "belge-" + Guid.NewGuid().ToString("N")[..12],
            LegalName = "Belgeden Doldurma Test Derneği",
            AdminEmailAddress = "belge-" + Guid.NewGuid().ToString("N") + "@ornek.org",
            AdminPassword = "1q2w3E*asd",
            CompanyType = CompanyType.Association,
            TaxNumber = Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString()
        });
        return created.TenantId;
    }

    /// <summary>Yapay zekânın iki öneri döndürdüğü bir okuma: eş finansman (2. sayfa) ve stratejik hedefler.</summary>
    private async Task<Guid> SeedExtractionAsync(Guid tenantId)
    {
        // Web test tabanında WithUnitOfWorkAsync yok — UoW elle açılır.
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        Guid id;
        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        {
            var definitions = await GetRequiredService<IRepository<FirmParameterDefinition, Guid>>().GetListAsync();
            var candidates = FirmDataExtractionManager.SelectCandidates(definitions, OrganizationType.Dernek);
            var extraction = new FirmDataExtraction(
                Guid.NewGuid(), tenantId, Guid.NewGuid(), Guid.NewGuid(), "faaliyet-raporu.pdf", Guid.NewGuid(), DateTime.Now);
            var pages = new List<FirmDocumentPage>
            {
                new(1, "Faaliyet Raporu 2025"),
                new(2, "Es finansman kapasitemiz 250000 TL olarak belirlenmistir.\nHedefimiz bolgesel kalkinmadir.")
            };
            GetRequiredService<FirmDataExtractionManager>().Complete(extraction, candidates, pages,
            [
                new FirmDataProposal("cofinancing_capacity", "250000", 90, 2, "Es finansman kapasitemiz 250000 TL"),
                new FirmDataProposal("strategic_goals", "Bölgesel kalkınma", 70, 2, "Hedefimiz bolgesel kalkinmadir.")
            ], 2, false);
            await GetRequiredService<IRepository<FirmDataExtraction, Guid>>().InsertAsync(extraction, autoSave: true);
            id = extraction.Id;
        }
        await uow.CompleteAsync();
        return id;
    }

    private async Task SetValueAsync(Guid tenantId, Guid definitionId, decimal number)
    {
        using var uow = GetRequiredService<IUnitOfWorkManager>().Begin(requiresNew: true);
        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        {
            await GetRequiredService<FirmParameterManager>().SetValueAsync(
                definitionId, new FirmParameterInput(Number: number), FirmParameterOrigin.UserEntry);
        }
        await uow.CompleteAsync();
    }

    private async Task<List<FirmParameterValue>> ValuesAsync(Guid tenantId)
    {
        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        {
            return await GetRequiredService<IRepository<FirmParameterValue, Guid>>().GetListAsync();
        }
    }

    private static HtmlDocument Load(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    private static string Text(HtmlNode card, string marker)
        => HtmlEntity.DeEntitize(card.SelectSingleNode($".//*[@{marker}]").InnerText);

    /// <summary>Öneri kartının formu: gönderim adresi ve tarayıcının göndereceği alanlar.</summary>
    private static (string Action, List<KeyValuePair<string, string>> Fields) ReadSuggestionForm(string html, string code)
    {
        var form = Load(html).DocumentNode.SelectSingleNode($"//*[@data-firm-suggestion='{code}']//form[@method='post']");
        form.ShouldNotBeNull($"{code} önerisinin formu basılmadı.");

        var fields = new List<KeyValuePair<string, string>>();
        foreach (var node in form.SelectNodes(".//input[@name] | .//textarea[@name] | .//select[@name]") ?? Enumerable.Empty<HtmlNode>())
        {
            if (node.Name == "input" && node.GetAttributeValue("type", "") == "checkbox" && node.Attributes["checked"] == null)
            {
                continue;
            }
            var value = node.Name switch
            {
                "textarea" => node.InnerText,
                "select" => node.SelectSingleNode(".//option[@selected]")?.GetAttributeValue("value", "") ?? "",
                _ => node.GetAttributeValue("value", "")
            };
            fields.Add(new KeyValuePair<string, string>(node.GetAttributeValue("name", ""), WebUtility.HtmlDecode(value)));
        }
        return (WebUtility.HtmlDecode(form.GetAttributeValue("action", "")), fields);
    }

    private static void Set(List<KeyValuePair<string, string>> fields, string name, string value)
    {
        var at = fields.FindIndex(f => f.Key == name);
        at.ShouldBeGreaterThanOrEqualTo(0);
        fields[at] = new KeyValuePair<string, string>(name, value);
    }
}
