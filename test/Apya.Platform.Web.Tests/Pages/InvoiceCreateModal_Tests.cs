using System.Threading.Tasks;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// FIN-05 · Fatura penceresinde bütçe kalemi alanı vardır ve ortak finans yardımcısına "isteğe
/// bağlı" olarak bağlanır (gider/gelir penceresinde kalem, projenin kalemi varsa zorunludur;
/// faturada hiçbir zaman zorunlu değildir).
/// </summary>
public class InvoiceCreateModal_Tests : PlatformWebTestBase
{
    [Fact]
    public async Task Fatura_penceresi_istege_bagli_butce_kalemi_alanini_basar()
    {
        var html = await GetResponseAsStringAsync("/Invoices/CreateModal");

        html.ShouldContain("id=\"InvoiceInfo_BudgetLineId\"", Case.Sensitive);
        html.ShouldContain("name=\"InvoiceInfo.BudgetLineId\"", Case.Sensitive);
        html.ShouldContain("optionalLine: true", Case.Sensitive);
        // Alan sunucuda "required" basılmaz; zorunluluğu yalnız betik koyabilir ve burada koymaz.
        html.ShouldNotContain("id=\"InvoiceInfo_BudgetLineId\" required", Case.Sensitive);
    }

    [Fact]
    public async Task Fatura_penceresi_musteri_secicisi_basmaz()
    {
        // Kullanıcı kararı 2026-11-14: şimdilik müşteri (cari) yok — seçici gizli, değer gizli alanda.
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync("/Invoices/CreateModal"));

        doc.DocumentNode.SelectSingleNode("//select[@name='InvoiceInfo.CustomerId']").ShouldBeNull();
        doc.DocumentNode.SelectSingleNode("//input[@name='InvoiceInfo.CustomerId']")
            .GetAttributeValue("type", "").ShouldBe("hidden");
        doc.DocumentNode.InnerText.ShouldNotContain("Müşteri", Case.Sensitive);
    }
}
