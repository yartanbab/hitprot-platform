using System.Threading.Tasks;
using HtmlAgilityPack;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Tutar alanlarına giriş maskesi (<c>data-money-input</c>) BAĞLANDIĞINI doğrular.
///
/// <para>Maske <c>abp-input</c> üzerine yazılıyor; öznitelik render edilen
/// <c>&lt;input&gt;</c>'a geçmezse maske sessizce devre dışı kalır — derleme de,
/// JS testleri de bunu yakalayamaz. Bu test o boşluğu kapatır.</para>
///
/// <para>2026-09-03 ölçümü (bu suite'in dökümünden): ABP <c>decimal</c> alanı
/// <c>type="text"</c> ve <c>value="0,00"</c> olarak basıyor, ve bu alanlara
/// <c>__Invariant</c> işaretçisi KOYMUYOR (işaretçi yalnız tarih ve <c>int</c>
/// alanlarda çıkıyor). Yani alan tr-TR ile bağlanır; maskenin gizli alana
/// virgüllü değer yazması ŞART. Noktalı yazsaydı 1.234,56 → 123456 olurdu.
/// Maske bunu çalışma anında işaretçiye bakarak seçiyor; iki dal da
/// apyaMoneyInput.test.js'te ayrı ayrı test ediliyor.</para>
/// </summary>
public class MoneyInputMask_Tests : PlatformWebTestBase
{
    [Theory]
    [InlineData("/Expenses/CreateModal", "Expense.Amount")]
    [InlineData("/Incomes/CreateModal", "Income.Amount")]
    [InlineData("/CashMovements/CreateModal", "Movement.Amount")]
    [InlineData("/Grants/CreateModal", "Grant.MaxAmount")]
    public async Task Tutar_alani_maskeye_baglanir(string url, string fieldName)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(url));

        var input = doc.DocumentNode.SelectSingleNode($"//input[@name='{fieldName}']");
        input.ShouldNotBeNull($"{url} sayfasında '{fieldName}' alanı basılmadı.");

        input.GetAttributeValue("data-money-input", null)
            .ShouldNotBeNull(
                $"'{fieldName}' alanına data-money-input geçmemiş — maske devre dışı. " +
                "abp-input özniteliği render edilen input'a aktarıyor mu, ona bak.");
    }
}
