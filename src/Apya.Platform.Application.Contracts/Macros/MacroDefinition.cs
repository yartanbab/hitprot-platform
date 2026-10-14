namespace Apya.Platform.Macros;

/// <summary>Makronun tıklanınca yaptığı iş.</summary>
public enum MacroKind
{
    /// <summary>Bir sayfaya gider.</summary>
    Link = 1,

    /// <summary>Bulunduğu sayfada bir oluşturma penceresi açar (ABP ModalManager).</summary>
    Modal = 2
}

/// <summary>
/// Koddaki eylem kataloğunun bir satırı (<see cref="MacroCatalog"/>).
///
/// <para>İki biçimi var. <b>Menüye bağlı</b> bağlantı yalnız <see cref="MenuName"/> taşır: adres,
/// etiket, ikon ve görünürlük menü ağacından gelir (PlatformNavigationResolver), makro ikinci bir
/// adres/izin kaynağı açmaz. <b>Adresli</b> makro (pencere ya da menüde olmayan sayfa)
/// <see cref="Url"/> + <see cref="Permission"/> + <see cref="TitleKey"/> + <see cref="Icon"/> taşır.</para>
///
/// <para>Adres ve izin KODDA durur, host'un elle yazdığı alanlarda değil: yanlış yazılmış bir izin
/// adı makroyu herkese açardı (kullanıcı kararı 2026-10-14, docs/design/makro-ekran).</para>
/// </summary>
public sealed class MacroDefinition
{
    /// <summary>Sabitleme ayarında makro adlarının ön eki — menü adlarıyla çakışmaz.</summary>
    public const string PinPrefix = "Apya.Macro.";

    /// <summary>Kalıcı anahtar (PascalCase, nokta/alt çizgi yok). Değiştirilirse kullanıcı iğneleri düşer.</summary>
    public required string Key { get; init; }

    public required MacroKind Kind { get; init; }

    /// <summary>Menüye bağlı bağlantıda menü öğesinin adı; adresli makroda null.</summary>
    public string? MenuName { get; init; }

    /// <summary>Adresli makroda hedef; menüye bağlıda null.</summary>
    public string? Url { get; init; }

    /// <summary>Adresli makroda gereken izin. Menüye bağlıda görünürlüğü menü ağacı belirler.</summary>
    public string? Permission { get; init; }

    /// <summary>
    /// Etiketin yerelleştirme anahtarı. Menüye bağlı makroda yalnız host yönetim ekranı okur; Makro
    /// Ekran menü öğesinin canlı etiketini kullanır.
    /// </summary>
    public string? TitleKey { get; init; }

    /// <summary>Font Awesome sınıfı. Menüye bağlıda boşsa menünün ikonu kullanılır.</summary>
    public string? Icon { get; init; }

    /// <summary>Kartın altındaki alan adının yerelleştirme anahtarı (menü grup başlıklarıyla aynı anahtarlar).</summary>
    public required string AreaKey { get; init; }

    /// <summary>Kenar çubuğuyla ORTAK sabitleme ayarında (Platform.Shell.Pins) bu makronun adı.</summary>
    public string PinName => MenuName ?? PinPrefix + Key;
}
