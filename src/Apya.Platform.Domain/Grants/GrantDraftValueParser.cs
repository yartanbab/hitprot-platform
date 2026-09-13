using System;
using System.Globalization;

namespace Apya.Platform.Grants;

/// <summary>
/// Taslak alanının ham metnini programın parametresine yazan TEK kaynak.
///
/// <para>İki yer kullanır: taslak oluşturulurken çıkarılan değerler programa uygulanır
/// (3a), parametre formu da "nereden geldi" sorusunu aynı ayrıştırmayla cevaplar (10b).
/// İki ayrı ayrıştırıcı olsaydı "metinden farklı" uyarısı biçim farkından sahte çıkardı.</para>
///
/// <para>Biçimler çıkarıcının ürettiği değişmez kültür biçimleridir: tamsayı, ondalık
/// (nokta), <c>true/false</c>, TRL için <c>3-7</c>.</para>
/// </summary>
public static class GrantDraftValueParser
{
    /// <summary>
    /// Ham değeri programa yazar. Anahtar tanınmıyorsa ya da değer ayrıştırılamıyorsa
    /// programa DOKUNMAZ ve false döner.
    /// </summary>
    public static bool TryApply(Grant grant, string fieldKey, string? raw)
    {
        var value = raw?.Trim();
        if (string.IsNullOrEmpty(value))
        {
            return false;
        }

        switch (fieldKey)
        {
            case GrantTextExtractor.FieldMaxAmount when TryDecimal(value, out var amount):
                grant.MaxAmount = amount;
                return true;
            case GrantTextExtractor.FieldSupportRate when TryInt(value, out var rate):
                grant.SupportRatePercent = rate;
                return true;
            case GrantTextExtractor.FieldDuration when TryInt(value, out var months):
                grant.ProjectDurationMonths = months;
                return true;
            case GrantTextExtractor.FieldCompanyAge when TryInt(value, out var age):
                grant.MinCompanyAgeYears = age;
                return true;
            case GrantTextExtractor.FieldCompanySizes when TryInt(value, out var sizes):
                grant.EligibleCompanySizes = sizes;
                return true;
            case GrantTextExtractor.FieldRdStaff when TryInt(value, out var rdStaff):
                grant.MinRdStaffCount = rdStaff;
                return true;
            case GrantTextExtractor.FieldConsortium when bool.TryParse(value, out var consortium):
                grant.RequiresConsortium = consortium;
                return true;
            case GrantTextExtractor.FieldTrl:
                var parts = value.Split('-', StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length == 2 && TryInt(parts[0].Trim(), out var min) && TryInt(parts[1].Trim(), out var max))
                {
                    grant.MinTrl = min;
                    grant.MaxTrl = max;
                    return true;
                }
                return false;
            default:
                return false;
        }
    }

    private static bool TryInt(string s, out int n)
        => int.TryParse(s, NumberStyles.Integer, CultureInfo.InvariantCulture, out n);

    private static bool TryDecimal(string s, out decimal d)
        => decimal.TryParse(s, NumberStyles.Number, CultureInfo.InvariantCulture, out d);
}
