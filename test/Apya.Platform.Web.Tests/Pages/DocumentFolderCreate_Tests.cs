using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// "Yeni klasör" penceresi (DOC-06): yalnız adla kaydedilince 500 veriyordu (boş içerik bağlamada
/// null'a dönüyor, AppDocuments.Content NOT NULL), pencere "Yeni Belge" başlığıyla klasörle ilgisiz
/// İkon/İçerik alanları soruyordu.
/// </summary>
public class DocumentFolderCreate_Tests : PlatformWebTestBase
{
    /// <summary>
    /// Pencerenin formu açık action taşıdığı için form etiketi antiforgery jetonu basmaz (gerçekte ABP
    /// ModalManager başlıkla gönderir). Jeton aynı oturumda jeton basan herhangi bir sayfadan alınır —
    /// herkese açık form sayfası (/f/{slug}) veri gerektirmeden basıyor.
    /// </summary>
    private async Task<string> AntiforgeryTokenAsync()
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync("/f/qa-ux-jeton"));

        var input = doc.DocumentNode.SelectSingleNode("//input[@name='__RequestVerificationToken']");
        input.ShouldNotBeNull("antiforgery jetonu bulunamadı — POST kurulamaz");
        return input!.GetAttributeValue("value", "");
    }

    [Fact]
    public async Task Yeni_klasor_penceresi_klasor_diliyle_ve_sade()
    {
        var html = await GetResponseAsStringAsync("/Documents/CreateModal");
        var decoded = WebUtility.HtmlDecode(html);

        decoded.ShouldContain("Yeni klasör");
        decoded.ShouldContain("Klasör adı");
        decoded.ShouldNotContain("Yeni Belge", Case.Sensitive);
        html.ShouldContain("name=\"Document.Title\"");
        html.ShouldContain("name=\"Document.ExpiryDate\"", customMessage: "Son Tarih işlevsel (hatırlatma) — kalır");
        html.ShouldNotContain("name=\"Document.Content\"");
        html.ShouldNotContain("name=\"Document.Icon\"");
    }

    [Fact]
    public async Task Yalniz_adla_klasor_olusur_bos_icerik_null_degil_bos_dize_kaydedilir()
    {
        var token = await AntiforgeryTokenAsync();
        var title = "QA-UX klasör " + Guid.NewGuid().ToString("N").Substring(0, 6);

        var response = await Client.PostAsync("/Documents/CreateModal", new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["__RequestVerificationToken"] = token,
            ["Document.Title"] = title,
            // Belge düzenleme penceresi boş textarea'yı hâlâ gönderir; bağlayıcı onu null'a çeviriyordu.
            ["Document.Content"] = ""
        }));

        response.StatusCode.ShouldBe(HttpStatusCode.NoContent);

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        var stored = (await GetRequiredService<IRepository<Document, Guid>>().GetListAsync(d => d.Title == title)).Single();
        stored.Content.ShouldBe(string.Empty);
        await uow.CompleteAsync();
    }
}
