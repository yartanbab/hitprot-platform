using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Apya.Platform.Tenants;

namespace Apya.Platform.Macros.Dtos;

/// <summary>Host yönetim ekranındaki bir satır: katalogdaki makro + host ayarı (yoksa varsayılanlar).</summary>
public class MacroAdminDto
{
    public string Key { get; set; } = string.Empty;

    public MacroKind Kind { get; set; }

    /// <summary>Menüye bağlı makroda menü öğesinin adı; adresli makroda null.</summary>
    public string? MenuName { get; set; }

    /// <summary>Adresli makroda hedef; menüye bağlıda null (adres menü ağacından gelir).</summary>
    public string? Url { get; set; }

    /// <summary>Adresli makroda gereken izin; menüye bağlıda menü öğesinin kapısı geçerli.</summary>
    public string? Permission { get; set; }

    /// <summary>Katalogdaki ad (yerelleştirilmiş).</summary>
    public string DefaultTitle { get; set; } = string.Empty;

    /// <summary>Katalogdaki ikon; menüye bağlıda boş olabilir (menünün ikonu kullanılır).</summary>
    public string? DefaultIcon { get; set; }

    /// <summary>Alan (İş Yönetimi, Hibe Yönetimi…).</summary>
    public string Area { get; set; } = string.Empty;

    /// <summary>Host bu makro için ayar kaydetmiş mi (false = katalog varsayılanları).</summary>
    public bool IsCustomized { get; set; }

    public string? DisplayName { get; set; }

    public string? Icon { get; set; }

    public bool IsHidden { get; set; }

    public int? SortOrder { get; set; }

    public bool DefaultPinned { get; set; }

    public List<PackageCode> Packages { get; set; } = new();

    public List<string> Roles { get; set; } = new();

    /// <summary>Son 30 günde bütün kiracılarda Makro Ekran'dan başlatma sayısı.</summary>
    public int Usage30Days { get; set; }
}

public class UpdateMacroSettingDto
{
    [StringLength(MacroSettingConsts.MaxDisplayNameLength)]
    public string? DisplayName { get; set; }

    [StringLength(MacroSettingConsts.MaxIconLength)]
    [RegularExpression(MacroSettingConsts.IconPattern)]
    public string? Icon { get; set; }

    public bool IsHidden { get; set; }

    [Range(0, 999)]
    public int? SortOrder { get; set; }

    public bool DefaultPinned { get; set; }

    /// <summary>Boş = bütün paketler.</summary>
    public List<PackageCode> Packages { get; set; } = new();

    /// <summary>Boş = bütün roller. Rol adı, kiracıdaki rolün adıyla birebir (harf duyarsız).</summary>
    public List<string> Roles { get; set; } = new();
}

/// <summary>Makro Ekran'ın oturumdaki kullanıcı için düzeni.</summary>
public class MacroLayoutDto
{
    /// <summary>Son 30 günde makro anahtarı başına kullanım.</summary>
    public Dictionary<string, int> Usage { get; set; } = new();

    /// <summary>
    /// Sabitleme listesi (kenar çubuğuyla ortak ayar). Kullanıcı hiç kaydetmemişse varsayılan
    /// menü iğneleri + host'un "yeni kullanıcıya sabitli gelsin" dediği makrolar.
    /// </summary>
    public List<string> Pins { get; set; } = new();

    /// <summary>Host ayarları (yalnız ayar kaydı olan makrolar), kullanıcının kapsamına göre çözülmüş.</summary>
    public List<MacroSettingViewDto> Settings { get; set; } = new();

    /// <summary>
    /// Güncelleme rozeti: makro anahtarı başına okunmamış bildirim sayısı (bağlantısı o makroya
    /// eşlenenler, <see cref="MacroCatalog.MatchNotificationLink"/>). Bildirim okununca düşer.
    /// </summary>
    public Dictionary<string, int> Badges { get; set; } = new();
}

public class MacroSettingViewDto
{
    public string Key { get; set; } = string.Empty;

    public string? DisplayName { get; set; }

    public string? Icon { get; set; }

    public int? SortOrder { get; set; }

    public bool DefaultPinned { get; set; }

    /// <summary>false: gizli ya da kullanıcı kapsam dışında (paket/rol).</summary>
    public bool IsVisible { get; set; }
}
