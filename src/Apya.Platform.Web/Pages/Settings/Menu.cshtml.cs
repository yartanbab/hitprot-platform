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
/// filtreler, buradan gelen menü ADI listesi yalnız YER bilgisidir.
/// </summary>
[Authorize]
public class MenuModel : AbpPageModel
{
    /// <summary>Kenar çubuğu sütunu.</summary>
    public List<NavNode> Sidebar { get; private set; } = new();

    /// <summary>Ayarlar sayfası sütunu — grup girdileri çocuklarıyla gelir.</summary>
    public List<NavNode> SettingsColumn { get; private set; } = new();

    /// <summary>Kullanıcı düzeni hiç değiştirmediyse "Varsayılana dön" gösterilmez.</summary>
    public bool HasCustomLayout { get; private set; }

    /// <summary>Tarayıcının kurduğu düzen JSON'u — MenuLayout şemasıyla aynı.</summary>
    [BindProperty]
    public string LayoutJson { get; set; } = string.Empty;

    /// <summary>Düzenleme ekranındaki bir satır. İki sütun da aynı tipi kullanır.</summary>
    public record NavNode(
        string Name,
        string Title,
        string Icon,
        bool IsGroup,
        bool IsLocked,
        bool IsAdminLink,
        bool IsCustom,
        string Url,
        /// <summary>
        /// Gizlenmeden önceki üst öğe — yalnız Gizlenenler bölmesindeki KÖK
        /// satırlarda dolu. Boşsa markup data-nav-from basmaz ve tarayıcı
        /// "geri getir"i kenar çubuğunun köküne düşürür.
        /// </summary>
        string From,
        List<NavNode> Children);

    /// <summary>Gizlenenler bölmesi — buradan geri alınabilirler.</summary>
    public List<NavNode> HiddenItems { get; private set; } = new();

    /// <summary>
    /// Formda listelenecek ikonlar. Beyaz liste SUNUCUDA da uygulanıyor
    /// (MenuIcons.Normalize); buradaki yalnız seçim yüzeyi.
    /// </summary>
    public IReadOnlyList<string> IconChoices => MenuIcons.All;

    /// <summary>Kullanıcının kendi kurduğu kategori/kısayol mu? (adı ayrılmış ön ekle başlar)</summary>
    private static bool IsCustomName(string name)
    {
        return name.StartsWith(
            PlatformSettingDefaults.ShellMenuLayoutCustomPrefix, System.StringComparison.Ordinal);
    }

    /// <summary>Katalogdan gelen adlar — kenar çubuğu sütununda da işaretlenir.</summary>
    private static readonly HashSet<string> AdminLinkNames =
        PlatformAdminLinks.All.Select(x => x.Name).ToHashSet(System.StringComparer.Ordinal);

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

        Sidebar = resolution.Sidebar.Select(FromMenuItem).ToList();
        SettingsColumn = resolution.SettingsLinks.Select(FromSettingsEntry).ToList();
        HasCustomLayout = !resolution.Layout.IsEmpty;

        HiddenItems = resolution.Hidden.Select(FromHiddenEntry).ToList();

        RestoreEmptyGroups(resolution.EmptyGroups);
    }

    /// <summary>
    /// Gizli girdi → satır. Çocuklar ŞART: grup çocuksuz basılırsa tarayıcı
    /// düzeni DOM'dan kurarken items[grup] anahtarını hiç yazmaz ve sonraki
    /// herhangi bir kayıt çocukların o gruba ait olduğu bilgisini siler.
    /// </summary>
    private static NavNode FromHiddenEntry(NavHiddenEntry entry)
    {
        return new NavNode(
            entry.Name, entry.Title, entry.Icon, entry.IsGroup,
            IsLocked: false, IsAdminLink: false, entry.IsCustom, entry.Url, entry.From,
            entry.Children.Select(FromHiddenEntry).ToList());
    }

    private static NavNode FromMenuItem(ApplicationMenuItem item)
    {
        return new NavNode(
            item.Name,
            item.DisplayName,
            item.Icon ?? string.Empty,
            IsGroup: string.IsNullOrEmpty(item.Url),
            // Ayarlar kapısının kendisi taşınamaz/sıralanamaz — taşınırsa
            // kullanıcının düzeni geri alacağı ekran kaybolur.
            IsLocked: item.Name == PlatformNavigationResolver.SettingsItemName,
            IsAdminLink: AdminLinkNames.Contains(item.Name),
            IsCustom: IsCustomName(item.Name),
            Url: item.Url ?? string.Empty, From: string.Empty,
            item.Items.Select(FromMenuItem).ToList());
    }

    private static NavNode FromSettingsEntry(NavSettingsEntry entry)
    {
        return new NavNode(
            entry.Name, entry.Title, entry.Icon,
            entry.IsGroup, IsLocked: false, entry.IsAdminLink,
            IsCustom: IsCustomName(entry.Name), entry.Url, From: string.Empty,
            entry.Children.Select(FromSettingsEntry).ToList());
    }

    /// <summary>
    /// İçi boşaldığı için iki yüzeyden de ayıklanan grupları düzenleme ekranına
    /// geri koyar. Serbest yerleşimde boş bir grup geçerli bir BIRAKMA HEDEFİDİR;
    /// ekranda görünmezse kullanıcının oraya öğe döndürme yolu kapanır. En
    /// bilinen hâli, henüz içine bir şey taşınmamış "Yönetim" grubu.
    /// </summary>
    private void RestoreEmptyGroups(List<NavEmptyGroup> emptyGroups)
    {
        foreach (var group in emptyGroups)
        {
            var node = new NavNode(
                group.Name, group.Title, group.Icon,
                IsGroup: true, IsLocked: false, IsAdminLink: false,
                IsCustom: IsCustomName(group.Name), Url: string.Empty, From: string.Empty,
                new List<NavNode>());

            if (group.InSettings)
            {
                SettingsColumn.Add(node);
                continue;
            }

            // Kilitli "Ayarlar" satırının ÜSTÜNE: o satır "her zaman dipte"
            // diyor, altında bir grup belirirse ekran kendi kuralını yalanlar.
            var locked = Sidebar.FindIndex(n => n.IsLocked);
            if (locked >= 0) { Sidebar.Insert(locked, node); } else { Sidebar.Add(node); }
        }
    }

    public async Task<IActionResult> OnPostAsync()
    {
        // Doğrulama MenuLayout.Parse'ta: bozuk/şişirilmiş JSON boş düzene düşer.
        // Ayrıca adlar SUNUCUDA kurulan havuzla eşleştirilir — tanınmayan ad,
        // yaprağın altına yerleştirme, döngü ve fazla derinlik yok sayılır ve
        // ilgili düğüm koddaki yerine döner. Yani buradan yetki yükseltilemez;
        // gelen yalnızca YER bilgisidir, her hedef ayrıca izinden geçer.
        var layout = MenuLayout.Parse(LayoutJson);

        // Parse bozuk/şişirilmiş yükü BOŞ düzene düşürüyor. Bunu "kullanıcı
        // her şeyi boşalttı" sanıp kaydedersek kayıtlı düzeni SİLERİZ, üstelik
        // ekranda "kaydedildi" yazarız. Gelen yük doluysa ama çözülemiyorsa
        // kaydetme iptal edilir ve ekran hatayla yeniden basılır.
        if (layout.IsEmpty && !string.IsNullOrWhiteSpace(LayoutJson))
        {
            ModelState.AddModelError(string.Empty, L["MenuLayout:SaveFailed"]);
            await OnGetAsync();
            return Page();
        }

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
