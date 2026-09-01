using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Form'a bağlanan ONDALIK alan <c>type="number"</c> OLAMAZ.
///
/// <para>HTML sayı alanının gönderdiği değer daima "valid floating-point number"dır,
/// yani ondalık ayracı <c>.</c>'tır — tarayıcının dili ne olursa olsun. Uygulama ise
/// istekleri <c>tr-TR</c> ile bağlıyor; orada ayraç <c>,</c>. Sonuç: kullanıcının
/// girdiği <c>1234,56</c> tarayıcıda <c>1234.56</c> olarak POST edilir ve sunucuda
/// <c>123456</c> olarak bağlanır — para alanında YÜZ KAT hata, hiçbir uyarı olmadan.</para>
///
/// <para>Doğru desen <c>abp-input</c>'un ürettiğidir: <c>type="text"</c> + kültüre göre
/// biçimlenmiş değer. Elle yazılan alanlarda <c>type="text" inputmode="decimal"</c>.</para>
///
/// <para>Bu kural YALNIZ form'a bağlanan (<c>asp-for</c> ya da <c>name="..."</c>) alanlar
/// içindir. Değeri JS ile okunup JSON gövdede giden alanlar etkilenmez: System.Text.Json
/// invariant kültürle ayrıştırır, nokta oradadır ve doğrudur.</para>
///
/// <para>2026-09-01'de iki yerde bu hata yapıldı (görev bütçesi ve bağlam sihirbazı);
/// ikisi de canlı denemede 100× sapma verdi. Test o yüzden var.</para>
/// </summary>
public class DecimalInputBinding_Tests
{
    /// <summary>
    /// MEVCUT BORÇ — bu alanlar tarama eklendiğinde (2026-09-02) zaten vardı ve
    /// BU OTURUMDA DOĞRULANMADI. Fatura alanlarında <c>data-money-input</c> var;
    /// o yardımcı görünür alanı text'e çevirip ham değeri gizli input'ta taşıyor,
    /// dolayısıyla davranışları farklı olabilir. Listeyi UZATMAYIN: yeni alanda
    /// kural <c>type="text" inputmode="decimal"</c> ya da <c>abp-input</c>.
    /// </summary>
    private static readonly string[] KnownDebt =
    {
        // Fatura kalemi alanlarinin hepsi (miktar + birim fiyat, sunucu satiri ve
        // JS sablonu). Tek girdi: JS sablonundaki ${itemIndex} kacisi bu dosyada
        // yeniden kacirmak zorunda kalmadan eslessin.
        "InvoiceInfo.Items[",
        "InvoiceInfo.TaxRate",
        "Task.EstimatedHours",
    };

    /// <summary>Ondalık taşıdığı adından belli olan alanlar.</summary>
    private static readonly string[] DecimalNameHints =
    {
        "Amount", "Rate", "Budget", "Price", "Total", "Hours", "Percent"
    };

    [Fact]
    public void Forma_baglanan_ondalik_alan_type_number_OLAMAZ()
    {
        var offenders = new List<string>();

        foreach (var file in RazorPages())
        {
            var text = File.ReadAllText(file);

            foreach (Match tag in Regex.Matches(text, "<input[^>]*>", RegexOptions.Singleline))
            {
                var input = tag.Value;

                if (!input.Contains("type=\"number\"", StringComparison.Ordinal))
                {
                    continue;
                }

                // Form'a bağlanmayan alan (JS'in okuduğu, yalnız id'li) bu kuralın dışında.
                var bound = input.Contains("asp-for=", StringComparison.Ordinal)
                            || input.Contains("name=", StringComparison.Ordinal);
                if (!bound)
                {
                    continue;
                }

                // Tam sayı alanları (adet, sıra, gün) sorunsuz: ayraç hiç yok.
                var looksDecimal = input.Contains("step=\"0.", StringComparison.Ordinal)
                                   || DecimalNameHints.Any(h => input.Contains(h, StringComparison.Ordinal));
                if (!looksDecimal)
                {
                    continue;
                }

                if (KnownDebt.Any(d => input.Contains(d, StringComparison.Ordinal)))
                {
                    continue;
                }

                offenders.Add($"{Path.GetFileName(file)}: {Collapse(input)}");
            }
        }

        offenders.ShouldBeEmpty(
            "Bu alanlar type=\"text\" inputmode=\"decimal\" olmalı (ya da abp-input kullanmalı); " +
            "type=\"number\" NOKTALI gönderir, tr-TR bağlaması 100× sapma üretir:" +
            Environment.NewLine + string.Join(Environment.NewLine, offenders));
    }

    private static IEnumerable<string> RazorPages()
    {
        var root = FindWebProjectRoot();
        return Directory.EnumerateFiles(Path.Combine(root, "Pages"), "*.cshtml", SearchOption.AllDirectories);
    }

    private static string FindWebProjectRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null)
        {
            var candidate = Path.Combine(dir.FullName, "src", "Apya.Platform.Web");
            if (Directory.Exists(candidate))
            {
                return candidate;
            }

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Apya.Platform.Web proje kökü bulunamadı.");
    }

    private static string Collapse(string s)
        => Regex.Replace(s, @"\s+", " ").Trim();

    /// <summary>
    /// Borç listesi ÖLÜ girdi biriktirmesin: listedeki bir alan düzeltilip
    /// kaldırıldığında girdisi de silinmeli, yoksa liste zamanla anlamsızlaşır.
    /// </summary>
    [Fact]
    public void Borc_listesindeki_her_girdi_hala_kodda_karsiligi_olan_bir_alandir()
    {
        var all = string.Concat(RazorPages().Select(File.ReadAllText));

        foreach (var entry in KnownDebt)
        {
            all.ShouldContain(entry,
                customMessage: $"'{entry}' artık kodda yok — KnownDebt listesinden çıkarın.");
        }
    }
}
