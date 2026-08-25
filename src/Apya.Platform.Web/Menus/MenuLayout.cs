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

    /// <summary>Kullanıcı hiç dokunmadıysa true — menü koda gömülü hâliyle basılır.</summary>
    [JsonIgnore]
    public bool IsEmpty => Sections.Count == 0 && SettingsOrder.Count == 0 && Items.Count == 0;

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
    /// </summary>
    public string Serialize()
    {
        var normalized = Normalize(this);
        var json = JsonSerializer.Serialize(normalized, SerializerOptions);

        while (json.Length > PlatformSettingDefaults.ShellMenuLayoutMaxChars &&
               normalized.Items.Count > 0)
        {
            normalized.Items.Remove(normalized.Items.Keys.Last());
            json = JsonSerializer.Serialize(normalized, SerializerOptions);
        }

        return json;
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
            Items = items
        };
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
