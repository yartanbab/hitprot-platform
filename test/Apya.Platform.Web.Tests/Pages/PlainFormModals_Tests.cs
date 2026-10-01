using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Prompts.Dtos;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// <c>abp-dynamic-form</c>'dan düz forma çevrilen pencereler (CUS-02 — bkz.
/// <see cref="DynamicFormMarkup_Tests"/>). Dinamik form modelin TÜM alanlarını kendiliğinden
/// basıyordu; düz formda yalnız elle yazılan alanlar gider. Elle yazılmamış bir alanın
/// taşıdığı varsayılan ya da mevcut değer bu geçişte sessizce kaybolur.
/// </summary>
public class PlainFormModals_Tests : PlatformWebTestBase
{
    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    /// <summary>
    /// Yön radyoları sayısal değer taşır, etiket yardımcısı ise modelin enum adıyla karşılaştırır:
    /// hiçbiri seçili basılmıyordu. Yön seçilmeden "Kaydet" doğrulamada takılıyor, ekranda mesaj
    /// çıkmıyordu. Varsayılan (Satış) seçili gelir; gönderilen değerler değişmez.
    /// </summary>
    [Fact]
    public async Task Yeni_fatura_penceresi_yonu_varsayilan_secili_acar()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Invoices/CreateModal"));

        var sales = doc.DocumentNode.SelectSingleNode("//input[@id='DirSales']");
        var purchase = doc.DocumentNode.SelectSingleNode("//input[@id='DirPurchase']");
        sales.ShouldNotBeNull();
        purchase.ShouldNotBeNull();

        sales!.Attributes.Contains("checked").ShouldBeTrue("varsayılan yön (Satış) seçili gelmeli");
        purchase!.Attributes.Contains("checked").ShouldBeFalse();
        sales.GetAttributeValue("value", "").ShouldBe("0");
        purchase.GetAttributeValue("value", "").ShouldBe("1");
    }

    /// <summary>
    /// Kategori düzenleme penceresi üst kategoriyi göstermez ama GERİ göndermelidir: alan formdan
    /// düşünce güncelleme <c>SetParent(null)</c> çağırıyor, alt kategori köke taşınıyordu. Gövde,
    /// tarayıcının göndereceği gibi pencerenin KENDİ alanlarından kurulur.
    /// </summary>
    [Fact]
    public async Task Kategori_duzenleme_ust_kategoriyi_korur()
    {
        var categories = GetRequiredService<IPromptCategoryAppService>();
        var suffix = Guid.NewGuid().ToString("N").Substring(0, 6);
        var parent = await categories.CreateAsync(new CreateUpdatePromptCategoryDto { Name = "QA-UX üst " + suffix, Code = "qa-ux-ust-" + suffix });
        var child = await categories.CreateAsync(new CreateUpdatePromptCategoryDto { Name = "QA-UX alt " + suffix, Code = "qa-ux-alt-" + suffix, ParentId = parent.Id });

        var doc = Parse(await GetResponseAsStringAsync($"/AiCenter/PromptCategories/EditModal?id={child.Id}"));

        var fields = new Dictionary<string, string>();
        foreach (var input in doc.DocumentNode.SelectNodes("//form//input[@name]"))
        {
            fields[input.GetAttributeValue("name", "")] = WebUtility.HtmlDecode(input.GetAttributeValue("value", ""));
        }
        foreach (var area in doc.DocumentNode.SelectNodes("//form//textarea[@name]") ?? new HtmlNodeCollection(null))
        {
            fields[area.GetAttributeValue("name", "")] = WebUtility.HtmlDecode(area.InnerText);
        }

        fields.ShouldContainKey("Category.ParentId");
        fields["Category.ParentId"].ShouldBe(parent.Id.ToString());

        fields["Category.Name"] = "QA-UX alt (yeni ad) " + suffix;
        fields["__RequestVerificationToken"] = await AntiforgeryTokenAsync();

        var response = await Client.PostAsync("/AiCenter/PromptCategories/EditModal", new FormUrlEncodedContent(fields));
        response.StatusCode.ShouldBe(HttpStatusCode.NoContent);

        var stored = await categories.GetAsync(child.Id);
        stored.Name.ShouldBe("QA-UX alt (yeni ad) " + suffix);
        stored.ParentId.ShouldBe(parent.Id, "ad değişikliği üst kategoriyi silmemeli");
    }

    /// <summary>
    /// Pencere formları açık action taşıdığı için antiforgery jetonu basmaz (gerçekte ABP ModalManager
    /// başlıkla gönderir); jeton, jeton basan herkese açık form sayfasından alınır.
    /// </summary>
    private async Task<string> AntiforgeryTokenAsync()
    {
        var input = Parse(await GetResponseAsStringAsync("/f/qa-ux-jeton"))
            .DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");

        input.ShouldNotBeNull("antiforgery jetonu bulunamadı — POST kurulamaz");
        return input!.GetAttributeValue("value", "");
    }
}
