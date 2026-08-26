using System.Collections.Generic;

namespace Apya.Platform.Tenants;

public class PackageDto
{
    public PackageCode Code { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public List<PackageFeatureDto> Features { get; set; } = new();

    /// <summary>Pakete dahil izin sayısı.</summary>
    public int PermissionCount { get; set; }

    /// <summary>Tanımlı toplam tenant izni sayısı (tavanın evreni).</summary>
    public int TotalPermissionCount { get; set; }
}

public class PackageFeatureDto
{
    public string FeatureName { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public bool IsNumeric { get; set; }

    /// <summary>
    /// Değeri izin ağacından TÜRETİLİR (elle düzenlenmez): modül feature'ları.
    /// Bkz. <see cref="PackageFeatureGates"/>.
    /// </summary>
    public bool IsDerived { get; set; }
}

public class UpdatePackageFeaturesDto
{
    public PackageCode Code { get; set; }

    /// <summary>featureName → value ("true"/"false" ya da sayı). Yalnız katalogdaki feature'lar işlenir.</summary>
    public Dictionary<string, string> Features { get; set; } = new();
}

/// <summary>
/// Paketin izin tavanı, yetki yönetimi ekranıyla AYNI ağaç olarak. Host burada tek tek
/// işaretleyerek "bu pakette ne kullanılabilir"i en ince ayrıntısına kadar belirler.
/// </summary>
public class PackagePermissionTreeDto
{
    public PackageCode Code { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<PackagePermissionGroupDto> Groups { get; set; } = new();
}

public class PackagePermissionGroupDto
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public List<PackagePermissionNodeDto> Permissions { get; set; } = new();
}

public class PackagePermissionNodeDto
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? ParentName { get; set; }

    /// <summary>Ağaç derinliği (0 = kök izin). UI girintisi için.</summary>
    public int Depth { get; set; }

    /// <summary>İzin bu pakete dahil mi?</summary>
    public bool IsIncluded { get; set; }

    /// <summary>
    /// Host yönetimi izni (ABP'de MultiTenancySide = Host): pakete EKLENEMEZ, çünkü
    /// tenant'ın yetki ekranında zaten hiç listelenmez. Ağaçta kilitli gösterilir —
    /// listeden tamamen çıkarınca "eksik mi kaldı?" izlenimi veriyordu.
    /// </summary>
    public bool IsHostOnly { get; set; }
}

/// <summary>
/// Paket süresi davranışı — host geneli (Global ayar). Bir müşteriye özel değildir:
/// süre dolduğunda ne olacağını bütün platform için belirler.
/// </summary>
public class SubscriptionSettingsDto
{
    /// <summary>
    /// Kapalıyken süresi dolan müşteriye yalnız uyarı gider, paketi değişmez.
    /// </summary>
    public bool AutoDowngradeEnabled { get; set; } = true;

    /// <summary>Bitişten sonra paketin açık kaldığı ek süre (gün). 0 = ek süre yok.</summary>
    public int GraceDays { get; set; }

    /// <summary>Uyarı eşikleri — virgülle ayrık gün listesi ("7,1"). Boş = uyarı yok.</summary>
    public string WarningDays { get; set; } = string.Empty;

    // --- Yükseltme kanalı: kiracının "Paketim" ekranındaki çağrı buraya gider ---
    // Üçü de boşsa ekranda hiçbir çağrı basılmaz.

    /// <summary>Yükseltme talebi için satış e-postası.</summary>
    public string UpgradeContactEmail { get; set; } = string.Empty;

    /// <summary>Yükseltme talebi için telefon.</summary>
    public string UpgradeContactPhone { get; set; } = string.Empty;

    /// <summary>Dış satış/fiyat sayfası adresi.</summary>
    public string UpgradeUrl { get; set; } = string.Empty;
}

public class UpdatePackagePermissionsDto
{
    public PackageCode Code { get; set; }

    /// <summary>Pakete dahil izin adları. Listede olmayan izin paketten ÇIKARILIR.</summary>
    public List<string> PermissionNames { get; set; } = new();
}
