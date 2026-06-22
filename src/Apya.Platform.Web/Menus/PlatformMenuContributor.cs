using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Features;
using Apya.Platform.Localization;
using Apya.Platform.MultiTenancy;
using Apya.Platform.Permissions;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Features;
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

    private async Task ConfigureMainMenuAsync(MenuConfigurationContext context)
    {
        var administration = context.Menu.GetAdministration();
        var l = context.GetLocalizer<PlatformResource>();
        var permission = context.ServiceProvider.GetRequiredService<IPermissionChecker>();
        var feature = context.ServiceProvider.GetRequiredService<IFeatureChecker>();

        context.Menu.Items.Insert(0, new ApplicationMenuItem(
            PlatformMenus.Home, l["Menu:Home"], "~/", icon: "fas fa-home", order: 0));

        context.Menu.AddItem(new ApplicationMenuItem(
            "Apya.Dashboard", l["Menu:Dashboard"], icon: "fa fa-chart-line", url: "/Dashboard", order: 1));

        // İşler
        var work = new ApplicationMenuItem("Apya.Work", l["Menu:Work"], icon: "fa fa-briefcase", order: 2);
        if (await permission.IsGrantedAsync(PlatformPermissions.Projects.Default))
            work.AddItem(new ApplicationMenuItem("Apya.Work.Projects", l["Menu:Projects"], icon: "fa fa-rocket", url: "/"));
        if (await permission.IsGrantedAsync(PlatformPermissions.Grants.Default))
            work.AddItem(new ApplicationMenuItem("Apya.Work.Grants", l["Menu:Grants"], icon: "fa fa-award", url: "/Grants"));
        if (await permission.IsGrantedAsync(PlatformPermissions.Tasks.Default))
        {
            work.AddItem(new ApplicationMenuItem("Apya.Work.Tasks", l["Menu:Tasks"], icon: "fa fa-tasks", url: "/Tasks"));
            work.AddItem(new ApplicationMenuItem("Apya.Work.Board", l["Menu:KanbanBoard"], icon: "fa fa-columns", url: "/Board"));
        }
        if (await permission.IsGrantedAsync(PlatformPermissions.Calendars.Default))
            work.AddItem(new ApplicationMenuItem("Apya.Work.Calendar", l["Menu:Calendar"], icon: "fa fa-calendar-days", url: "/Calendars"));
        if (work.Items.Count > 0) context.Menu.AddItem(work);

        // Finans — Faz 1 sadeleştirme: yalnızca günlük işlem + hesap öğeleri kalır.
        // Raporlar tek "Raporlar" menüsünde toplandı; Döviz Kurları Yönetim'e taşındı.
        var finance = new ApplicationMenuItem("Apya.Finance", l["Menu:Finance"], icon: "fa fa-coins", order: 3);
        // Sıralama (kullanıcı kararı 2026-06-22): 1) Kasalar  2) Para Hareketleri.
        if (await permission.IsGrantedAsync(PlatformPermissions.CashAccounts.Default))
            finance.AddItem(new ApplicationMenuItem("Apya.Finance.CashAccounts", l["Menu:CashAccounts"], icon: "fa fa-cash-register", url: "/CashAccounts", order: 1));
        // Para Hareketleri hub'ı (Faz 2): Gelir + Gider + Fatura tek listede toplandı.
        // Ayrı Giderler/Gelirler/Faturalar menü öğeleri kaldırıldı (sayfalar hub'dan erişilebilir).
        if (await permission.IsGrantedAsync(PlatformPermissions.Incomes.Default)
            || await permission.IsGrantedAsync(PlatformPermissions.Expenses.Default)
            || await permission.IsGrantedAsync(PlatformPermissions.Invoices.Default))
            finance.AddItem(new ApplicationMenuItem("Apya.Finance.Hub", l["Menu:FinanceHub"], icon: "fa fa-right-left", url: "/Finance", order: 2));
        // Cariler kullanıcı kararıyla menüden gizlendi (2026-06-22). /Customers sayfası korunur;
        // izinli kullanıcı doğrudan erişebilir. Geri açmak için aşağıyı yorumdan çıkar:
        // if (await permission.IsGrantedAsync(PlatformPermissions.Customers.Default))
        //     finance.AddItem(new ApplicationMenuItem("Apya.Finance.Customers", l["Menu:Customers"], icon: "fa fa-id-card", url: "/Customers"));
        if (finance.Items.Count > 0) context.Menu.AddItem(finance);

        // İçerik
        var content = new ApplicationMenuItem("Apya.Content", l["Menu:Content"], icon: "fa fa-folder-open", order: 4);
        if (await permission.IsGrantedAsync(PlatformPermissions.Documents.Default))
            content.AddItem(new ApplicationMenuItem("Apya.Content.Documents", l["Menu:Documents"], icon: "fa fa-book", url: "/Documents"));
        if (await permission.IsGrantedAsync(PlatformPermissions.DynamicAssets.Default))
        {
            content.AddItem(new ApplicationMenuItem("Apya.Content.DynamicAssets", l["Menu:DynamicAssets"], icon: "fa fa-file-signature", url: "/DynamicAssets"));
            content.AddItem(new ApplicationMenuItem("Apya.Content.Webhooks", l["Menu:Webhooks"], icon: "fa fa-bolt", url: "/DynamicAssets/Webhooks"));
        }
        if (content.Items.Count > 0) context.Menu.AddItem(content);

        // AI Değerlendirme Merkezi (AI Evaluation Center) — AiAssist feature + Ai.Prompts yetkisi
        if (await feature.IsEnabledAsync(PlatformFeatures.AiAssist))
        {
            var aiCenter = new ApplicationMenuItem(
                "Apya.AiCenter", l["Menu:AiCenter"], icon: "fa fa-robot", order: 6);
            if (await permission.IsGrantedAsync(AiPermissions.Dashboard.View))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Dashboard", l["Menu:AiCenter:Dashboard"],
                    icon: "fa fa-gauge-high", url: "/AiCenter/Dashboard"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.Prompts.Default))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Prompts", l["Menu:AiCenter:Prompts"],
                    icon: "fa fa-wand-magic-sparkles", url: "/AiCenter/Prompts"));
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.PromptCategories", l["Menu:AiCenter:PromptCategories"],
                    icon: "fa fa-folder-tree", url: "/AiCenter/PromptCategories"));
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Bindings", l["Menu:AiCenter:Bindings"],
                    icon: "fa fa-link", url: "/AiCenter/Bindings"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.Evaluations.Default))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Evaluations", l["Menu:AiCenter:Evaluations"],
                    icon: "fa fa-clipboard-check", url: "/AiCenter/Evaluations"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.Workflows.Default))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Workflows", l["Menu:AiCenter:Workflows"],
                    icon: "fa fa-diagram-project", url: "/AiCenter/Workflows"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.Providers.Default))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Providers", l["Menu:AiCenter:Providers"],
                    icon: "fa fa-plug", url: "/AiCenter/Providers"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.UsageLogs.View))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.UsageLogs", l["Menu:AiCenter:UsageLogs"],
                    icon: "fa fa-receipt", url: "/AiCenter/UsageLogs"));
            }
            if (await permission.IsGrantedAsync(AiPermissions.Reports.View))
            {
                aiCenter.AddItem(new ApplicationMenuItem(
                    "Apya.AiCenter.Reports", l["Menu:AiCenter:Reports"],
                    icon: "fa fa-file-lines", url: "/AiCenter/Reports"));
            }
            if (aiCenter.Items.Count > 0) context.Menu.AddItem(aiCenter);
        }

        // Raporlar — tüm rapor/çıktı sayfaları tek menüde toplandı (Finans'tan taşındı; çift menü giderildi).
        var reports = new ApplicationMenuItem("Apya.Reports", l["Menu:Reports"], icon: "fa fa-chart-pie", order: 5);
        if (await permission.IsGrantedAsync(PlatformPermissions.Reports.Default))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.Overview", l["Menu:Reports"], icon: "fa fa-gauge", url: "/Reports"));
        if (await permission.IsGrantedAsync(PlatformPermissions.Projects.Default))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.ProjectBudget", l["Menu:ProjectBudget"], icon: "fa fa-chart-bar", url: "/Reports/ProjectBudget"));
        if (await permission.IsGrantedAsync(PlatformPermissions.Customers.Default))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.CustomerStatement", l["Menu:CustomerStatement"], icon: "fa fa-file-lines", url: "/Reports/CustomerStatement"));
        if (await permission.IsGrantedAsync(PlatformPermissions.Reports.TrialBalance)
            && await feature.IsEnabledAsync(PlatformFeatures.AdvancedReports))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.TrialBalance", l["Menu:TrialBalance"], icon: "fa fa-scale-unbalanced", url: "/Reports/TrialBalance"));
        if (await permission.IsGrantedAsync(PlatformPermissions.FxRevaluations.Default)
            && await feature.IsEnabledAsync(PlatformFeatures.AdvancedReports))
            reports.AddItem(new ApplicationMenuItem("Apya.Reports.FxRevaluation", l["Menu:FxRevaluation"], icon: "fa fa-scale-balanced", url: "/FxRevaluations"));
        if (reports.Items.Count > 0) context.Menu.AddItem(reports);

        if (await permission.IsGrantedAsync(PlatformPermissions.TenantSettings.ManageAi)
            && await feature.IsEnabledAsync(PlatformFeatures.AiAssist))
        {
            administration.AddItem(new ApplicationMenuItem(
                "Apya.Admin.AiSettings",
                l["Menu:AiSettings"],
                icon: "fa fa-robot",
                url: "/TenantManagement/AiSettings"));
        }

        // Döviz Kurları: TCMB'den otomatik geldiği ve nadiren elle bakıldığı için
        // günlük Finans menüsünden çıkarılıp Yönetim (Ayarlar) altına alındı.
        if (await permission.IsGrantedAsync(PlatformPermissions.ExchangeRates.Default))
        {
            administration.AddItem(new ApplicationMenuItem(
                "Apya.Admin.ExchangeRates", l["Menu:ExchangeRates"],
                icon: "fa fa-money-bill-transfer", url: "/ExchangeRates"));
        }

        if (MultiTenancyConsts.IsEnabled)
        {
            administration.SetSubItemOrder(TenantManagementMenuNames.GroupName, 1);
        }

        administration.SetSubItemOrder(IdentityMenuNames.GroupName, 2);
        administration.SetSubItemOrder(SettingManagementMenuNames.GroupName, 3);
    }
}
