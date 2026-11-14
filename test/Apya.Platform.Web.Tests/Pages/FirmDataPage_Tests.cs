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
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// /CompanyProfile/Data — Kurumsal Veriler. Form katalogdaki tanımlardan çizilir; gönderim
/// tarayıcının yapacağı gibi (formdaki bütün alanlarla) sınanır.
/// </summary>
public class FirmDataPage_Tests : PlatformWebTestBase
{
    private static readonly Guid Cofinancing = FirmParameterCatalog.IdOf(26);
    private static readonly Guid StrategicGoals = FirmParameterCatalog.IdOf(19);
    private static readonly Guid PublicDebt = FirmParameterCatalog.IdOf(34);

    [Fact]
    public async Task Host_baglaminda_bilgi_notu_gosterir()
    {
        var html = HtmlEntity.DeEntitize(await GetResponseAsStringAsync("/CompanyProfile/Data"));

        html.ShouldContain("Platform yönetim hesabının kurumsal verisi yoktur");
    }

    [Fact]
    public async Task Kurum_gozuyle_form_tanimlardan_cizilir()
    {
        await WithTenantClientAsync(await CreateTenantAsync(), async client =>
        {
            var doc = Load(await client.GetStringAsync("/CompanyProfile/Data"));

            var cofinancing = doc.DocumentNode.SelectSingleNode("//*[@data-firm-param='cofinancing_capacity']");
            cofinancing.ShouldNotBeNull();
            cofinancing.SelectSingleNode(".//input[@type='number']").ShouldNotBeNull();
            HtmlEntity.DeEntitize(cofinancing.InnerText).ShouldContain("Eş finansman kapasitesi");
            HtmlEntity.DeEntitize(cofinancing.InnerText).ShouldContain("Henüz girilmedi");

            // Evet/hayır onay kutusu değil: işaretsiz kutu "hayır" ile "bilmiyorum"u ayıramazdı.
            var debt = doc.DocumentNode.SelectSingleNode("//*[@data-firm-param='has_public_debt']");
            debt.SelectNodes(".//select/option").Select(o => o.GetAttributeValue("value", "?"))
                .ShouldBe(new[] { "", "true", "false" });

            doc.DocumentNode.SelectSingleNode("//*[@data-firm-param='annual_revenue']")
                .ShouldBeNull("sistem parametresi bu formda sorulmaz");
        });
    }

    [Fact]
    public async Task Gonderim_girilenleri_kaydeder_bos_birakilani_bilinmiyor_birakir()
    {
        var tenantId = await CreateTenantAsync();

        await WithTenantClientAsync(tenantId, async client =>
        {
            var form = ReadForm(await client.GetStringAsync("/CompanyProfile/Data"));
            Set(form, Cofinancing, "0");
            Set(form, PublicDebt, "false");

            var response = await client.PostAsync("/CompanyProfile/Data", new FormUrlEncodedContent(form));
            response.StatusCode.ShouldBe(HttpStatusCode.Redirect);

            var after = Load(await client.GetStringAsync("/CompanyProfile/Data"));
            after.DocumentNode.SelectSingleNode("//*[@data-firm-param='cofinancing_capacity']//input[@type='number']")
                .GetAttributeValue("value", "").ShouldBe("0");
            HtmlEntity.DeEntitize(after.DocumentNode.SelectSingleNode("//*[@data-firm-param='cofinancing_capacity']//*[@data-firm-param-origin]").InnerText)
                .ShouldContain("Elle girildi");
            HtmlEntity.DeEntitize(after.DocumentNode.SelectSingleNode("//*[@data-firm-data-progress]").InnerText)
                .ShouldContain("2 /");
        });

        using (GetRequiredService<ICurrentTenant>().Change(tenantId))
        {
            var rows = await GetRequiredService<IRepository<FirmParameterValue, Guid>>().GetListAsync();
            rows.Count.ShouldBe(2, "boş bırakılan alanlar satır olarak yazılmaz");
            rows.Single(r => r.DefinitionId == Cofinancing).ValueNumber.ShouldBe(0m);
            rows.Single(r => r.DefinitionId == PublicDebt).ValueBool.ShouldBe(false);
        }
    }

    [Fact]
    public async Task Hatali_deger_sayfada_gosterilir_ve_yazilanlar_formda_kalir()
    {
        await WithTenantClientAsync(await CreateTenantAsync(), async client =>
        {
            var form = ReadForm(await client.GetStringAsync("/CompanyProfile/Data"));
            Set(form, Cofinancing, "-5");
            Set(form, StrategicGoals, "Bölgesel büyüme");

            var response = await client.PostAsync("/CompanyProfile/Data", new FormUrlEncodedContent(form));

            response.StatusCode.ShouldBe(HttpStatusCode.OK);
            var html = await response.Content.ReadAsStringAsync();
            HtmlEntity.DeEntitize(html).ShouldContain("\"Eş finansman kapasitesi (TL)\" en az 0 olabilir.");
            HtmlEntity.DeEntitize(Load(html).DocumentNode.SelectSingleNode("//*[@data-firm-param='strategic_goals']//textarea")
                .InnerText).Trim().ShouldBe("Bölgesel büyüme");
        });
    }

    // --- Yardımcılar ---

    private async Task<Guid> CreateTenantAsync()
    {
        var created = await GetRequiredService<ITenantProfileAppService>().CreateTenantWithProfileAsync(new CreateTenantExtendedDto
        {
            Name = "veri-" + Guid.NewGuid().ToString("N")[..12],
            LegalName = "Kurumsal Veri Test Derneği",
            AdminEmailAddress = "veri-" + Guid.NewGuid().ToString("N") + "@ornek.org",
            AdminPassword = "1q2w3E*asd",
            CompanyType = CompanyType.Association,
            TaxNumber = Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString()
        });
        return created.TenantId;
    }

    private static HtmlDocument Load(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    /// <summary>Formdaki alanları ve antiforgery jetonunu tarayıcının göndereceği sırayla okur.</summary>
    private static List<KeyValuePair<string, string>> ReadForm(string html)
    {
        var form = Load(html).DocumentNode.SelectSingleNode("//form[@method='post']");
        form.ShouldNotBeNull("Kurumsal veriler formu basılmadı.");

        var values = new List<KeyValuePair<string, string>>();
        foreach (var node in form.SelectNodes(".//input[@name] | .//textarea[@name] | .//select[@name]") ?? Enumerable.Empty<HtmlNode>())
        {
            var name = node.GetAttributeValue("name", "");
            var value = node.Name switch
            {
                "textarea" => node.InnerText.Trim(),
                "select" => node.SelectSingleNode(".//option[@selected]")?.GetAttributeValue("value", "") ?? "",
                _ => node.GetAttributeValue("value", "")
            };
            if (node.Name == "input" && node.GetAttributeValue("type", "") == "checkbox" && node.Attributes["checked"] == null)
            {
                continue;
            }
            values.Add(new KeyValuePair<string, string>(name, WebUtility.HtmlDecode(value)));
        }
        return values;
    }

    /// <summary>Tanım kimliğinin gizli alanını bulur ve aynı satırın değerini yazar.</summary>
    private static void Set(List<KeyValuePair<string, string>> form, Guid definitionId, string raw)
    {
        var idField = form.Single(f => f.Key.EndsWith(".DefinitionId") && f.Value == definitionId.ToString());
        var valueKey = idField.Key.Replace(".DefinitionId", ".RawValue");
        var at = form.FindIndex(f => f.Key == valueKey);
        at.ShouldBeGreaterThanOrEqualTo(0);
        form[at] = new KeyValuePair<string, string>(valueKey, raw);
    }
}
