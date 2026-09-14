using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.RegistrationRequests;
using Apya.Platform.Tenants;
using Apya.Platform.Web.Menus;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// /CompanyProfile — kurumun kendi profili.
///
/// <para>Web testleri HOST bağlamında koşar; kurum gözüyle istek için
/// <c>WithTenantClientAsync</c> (taban sınıf) kullanılır.</para>
/// </summary>
public class CompanyProfilePage_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Kurum_profili_host_baglaminda_bilgi_notu_gosterir()
    {
        var html = HtmlEntity.DeEntitize(await GetResponseAsStringAsync("/CompanyProfile"));

        html.ShouldContain("Host hesabının kurum profili yoktur");
    }

    /// <summary>Katalog kaydı ile sayfa adresi ayrışırsa Ayarlar'daki kart 404'e gider.</summary>
    [Fact]
    public void Kurum_profili_baglantisi_katalogda_kuruma_ozel_tanimlidir()
    {
        var link = PlatformAdminLinks.All.Single(x => x.Name == "Apya.Admin.CompanyProfile");

        link.Url.ShouldBe("/CompanyProfile");
        link.TenantOnly.ShouldBeTrue();
    }

    [Fact]
    public async Task Kurum_gozuyle_profil_ve_duzenleme_formu_dolu_basilir()
    {
        var tenantId = await CreateTenantAsync(UniqueTaxNumber());

        await WithTenantClientAsync(tenantId, async client =>
        {
            var view = HtmlEntity.DeEntitize(await client.GetStringAsync("/CompanyProfile"));
            view.ShouldContain("Profil Sayfası Test Derneği");
            view.ShouldContain("Yönetim Kurulu Başkanı");
            view.ShouldContain("11-50 kişi");

            var form = ReadForm(await client.GetStringAsync("/CompanyProfile?edit=true"));
            form["Input.LegalName"].ShouldBe("Profil Sayfası Test Derneği");
            form["Input.EmployeeCount"].ShouldBe(nameof(RegistrationRequestCompanySize.From11To50));
            form["Input.LegalRepresentativeTitle"].ShouldBe("Yönetim Kurulu Başkanı");
        });
    }

    /// <summary>
    /// 🔴 Formun doldurmadığı alan boş gönderilir ve kayıtta SİLİNİR. Yalnız unvanı değiştirip
    /// kaydetmek başka hiçbir alana dokunmamalı — alan eklenip form doldurucusu unutulursa bu
    /// test düşer.
    /// </summary>
    [Fact]
    public async Task Formu_yalniz_unvani_degistirerek_kaydetmek_diger_alanlari_silmez()
    {
        var taxNumber = UniqueTaxNumber();
        var tenantId = await CreateTenantAsync(taxNumber);

        await WithTenantClientAsync(tenantId, async client =>
        {
            var form = ReadForm(await client.GetStringAsync("/CompanyProfile?edit=true"));
            form["Input.LegalName"] = "Yeni Unvan Derneği";

            var response = await client.PostAsync("/CompanyProfile", new FormUrlEncodedContent(form));

            response.StatusCode.ShouldBe(HttpStatusCode.Redirect);
        });

        var profile = await GetRequiredService<IRepository<TenantProfile, Guid>>()
            .GetAsync(p => p.TenantId == tenantId);

        profile.LegalName.ShouldBe("Yeni Unvan Derneği");
        profile.CompanyType.ShouldBe(CompanyType.Association);
        profile.TaxNumber.ShouldBe(taxNumber);
        profile.TaxOffice.ShouldBe("Halkalı");
        profile.EmployeeCount.ShouldBe(RegistrationRequestCompanySize.From11To50);
        profile.Address.ShouldBe("Merkez Mah. Atatürk Cad. No:1, İstanbul");
        profile.CorporateEmail.ShouldBe("info@ornek.org");
        profile.LegalRepresentativeName.ShouldBe("Ayşe Yılmaz");
        profile.LegalRepresentativeTitle.ShouldBe("Yönetim Kurulu Başkanı");
        profile.LegalRepresentativeEmail.ShouldBe("ayse@ornek.org");
        profile.LegalRepresentativePhone.ShouldBe("05551112233");
        profile.OperationalContactName.ShouldBe("Mehmet Kaya");
        profile.OperationalContactPhone.ShouldBe("05329998877");
    }

    /// <summary>Vergi numarası çakışması 500'e değil, alanın altına mesaj olarak döner.</summary>
    [Fact]
    public async Task Baska_kurumun_vergi_numarasi_alanda_hata_olarak_doner()
    {
        var takenTaxNumber = UniqueTaxNumber();
        await CreateTenantAsync(takenTaxNumber);
        var tenantId = await CreateTenantAsync(UniqueTaxNumber());

        await WithTenantClientAsync(tenantId, async client =>
        {
            var form = ReadForm(await client.GetStringAsync("/CompanyProfile?edit=true"));
            form["Input.TaxNumber"] = takenTaxNumber;

            var response = await client.PostAsync("/CompanyProfile", new FormUrlEncodedContent(form));

            response.StatusCode.ShouldBe(HttpStatusCode.OK);
            var html = HtmlEntity.DeEntitize(await response.Content.ReadAsStringAsync());
            html.ShouldContain("Bu vergi numarası başka bir müşteriye ait");
        });
    }

    // --- Yardımcılar ---

    /// <summary>Düzenleme formundaki tüm alanları ve antiforgery jetonunu tarayıcının göndereceği hâliyle okur.</summary>
    private static Dictionary<string, string> ReadForm(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        var form = doc.DocumentNode.SelectSingleNode("//form[@method='post']");
        form.ShouldNotBeNull("Düzenleme formu basılmadı.");

        var values = new Dictionary<string, string>();

        foreach (var input in form.SelectNodes(".//input[@name]") ?? Enumerable.Empty<HtmlNode>())
        {
            values[input.GetAttributeValue("name", "")] = WebUtility.HtmlDecode(input.GetAttributeValue("value", ""));
        }

        foreach (var textarea in form.SelectNodes(".//textarea[@name]") ?? Enumerable.Empty<HtmlNode>())
        {
            values[textarea.GetAttributeValue("name", "")] = WebUtility.HtmlDecode(textarea.InnerText.Trim());
        }

        foreach (var select in form.SelectNodes(".//select[@name]") ?? Enumerable.Empty<HtmlNode>())
        {
            var selected = select.SelectSingleNode(".//option[@selected]");
            values[select.GetAttributeValue("name", "")] = selected?.GetAttributeValue("value", "") ?? "";
        }

        return values;
    }

    private async Task<Guid> CreateTenantAsync(string taxNumber)
    {
        var created = await GetRequiredService<ITenantProfileAppService>().CreateTenantWithProfileAsync(new CreateTenantExtendedDto
        {
            Name = "profil-" + Guid.NewGuid().ToString("N")[..12],
            LegalName = "Profil Sayfası Test Derneği",
            AdminEmailAddress = "profil-" + Guid.NewGuid().ToString("N") + "@ornek.org",
            AdminPassword = "1q2w3E*asd",
            CompanyType = CompanyType.Association,
            TaxNumber = taxNumber,
            TaxOffice = "Halkalı",
            CorporateEmail = "info@ornek.org",
            Address = "Merkez Mah. Atatürk Cad. No:1, İstanbul",
            LegalRepresentativeName = "Ayşe Yılmaz",
            LegalRepresentativeTitle = "Yönetim Kurulu Başkanı",
            LegalRepresentativeEmail = "ayse@ornek.org",
            LegalRepresentativePhone = "05551112233",
            OperationalContactName = "Mehmet Kaya",
            OperationalContactPhone = "05329998877",
            EmployeeCount = RegistrationRequestCompanySize.From11To50
        });

        return created.TenantId;
    }

    private static string UniqueTaxNumber()
        => Random.Shared.NextInt64(1_000_000_000L, 9_999_999_999L).ToString();
}
