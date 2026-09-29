using System.IO;
using System.Threading.Tasks;
using Apya.Platform.Dashboard;
using Apya.Platform.Dashboard.Dtos;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Genel Bakış finans kartlarının kilit sözleşmesi C# → JS arasında AD ile bağlı (SHL-15, ROL-06):
/// sunucu <c>Locked</c> / <c>Items</c> yazar, kartlar ve baskı çıktısı <c>.locked</c> / <c>.items</c>
/// okur. Ad değişirse (Locked → IsLocked) derleyici değil bu test kırmızı verir; kaynak okuyan
/// sözleşme testi, bkz. <see cref="AdminLoadFailureScripts_Tests"/>.
/// </summary>
public class DashboardLockContract_Tests
{
    private static string ReadSource(params string[] relative)
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynaklar depodan okunur.
        var root = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..");
        var path = Path.Combine(root, Path.Combine(relative));

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path).Replace("\r\n", "\n");
    }

    private static string Card(string name) => ReadSource(
        "src", "Apya.Platform.Web", "wwwroot", "dynamic-assets", "src", "dashboard", "cards", name);

    private static string PrintView() => ReadSource(
        "src", "Apya.Platform.Web", "wwwroot", "dynamic-assets", "src", "dashboard", "print", "DashboardPrintView.jsx");

    [Fact]
    public void Sunucu_kilit_bayraklarini_Locked_ve_Items_adlariyla_tasir()
    {
        typeof(IncomeExpenseDto).GetProperty("Locked")!.PropertyType.ShouldBe(typeof(bool));
        typeof(PendingApprovalListDto).GetProperty("Locked")!.PropertyType.ShouldBe(typeof(bool));
        typeof(PendingApprovalListDto).GetProperty("Items").ShouldNotBeNull();

        typeof(IDashboardAppService).GetMethod(nameof(IDashboardAppService.GetPendingApprovalsAsync))!
            .ReturnType.ShouldBe(typeof(Task<PendingApprovalListDto>));
        typeof(DashboardController).GetMethod(nameof(DashboardController.GetPendingApprovalsAsync))!
            .ReturnType.ShouldBe(typeof(Task<PendingApprovalListDto>));
    }

    [Fact]
    public void Kartlar_ve_baski_ciktisi_ayni_adlari_okur()
    {
        var approvals = Card("ApprovalsCard.jsx");
        approvals.ShouldContain("data?.locked === true");
        approvals.ShouldContain("data?.items");
        // Yayın öncesi kalıcı önbellekteki eski dizi şekli çökmesin.
        approvals.ShouldContain("Array.isArray(data)");

        Card("IncomeExpenseCard.jsx").ShouldContain("data?.locked === true");

        var print = PrintView();
        print.ShouldContain("data?.locked === true");
        print.ShouldContain("data?.items");
        print.ShouldContain("Array.isArray(data)");
    }
}
