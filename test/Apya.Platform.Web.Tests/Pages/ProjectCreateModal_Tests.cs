using System.Threading.Tasks;
using Apya.Platform.Projects;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Proje oluşturma formunun açılış durumu. Seçili kategori gizli alanda (<c>#PfCategory</c>)
/// taşınır; kartları işaretleyen JS onu okur.
/// </summary>
public class ProjectCreateModal_Tests : PlatformWebTestBase
{
    private static HtmlDocument Parse(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);
        return doc;
    }

    /// <summary>
    /// 🔴 PRJ-10: Varsayılan "Hibe Projesi"ydi — formu açan herkes aksini seçmedikçe
    /// projesini hibe projesi olarak kaydediyordu. Kategori, Finans Merkezi'nin sekme
    /// setini ve hibe alanlarını belirlediği için sıradan proje sessizce yanlış
    /// şablonla doğuyordu. Hibe projesi dönüşümde zaten doğru kategoriyle açılıyor.
    /// </summary>
    [Fact]
    public async Task Varsayilan_Kategori_Diger()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Projects/CreateModal"));

        var hidden = doc.DocumentNode.SelectSingleNode("//input[@id='PfCategory']");
        hidden.ShouldNotBeNull("seçili kategori gizli alanda taşınır");

        hidden!.GetAttributeValue("value", string.Empty)
            .ShouldBe(ProjectCategoryConsts.SystemIds.Other.ToString(),
                "form 'Diğer' ile açılmalı; 'Hibe Projesi' varsayılanı sıradan projeyi yanlış etiketliyordu");
    }

    /// <summary>
    /// PRJ-06 · Bütçe yetkisi OLAN kullanıcı bütçe alanını görmeye devam eder (bu barındırıcı
    /// her izne evet der). Yetkisiz yol <c>ProjectCreateBudgetPermission_Tests</c>'te.
    /// </summary>
    [Fact]
    public async Task Butce_yetkisi_olana_butce_alani_gosterilir()
    {
        var doc = Parse(await GetResponseAsStringAsync("/Projects/CreateModal"));

        doc.DocumentNode.SelectSingleNode("//input[@id='PfBudgetDisplay']")
            .ShouldNotBeNull("yetkili kullanıcı bütçeyi oluştururken girebilmeli");
    }

    /// <summary>Üç sistem kategorisinin kartı da formda olmalı — varsayılan değişimi kart setini daraltmaz.</summary>
    [Fact]
    public async Task Kategori_Kartlari_Formda()
    {
        var html = await GetResponseAsStringAsync("/Projects/CreateModal");

        html.ShouldContain(ProjectCategoryConsts.SystemIds.Other.ToString());
        html.ShouldContain(ProjectCategoryConsts.SystemIds.GrantProject.ToString());
        html.ShouldContain(ProjectCategoryConsts.SystemIds.Event.ToString());
    }
}
