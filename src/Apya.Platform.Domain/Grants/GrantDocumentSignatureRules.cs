using System.Collections.Generic;
using System.Globalization;

namespace Apya.Platform.Grants;

/// <summary>
/// Evrak adından ıslak imza / kaşe şartını çıkarır. Katalogdaki şart bugüne dek yalnız
/// adın içinde yazıyordu ("Faaliyet Planı (EK TD2; imzalı-kaşeli)").
///
/// <para>Migration'daki geri doldurma SQL'i (<c>AddGrantDocumentSignatureChecks</c>) bu kuralın
/// yakın karşılığıdır; ASCII yazımı ("KASELI") orada yakalanmaz. Migration uygulanmış olduğu için
/// değiştirilmez.</para>
/// </summary>
public static class GrantDocumentSignatureRules
{
    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    /// <summary>"e-imzalı" ıslak imza değildir; ad bundan arındırılınca kalan "imza" ıslak imzadır.</summary>
    public static bool InfersWetSignature(string name)
    {
        var text = Fold(name).Replace("elektronik imza", "").Replace("e-imza", "");
        return text.Contains("imza");
    }

    public static bool InfersStamp(string name)
    {
        var text = Fold(name);
        return text.Contains("kase") || text.Contains("muhur");
    }

    /// <summary>Metin imza, kaşe ya da mühürden söz ediyor mu (e-imza dahil).</summary>
    public static bool MentionsSignatureOrStamp(string text)
    {
        var folded = Fold(text);
        return folded.Contains("imza") || folded.Contains("kase") || folded.Contains("muhur");
    }

    /// <summary>
    /// Küçük harfe indirip Türkçe harfleri ASCII karşılığına çevirir. Türkçe küçültmede
    /// "IMZA" noktasız "ımza" olur ve "imza" aramasını kaçırırdı; formlarda ve elle yazılan
    /// adlarda "IMZALI", "KASELI" gibi ASCII yazım sık görülür.
    /// </summary>
    private static string Fold(string text)
    {
        var chars = text.ToLower(Turkish).ToCharArray();
        for (var i = 0; i < chars.Length; i++)
        {
            chars[i] = chars[i] switch
            {
                'ı' => 'i',
                'ş' => 's',
                'ü' => 'u',
                'ç' => 'c',
                'ğ' => 'g',
                'ö' => 'o',
                _ => chars[i]
            };
        }
        return new string(chars);
    }

    /// <summary>
    /// Dosyadan okunan bilgiyi evrakın şartıyla karşılaştırır.
    /// E-imza ıslak imzanın yerini tutar (5070 s. Kanun); e-imzalı dosyada kaşe aranmaz.
    /// </summary>
    public static List<GrantDocumentPreCheckWarning> Evaluate(
        bool requiresESignature,
        bool requiresWetSignature,
        bool requiresStamp,
        GrantDocumentFileInspection? inspection)
    {
        var warnings = new List<GrantDocumentPreCheckWarning>();
        if (inspection == null) { return warnings; }

        if (!inspection.HasDigitalSignature)
        {
            if (requiresWetSignature || requiresStamp)
            {
                if (!inspection.LooksScanned) { warnings.Add(GrantDocumentPreCheckWarning.NotScanned); }
            }
            else if (requiresESignature)
            {
                warnings.Add(GrantDocumentPreCheckWarning.ESignatureMissing);
            }
        }

        if (inspection.EmptyFieldCount > 0) { warnings.Add(GrantDocumentPreCheckWarning.EmptyFields); }
        return warnings;
    }
}
