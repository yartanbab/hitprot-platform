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

/// <summary>Yasaklı sayfanın sebebi — /AccessDenied sayfası metnini ve eylemini buna göre seçer.</summary>
public enum AccessDenialReason
{
    /// <summary>İzin adı yok ya da tanınmıyor (açık Forbid(), eski yer imi).</summary>
    Unknown,

    /// <summary>İzin tanımlı ve açık; kullanıcının rolüne verilmemiş.</summary>
    NotGranted,

    /// <summary>Kiracının paketi (feature ya da paket izin tavanı) kapatıyor.</summary>
    Package,

    /// <summary>Platform yönetimine (host) ait ekran; hiçbir kiracı paketi açmaz.</summary>
    HostOnly,

    /// <summary>Kiracıya ait ekran; host hesabından açılmaz.</summary>
    TenantOnly
}

/// <summary>Reddin açıklaması: sebep + (varsa) iznin ve modülün görünen adları.</summary>
public sealed record AccessDenialExplanation(
    AccessDenialReason Reason,
    string? PermissionName = null,
    string? PermissionDisplayName = null,
    string? ModuleDisplayName = null)
{
    public static AccessDenialExplanation Unknown { get; } = new(AccessDenialReason.Unknown);
}

/// <summary>
/// Yetkilendirmenin REDDETTİĞİ bir iznin neden reddedildiğini açıklar (ROL-05, SHL-11, GRT-14, ACC-12).
///
/// <para>ABP <c>PermissionChecker.IsGrantedAsync</c> ile aynı kaynaklara bakar (tanım → state checker'lar
/// [RequireFeatures + global paket tavanı] → çok kiracılı taraf → değer sağlayıcıları) ama TARAFI ÖNCE
/// sorar: host'a özel izinler hiçbir paket tavanına giremediği için kiracıda state de "kapalı" der; state
/// önce gelseydi kiracıya /TenantManagement için "paketinizde yok" denirdi — hiçbir paket onu açmaz.</para>
///
/// <para>İzin VERİLİ Mİ sorusu sorulmaz: açıklayıcı raporlanmış bir reddi açıklar. Sebep kullanıcının
/// KENDİ kiracı durumundan hesaplanır; adres çubuğundaki izin adıyla oynamak en fazla başka bir iznin
/// doğru açıklamasını gösterir.</para>
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

    public AccessDenialExplainer(
        IPermissionDefinitionManager permissionDefinitionManager,
        ISimpleStateCheckerManager<PermissionDefinition> stateCheckerManager,
        IFeatureChecker featureChecker,
        ICurrentTenant currentTenant,
        IStringLocalizerFactory stringLocalizerFactory)
    {
        _permissionDefinitionManager = permissionDefinitionManager;
        _stateCheckerManager = stateCheckerManager;
        _featureChecker = featureChecker;
        _currentTenant = currentTenant;
        _stringLocalizerFactory = stringLocalizerFactory;
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

        var displayName = definition.DisplayName.Localize(_stringLocalizerFactory).Value;

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
                    await FindModuleDisplayNameAsync(permissionName));
        }

        // (3) Rol.
        return new AccessDenialExplanation(AccessDenialReason.NotGranted, permissionName, displayName);
    }

    /// <summary>
    /// İzni kapsayan modüllerden kiracıda KAPALI olan ilki (Finans açık ama Gelişmiş Raporlar kapalıysa
    /// kur değerleme için "Gelişmiş Raporlar"); hiçbiri kapalı değilse izin yalnız tavan dışıdır
    /// (ROL-07 ile aynı ayrım) ve kapsayan ilk modül söylenir. Ad Paketim ekranındakiyle aynıdır.
    /// </summary>
    private async Task<string?> FindModuleDisplayNameAsync(string permissionName)
    {
        string? firstCovering = null;
        foreach (var feature in PackageFeatureGates.Map.Keys)
        {
            if (!PackageFeatureGates.IsGatedBy(feature, permissionName))
            {
                continue;
            }

            firstCovering ??= feature;
            if (!await _featureChecker.IsEnabledAsync(feature))
            {
                return DisplayNameOf(feature);
            }
        }

        return firstCovering == null ? null : DisplayNameOf(firstCovering);
    }

    private static string? DisplayNameOf(string featureName)
        => PackageFeatureCatalog.Managed.FirstOrDefault(meta => meta.Name == featureName)?.DisplayName;

    private static int Rank(AccessDenialReason reason) => reason switch
    {
        AccessDenialReason.HostOnly or AccessDenialReason.TenantOnly => 3,
        AccessDenialReason.Package => 2,
        AccessDenialReason.NotGranted => 1,
        _ => 0
    };
}
