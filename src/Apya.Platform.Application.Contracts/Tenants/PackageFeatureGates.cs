using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Features;
using Apya.Platform.Permissions;

namespace Apya.Platform.Tenants;

/// <summary>
/// Modül feature'ı ↔ o modülün izinleri eşlemesi. TEK kaynak; iki yönde birden kullanılır:
/// <list type="bullet">
/// <item>İleri: paketin feature değerlerinden varsayılan izin tavanı türetilir
/// (<see cref="PackagePermissionDefaults"/>) — mevcut davranış korunur.</item>
/// <item>Geri: host izin ağacında seçim yapınca paketin feature değeri buradan yeniden
/// hesaplanır (<see cref="DeriveFeatureValues"/>) — "izni işaretledim ama modül kapalı
/// kaldı" tuzağı oluşmaz.</item>
/// </list>
///
/// <para>Burada YER ALMAYAN feature'lar (MultiCurrency, MaxUsers, MaxProjects) izinle ifade
/// edilemez; onlar paket ekranından elle düzenlenmeye devam eder.</para>
///
/// <para>Ön ek eşleşmesi tam ad ya da "<c>ön ek + nokta</c>": "Platform.Grants" dışlaması
/// "Platform.Grants.Create"i kapsar, "Platform.GrantsGroup" gibi bir adı kapsamaz.</para>
/// </summary>
public static class PackageFeatureGates
{
    // AI modülünün izin grubu ön eki. Application.Contracts → Ai.Application.Contracts
    // bağımlılığı olmadığı için sabit burada tekrar edilir (bkz. AiPermissions.GroupName).
    private const string AiGroupPrefix = "Ai";

    public static readonly IReadOnlyDictionary<string, string[]> Map = new Dictionary<string, string[]>
    {
        [PlatformFeatures.Finance] = new[]
        {
            PlatformPermissions.Incomes.Default,
            PlatformPermissions.Expenses.Default,
            PlatformPermissions.Invoices.Default,
            PlatformPermissions.ExchangeRates.Default,
            PlatformPermissions.Reports.Default,
            PlatformPermissions.FxRevaluations.Default,
            PlatformPermissions.Customers.Default,
            PlatformPermissions.CashAccounts.Default,
            PlatformPermissions.CashMovements.Default,
        },
        [PlatformFeatures.Grants] = new[] { PlatformPermissions.Grants.Default },
        [PlatformFeatures.Documents] = new[] { PlatformPermissions.Documents.Default },
        [PlatformFeatures.Forms] = new[] { PlatformPermissions.DynamicAssets.Default },
        [PlatformFeatures.Calendar] = new[] { PlatformPermissions.Calendars.Default },
        // DİKKAT: Tasks.Default / Tasks.Create BİLEREK yok. Bu kapı yalnız oluşturma
        // ekranının ekstralarını kapatır; kapanınca kullanıcı görev açamaz hâle GELMEMELİ.
        [PlatformFeatures.TaskQuickEntry] = new[]
        {
            PlatformPermissions.Tasks.QuickCreate,
            PlatformPermissions.Tasks.ManagePlanning,
        },
        [PlatformFeatures.AiAssist] = new[]
        {
            AiGroupPrefix,
            PlatformPermissions.TenantSettings.ManageAi,
            PlatformPermissions.Projects.UseAiFeatures,
        },
        [PlatformFeatures.AdvancedReports] = new[]
        {
            PlatformPermissions.Reports.TrialBalance,
            PlatformPermissions.FxRevaluations.Default,
        },
    };

    /// <summary>Bu izin, verilen feature'ın kapısının arkasında mı?</summary>
    public static bool IsGatedBy(string featureName, string permissionName)
        => Map.TryGetValue(featureName, out var prefixes)
           && prefixes.Any(prefix => Covers(prefix, permissionName));

    /// <summary>
    /// Seçili izinlerden modül feature değerlerini türetir: kapısının arkasındaki izinlerden
    /// en az biri seçiliyse "true", hiçbiri seçili değilse "false".
    /// </summary>
    public static Dictionary<string, string> DeriveFeatureValues(IEnumerable<string> selectedPermissions)
    {
        var selected = selectedPermissions.ToList();
        return Map.Keys.ToDictionary(
            feature => feature,
            feature => selected.Any(p => IsGatedBy(feature, p)) ? "true" : "false");
    }

    private static bool Covers(string prefix, string permissionName)
        => permissionName.Equals(prefix, StringComparison.Ordinal)
           || permissionName.StartsWith(prefix + ".", StringComparison.Ordinal);
}
