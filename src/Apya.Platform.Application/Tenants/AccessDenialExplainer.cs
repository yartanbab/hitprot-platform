using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Features;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SimpleStateChecking;

namespace Apya.Platform.Tenants;

/// <summary>
/// Yetkilendirmenin REDDETTİĞİ bir iznin neden reddedildiğini açıklar (ROL-05, SHL-11, GRT-14, ACC-12).
///
/// <para>ABP <c>PermissionChecker.IsGrantedAsync</c> ile aynı kaynaklara bakar (tanım → state checker'lar
/// [RequireFeatures + global paket tavanı] → çok kiracılı taraf → değer sağlayıcıları) ama TARAFI ÖNCE
/// sorar: host'a özel izinler hiçbir paket tavanına giremediği için kiracıda state de "kapalı" der; state
/// önce gelseydi kiracıya /TenantManagement için "paketinizde yok" denirdi — hiçbir paket onu açmaz.</para>
///
/// <para>Rol sebebi ("yetki hesabınıza tanımlı değil") yalnız izin kullanıcıya GERÇEKTEN verilmemişse
/// söylenir (<see cref="IPermissionChecker"/>): elle yazılan ya da bayat adres ve çoklu gereksinimin
/// (PermissionsRequirement) karşılanmış adları, sahip olunan yetki için "tanımlı değil" yazdıramaz — o ad
/// bilinmiyor sayılır. Taraf ve paket sebebi kullanıcının KENDİ kiracı durumundan hesaplanır.</para>
/// </summary>
public class AccessDenialExplainer : ITransientDependency
{
    /// <summary>Değerlendirilen en fazla izin adı (adres çubuğundan gelir).</summary>
    public const int MaxPermissionNames = 5;

    /// <summary>Bundan uzun ad tanınmayan ad sayılır.</summary>
    public const int MaxPermissionNameLength = 128;

    private readonly IPermissionDefinitionManager _permissionDefinitionManager;
    private readonly ISimpleStateCheckerManager<PermissionDefinition> _stateCheckerManager;
    private readonly IFeatureChecker _featureChecker;
    private readonly ICurrentTenant _currentTenant;
    private readonly IStringLocalizerFactory _stringLocalizerFactory;
    private readonly IPermissionChecker _permissionChecker;
    private readonly PackageCeilingStore _ceilingStore;

    public AccessDenialExplainer(
        IPermissionDefinitionManager permissionDefinitionManager,
        ISimpleStateCheckerManager<PermissionDefinition> stateCheckerManager,
        IFeatureChecker featureChecker,
        ICurrentTenant currentTenant,
        IStringLocalizerFactory stringLocalizerFactory,
        IPermissionChecker permissionChecker,
        PackageCeilingStore ceilingStore)
    {
        _permissionDefinitionManager = permissionDefinitionManager;
        _stateCheckerManager = stateCheckerManager;
        _featureChecker = featureChecker;
        _currentTenant = currentTenant;
        _stringLocalizerFactory = stringLocalizerFactory;
        _permissionChecker = permissionChecker;
        _ceilingStore = ceilingStore;
    }

    /// <summary>
    /// Birden çok ad gelirse en "yapısal" sebep kazanır: taraf (host/kiracı) &gt; paket &gt; rol &gt;
    /// bilinmiyor — kullanıcının yöneticisinden isteyebileceği şey (rol) ancak paket ve taraf engeli
    /// yoksa anlamlıdır.
    /// </summary>
    public virtual async Task<AccessDenialExplanation> ExplainAsync(IEnumerable<string>? permissionNames)
    {
        var best = AccessDenialExplanation.Unknown;
        if (permissionNames == null)
        {
            return best;
        }

        var names = permissionNames
            .Where(name => !string.IsNullOrWhiteSpace(name) && name.Length <= MaxPermissionNameLength)
            .Distinct(StringComparer.Ordinal)
            .Take(MaxPermissionNames)
            .ToList();

        foreach (var name in names)
        {
            var explanation = await ExplainOneAsync(name);
            if (Rank(explanation.Reason) > Rank(best.Reason))
            {
                best = explanation;
            }
        }

        return best;
    }

    private async Task<AccessDenialExplanation> ExplainOneAsync(string permissionName)
    {
        var definition = await _permissionDefinitionManager.GetOrNullAsync(permissionName);
        if (definition == null || !definition.IsEnabled)
        {
            return AccessDenialExplanation.Unknown;
        }

        var displayName = PermissionDisplayNameOf(definition);

        // (1) Taraf — paketten ÖNCE (sınıf özeti).
        var side = _currentTenant.GetMultiTenancySide();
        if (!definition.MultiTenancySide.HasFlag(side))
        {
            return new AccessDenialExplanation(
                side == MultiTenancySides.Tenant ? AccessDenialReason.HostOnly : AccessDenialReason.TenantOnly,
                permissionName,
                displayName);
        }

        // (2) State: RequireFeatures + paket tavanı. Host tavandan ve feature kapılarından muaf
        // olduğu için host'ta kapalı state paket sebebi değildir.
        if (!await _stateCheckerManager.IsEnabledAsync(definition))
        {
            return _currentTenant.Id == null
                ? AccessDenialExplanation.Unknown
                : new AccessDenialExplanation(
                    AccessDenialReason.Package,
                    permissionName,
                    displayName,
                    await FindModuleDisplayNameAsync(_currentTenant.Id.Value, permissionName));
        }

        // (3) Rol — yalnız izin GERÇEKTEN verilmemişse (sınıf özeti); verilmiş ad bilinmiyor sayılır.
        if (await _permissionChecker.IsGrantedAsync(permissionName))
        {
            return AccessDenialExplanation.Unknown;
        }

        return new AccessDenialExplanation(AccessDenialReason.NotGranted, permissionName, displayName);
    }

    /// <summary>
    /// İzni kapsayan modüllerden kiracıda KAPALI olan ilki (Finans açık ama Gelişmiş Raporlar kapalıysa
    /// kur değerleme için "Gelişmiş Raporlar"). Hiçbiri kapalı değilse izin yalnız tavan dışıdır: modül
    /// ancak kapısının arkasındaki izinlerin HİÇBİRİ kiracının tavanında değilse pakette yoktur (profilsiz
    /// kiracı, ROL-07: feature varsayılanı açık). Host tavandan tek bir alt izni çıkardıysa modül pakettedir
    /// — Faturalar'ı kullanana "Finans &amp; Muhasebe paketinizde yok" denmez: null, ekranda modülsüz genel
    /// metin. Ad Paketim ekranındakiyle aynıdır.
    /// </summary>
    private async Task<string?> FindModuleDisplayNameAsync(Guid tenantId, string permissionName)
    {
        var covering = PackageFeatureGates.Map.Keys
            .Where(feature => PackageFeatureGates.IsGatedBy(feature, permissionName))
            .ToList();

        foreach (var feature in covering)
        {
            if (!await _featureChecker.IsEnabledAsync(feature))
            {
                return DisplayNameOf(feature);
            }
        }

        // null tavan = kısıt yok (PackageCeilingStore): hiçbir modül "pakette yok" sayılmaz.
        var ceiling = covering.Count == 0 ? null : await _ceilingStore.GetCeilingOrNullAsync(tenantId);
        if (ceiling == null)
        {
            return null;
        }

        var absent = covering.FirstOrDefault(feature => !ceiling.Any(name => PackageFeatureGates.IsGatedBy(feature, name)));
        return absent == null ? null : DisplayNameOf(absent);
    }

    private static string? DisplayNameOf(string featureName)
        => PackageFeatureCatalog.Managed.FirstOrDefault(meta => meta.Name == featureName)?.DisplayName;

    /// <summary>
    /// Alt iznin adı ("Düzenleme", "Silme") tek başına hangi ekranın yetkisi olduğunu söylemez;
    /// üst izinle birlikte yazılır ("Kiracılar › Düzenleme").
    /// </summary>
    private string PermissionDisplayNameOf(PermissionDefinition definition)
    {
        var name = definition.DisplayName.Localize(_stringLocalizerFactory).Value;
        return definition.Parent == null
            ? name
            : definition.Parent.DisplayName.Localize(_stringLocalizerFactory).Value + " › " + name;
    }

    private static int Rank(AccessDenialReason reason) => reason switch
    {
        AccessDenialReason.HostOnly or AccessDenialReason.TenantOnly => 3,
        AccessDenialReason.Package => 2,
        AccessDenialReason.NotGranted => 1,
        _ => 0
    };
}
