using System.IO;
using System.Threading.Tasks;
using Apya.Platform.Dashboard;
using Apya.Platform.Dashboard.Dtos;
using Apya.Platform.Permissions;
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

    /// <summary>
    /// Ham izin kodu ("Platform.Invoices") müşteri yüzeyine basılmaz (canlı doğrulama L3 E7): istatistik
    /// kutucukları ve baskı, sunucunun KOD olarak yolladığı <c>RequiredPermission</c>'ı izin tanımının
    /// görünen adına çevirir. İki uç BİÇİMLE bağlı: sunucu kodları " + " ile birleştirir, JS aynı ayraçla
    /// böler ve "Platform." önekini atıp "Permission:" ekleyerek yerelleştirme anahtarını kurar
    /// (anahtarın izin tanımındaki adla eşleştiği Application.Tests DashboardStatisticsProvider_Tests'te).
    /// İki izin " + " ile değil iki yer tutuculu metinle birleşir.
    /// </summary>
    [Fact]
    public void Izin_kodu_gorunen_ada_ayni_ayrac_ve_onekle_cevrilir()
    {
        var provider = ReadSource("src", "Apya.Platform.Application", "Dashboard", "DashboardStatisticsProvider.cs");
        provider.ShouldContain("RequiredPermission = string.Join(\" + \", def.Permissions)");

        var band = Card("StatisticsBand.jsx");
        band.ShouldContain(".split(' + ')");
        band.ShouldContain("`Permission:${code.replace(/^" + PlatformPermissions.GroupName + "\\./, '')}`");
        band.ShouldContain("t('Dashboard:Stat:PermissionPair'");
    }

    [Fact]
    public void Kutucuklar_ve_baski_ham_izin_kodu_basmaz()
    {
        var band = Card("StatisticsBand.jsx");
        var strip = Card("StatStripCard.jsx");
        var print = PrintView();

        // Sunucudan gelen kod doğrudan basılmaz; her kullanım permissionLabel'dan geçer.
        band.ShouldNotContain("{stat.requiredPermission}");
        print.ShouldNotContain("{stat.requiredPermission}");
        band.ShouldContain("{permissionLabel(stat.requiredPermission)}");
        print.ShouldContain("{permissionLabel(stat.requiredPermission)}");

        // Koda gömülü izin kodu da kalmadı: özet şeridinin iki kilidi (ekran + kağıt) görünen adı
        // izin tanımının anahtarından alır.
        foreach (var source in new[] { strip, print })
        {
            source.ShouldNotContain("\"" + PlatformPermissions.GroupName + ".");
            source.ShouldNotContain(">" + PlatformPermissions.GroupName + ".");
            source.ShouldContain("t('Permission:Invoices'");
            source.ShouldContain("t('Permission:Projects.ViewBudget'");
        }
    }
}
