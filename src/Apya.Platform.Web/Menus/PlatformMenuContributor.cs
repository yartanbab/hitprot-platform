using System.Threading.Tasks;
using Apya.Platform.Localization;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.UI.Navigation;

namespace Apya.Platform.Web.Menus;

public class PlatformMenuContributor : IMenuContributor
{
    public async Task ConfigureMenuAsync(MenuConfigurationContext context)
    {
        if (context.Menu.Name == StandardMenus.Main)
        {
            await ConfigureMainMenuAsync(context);
        }
        else if (context.Menu.Name == StandardMenus.User)
        {
            ConfigureUserMenu(context);
        }
    }

    // Sağ üst avatar menüsüne kişisel "Genel Ayarlar" linki. Yalnız oturumlu kullanıcı
    // bu menüyü görür → ayrı izin gerekmez.
    private void ConfigureUserMenu(MenuConfigurationContext context)
    {
        var l = context.GetLocalizer<PlatformResource>();
        context.Menu.AddItem(new ApplicationMenuItem(
            "Apya.Account.Settings",
            l["Menu:GeneralSettings"],
            icon: "fa fa-sliders",
            url: "/Settings",
            order: 100));

        // Tanıtım turunu istenildiği zaman yeniden açar. Menü öğesi bir URL taşımak
        // zorunda olduğu için modal doğrudan tetiklenemez; ?tur=1 ile Dashboard'a
        // gidilir, ProductTourViewComponent bu işareti görüp pencereyi açar ve
        // adresi temizler.
        context.Menu.AddItem(new ApplicationMenuItem(
            "Apya.Account.Tour",
            l["Menu:ProductTour"],
            icon: "fa fa-circle-play",
            url: "/Dashboard?tur=1",
            order: 101));
    }

    /// <summary>
    /// Menü AĞACI artık burada kurulmuyor — PlatformNavigationResolver kuruyor
    /// ve kullanıcının menü düzenini (sıra + Ayarlar'a/kenar çubuğuna taşımalar)
    /// uygulanmış hâlde veriyor. Aynı sonucu Ayarlar sayfası ve menü düzenleme
    /// ekranı da okuyor; liste burada kalsaydı iki yüzey ayrışırdı.
    /// </summary>
    private async Task ConfigureMainMenuAsync(MenuConfigurationContext context)
    {
        var resolver = context.ServiceProvider.GetRequiredService<PlatformNavigationResolver>();
        var resolution = await resolver.ResolveAsync();

        foreach (var item in resolution.Sidebar)
        {
            context.Menu.AddItem(item);
        }

        // ── YÖNETİM bölümü kaldırıldı ─────────────────────────────────────────
        // Kabuk handoff'u (2026-08-13): 7 maddelik YÖNETİM bölümü günlük işi
        // boğuyordu. Hepsi tek "Ayarlar" girişine indi; hedefler /Settings
        // sayfasındaki izin-filtreli bağlantı listesinden açılır (sekme YOK,
        // ABP modül sayfaları kendi route'larında durmaya devam eder).
        //   Kurlar        → FİNANS
        //   Sistem Sağlığı → PLATFORM
        //   Kiracı · Kimlik · Ayar Yönetimi · Paket · Tasarım Sistemi ·
        //   Geri Bildirim · Giriş Ekranı → /Settings
        //
        // TenantManagement/Identity/SettingManagement öğelerini bu gruba KENDİ
        // contributor'ları ekliyor ve onlar bizden ÖNCE çalışıyor (bu yüzden
        // eskiden SetSubItemOrder ile sıralayabiliyorduk). Grubu burada düşürmek
        // hepsini birden düşürür.
        //
        // GetAdministration() DEĞİL GetMenuItemOrNull(): ilki öğe yoksa
        // AbpException fırlatıyor ve grup kaldırıldıktan sonra bir daha geri
        // gelmiyor (menü nesnesi her istekte sıfırdan kurulmuyor). Fırlatan
        // sürümle 8 sayfa render'ı 500 veriyordu — test paketi yakaladı.
        var administration = context.Menu.GetMenuItemOrNull(
            DefaultMenuNames.Application.Main.Administration);
        if (administration != null)
        {
            context.Menu.Items.Remove(administration);
        }
    }
}
