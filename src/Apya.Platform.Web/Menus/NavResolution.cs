using System.Collections.Generic;
using Volo.Abp.UI.Navigation;

namespace Apya.Platform.Web.Menus;

/// <summary>
/// Kullanıcının çözülmüş gezinme düzeni: kenar çubuğu ağacı + Ayarlar
/// sayfasındaki liste. İki yüzey de bu tek sonucu tüketir.
/// </summary>
public class NavResolution
{
    /// <summary>Kenar çubuğunun 1. seviyesi — sıralanmış, izin filtreli, boş gruplar ayıklanmış.</summary>
    public List<ApplicationMenuItem> Sidebar { get; } = new();

    /// <summary>Ayarlar sayfasının 1. seviyesi — grup girdileri çocuklarıyla birlikte gelir.</summary>
    public List<NavSettingsEntry> SettingsLinks { get; } = new();

    /// <summary>
    /// İçi boşaldığı için İKİ yüzeyden de ayıklanan gruplar. Düzenleme ekranı
    /// bunları geri koyar: serbest yerleşimde boş bir grup, kullanıcının öğe
    /// bırakabileceği geçerli bir hedeftir — ekranda görünmezse geri dönüş yolu
    /// kapanır.
    /// </summary>
    public List<NavEmptyGroup> EmptyGroups { get; } = new();

    /// <summary>Kullanıcının kayıtlı düzeni.</summary>
    public MenuLayout Layout { get; set; } = new();
}

/// <summary>
/// Ayarlar sayfasındaki bir girdi. Yaprak (tek bağlantı) ya da grup (başlık +
/// altında çocukları) olabilir — kullanıcı bir kategoriyi bütün hâlinde
/// taşıyabildiği için liste artık düz değil.
/// </summary>
public class NavSettingsEntry
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;

    /// <summary>true → başlık + çocuklar; false → tek bağlantı.</summary>
    public bool IsGroup { get; set; }

    /// <summary>
    /// PlatformAdminLinks kataloğundan mı geliyor? Düzenleme ekranı, kenar
    /// çubuğuna geri gönderilen bir yönetim bağlantısını varsayılan olarak
    /// "Yönetim" grubuna koyabilmek için bunu bilmek zorunda.
    /// </summary>
    public bool IsAdminLink { get; set; }

    public List<NavSettingsEntry> Children { get; } = new();
}

/// <summary>İçi boşaldığı için ayıklanmış grup — yalnız düzenleme ekranı kullanır.</summary>
public class NavEmptyGroup
{
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;

    /// <summary>true → Ayarlar sütununda duruyordu; false → kenar çubuğunda.</summary>
    public bool InSettings { get; set; }
}
