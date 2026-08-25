using System.Collections.Generic;
using Volo.Abp.UI.Navigation;

namespace Apya.Platform.Web.Menus;

/// <summary>
/// Kullanıcının çözülmüş gezinme düzeni: kenar çubuğu ağacı + Ayarlar
/// sayfasındaki bağlantı listesi. İki yüzey de bu tek sonucu tüketir.
/// </summary>
public class NavResolution
{
    /// <summary>Kenar çubuğunun 1. seviye öğeleri — sıralanmış, izin filtreli.</summary>
    public List<ApplicationMenuItem> Sidebar { get; } = new();

    /// <summary>Ayarlar sayfasındaki yönetim bağlantıları — sıralanmış, izin filtreli.</summary>
    public List<NavSettingsLink> SettingsLinks { get; } = new();

    /// <summary>Kullanıcının kayıtlı düzeni (düzenleme ekranı ham hâli de gösterir).</summary>
    public MenuLayout Layout { get; set; } = new();
}

/// <summary>
/// Ayarlar sayfasında bir satır. İki kaynaktan gelebilir: yönetim bağlantıları
/// kataloğu (varsayılan konum) veya kenar çubuğundan indirilmiş bir yaprak öğe.
/// </summary>
public class NavSettingsLink
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;

    /// <summary>
    /// true → <see cref="PlatformAdminLinks"/> kataloğundan (kenar çubuğuna
    /// alınırsa "Yönetim" grubuna girer); false → kenar çubuğundan indirilmiş
    /// yaprak (geri alınırsa kendi eski grubuna döner).
    /// </summary>
    public bool IsAdminLink { get; set; }

    /// <summary>Geri alındığında döneceği grubun menü adı — 1. seviye yapraklarda boş.</summary>
    public string HomeGroupName { get; set; } = string.Empty;

    /// <summary>Aynı grubun etiketi — düzenleme ekranında kullanıcıya gösterilir.</summary>
    public string HomeGroupTitle { get; set; } = string.Empty;

    /// <summary>
    /// Aynı grubun ikonu. Düzenleme ekranı, tüm çocukları Ayarlar'a taşınmış
    /// (ve bu yüzden kenar çubuğundan düşmüş) grubu buradan yeniden kurar —
    /// yoksa öğenin geri döneceği yer ekranda hiç görünmezdi.
    /// </summary>
    public string HomeGroupIcon { get; set; } = string.Empty;
}
