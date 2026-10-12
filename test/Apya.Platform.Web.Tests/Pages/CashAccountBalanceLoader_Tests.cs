using System.IO;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// FUX-03: kasa hesaplarını bakiyeleriyle okuyan döngü tek yerde durur
/// (<c>CashAccountBalanceLoader</c>). Kasa &amp; Banka sayfası ile Finans Merkezi aynı döngüyü
/// ayrı ayrı yazıyordu ve iki kopya zamanla ayrışmıştı.
///
/// <para>Derleyici "aynı işi iki yerde yapma"yı göremez; sözleşme kaynaktan kilitlenir.</para>
/// </summary>
public class CashAccountBalanceLoader_Tests
{
    [Theory]
    [InlineData("src/Apya.Platform.Web/Pages/CashAccounts/Index.cshtml.cs")]
    [InlineData("src/Apya.Platform.Web/Pages/Finance/Index.cshtml.cs")]
    public void Sayfa_hesap_bakiyesini_ortak_yukleyiciden_okur(string relativePath)
    {
        var path = Path.Combine(WebSourceFiles.RepoRoot(), relativePath.Replace('/', Path.DirectorySeparatorChar));
        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {path}");
        var source = File.ReadAllText(path);

        source.ShouldContain("CashAccountBalanceLoader.LoadActiveAsync(");
        source.ShouldNotContain("_cashMovementAppService.GetBalanceAsync(",
            customMessage: $"{relativePath} hesap başına bakiye döngüsünü yeniden yazıyor");
    }
}
