using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Web.Menus;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// /Grants/FirmParameters ve /Grants/FirmParameterEdit — kurum parametre kataloğunun host yönetimi.
/// Web testleri host bağlamında koşar; gönderim formdaki bütün alanlarla, tarayıcının yapacağı gibi sınanır.
/// </summary>
public class FirmParametersPage_Tests : PlatformWebTestBase
{
    private static readonly Guid Cofinancing = FirmParameterCatalog.IdOf(26);
    private static readonly Guid AnnualRevenue = FirmParameterCatalog.IdOf(6);

    [Fact]
    public void Baglanti_katalogda_hibe_grubunda_tanimlidir()
    {
        var link = PlatformAdminLinks.All.Single(x => x.Name == "Apya.Admin.GrantFirmParameters");

        link.Url.ShouldBe("/Grants/FirmParameters");
        link.Group.ShouldBe(PlatformAdminLinks.Grants);
    }

    [Fact]
    public async Task Liste_katalogu_basar_sistem_parametresinde_sil_dugmesi_yoktur()
    {
        var doc = Load(await GetResponseAsStringAsync("/Grants/FirmParameters"));

        var cofinancing = doc.DocumentNode.SelectSingleNode("//tr[@data-firm-param='cofinancing_capacity']");
        cofinancing.ShouldNotBeNull();
        HtmlEntity.DeEntitize(cofinancing.InnerText).ShouldContain("Tutar");
        cofinancing.SelectSingleNode(".//form").ShouldNotBeNull("kullanıcı parametresi silinebilir");

        var revenue = doc.DocumentNode.SelectSingleNode("//tr[@data-firm-param='annual_revenue']");
        HtmlEntity.DeEntitize(revenue.InnerText).ShouldContain("Sistem");
        revenue.SelectSingleNode(".//form").ShouldBeNull();
    }

    [Fact]
    public async Task Yeni_parametre_formdan_eklenir_ve_ondalik_sinir_dogru_okunur()
    {
        var form = ReadForm(await GetResponseAsStringAsync("/Grants/FirmParameterEdit"));
        Set(form, "Input.Code", "export_share");
        Set(form, "Input.Name", "İhracat payı");
        Set(form, "Input.DataType", nameof(FirmParameterDataType.Percent));
        Set(form, "MinText", "0.5");
        Set(form, "MaxText", "99.5");

        var response = await Client.PostAsync("/Grants/FirmParameterEdit", new FormUrlEncodedContent(form));
        response.StatusCode.ShouldBe(HttpStatusCode.Redirect);

        var created = (await GetRequiredService<IFirmParameterAdminAppService>().GetListAsync()).Single(d => d.Code == "export_share");
        created.Name.ShouldBe("İhracat payı");
        created.DataType.ShouldBe(FirmParameterDataType.Percent);
        created.MinNumber.ShouldBe(0.5m, "Türkçe kültürde ondalık bağlama 0.5'i 5 okurdu");
        created.MaxNumber.ShouldBe(99.5m);
        created.IsActive.ShouldBeTrue();
    }

    /// <summary>
    /// 🔴 Formun doldurmadığı alan boş gönderilir ve kayıtta silinir. Yalnız adı değiştirip
    /// kaydetmek diğer özelliklere dokunmamalı.
    /// </summary>
    [Fact]
    public async Task Yalniz_adi_degistirip_kaydetmek_diger_ozellikleri_bozmaz()
    {
        var service = GetRequiredService<IFirmParameterAdminAppService>();
        var before = await service.GetAsync(Cofinancing);

        var form = ReadForm(await GetResponseAsStringAsync($"/Grants/FirmParameterEdit?id={Cofinancing}"));
        Set(form, "Input.Name", "Öz kaynak kapasitesi (TL)");
        (await Client.PostAsync("/Grants/FirmParameterEdit", new FormUrlEncodedContent(form))).StatusCode.ShouldBe(HttpStatusCode.Redirect);

        var after = await service.GetAsync(Cofinancing);
        after.Name.ShouldBe("Öz kaynak kapasitesi (TL)");
        after.Description.ShouldBe(before.Description);
        after.Group.ShouldBe(before.Group);
        after.Requirement.ShouldBe(before.Requirement);
        after.Audience.ShouldBe(before.Audience);
        after.AllowDocumentSource.ShouldBe(before.AllowDocumentSource);
        after.ValidityMonths.ShouldBe(before.ValidityMonths);
        after.MinNumber.ShouldBe(before.MinNumber);
        after.MaxNumber.ShouldBe(before.MaxNumber);
        after.MatchUsage.ShouldBe(before.MatchUsage);
        after.Version.ShouldBe(before.Version);
        after.IsActive.ShouldBe(before.IsActive);
        after.Order.ShouldBe(before.Order);
    }

    [Fact]
    public async Task Sistem_parametresi_formu_kilitli_alanlari_basmaz_ve_kaydedilebilir()
    {
        var html = await GetResponseAsStringAsync($"/Grants/FirmParameterEdit?id={AnnualRevenue}");
        Load(html).DocumentNode.SelectSingleNode("//select[@name='Input.MatchUsage']").ShouldBeNull();

        var form = ReadForm(html);
        Set(form, "Input.Name", "Yıllık net satış");
        (await Client.PostAsync("/Grants/FirmParameterEdit", new FormUrlEncodedContent(form))).StatusCode.ShouldBe(HttpStatusCode.Redirect);

        var after = await GetRequiredService<IFirmParameterAdminAppService>().GetAsync(AnnualRevenue);
        after.Name.ShouldBe("Yıllık net satış");
        after.MatchUsage.ShouldBe(FirmParameterMatchUsage.Eleme);
        after.IsActive.ShouldBeTrue();
    }

    [Fact]
    public async Task Ayni_kod_hatasi_sayfada_gosterilir()
    {
        var form = ReadForm(await GetResponseAsStringAsync("/Grants/FirmParameterEdit"));
        Set(form, "Input.Code", "cofinancing_capacity");
        Set(form, "Input.Name", "Kopya");

        var response = await Client.PostAsync("/Grants/FirmParameterEdit", new FormUrlEncodedContent(form));

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        HtmlEntity.DeEntitize(await response.Content.ReadAsStringAsync()).ShouldContain("Bu kodla bir parametre zaten var.");
    }

    // --- Yardımcılar ---

    private static HtmlDocument Load(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    /// <summary>Formdaki alanları tarayıcının göndereceği gibi okur (işaretsiz onay kutusu gönderilmez).</summary>
    private static List<KeyValuePair<string, string>> ReadForm(string html)
    {
        var form = Load(html).DocumentNode.SelectSingleNode("//form[@method='post']");
        form.ShouldNotBeNull("Parametre formu basılmadı.");

        var values = new List<KeyValuePair<string, string>>();
        foreach (var node in form.SelectNodes(".//input[@name] | .//textarea[@name] | .//select[@name]") ?? Enumerable.Empty<HtmlNode>())
        {
            if (node.Name == "input" && node.GetAttributeValue("type", "") == "checkbox" && node.Attributes["checked"] == null)
            {
                continue;
            }
            var value = node.Name switch
            {
                "textarea" => node.InnerText.Trim(),
                "select" => node.SelectSingleNode(".//option[@selected]")?.GetAttributeValue("value", "")
                            ?? node.SelectSingleNode(".//option")?.GetAttributeValue("value", "") ?? "",
                _ => node.GetAttributeValue("value", "")
            };
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
