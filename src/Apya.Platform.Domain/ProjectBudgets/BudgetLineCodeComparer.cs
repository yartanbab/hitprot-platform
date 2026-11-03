using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace Apya.Platform.ProjectBudgets;

/// <summary>
/// Kalem kodlarını SAYI sırasıyla karşılaştırır: "1" &lt; "2" &lt; "2.1" &lt; "2.2" &lt; "2.10" &lt; "10".
/// Alfabetik sıralama "10"u "2"nin önüne koyar; donör kodlaması böyle okunmaz.
///
/// Kod rakam ve harf parçalarına bölünür, ayraçlar ("." "-" "/" boşluk) yok sayılır;
/// rakam parçaları sayı olarak, harf parçaları büyük/küçük harf ayırmadan kıyaslanır.
/// Kısa olan önek önce gelir ("2" &lt; "2.1"). Kodsuz kalem en sona düşer.
/// </summary>
public sealed class BudgetLineCodeComparer : IComparer<string?>
{
    public static readonly BudgetLineCodeComparer Instance = new();

    private static readonly Regex Tokens = new(@"\d+|[^\W\d_]+", RegexOptions.Compiled);

    public int Compare(string? x, string? y)
    {
        var xEmpty = string.IsNullOrWhiteSpace(x);
        var yEmpty = string.IsNullOrWhiteSpace(y);
        if (xEmpty || yEmpty)
            return xEmpty == yEmpty ? 0 : xEmpty ? 1 : -1;

        var xs = Tokens.Matches(x!);
        var ys = Tokens.Matches(y!);

        for (var i = 0; i < Math.Min(xs.Count, ys.Count); i++)
        {
            var a = xs[i].Value;
            var b = ys[i].Value;
            var aNum = char.IsDigit(a[0]);
            var bNum = char.IsDigit(b[0]);

            int result;
            if (aNum && bNum)
            {
                // Uzunluk önce: baştaki sıfırlar atılınca uzun olan büyüktür — taşmasız.
                var at = a.TrimStart('0');
                var bt = b.TrimStart('0');
                result = at.Length != bt.Length
                    ? at.Length.CompareTo(bt.Length)
                    : string.CompareOrdinal(at, bt);
            }
            else if (aNum != bNum)
            {
                result = aNum ? -1 : 1;
            }
            else
            {
                result = string.Compare(a, b, StringComparison.OrdinalIgnoreCase);
            }

            if (result != 0)
                return result;
        }

        var byLength = xs.Count.CompareTo(ys.Count);
        return byLength != 0 ? byLength : string.CompareOrdinal(x, y);
    }
}
