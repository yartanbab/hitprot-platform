using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Apya.Platform.Settings;

namespace Apya.Platform.Web.Menus;

/// <summary>
/// Kullanıcının menü düzeni — <see cref="PlatformSettings.Shell.MenuLayout"/>
/// ayarının çözülmüş hâli. Menü ADI saklanır, etiketi değil (Shell.Pins ile aynı
/// gerekçe: dil ya da etiket değişince düzen kaybolmasın).
///
/// Model: her öğenin bir YERİ vardır — (sütun, üst öğe, sıra). Üç liste bunu
/// eksiksiz anlatır:
///   Sections      → kenar çubuğunun 1. seviyesi
///   SettingsOrder → Ayarlar sayfasının 1. seviyesi
///   Items[üst]    → o üst öğenin çocukları (sütun üstten miras alınır)
///
/// Adı hiçbir listede geçmeyen öğe KODDAKİ yerinde kalır: sonradan eklenen bir
/// menü girişi eski bir düzen yüzünden kaybolmaz ya da yanlış sütuna düşmez.
/// </summary>
public class MenuLayout
{
    /// <summary>Kenar çubuğunun 1. seviyesindeki öğeler, sırasıyla.</summary>
    [JsonPropertyName("sections")]
    public List<string> Sections { get; set; } = new();

    /// <summary>Ayarlar sayfasının 1. seviyesindeki öğeler, sırasıyla.</summary>
    [JsonPropertyName("settingsOrder")]
    public List<string> SettingsOrder { get; set; } = new();

    /// <summary>Bir grubun çocukları — anahtar grubun menü adı, değer sıralı çocuk adları.</summary>
    [JsonPropertyName("items")]
    public Dictionary<string, List<string>> Items { get; set; } = new();

    /// <summary>Kullanıcının kendi kurduğu kategoriler. Yerleşimleri diğerleriyle aynı yoldan.</summary>
    [JsonPropertyName("groups")]
    public List<MenuLayoutGroup> Groups { get; set; } = new();

    /// <summary>Kullanıcının kendi eklediği kısayollar (site içi yol).</summary>
    [JsonPropertyName("links")]
    public List<MenuLayoutLink> Links { get; set; } = new();

    /// <summary>
    /// Tamamen gizlenen öğeler — iki yüzeyde de basılmaz. Bir GRUP gizlenirse
    /// alt ağacıyla birlikte gizlenir. Gizleme bir YETKİ DEĞİLDİR: sayfanın
    /// kendi adresi açılmaya devam eder, yalnız gezinmede görünmez.
    /// </summary>
    [JsonPropertyName("hidden")]
    public List<string> Hidden { get; set; } = new();

    /// <summary>Kullanıcı hiç dokunmadıysa true — menü koda gömülü hâliyle basılır.</summary>
    [JsonIgnore]
    public bool IsEmpty =>
        Sections.Count == 0 && SettingsOrder.Count == 0 && Items.Count == 0 &&
        Groups.Count == 0 && Links.Count == 0 && Hidden.Count == 0;

    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    /// <summary>
    /// Ham ayar değerini güvenli bir düzene çevirir. Bozuk, boş veya şişirilmiş
    /// değer BOŞ düzene düşer — menü hiçbir koşulda çökmez. (Aynı ilke
    /// ShellAppService.GetSavedViewsAsync'te de var.)
    /// </summary>
    public static MenuLayout Parse(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw) ||
            raw.Length > PlatformSettingDefaults.ShellMenuLayoutMaxChars)
        {
            return new MenuLayout();
        }

        MenuLayout? parsed;
        try
        {
            parsed = JsonSerializer.Deserialize<MenuLayout>(raw, SerializerOptions);
        }
        catch (JsonException)
        {
            return new MenuLayout();
        }

        return parsed == null ? new MenuLayout() : Normalize(parsed);
    }

    /// <summary>
    /// Normalize edip JSON'a çevirir ve sonucun <see cref="Parse"/> tarafından
    /// KABUL EDİLECEĞİNİ garanti eder.
    ///
    /// Normalize'ın izin verdiği üst sınırlar (60 ad × 128 karakter × 40 grup)
    /// ham uzunluk sınırından çok daha büyük bir JSON üretebiliyor. Kırpma
    /// burada yapılmazsa ayar sorunsuz KAYDEDİLİR, sonraki okumada Parse
    /// uzunluk kontrolünde reddeder ve kullanıcının düzeni sessizce kaybolur.
    /// En ucuz kırpma sondaki gruplar: 1. seviye sıralama (sections /
    /// settingsOrder) korunur, en içteki gruplar koddaki yerine döner.
    ///
    /// Sıra ÖNEMLİ: önce grup içi sıralar, sonra gizlemeler, en son kullanıcının
    /// kendi kurduğu kısayol/kategoriler. Sonuncular kullanıcının EMEK verdiği
    /// veri (ad + ikon + hedef yazdı); bir sıralama tercihinden daha değerli,
    /// o yüzden en sona bırakılır. Yine de sınıra dahiller: sonsuz döngüye
    /// düşmek yerine bir şeyi feda etmek, ayarın tümüyle reddedilmesinden iyi.
    /// </summary>
    public string Serialize()
    {
        var normalized = Normalize(this);
        var json = JsonSerializer.Serialize(normalized, SerializerOptions);
        if (json.Length <= PlatformSettingDefaults.ShellMenuLayoutMaxChars) { return json; }

        var shrinkers = new Func<bool>[]
        {
            () => Drop(normalized.Items),
            () => Drop(normalized.Hidden),
            () => Drop(normalized.Links),
            () => Drop(normalized.Groups)
        };

        foreach (var shrink in shrinkers)
        {
            while (json.Length > PlatformSettingDefaults.ShellMenuLayoutMaxChars && shrink())
            {
                json = JsonSerializer.Serialize(normalized, SerializerOptions);
            }
            if (json.Length <= PlatformSettingDefaults.ShellMenuLayoutMaxChars) { break; }
        }

        return json;
    }

    /// <summary>Sondaki girdiyi düşürür; düşürecek bir şey kalmadıysa false.</summary>
    private static bool Drop<T>(List<T> list)
    {
        if (list.Count == 0) { return false; }
        list.RemoveAt(list.Count - 1);
        return true;
    }

    private static bool Drop<TKey, TValue>(Dictionary<TKey, TValue> map) where TKey : notnull
    {
        if (map.Count == 0) { return false; }
        map.Remove(map.Keys.Last());
        return true;
    }

    /// <summary>
    /// Üst sınırları ve tekilliği uygular. Manipüle edilmiş bir istek ayarı
    /// şişiremesin diye her liste kırpılır; adlar trim'lenir ve tekilleştirilir.
    ///
    /// Bir ad birden çok yerde geçemez — yoksa öğe iki sütunda birden görünürdü.
    /// Öncelik: Sections → SettingsOrder → Items (deterministik olması yeterli;
    /// tarayıcı zaten çakışan bir yük üretmez).
    /// </summary>
    public static MenuLayout Normalize(MenuLayout source)
    {
        var seen = new HashSet<string>(StringComparer.Ordinal);

        var sections = CleanList(source.Sections, seen);
        var settingsOrder = CleanList(source.SettingsOrder, seen);

        var items = new Dictionary<string, List<string>>();
        foreach (var pair in source.Items ?? new Dictionary<string, List<string>>())
        {
            if (items.Count >= PlatformSettingDefaults.ShellMenuLayoutGroupMax) { break; }

            var key = CleanName(pair.Key);
            if (key == null || items.ContainsKey(key)) { continue; }

            var children = CleanList(pair.Value, seen);
            if (children.Count == 0) { continue; }

            items[key] = children;
        }

        return new MenuLayout
        {
            Sections = sections,
            SettingsOrder = settingsOrder,
            Items = items,
            Groups = CleanCustom(source.Groups, PlatformSettingDefaults.ShellMenuLayoutCustomGroupMax,
                                 g => new MenuLayoutGroup { Name = g.Name, Title = g.Title, Icon = g.Icon }),
            Links = CleanCustom(source.Links, PlatformSettingDefaults.ShellMenuLayoutCustomLinkMax,
                                l => new MenuLayoutLink { Name = l.Name, Title = l.Title, Icon = l.Icon, Url = l.Url })
                    .Where(l => l.Url.Length > 0)
                    .ToList(),
            // Gizleme yerleşimden BAĞIMSIZ: bir ad hem bir listede hem burada
            // olabilir, o yüzden `seen` tekilliğine katılmaz.
            Hidden = CleanList(source.Hidden, new HashSet<string>(StringComparer.Ordinal))
        };
    }

    /// <summary>
    /// Özel kategori/kısayol temizliği: ad ön eki, başlık uzunluğu, ikon beyaz
    /// listesi, kısayolda site içi yol kuralı ve adet tavanı.
    /// </summary>
    private static List<T> CleanCustom<T>(List<T>? source, int max, Func<T, T> copy)
        where T : MenuLayoutGroup, new()
    {
        if (source == null) { return new List<T>(); }

        var cleaned = new List<T>();
        var seen = new HashSet<string>(StringComparer.Ordinal);

        foreach (var raw in source)
        {
            if (raw == null || cleaned.Count >= max) { break; }

            var entry = copy(raw) as T ?? new T();
            entry.Name = CleanCustomName(raw.Name) ?? string.Empty;
            if (entry.Name.Length == 0 || !seen.Add(entry.Name)) { continue; }

            entry.Title = Clip(raw.Title, PlatformSettingDefaults.ShellMenuLayoutTitleMax);
            if (entry.Title.Length == 0) { continue; }

            entry.Icon = MenuIcons.Normalize(raw.Icon);

            if (entry is MenuLayoutLink link)
            {
                link.Url = NormalizePath((raw as MenuLayoutLink)?.Url);
            }

            cleaned.Add(entry);
        }

        return cleaned;
    }

    /// <summary>
    /// Özel ad yalnız ayrılmış ön ekle ve yalın karakterlerle olabilir. Alt
    /// çizgi YASAK: LeptonX `MenuItem_Apya_User_ab12` basıyor ve kabuk JS'i
    /// `_` → `.` çevirisiyle adı geri okuyor; ada alt çizgi girerse o çeviri
    /// sessizce bozulur.
    /// </summary>
    private static string? CleanCustomName(string? name)
    {
        name = name?.Trim();
        if (string.IsNullOrEmpty(name) ||
            name.Length > PlatformSettingDefaults.ShellMenuLayoutNameMax ||
            !name.StartsWith(PlatformSettingDefaults.ShellMenuLayoutCustomPrefix, StringComparison.Ordinal))
        {
            return null;
        }

        var suffix = name.Substring(PlatformSettingDefaults.ShellMenuLayoutCustomPrefix.Length);
        if (suffix.Length == 0 || !suffix.All(char.IsLetterOrDigit)) { return null; }

        return name;
    }

    private static string Clip(string? value, int max)
    {
        value = (value ?? string.Empty).Trim();
        return value.Length <= max ? value : value.Substring(0, max);
    }

    /// <summary>
    /// Yalnız site içi YOL bırakır ("/Tasks"). Manipüle edilmiş bir istek başka
    /// bir origin'e götüren "kısayol" bırakamasın diye şema/host taşıyan ve
    /// protokol-göreli ("//site") değerler elenir. Aynı kural
    /// ShellAppService.NormalizeScreen'de de var — kayıtlı görünümler için
    /// yazılmıştı, kısayollar da aynı yüzey.
    /// </summary>
    private static string NormalizePath(string? url)
    {
        url = (url ?? string.Empty).Trim();
        if (url.Length == 0) { return string.Empty; }

        // Mutlak adres REDDEDİLİR, yoluna indirgenmez.
        //
        // ShellAppService.NormalizeScreen (kayıtlı görünümler) mutlak adresi
        // PathAndQuery'ye çeviriyor; orada değer EKRANIN KENDİ URL'inden
        // üretildiği için makul. Burada ise metni kullanıcı yazıyor:
        // "https://baska-site.example/x" sessizce "/x" olsaydı kısayol,
        // yazılandan bambaşka bir sayfaya giderdi. Açık yönlendirme değil ama
        // sessizce yanlış hedef; kullanıcıya "geçersiz" demek doğrusu.
        if (Uri.TryCreate(url, UriKind.Absolute, out _)) { return string.Empty; }

        if (!url.StartsWith('/') || url.StartsWith("//"))
        {
            return string.Empty;
        }
        return Clip(url, PlatformSettingDefaults.ShellMenuLayoutUrlMax);
    }

    private static List<string> CleanList(List<string>? names, HashSet<string> seen)
    {
        if (names == null) { return new List<string>(); }

        var cleaned = new List<string>();
        foreach (var raw in names)
        {
            if (cleaned.Count >= PlatformSettingDefaults.ShellMenuLayoutListMax) { break; }

            var name = CleanName(raw);
            if (name == null || !seen.Add(name)) { continue; }

            cleaned.Add(name);
        }
        return cleaned;
    }

    private static string? CleanName(string? name)
    {
        name = name?.Trim();
        if (string.IsNullOrEmpty(name) ||
            name.Length > PlatformSettingDefaults.ShellMenuLayoutNameMax)
        {
            return null;
        }
        return name;
    }
}

/// <summary>Kullanıcının kendi kurduğu kategori. JSON anahtarları kısa: ayar değeri sınırlı uzunlukta.</summary>
public class MenuLayoutGroup
{
    /// <summary>"Apya.User.&lt;alfasayısal&gt;" — koddaki adlarla çakışmayan ayrılmış ad alanı.</summary>
    [JsonPropertyName("n")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("t")]
    public string Title { get; set; } = string.Empty;

    /// <summary>Yalnız <see cref="MenuIcons.All"/> içinden; liste dışı değer varsayılana düşer.</summary>
    [JsonPropertyName("i")]
    public string Icon { get; set; } = MenuIcons.Default;
}

/// <summary>Kullanıcının kendi eklediği kısayol — kategoriden tek farkı hedef yolu.</summary>
public class MenuLayoutLink : MenuLayoutGroup
{
    /// <summary>Site içi yol ("/Tasks"). Dış adres kabul edilmez.</summary>
    [JsonPropertyName("u")]
    public string Url { get; set; } = string.Empty;
}
