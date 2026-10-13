using System.Threading.Tasks;
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
}
