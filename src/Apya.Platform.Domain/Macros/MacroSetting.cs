using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Tenants;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Macros;

/// <summary>
/// Host'un Makro Ekran kataloğundaki BİR makro için yaptığı ayar.
///
/// <para>Varsayılan AÇIK model (kullanıcı kararı 2026-10-14): satır yoksa makro katalogdaki hâliyle
/// yetkisi olan herkese görünür. Host gizler, yeniden adlandırır, ikonunu değiştirir, paket/rol
/// kapsamını daraltır, sıralar ve yeni kullanıcıya sabitli gelip gelmeyeceğini seçer. Adres ve izin
/// KODDA (MacroCatalog) durur, burada değil.</para>
///
/// <para><c>IMultiTenant</c> DEĞİL: tek kayıt bütün kiracılar için geçerli; kiracı yöneticisi
/// değiştiremez (izin host-only).</para>
/// </summary>
public class MacroSetting : AuditedAggregateRoot<Guid>
{
    /// <summary>Katalog anahtarı (MacroDefinition.Key) — makro başına tek satır.</summary>
    public string MacroKey { get; private set; }

    /// <summary>Katalogdaki adın yerine; boşsa katalog/menü adı.</summary>
    public string? DisplayName { get; private set; }

    /// <summary>Katalogdaki ikonun yerine; boşsa katalog/menü ikonu.</summary>
    public string? Icon { get; private set; }

    /// <summary>Kimseye gösterilmez ("+ Yeni" ve komut paleti dahil).</summary>
    public bool IsHidden { get; private set; }

    /// <summary>Kullanım eşitken sıra (küçük önce); boşsa katalog sırası.</summary>
    public int? SortOrder { get; private set; }

    /// <summary>Kendi sabitleme listesini hiç kaydetmemiş kullanıcıya sabitli gelir.</summary>
    public bool DefaultPinned { get; private set; }

    /// <summary>Virgüllü PackageCode adları; boş = bütün paketler.</summary>
    public string Packages { get; private set; }

    /// <summary>Virgüllü rol adları; boş = bütün roller.</summary>
    public string Roles { get; private set; }

    protected MacroSetting()
    {
        MacroKey = string.Empty;
        Packages = string.Empty;
        Roles = string.Empty;
    }

    public MacroSetting(Guid id, string macroKey) : base(id)
    {
        MacroKey = Check.NotNullOrWhiteSpace(macroKey, nameof(macroKey), MacroUsageConsts.MaxKeyLength);
        Packages = string.Empty;
        Roles = string.Empty;
    }

    public void Set(
        string? displayName,
        string? icon,
        bool isHidden,
        int? sortOrder,
        bool defaultPinned,
        IEnumerable<PackageCode> packages,
        IEnumerable<string> roles)
    {
        DisplayName = string.IsNullOrWhiteSpace(displayName)
            ? null
            : Check.Length(displayName.Trim(), nameof(displayName), MacroSettingConsts.MaxDisplayNameLength);
        Icon = string.IsNullOrWhiteSpace(icon)
            ? null
            : Check.Length(icon.Trim(), nameof(icon), MacroSettingConsts.MaxIconLength);
        IsHidden = isHidden;
        SortOrder = sortOrder;
        DefaultPinned = defaultPinned;
        Packages = string.Join(",", packages.Distinct().OrderBy(p => (int)p));
        Roles = Check.Length(string.Join(",", roles
                .Where(r => !string.IsNullOrWhiteSpace(r))
                .Select(r => r.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)),
            nameof(roles), MacroSettingConsts.MaxRolesLength) ?? string.Empty;
    }

    public IReadOnlyList<PackageCode> PackageCodes() => ParsePackages(Packages);

    public IReadOnlyList<string> RoleNames() => ParseRoles(Roles);

    public bool IsInScope(PackageCode? tenantPackage, IReadOnlyCollection<string> userRoles)
        => IsInScope(Packages, Roles, tenantPackage, userRoles);

    /// <summary>
    /// Kapsam: paket listesi boşsa ya da kiracının paketi listedeyse VE rol listesi boşsa ya da
    /// kullanıcının rollerinden biri listedeyse. Host'un paketi yoktur (<paramref name="tenantPackage"/>
    /// null): paket kapsamı yalnız kiracıyı daraltır, host'u elemez. Rol adı karşılaştırması harf duyarsız.
    /// Statik: önbellekteki satır (varlık değil) da aynı kuraldan geçer.
    /// </summary>
    public static bool IsInScope(string packages, string roles, PackageCode? tenantPackage, IReadOnlyCollection<string> userRoles)
    {
        var packageList = ParsePackages(packages);
        if (packageList.Count > 0 && tenantPackage.HasValue && !packageList.Contains(tenantPackage.Value))
        {
            return false;
        }

        var roleList = ParseRoles(roles);
        return roleList.Count == 0 || roleList.Any(r => userRoles.Contains(r, StringComparer.OrdinalIgnoreCase));
    }

    public static IReadOnlyList<PackageCode> ParsePackages(string? packages)
        => (packages ?? string.Empty).Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(s => Enum.TryParse<PackageCode>(s, out var code) ? (PackageCode?)code : null)
            .Where(c => c.HasValue)
            .Select(c => c!.Value)
            .ToList();

    public static IReadOnlyList<string> ParseRoles(string? roles)
        => (roles ?? string.Empty).Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
}
