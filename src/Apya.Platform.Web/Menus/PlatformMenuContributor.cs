using System.Threading.Tasks;
using Apya.Platform.Localization;
using Apya.Platform.MultiTenancy;
using Apya.Platform.Permissions;
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
            "Apya.Dashboard", l["Menu:Dashboard"], icon: "fa fa-chart-line", url: "/Dashboard", order: 1));

        // İşler
        var work = new ApplicationMenuItem("Apya.Work", l["Menu:Work"], icon: "fa fa-briefcase", order: 2);
        work.AddItem(new ApplicationMenuItem("Apya.Work.Projects", l["Menu:Projects"], icon: "fa fa-rocket", url: "/")
            .RequirePermissions(PlatformPermissions.Projects.Default));
        work.AddItem(new ApplicationMenuItem("Apya.Work.Tasks", l["Menu:Tasks"], icon: "fa fa-tasks", url: "/Tasks")
            .RequirePermissions(PlatformPermissions.Tasks.Default));
        work.AddItem(new ApplicationMenuItem("Apya.Work.Board", l["Menu:KanbanBoard"], icon: "fa fa-columns", url: "/Board")
            .RequirePermissions(PlatformPermissions.Tasks.Default));
        context.Menu.AddItem(work);

        // Finans
        var finance = new ApplicationMenuItem("Apya.Finance", l["Menu:Finance"], icon: "fa fa-coins", order: 3);
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.Customers", l["Menu:Customers"], icon: "fa fa-id-card", url: "/Customers")
            .RequirePermissions(PlatformPermissions.Customers.Default));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.CashAccounts", l["Menu:CashAccounts"], icon: "fa fa-cash-register", url: "/CashAccounts")
            .RequirePermissions(PlatformPermissions.CashAccounts.Default));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.CashMovements", l["Menu:CashMovements"], icon: "fa fa-right-left", url: "/CashMovements")
            .RequirePermissions(PlatformPermissions.CashMovements.Default));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.ExchangeRates", l["Menu:ExchangeRates"], icon: "fa fa-money-bill-transfer", url: "/ExchangeRates")
            .RequirePermissions(PlatformPermissions.ExchangeRates.Default));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.FxRevaluation", l["Menu:FxRevaluation"], icon: "fa fa-scale-balanced", url: "/FxRevaluations")
            .RequirePermissions(PlatformPermissions.FxRevaluations.Default));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.Expenses", l["Menu:Expenses"], icon: "fa fa-receipt", url: "/Expenses")
            .RequirePermissions(PlatformPermissions.Expenses.Default));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.Incomes", l["Menu:Incomes"], icon: "fa fa-hand-holding-dollar", url: "/Incomes")
            .RequirePermissions(PlatformPermissions.Incomes.Default));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.Invoices", l["Menu:Invoices"], icon: "fa fa-file-invoice-dollar", url: "/Invoices")
            .RequirePermissions(PlatformPermissions.Invoices.Default));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.ExpenseCapture", l["Menu:ExpenseCapture"], icon: "fa fa-camera", url: "/Expenses/Capture")
            .RequirePermissions(PlatformPermissions.Expenses.Create));
        finance.AddItem(new ApplicationMenuItem("Apya.Finance.TrialBalance", l["Menu:TrialBalance"], icon: "fa fa-scale-unbalanced", url: "/Reports/TrialBalance")
            .RequirePermissions(PlatformPermissions.Reports.TrialBalance));
        context.Menu.AddItem(finance);

        // İçerik
        var content = new ApplicationMenuItem("Apya.Content", l["Menu:Content"], icon: "fa fa-folder-open", order: 4);
        content.AddItem(new ApplicationMenuItem("Apya.Content.Documents", l["Menu:Documents"], icon: "fa fa-book", url: "/Documents")
            .RequirePermissions(PlatformPermissions.Documents.Default));
        content.AddItem(new ApplicationMenuItem("Apya.Content.DynamicAssets", l["Menu:DynamicAssets"], icon: "fa fa-file-signature", url: "/DynamicAssets")
            .RequirePermissions(PlatformPermissions.DynamicAssets.Default));
        context.Menu.AddItem(content);

        context.Menu.AddItem(new ApplicationMenuItem(
            "Apya.Reports", l["Menu:Reports"], icon: "fa fa-chart-pie", url: "/Reports", order: 5)
            .RequirePermissions(PlatformPermissions.Reports.Default));

        administration.AddItem(new ApplicationMenuItem(
            "Apya.Admin.AiSettings",
            l["Menu:AiSettings"],
            icon: "fa fa-robot",
            url: "/TenantManagement/AiSettings")
            .RequirePermissions(PlatformPermissions.TenantSettings.ManageAi));

        if (MultiTenancyConsts.IsEnabled)
        {
            administration.SetSubItemOrder(TenantManagementMenuNames.GroupName, 1);
        }

        administration.SetSubItemOrder(IdentityMenuNames.GroupName, 2);
        administration.SetSubItemOrder(SettingManagementMenuNames.GroupName, 3);

        return Task.CompletedTask;
    }
}
