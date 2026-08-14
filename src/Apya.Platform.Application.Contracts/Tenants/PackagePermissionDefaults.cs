using System.Linq;

namespace Apya.Platform.Tenants;

/// <summary>
/// Bir paketin izin tavanı ilk kez tohumlanırken kullanılan varsayılan: tanımlı TÜM tenant
/// izinleri, paketin KAPALI feature'larının arkasındaki izinler dışında.
///
/// <para>Böylece varsayılan tohum, bu özellikten önceki (yalnız feature'la yapılan) modül
/// kapamasının birebir karşılığıdır — mevcut tenant'lar tavan devreye girince yetki kaybetmez.
/// Host tohumdan sonra ekranda tek tek işaretleyip kaldırabilir.</para>
/// </summary>
public static class PackagePermissionDefaults
{
    public static bool IsIncluded(PackageCode code, string permissionName)
    {
        var featureValues = PackageDefinitions.For(code);

        return !PackageFeatureGates.Map.Keys.Any(feature =>
            featureValues.TryGetValue(feature, out var value)
            && value == "false"
            && PackageFeatureGates.IsGatedBy(feature, permissionName));
    }
}
