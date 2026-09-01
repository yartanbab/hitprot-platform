using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Elle yazılan ONDALIK form alanı <c>__Invariant</c> işaretçisi İSTER.
///
/// <para>Uygulama form değerlerini <c>tr-TR</c> ile bağlar; orada ondalık ayracı
/// virgüldür ve NOKTA binlik ayracıdır. HTML <c>type="number"</c> alanı ise değeri
/// daima noktalı gönderir, <c>apya-money-input.js</c> de gizli alana noktalı
/// invariant değer yazar. İkisi de tek başına 100× (hatta 1000×) sapma üretir.</para>
///
/// <para>ASP.NET bunun çözümünü sağlıyor: <c>asp-for</c> ile basılan sayı alanının
/// yanına <c>&lt;input name="__Invariant" value="Alan.Adı" /&gt;</c> koyuyor ve o alan
/// invariant kültürle ayrıştırılıyor. ELLE <c>name="..."</c> yazılan alanlarda bu
/// işaretçi OLUŞMAZ — geliştiricinin kendisi eklemek zorundadır.</para>
///
/// <para>2026-09-02'de fatura kalemlerinde bu eksikti: miktar 2,5 ve birim fiyat
/// 1.234,56 girilen fatura 3.703,68 yerine 3.703.680 olarak kaydediliyordu.
/// Canlı denemeyle doğrulandı, düzeltildi; test tekrarını engellemek için var.</para>
/// </summary>
public class DecimalInputBinding_Tests
{
    /// <summary>Ondalık taşıdığı adından ya da step'inden belli olan alanlar.</summary>
    private static readonly string[] DecimalNameHints =
    {
        "Amount", "Rate", "Budget", "Price", "Total", "Hours", "Percent", "Quantity"
    };

    [Fact]
    public void Elle_yazilan_ondalik_alan_Invariant_isaretcisi_ister()
    {
        var offenders = new List<string>();

        foreach (var file in RazorPages())
        {
            var text = File.ReadAllText(file);

            foreach (Match tag in Regex.Matches(text, "<input[^>]*>", RegexOptions.Singleline))
            {
                var input = tag.Value;

                // Gizli alan kullanıcıdan değer almaz; adında "Budget" geçen bir bool
                // (BudgetFormRendered) bu kurala takılmasın.
                if (input.Contains("type=\"hidden\"", StringComparison.Ordinal))
                {
                    continue;
                }

                // asp-for ile basılan alana işaretçiyi ASP.NET kendisi ekler.
                if (input.Contains("asp-for=", StringComparison.Ordinal))
                {
                    continue;
                }

                var nameMatch = Regex.Match(input, "name=\"([^\"]+)\"");
                if (!nameMatch.Success || nameMatch.Groups[1].Value == "__Invariant")
                {
                    continue;
                }

                var name = nameMatch.Groups[1].Value;

                var looksDecimal = input.Contains("step=\"0.", StringComparison.Ordinal)
                                   || input.Contains("data-money-input", StringComparison.Ordinal)
                                   || DecimalNameHints.Any(h => name.Contains(h, StringComparison.Ordinal));
                if (!looksDecimal)
                {
                    continue;
                }

                // İşaretçi aynı dosyada, tam bu alan adıyla bulunmalı.
                var marker = $"name=\"__Invariant\" value=\"{name}\"";
                if (!text.Contains(marker, StringComparison.Ordinal))
                {
                    offenders.Add($"{Path.GetFileName(file)}: {name}");
                }
            }
        }

        offenders.ShouldBeEmpty(
            "Bu alanlara <input type=\"hidden\" name=\"__Invariant\" value=\"<alan adı>\" /> " +
            "eklenmeli; yoksa noktalı gelen değer tr-TR ile bağlanır ve tutar 100× büyür:" +
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
}
