using System.Collections.Generic;
using Apya.Platform.Features;

namespace Apya.Platform.Tenants;

/// <summary>
/// Faz 1: Kod-tanımlı satış paketleri (edition). Her paket → feature değerleri sözlüğü.
/// Tenant'a paket atanınca bu değerler IFeatureManager ile tenant'a yazılır
/// (TenantPackageManager). Feature'lar permission tavanını belirler (RequireFeatures).
///
/// Toggle değer "true"/"false"; sayısal limitler string sayı. Her paket tüm capability'leri
/// AÇIKÇA belirtir (sürpriz olmasın). Faz 2'de bu registry DB'den okunacak + host UI ile
/// düzenlenebilecek.
///
/// Not: Klasör adı bilerek "Packages" DEĞİL — .gitignore '**/packages/*' kuralı dosyayı yutar.
/// </summary>
public static class PackageDefinitions
{
    public static IReadOnlyDictionary<string, string> For(PackageCode code) => code switch
    {
        PackageCode.Basic => Basic,
        PackageCode.Standard => Standard,
        PackageCode.Premium => Premium,
        PackageCode.Enterprise => Enterprise,
        _ => Basic
    };

    // Proje & Görev yönetimi her pakette açıktır (feature ile gate edilmez).

    private static readonly Dictionary<string, string> Basic = new()
    {
        [PlatformFeatures.Finance] = "true",
        [PlatformFeatures.Grants] = "false",
        [PlatformFeatures.Documents] = "false",
        [PlatformFeatures.Forms] = "false",
        [PlatformFeatures.Calendar] = "false",
        [PlatformFeatures.AiAssist] = "false",
        [PlatformFeatures.MultiCurrency] = "false",
        [PlatformFeatures.AdvancedReports] = "false",
        [PlatformFeatures.TaskQuickEntry] = "false",
        [PlatformFeatures.MaxUsers] = "3",
        [PlatformFeatures.MaxProjects] = "5",
    };

    private static readonly Dictionary<string, string> Standard = new()
    {
        [PlatformFeatures.Finance] = "true",
        [PlatformFeatures.Grants] = "true",
        [PlatformFeatures.Documents] = "true",
        [PlatformFeatures.Forms] = "false",
        [PlatformFeatures.Calendar] = "true",
        [PlatformFeatures.AiAssist] = "false",
        [PlatformFeatures.MultiCurrency] = "true",
        [PlatformFeatures.AdvancedReports] = "false",
        [PlatformFeatures.TaskQuickEntry] = "true",
        [PlatformFeatures.MaxUsers] = "10",
        [PlatformFeatures.MaxProjects] = "25",
    };

    private static readonly Dictionary<string, string> Premium = new()
    {
        [PlatformFeatures.Finance] = "true",
        [PlatformFeatures.Grants] = "true",
        [PlatformFeatures.Documents] = "true",
        [PlatformFeatures.Forms] = "true",
        [PlatformFeatures.Calendar] = "true",
        [PlatformFeatures.AiAssist] = "true",
        [PlatformFeatures.MultiCurrency] = "true",
        [PlatformFeatures.AdvancedReports] = "true",
        [PlatformFeatures.TaskQuickEntry] = "true",
        [PlatformFeatures.MaxUsers] = "50",
        [PlatformFeatures.MaxProjects] = "200",
    };

    private static readonly Dictionary<string, string> Enterprise = new()
    {
        [PlatformFeatures.Finance] = "true",
        [PlatformFeatures.Grants] = "true",
        [PlatformFeatures.Documents] = "true",
        [PlatformFeatures.Forms] = "true",
        [PlatformFeatures.Calendar] = "true",
        [PlatformFeatures.AiAssist] = "true",
        [PlatformFeatures.MultiCurrency] = "true",
        [PlatformFeatures.AdvancedReports] = "true",
        [PlatformFeatures.TaskQuickEntry] = "true",
        [PlatformFeatures.MaxUsers] = "100000",
        [PlatformFeatures.MaxProjects] = "100000",
    };
}
