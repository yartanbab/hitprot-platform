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

        context.Menu.Items.Insert(0, new ApplicationMenuItem(
            PlatformMenus.Home, l["Menu:Home"], "~/", icon: "fas fa-home", order: 0));

        context.Menu.AddItem(new ApplicationMenuItem(
            "Apya.Dashboard", "Dashboard", icon: "fa fa-chart-line", url: "/Dashboard", order: 1));

        // İşler
        var work = new ApplicationMenuItem("Apya.Work", "İşler", icon: "fa fa-briefcase", order: 2);
        work.AddItem(new ApplicationMenuItem("Apya.Work.Projects", "Projeler", icon: "fa fa-rocket", url: "/"));
        work.AddItem(new ApplicationMenuItem("Apya.Work.Tasks", "Görevler", icon: "fa fa-tasks", url: "/Tasks"));
        work.AddItem(new ApplicationMenuItem("Apya.Work.Board", "Kanban Board", icon: "fa fa-columns", url: "/Board"));
        context.Menu.AddItem(work);

        // Finans
        var finance = new ApplicationMenuItem("Apya.Finance", "Finans", icon: "fa fa-coins", order: 3);
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.Customers", "Cariler", icon: "fa fa-id-card", url: "/Customers"));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.CashAccounts", "Kasalar", icon: "fa fa-cash-register", url: "/CashAccounts"));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.CashMovements", "Kasa Hareketleri", icon: "fa fa-right-left", url: "/CashMovements"));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.ExchangeRates", "Döviz Kurları", icon: "fa fa-money-bill-transfer", url: "/ExchangeRates"));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.Expenses", "Giderler", icon: "fa fa-receipt", url: "/Expenses"));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.Invoices", "Faturalar & Ödemeler", icon: "fa fa-file-invoice-dollar", url: "/Invoices"));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.ExpenseCapture", "Masraf Yakala", icon: "fa fa-camera", url: "/Expenses/Capture"));
        context.Menu.AddItem(finance);

        // İçerik
        var content = new ApplicationMenuItem("Apya.Content", "İçerik", icon: "fa fa-folder-open", order: 4);
        content.AddItem(new ApplicationMenuItem("Apya.Content.Documents", "Wiki / Belgeler", icon: "fa fa-book", url: "/Documents"));
        content.AddItem(new ApplicationMenuItem("Apya.Content.DynamicAssets", "Şablonlar & Formlar", icon: "fa fa-file-signature", url: "/DynamicAssets"));
        context.Menu.AddItem(content);

        context.Menu.AddItem(new ApplicationMenuItem(
            "Apya.Reports", "Raporlar & Analiz", icon: "fa fa-chart-pie", url: "/Reports", order: 5));

        administration.AddItem(new ApplicationMenuItem(
            "Apya.Admin.AiSettings",
            "AI Ayarları",
            icon: "fa fa-robot",
            url: "/TenantManagement/AiSettings"));

        if (MultiTenancyConsts.IsEnabled)
        {
            administration.SetSubItemOrder(TenantManagementMenuNames.GroupName, 1);
        }

        administration.SetSubItemOrder(IdentityMenuNames.GroupName, 2);
        administration.SetSubItemOrder(SettingManagementMenuNames.GroupName, 3);

        return Task.CompletedTask;
    }
}
