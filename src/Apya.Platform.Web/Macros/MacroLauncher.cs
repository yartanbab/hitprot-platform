using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Macros;
using Apya.Platform.Macros.Dtos;
using Apya.Platform.Settings;
using Apya.Platform.Web.Menus;
using Microsoft.Extensions.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Web.Macros;

/// <summary>
/// Makro Ekran'ın listesini kurar: katalogdan (<see cref="MacroCatalog"/>) kullanıcının
/// görebildiklerini süzer, host ayarını uygular (gizli/kapsam dışı düşer, ad ve ikon değişebilir);
/// sabitlenenler (kenar çubuğuyla ORTAK ayar) önce, gerisi son 30 günde en çok kullanılandan aza,
/// eşitlikte host sırası, o da yoksa katalog sırası.
///
/// <para>Görünürlük iki kaynaktan gelir ve ikisi de makroya özgü değildir: menüye bağlı
/// bağlantıda menü ağacı (<see cref="PlatformNavigationResolver.GetGrantedLinksAsync"/>),
/// adresli makroda katalogdaki izin. Host ayarı yalnız DARALTIR — izni olmayana makro açmaz.
/// Sunucu bir makroyu basmıyorsa istemci de onu bilmez.</para>
/// </summary>
public class MacroLauncher : IScopedDependency
{
    private readonly PlatformNavigationResolver _navigation;
    private readonly IPermissionChecker _permission;
    private readonly IStringLocalizer<PlatformResource> _l;
    private readonly IMacroScreenAppService _macroScreen;

    public MacroLauncher(
        PlatformNavigationResolver navigation,
        IPermissionChecker permission,
        IStringLocalizer<PlatformResource> l,
        IMacroScreenAppService macroScreen)
    {
        _navigation = navigation;
        _permission = permission;
        _l = l;
        _macroScreen = macroScreen;
    }

    public async Task<MacroScreen> GetAsync()
    {
        // Kullanım + sabitleme (kayıt yoksa host varsayılanlarıyla) + host ayarı tek çağrıda;
        // kenar çubuğu aynı sabitleme listesini kabuk durumundan okur (MacroSettingsProvider).
        var layout = await _macroScreen.GetMyLayoutAsync();
        var items = ApplySettings(await GetVisibleAsync(), layout.Settings);

        return new MacroScreen
        {
            Items = Order(items, layout.Pins, layout.Usage),
            Pins = layout.Pins,
            MaxPins = PlatformSettingDefaults.ShellPinsMax
        };
    }

    /// <summary>Kullanıcının görebildiği makrolar, katalog sırasıyla (host ayarı ve sabitleme uygulanmamış).</summary>
    public async Task<List<MacroItem>> GetVisibleAsync()
    {
        var links = await _navigation.GetGrantedLinksAsync();
        var items = new List<MacroItem>();

        for (var index = 0; index < MacroCatalog.All.Count; index++)
        {
            var definition = MacroCatalog.All[index];
            if (definition.MenuName != null)
            {
                if (!links.TryGetValue(definition.MenuName, out var link))
                {
                    continue;
                }

                items.Add(new MacroItem(definition, index, link.DisplayName, link.Url!,
                    definition.Icon ?? link.Icon ?? "fa fa-bolt", _l[definition.AreaKey]));
            }
            else if (await _permission.IsGrantedAsync(definition.Permission!))
            {
                items.Add(new MacroItem(definition, index, _l[definition.TitleKey!], definition.Url!,
                    definition.Icon!, _l[definition.AreaKey]));
            }
        }

        return items;
    }

    /// <summary>
    /// Host ayarını uygular: görünmeyen (gizli ya da kullanıcı kapsam dışı) düşer; ad ve ikon host'unki
    /// olur; host sırası kullanım eşitliğinde sıralamaya girer. Ayar kaydı olmayan makro olduğu gibi kalır.
    /// </summary>
    public static List<MacroItem> ApplySettings(IEnumerable<MacroItem> items, IEnumerable<MacroSettingViewDto> settings)
    {
        var byKey = settings.ToDictionary(s => s.Key, StringComparer.Ordinal);
        var result = new List<MacroItem>();
        foreach (var item in items)
        {
            if (byKey.TryGetValue(item.Key, out var setting))
            {
                if (!setting.IsVisible)
                {
                    continue;
                }

                item.Title = setting.DisplayName ?? item.Title;
                item.Icon = setting.Icon ?? item.Icon;
                item.HostOrder = setting.SortOrder;
            }

            result.Add(item);
        }

        return result;
    }

    /// <summary>
    /// Sabitlenenler önce (sabitlenme sırasıyla); gerisi son 30 günlük kullanıma göre çoktan aza,
    /// eşitlikte <see cref="MacroItem.TieBreakOrder"/> (host sırası, yoksa katalog). Sabitli adın
    /// karşılığı yoksa (izin değişmiş, menü öğesi kalkmış, host gizlemiş) sessizce atlanır — kenar
    /// çubuğuyla aynı davranış. İstemci (Index.js reorder) aynı kuralı uygular.
    /// </summary>
    public static List<MacroItem> Order(
        IReadOnlyList<MacroItem> items,
        IReadOnlyList<string> pins,
        IReadOnlyDictionary<string, int>? usage = null)
    {
        foreach (var item in items)
        {
            item.UsageCount = usage != null && usage.TryGetValue(item.Key, out var count) ? count : 0;
        }

        var byPin = items.ToDictionary(item => item.PinName, StringComparer.Ordinal);
        var pinned = pins.Where(byPin.ContainsKey).Distinct().Select(pin => byPin[pin]).ToList();
        foreach (var item in pinned)
        {
            item.IsPinned = true;
        }

        var rest = items.Where(item => !item.IsPinned)
            .OrderByDescending(item => item.UsageCount)
            .ThenBy(item => item.TieBreakOrder);
        return pinned.Concat(rest).ToList();
    }
}

/// <summary>Ekrana basılacak liste + istemcinin sabitleme için bilmesi gerekenler.</summary>
public class MacroScreen
{
    public List<MacroItem> Items { get; init; } = new();

    /// <summary>Ayardaki TÜM adlar (menü iğneleri dahil) — istemci listeyi bütün olarak geri yazar.</summary>
    public List<string> Pins { get; init; } = new();

    public int MaxPins { get; init; }
}

public class MacroItem
{
    public MacroItem(MacroDefinition definition, int catalogIndex, string title, string url, string icon, string area)
    {
        Key = definition.Key;
        CatalogIndex = catalogIndex;
        Kind = definition.Kind;
        PinName = definition.PinName;
        Title = title;
        Url = url;
        Icon = icon;
        Area = area;
    }

    public string Key { get; }

    /// <summary>Katalogdaki sıra.</summary>
    public int CatalogIndex { get; }

    public MacroKind Kind { get; }
    public string PinName { get; }

    /// <summary>Katalog/menü adı ya da host'un verdiği ad.</summary>
    public string Title { get; set; }

    public string Url { get; }

    /// <summary>Katalog/menü ikonu ya da host'un verdiği ikon.</summary>
    public string Icon { get; set; }

    public string Area { get; }
    public bool IsPinned { get; set; }

    /// <summary>Son 30 gündeki kullanım (Makro Ekran'dan başlatma sayısı).</summary>
    public int UsageCount { get; set; }

    /// <summary>Host'un verdiği sıra (0–999); yoksa null.</summary>
    public int? HostOrder { get; set; }

    /// <summary>
    /// Kullanım eşitliğinde sıra: host sırası verilmişse önce o (katalog sırası kendi içinde), yoksa
    /// katalog sırası. İstemci aynı değeri <c>data-order</c>'dan okur.
    /// </summary>
    public int TieBreakOrder => (HostOrder ?? 999_999) * 1000 + CatalogIndex;
}
