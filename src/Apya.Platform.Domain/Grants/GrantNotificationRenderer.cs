using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Apya.Platform.Grants;

/// <summary>
/// 6d · Şablon metnindeki <c>{değişken}</c> yerlerini doldurur.
///
/// <para>DI'sız ve saf: aynı girdi her zaman aynı metni üretir, birim testi kolaydır.
/// <c>string.Format</c> KULLANILMAZ — şablonu host yazıyor ve metinde geçen tek bir
/// süslü parantez <c>FormatException</c> ile bildirimi tamamen düşürürdü.</para>
///
/// <para>Karşılığı verilmemiş token metinde OLDUĞU GİBİ BIRAKILMAZ, silinir: kullanıcıya
/// "{kalan_gün}" diye giden bir e-posta, boşluğa göre çok daha kötü görünür. Hangi
/// tokenların doldurulabildiği <see cref="GrantNotificationTriggerRegistry.VariablesOf"/>
/// ile zaten sınırlanmıştır.</para>
/// </summary>
public static class GrantNotificationRenderer
{
    public static string Render(string template, IReadOnlyDictionary<string, string?> values)
    {
        if (string.IsNullOrEmpty(template))
        {
            return string.Empty;
        }

        var sb = new StringBuilder(template.Length);
        var i = 0;

        while (i < template.Length)
        {
            var open = template.IndexOf('{', i);
            if (open < 0)
            {
                sb.Append(template, i, template.Length - i);
                break;
            }

            var close = template.IndexOf('}', open + 1);
            if (close < 0)
            {
                sb.Append(template, i, template.Length - i);
                break;
            }

            sb.Append(template, i, open - i);

            var token = template.Substring(open, close - open + 1);
            if (values.TryGetValue(token, out var value))
            {
                sb.Append(value ?? string.Empty);
            }

            i = close + 1;
        }

        // Token silinince çift boşluk ve boşluk-noktalama kalabiliyor.
        return CollapseSpaces(sb.ToString());
    }

    private static string CollapseSpaces(string text)
    {
        var parts = text.Split('\n');
        return string.Join('\n', parts.Select(line =>
            string.Join(' ', line.Split(' ', StringSplitOptions.RemoveEmptyEntries)).Trim()));
    }
}
