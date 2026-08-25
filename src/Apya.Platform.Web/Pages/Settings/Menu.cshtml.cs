using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Settings;
using Apya.Platform.Web.Menus;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.SettingManagement;
using Volo.Abp.UI.Navigation;

namespace Apya.Platform.Web.Pages.Settings;

/// <summary>
/// "Menü Düzeni" — kenar çubuğunun sırasını değiştirme ve öğeleri kenar çubuğu
/// ile Ayarlar sayfası arasında taşıma ekranı.
///
/// İzin kapısı YOK: düzen kullanıcıya özeldir (Shell.Pins ile aynı ray) ve
/// kimsenin göremediği bir ekranı açmaz — resolver her iki yüzeyi de izinle
/// filtreler, buradan gelen menü ADI listesi yalnız SIRA/KONUM bilgisidir.
/// </summary>
[Authorize]
public class MenuModel : AbpPageModel
{
    /// <summary>Kenar çubuğu sütunu — 1. seviye öğeler ve alt ağaçları.</summary>
    public List<NavNode> Sidebar { get; private set; } = new();

    /// <summary>Ayarlar sayfası sütunu.</summary>
    public List<NavSettingsLink> SettingsLinks { get; private set; } = new();

    /// <summary>Kullanıcı düzeni hiç değiştirmediyse "Varsayılana dön" gösterilmez.</summary>
    public bool HasCustomLayout { get; private set; }

    /// <summary>Tarayıcının kurduğu düzen JSON'u — MenuLayout şemasıyla aynı.</summary>
    [BindProperty]
    public string LayoutJson { get; set; } = string.Empty;

    /// <summary>Düzenleme ekranındaki bir satır.</summary>
    public record NavNode(
        string Name,
        string Title,
        string Icon,
        bool IsGroup,
        bool IsLocked,
        List<NavNode> Children);

    private readonly PlatformNavigationResolver _navigation;
    private readonly ISettingManager _settingManager;

    public MenuModel(PlatformNavigationResolver navigation, ISettingManager settingManager)
    {
        _navigation = navigation;
        _settingManager = settingManager;
    }

    public async Task OnGetAsync()
    {
        var resolution = await _navigation.ResolveAsync();

        Sidebar = resolution.Sidebar.Select(ToNode).ToList();
        SettingsLinks = resolution.SettingsLinks;
        HasCustomLayout = !resolution.Layout.IsEmpty;

        AddMissingHomeGroups();
    }

    private static NavNode ToNode(ApplicationMenuItem item)
    {
        return new NavNode(
            item.Name,
            item.DisplayName,
            item.Icon ?? string.Empty,
            IsGroup: item.Items.Count > 0,
            // Ayarlar kapısının kendisi taşınamaz/sıralanamaz — taşınırsa
            // kullanıcının düzeni geri alacağı ekran kaybolur.
            IsLocked: item.Name == PlatformNavigationResolver.SettingsItemName,
            item.Items.Select(ToNode).ToList());
    }

    /// <summary>
    /// Ayarlar sütunundaki bir öğenin geri döneceği grup kenar çubuğunda
    /// görünmüyorsa (henüz hiç öğe taşınmadığı için doğmamış "Yönetim" grubu ya
    /// da tüm çocukları taşındığı için düşmüş bir bölüm) BOŞ olarak eklenir.
    /// Yoksa öğenin hedefi ekranda hiç olmaz ve geri alınamaz.
    /// </summary>
    private void AddMissingHomeGroups()
    {
        var present = new HashSet<string>();
        void Collect(IEnumerable<NavNode> nodes)
        {
            foreach (var node in nodes)
            {
                present.Add(node.Name);
                Collect(node.Children);
            }
        }
        Collect(Sidebar);

        foreach (var link in SettingsLinks)
        {
            if (link.HomeGroupName.Length == 0 || !present.Add(link.HomeGroupName)) { continue; }

            var node = new NavNode(
                link.HomeGroupName, link.HomeGroupTitle, link.HomeGroupIcon,
                IsGroup: true, IsLocked: false, new List<NavNode>());

            // Kilitli "Ayarlar" satırının ÜSTÜNE: o satır "her zaman dipte"
            // diyor, altında bir grup belirirse ekran kendi kuralını yalanlar.
            var locked = Sidebar.FindIndex(n => n.IsLocked);
            if (locked >= 0) { Sidebar.Insert(locked, node); } else { Sidebar.Add(node); }
        }
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // Doğrulama MenuLayout.Parse'ta: bozuk/şişirilmiş JSON boş düzene düşer.
        // Ayrıca listedeki adlar SUNUCUDA kurulan ağaçla eşleştirilir — tanınmayan
        // ad yok sayılır, "toSidebar"daki hedefe izin yoksa yine basılmaz.
        // Yani buradan yetki yükseltilemez, yalnız sıra/konum bildirilir.
        var layout = MenuLayout.Parse(LayoutJson);

        await _settingManager.SetForCurrentUserAsync(
            PlatformSettings.Shell.MenuLayout,
            layout.IsEmpty ? null : layout.Serialize());

        TempData["Saved"] = true;
        return RedirectToPage();
    }

    /// <summary>Kayıtlı düzeni siler — menü koda gömülü varsayılan hâline döner.</summary>
    public async Task<IActionResult> OnPostResetAsync()
    {
        await _settingManager.SetForCurrentUserAsync(PlatformSettings.Shell.MenuLayout, null);

        TempData["Saved"] = true;
        return RedirectToPage();
    }
}
