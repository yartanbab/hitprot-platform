using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.MultiTenancy;
using Volo.Abp.Identity.Web.Navigation;
using Volo.Abp.SettingManagement.Web.Navigation;
using Volo.Abp.TenantManagement.Web.Navigation;
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
    }

    private Task ConfigureMainMenuAsync(MenuConfigurationContext context)
    {
        var administration = context.Menu.GetAdministration();
        var l = context.GetLocalizer<PlatformResource>();

        context.Menu.Items.Insert(
            0,
            new ApplicationMenuItem(
                PlatformMenus.Home,
                l["Menu:Home"],
                "~/",
                icon: "fas fa-home",
                order: 0
            )
        );

        // --- PROJELER MENÜSÜ DÜZELTMESİ ---
        context.Menu.AddItem(
            new ApplicationMenuItem(
                "Platform.Projects",    // Menü ID
                l["Permission:Projects"], // Görünen İsim
                icon: "fa fa-rocket",

                // ESKİSİ (Hatalı): url: "/Projects"
                // YENİSİ (Doğru):  url: "/" 
                url: "/"
            )
        );

        // "Tasks" menü öğesi
        context.Menu.AddItem(
            new ApplicationMenuItem(
                "Apya.Platform.Tasks", // Benzersiz iç isim
                "Görev Yönetimi",      // Ekranda görünecek isim (L10n ile de yapılabilir ama şimdilik düz yazalım)
                icon: "fa fa-tasks",   // FontAwesome ikonu
                url: "/Tasks"          // Tıklayınca gideceği adres
            )
        );

        // "Reports" menü öğesi
        context.Menu.AddItem(
            new ApplicationMenuItem(
                "Apya.Platform.Reports",
                "Raporlar & Analiz",
                icon: "fa fa-chart-pie",
                url: "/Reports"
            )
        );

        if (MultiTenancyConsts.IsEnabled)
        {
            administration.SetSubItemOrder(TenantManagementMenuNames.GroupName, 1);
        }
        else
        {
            administration.TryRemoveMenuItem(TenantManagementMenuNames.GroupName);
        }

        administration.SetSubItemOrder(IdentityMenuNames.GroupName, 2);
        administration.SetSubItemOrder(SettingManagementMenuNames.GroupName, 3);

        return Task.CompletedTask;
    }
}
