using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using Apya.Platform.Settings;

namespace Apya.Platform.Web.Menus;

/// <summary>
/// Kullanıcının kenar çubuğu düzeni — <see cref="PlatformSettings.Shell.MenuLayout"/>
/// ayarının çözülmüş hâli. Menü ADI saklanır, etiketi değil (Shell.Pins ile aynı
/// gerekçe: dil ya da etiket değişince düzen kaybolmasın).
///
/// Listede olmayan ad varsayılan yerinde kalır → sonradan koda eklenen bir menü
/// öğesi, kaydedilmiş eski düzen yüzünden kaybolmaz veya yanlış yere düşmez.
/// </summary>
public class MenuLayout
{
    /// <summary>1. seviye öğelerin sırası (menü adı).</summary>
    [JsonPropertyName("sections")]
    public List<string> Sections { get; set; } = new();

    /// <summary>Bir grubun çocuklarının sırası — anahtar grubun menü adı.</summary>
    [JsonPropertyName("items")]
    public Dictionary<string, List<string>> Items { get; set; } = new();

    /// <summary>Ayarlar sayfasından kenar çubuğuna ("Yönetim" grubuna) alınan bağlantılar.</summary>
    [JsonPropertyName("toSidebar")]
    public List<string> ToSidebar { get; set; } = new();

    /// <summary>Kenar çubuğundan Ayarlar sayfasına indirilen yaprak öğeler.</summary>
    [JsonPropertyName("toSettings")]
    public List<string> ToSettings { get; set; } = new();

    /// <summary>Ayarlar sayfasındaki listenin sırası.</summary>
    [JsonPropertyName("settingsOrder")]
    public List<string> SettingsOrder { get; set; } = new();

    /// <summary>Kullanıcı hiç dokunmadıysa true — menü koda gömülü hâliyle basılır.</summary>
    [JsonIgnore]
    public bool IsEmpty =>
        Sections.Count == 0 && Items.Count == 0 &&
        ToSidebar.Count == 0 && ToSettings.Count == 0 && SettingsOrder.Count == 0;

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

    public string Serialize()
    {
        return JsonSerializer.Serialize(Normalize(this), SerializerOptions);
    }

    /// <summary>
    /// Üst sınırları ve tekilliği uygular. Manipüle edilmiş bir istek ayarı
    /// şişiremesin diye her liste kırpılır; adlar trim'lenir ve tekilleştirilir.
    /// </summary>
    public static MenuLayout Normalize(MenuLayout source)
    {
        var toSettings = CleanList(source.ToSettings);
        var toSidebar = CleanList(source.ToSidebar)
            // Aynı ad iki yönde birden olamaz — manipüle edilmiş yükte
            // deterministik davranmak için Ayarlar tarafı kazanır.
            .Where(n => !toSettings.Contains(n))
            .ToList();

        var items = new Dictionary<string, List<string>>();
        foreach (var pair in source.Items ?? new Dictionary<string, List<string>>())
        {
            if (items.Count >= PlatformSettingDefaults.ShellMenuLayoutGroupMax) { break; }

            var key = CleanName(pair.Key);
            if (key == null || items.ContainsKey(key)) { continue; }

            var children = CleanList(pair.Value);
            if (children.Count == 0) { continue; }

            items[key] = children;
        }

        return new MenuLayout
        {
            Sections = CleanList(source.Sections),
            Items = items,
            ToSidebar = toSidebar,
            ToSettings = toSettings,
            SettingsOrder = CleanList(source.SettingsOrder)
        };
    }

    private static List<string> CleanList(List<string>? names)
    {
        if (names == null) { return new List<string>(); }

        return names
            .Select(CleanName)
            .Where(n => n != null)
            .Select(n => n!)
            .Distinct(StringComparer.Ordinal)
            .Take(PlatformSettingDefaults.ShellMenuLayoutListMax)
            .ToList();
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
