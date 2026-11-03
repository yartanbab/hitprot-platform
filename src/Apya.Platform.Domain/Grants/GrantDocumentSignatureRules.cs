using System.Collections.Generic;
using System.Globalization;

namespace Apya.Platform.Grants;

/// <summary>
/// Evrak adından ıslak imza / kaşe şartını çıkarır. Katalogdaki şart bugüne dek yalnız
/// adın içinde yazıyordu ("Faaliyet Planı (EK TD2; imzalı-kaşeli)").
///
/// <para>🔴 Aynı kural migration'daki geri doldurma SQL'inde de var
/// (<c>AddGrantDocumentSignatureChecks</c>); biri değişirse öbürü de değişmeli.</para>
/// </summary>
public static class GrantDocumentSignatureRules
{
    private static readonly CultureInfo Turkish = CultureInfo.GetCultureInfo("tr-TR");

    /// <summary>"e-imzalı" ıslak imza değildir; ad bundan arındırılınca kalan "imza" ıslak imzadır.</summary>
    public static bool InfersWetSignature(string name)
    {
        var text = name.ToLower(Turkish).Replace("elektronik imza", "").Replace("e-imza", "");
        return text.Contains("imza");
    }

    public static bool InfersStamp(string name)
    {
        var text = name.ToLower(Turkish);
        return text.Contains("kaşe") || text.Contains("mühür");
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
