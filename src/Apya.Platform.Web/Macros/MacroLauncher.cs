using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.Macros;
using Apya.Platform.Settings;
using Apya.Platform.Web.Menus;
using Microsoft.Extensions.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.SettingManagement;

namespace Apya.Platform.Web.Macros;

/// <summary>
/// Makro Ekran'ın listesini kurar: katalogdan (<see cref="MacroCatalog"/>) kullanıcının
/// görebildiklerini süzer, kenar çubuğuyla ORTAK sabitleme ayarına göre dizer.
///
/// <para>Görünürlük iki kaynaktan gelir ve ikisi de makroya özgü değildir: menüye bağlı
/// bağlantıda menü ağacı (<see cref="PlatformNavigationResolver.GetGrantedLinksAsync"/>),
/// adresli makroda katalogdaki izin. Sunucu bir makroyu basmıyorsa istemci de onu bilmez.</para>
/// </summary>
public class MacroLauncher : IScopedDependency
{
    private readonly PlatformNavigationResolver _navigation;
    private readonly IPermissionChecker _permission;
    private readonly ISettingManager _settingManager;
    private readonly IStringLocalizer<PlatformResource> _l;

    public MacroLauncher(
        PlatformNavigationResolver navigation,
        IPermissionChecker permission,
        ISettingManager settingManager,
        IStringLocalizer<PlatformResource> l)
    {
        _navigation = navigation;
        _permission = permission;
        _settingManager = settingManager;
        _l = l;
    }

    public async Task<MacroScreen> GetAsync()
    {
        var items = await GetVisibleAsync();

        // ShellAppService.GetPinsAsync ile AYNI okuma: kullanıcı kaydı yoksa varsayılan liste.
        var raw = await _settingManager.GetOrNullForCurrentUserAsync(PlatformSettings.Shell.Pins)
                  ?? PlatformSettingDefaults.ShellPins;
        var pins = raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                      .Distinct()
                      .ToList();

        return new MacroScreen
        {
            Items = Order(items, pins),
            Pins = pins,
            MaxPins = PlatformSettingDefaults.ShellPinsMax
        };
    }

    /// <summary>Kullanıcının görebildiği makrolar, katalog sırasıyla (sabitleme uygulanmamış).</summary>
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
    /// Sabitlenenler önce (sabitlenme sırasıyla), gerisi katalog sırasıyla. Sabitli adın
    /// karşılığı yoksa (izin değişmiş, menü öğesi kalkmış) sessizce atlanır — kenar çubuğuyla
    /// aynı davranış.
    /// </summary>
    public static List<MacroItem> Order(IReadOnlyList<MacroItem> items, IReadOnlyList<string> pins)
    {
        var byPin = items.ToDictionary(item => item.PinName, StringComparer.Ordinal);
        var pinned = pins.Where(byPin.ContainsKey).Distinct().Select(pin => byPin[pin]).ToList();
        foreach (var item in pinned)
        {
            item.IsPinned = true;
        }

        return pinned.Concat(items.Where(item => !item.IsPinned)).ToList();
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

    /// <summary>Katalogdaki sıra — istemci sabitleme sonrası yeniden dizerken kullanır.</summary>
    public int CatalogIndex { get; }

    public MacroKind Kind { get; }
    public string PinName { get; }
    public string Title { get; }
    public string Url { get; }
    public string Icon { get; }
    public string Area { get; }
    public bool IsPinned { get; set; }
}
