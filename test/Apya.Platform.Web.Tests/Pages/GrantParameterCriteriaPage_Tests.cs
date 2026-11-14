using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>/Grants/ParameterCriteria — programın kurum parametrelerine koyduğu ölçütlerin host ekranı.</summary>
public class GrantParameterCriteriaPage_Tests : PlatformWebTestBase
{
    private static readonly Guid PublicDebt = FirmParameterCatalog.IdOf(34);

    private async Task<Guid> CreateGrantAsync(int? supportRate = null)
    {
        var grant = new Grant(Guid.NewGuid(), "Ölçüt sayfası programı", "Kurum", 0m, 0) { SupportRatePercent = supportRate };
        await GetRequiredService<IRepository<Grant, Guid>>().InsertAsync(grant, autoSave: true);
        return grant.Id;
    }

    [Fact]
    public async Task Sayfa_programi_es_finansman_notunu_ve_ekleme_formunu_basar()
    {
        var grantId = await CreateGrantAsync(supportRate: 75);

        var html = HtmlEntity.DeEntitize(await GetResponseAsStringAsync($"/Grants/ParameterCriteria?grantId={grantId}"));

        html.ShouldContain("Ölçüt sayfası programı");
        html.ShouldContain("Bu program %25 eş finansman istiyor");
        html.ShouldContain("Bu program için henüz parametre ölçütü yok.");
        html.ShouldContain("Vadesi geçmiş kamu borcu");
    }

    [Fact]
    public async Task Formdan_eklenen_olcut_listede_gorunur_ve_silinir()
    {
        var grantId = await CreateGrantAsync();
        var url = $"/Grants/ParameterCriteria?grantId={grantId}";

        var form = ReadForm(await GetResponseAsStringAsync(url), "Add");
        Set(form, "Input.DefinitionId", PublicDebt.ToString());
        Set(form, "Input.Operator", nameof(GrantParameterOperator.Esit));
        Set(form, "Input.Value", "false");
        (await Client.PostAsync(url + "&handler=Add", new FormUrlEncodedContent(form))).StatusCode.ShouldBe(HttpStatusCode.Redirect);

        var service = GetRequiredService<IGrantParameterCriterionAppService>();
        var criterion = (await service.GetAsync(grantId)).Criteria.Single();
        criterion.ParameterName.ShouldBe("Vadesi geçmiş kamu borcu");
        criterion.IsEliminating.ShouldBeTrue("kutu işaretli gelir ve işaretli gönderilir");

        var listHtml = await GetResponseAsStringAsync(url);
        HtmlEntity.DeEntitize(listHtml).ShouldContain("Hayır");

        var deleteForm = ReadForm(listHtml, "Delete");
        (await Client.PostAsync(url + $"&handler=Delete&id={criterion.Id}", new FormUrlEncodedContent(deleteForm)))
            .StatusCode.ShouldBe(HttpStatusCode.Redirect);
        (await service.GetAsync(grantId)).Criteria.ShouldBeEmpty();
    }

    [Fact]
    public async Task Gecersiz_karsilastirma_sayfada_hata_olarak_gosterilir()
    {
        var grantId = await CreateGrantAsync();
        var url = $"/Grants/ParameterCriteria?grantId={grantId}";

        var form = ReadForm(await GetResponseAsStringAsync(url), "Add");
        Set(form, "Input.DefinitionId", PublicDebt.ToString());
        Set(form, "Input.Operator", nameof(GrantParameterOperator.EnAz));
        Set(form, "Input.Value", "false");

        var response = await Client.PostAsync(url + "&handler=Add", new FormUrlEncodedContent(form));

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        HtmlEntity.DeEntitize(await response.Content.ReadAsStringAsync()).ShouldContain("Bu karşılaştırma");
    }

    // --- Yardımcılar ---

    /// <summary>Adresinde verilen işleyici geçen formun alanlarını tarayıcının göndereceği gibi okur.</summary>
    private static List<KeyValuePair<string, string>> ReadForm(string html, string handler)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var form = doc.DocumentNode.SelectNodes("//form[@method='post']")?
            .FirstOrDefault(f => f.GetAttributeValue("action", "").Contains("handler=" + handler, StringComparison.OrdinalIgnoreCase));
        form.ShouldNotBeNull(handler + " formu basılmadı.");

        var values = new List<KeyValuePair<string, string>>();
        foreach (var node in form.SelectNodes(".//input[@name] | .//select[@name]") ?? Enumerable.Empty<HtmlNode>())
        {
            if (node.Name == "input" && node.GetAttributeValue("type", "") == "checkbox" && node.Attributes["checked"] == null)
            {
                continue;
            }
            var value = node.Name == "select"
                ? node.SelectSingleNode(".//option[@selected]")?.GetAttributeValue("value", "")
                  ?? node.SelectSingleNode(".//option")?.GetAttributeValue("value", "") ?? ""
                : node.GetAttributeValue("value", "");
            values.Add(new KeyValuePair<string, string>(node.GetAttributeValue("name", ""), HtmlEntity.DeEntitize(value)));
        }
        return values;
    }

    private static void Set(List<KeyValuePair<string, string>> form, string name, string value)
    {
        var at = form.FindIndex(f => f.Key == name);
        at.ShouldBeGreaterThanOrEqualTo(0, name + " alanı formda yok");
        form[at] = new KeyValuePair<string, string>(name, value);
    }
}
