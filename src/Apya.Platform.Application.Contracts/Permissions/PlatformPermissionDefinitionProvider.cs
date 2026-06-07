using Apya.Platform.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace Apya.Platform.Permissions;

public class PlatformPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        // ============================================================
        // PROJE & GÖREV YÖNETİMİ
        // ============================================================
        var workGroup = context.AddGroup(PlatformPermissions.Groups.Work, L("Permission:Group:Work"));

        var projectsPermission = workGroup.AddPermission(PlatformPermissions.Projects.Default, L("Permission:Projects"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Create, L("Permission:Projects.Create"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Edit, L("Permission:Projects.Edit"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Delete, L("Permission:Projects.Delete"));
        projectsPermission.AddChild(PlatformPermissions.Projects.ViewBudget, L("Permission:Projects.ViewBudget"));
        projectsPermission.AddChild(PlatformPermissions.Projects.ManageTeam, L("Permission:Projects.ManageTeam"));
        projectsPermission.AddChild(PlatformPermissions.Projects.UseAiFeatures, L("Permission:Projects.UseAiFeatures"));

        var tasksPermission = workGroup.AddPermission(PlatformPermissions.Tasks.Default, L("Permission:Tasks"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Create, L("Permission:Tasks.Create"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Edit, L("Permission:Tasks.Edit"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Delete, L("Permission:Tasks.Delete"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Assign, L("Permission:Tasks.Assign"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.ChangeStatus, L("Permission:Tasks.ChangeStatus"));

        // ============================================================
        // HİBE YÖNETİMİ
        // ============================================================
        var grantsGroup = context.AddGroup(PlatformPermissions.Groups.Grants, L("Permission:Group:Grants"));

        var grantsPermission = grantsGroup.AddPermission(PlatformPermissions.Grants.Default, L("Permission:Grants"));
        grantsPermission.AddChild(PlatformPermissions.Grants.Create, L("Permission:Grants.Create"));
        grantsPermission.AddChild(PlatformPermissions.Grants.Edit,   L("Permission:Grants.Edit"));
        grantsPermission.AddChild(PlatformPermissions.Grants.Delete, L("Permission:Grants.Delete"));

        // ============================================================
        // FİNANS & MUHASEBE
        // ============================================================
        var financeGroup = context.AddGroup(PlatformPermissions.Groups.Finance, L("Permission:Group:Finance"));

        var incomesPermission = financeGroup.AddPermission(PlatformPermissions.Incomes.Default, L("Permission:Incomes"));
        incomesPermission.AddChild(PlatformPermissions.Incomes.Create, L("Permission:Incomes.Create"));
        incomesPermission.AddChild(PlatformPermissions.Incomes.Edit, L("Permission:Incomes.Edit"));
        incomesPermission.AddChild(PlatformPermissions.Incomes.Delete, L("Permission:Incomes.Delete"));

        var expensesPermission = financeGroup.AddPermission(PlatformPermissions.Expenses.Default, L("Permission:Expenses"));
        expensesPermission.AddChild(PlatformPermissions.Expenses.Create, L("Permission:Expenses.Create"));
        expensesPermission.AddChild(PlatformPermissions.Expenses.Edit, L("Permission:Expenses.Edit"));
        expensesPermission.AddChild(PlatformPermissions.Expenses.Delete, L("Permission:Expenses.Delete"));

        var invoicesPermission = financeGroup.AddPermission(PlatformPermissions.Invoices.Default, L("Permission:Invoices"));
        invoicesPermission.AddChild(PlatformPermissions.Invoices.Create, L("Permission:Invoices.Create"));
        invoicesPermission.AddChild(PlatformPermissions.Invoices.Edit, L("Permission:Invoices.Edit"));
        invoicesPermission.AddChild(PlatformPermissions.Invoices.Delete, L("Permission:Invoices.Delete"));

        var exchangeRatesPermission = financeGroup.AddPermission(PlatformPermissions.ExchangeRates.Default, L("Permission:ExchangeRates"));
        exchangeRatesPermission.AddChild(PlatformPermissions.ExchangeRates.Create, L("Permission:ExchangeRates.Create"));
        exchangeRatesPermission.AddChild(PlatformPermissions.ExchangeRates.Edit, L("Permission:ExchangeRates.Edit"));
        exchangeRatesPermission.AddChild(PlatformPermissions.ExchangeRates.Delete, L("Permission:ExchangeRates.Delete"));

        var fxRevaluationPermission = financeGroup.AddPermission(PlatformPermissions.FxRevaluations.Default, L("Permission:FxRevaluations"));
        fxRevaluationPermission.AddChild(PlatformPermissions.FxRevaluations.Run, L("Permission:FxRevaluations.Run"));
        fxRevaluationPermission.AddChild(PlatformPermissions.FxRevaluations.Delete, L("Permission:FxRevaluations.Delete"));

        var reportsPermission = financeGroup.AddPermission(PlatformPermissions.Reports.Default, L("Permission:Reports"));
        reportsPermission.AddChild(PlatformPermissions.Reports.TrialBalance, L("Permission:Reports.TrialBalance"));

        // ============================================================
        // CARİ & KASA
        // ============================================================
        var accountingGroup = context.AddGroup(PlatformPermissions.Groups.Accounting, L("Permission:Group:Accounting"));

        var customersPermission = accountingGroup.AddPermission(PlatformPermissions.Customers.Default, L("Permission:Customers"));
        customersPermission.AddChild(PlatformPermissions.Customers.Create, L("Permission:Customers.Create"));
        customersPermission.AddChild(PlatformPermissions.Customers.Edit, L("Permission:Customers.Edit"));
        customersPermission.AddChild(PlatformPermissions.Customers.Delete, L("Permission:Customers.Delete"));

        var cashAccountsPermission = accountingGroup.AddPermission(PlatformPermissions.CashAccounts.Default, L("Permission:CashAccounts"));
        cashAccountsPermission.AddChild(PlatformPermissions.CashAccounts.Create, L("Permission:CashAccounts.Create"));
        cashAccountsPermission.AddChild(PlatformPermissions.CashAccounts.Edit, L("Permission:CashAccounts.Edit"));
        cashAccountsPermission.AddChild(PlatformPermissions.CashAccounts.Delete, L("Permission:CashAccounts.Delete"));

        var cashMovementsPermission = accountingGroup.AddPermission(PlatformPermissions.CashMovements.Default, L("Permission:CashMovements"));
        cashMovementsPermission.AddChild(PlatformPermissions.CashMovements.Create, L("Permission:CashMovements.Create"));
        cashMovementsPermission.AddChild(PlatformPermissions.CashMovements.Edit, L("Permission:CashMovements.Edit"));
        cashMovementsPermission.AddChild(PlatformPermissions.CashMovements.Delete, L("Permission:CashMovements.Delete"));

        // ============================================================
        // İÇERİK & DOKÜMAN
        // ============================================================
        var contentGroup = context.AddGroup(PlatformPermissions.Groups.Content, L("Permission:Group:Content"));

        var docsPermission = contentGroup.AddPermission(PlatformPermissions.Documents.Default, L("Permission:Documents"));
        docsPermission.AddChild(PlatformPermissions.Documents.Create, L("Permission:Documents.Create"));
        docsPermission.AddChild(PlatformPermissions.Documents.Edit, L("Permission:Documents.Edit"));
        docsPermission.AddChild(PlatformPermissions.Documents.Delete, L("Permission:Documents.Delete"));

        var dynamicAssetsPermission = contentGroup.AddPermission(PlatformPermissions.DynamicAssets.Default, L("Permission:DynamicAssets"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.Create, L("Permission:DynamicAssets.Create"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.Edit, L("Permission:DynamicAssets.Edit"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.Delete, L("Permission:DynamicAssets.Delete"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.Publish, L("Permission:DynamicAssets.Publish"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.ViewResponses, L("Permission:DynamicAssets.ViewResponses"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.Export, L("Permission:DynamicAssets.Export"));
        dynamicAssetsPermission.AddChild(PlatformPermissions.DynamicAssets.ManageCategories, L("Permission:DynamicAssets.ManageCategories"));

        // ============================================================
        // SİSTEM & ENTEGRASYON
        // ============================================================
        var systemGroup = context.AddGroup(PlatformPermissions.Groups.System, L("Permission:Group:System"));

        var notificationsPermission = systemGroup.AddPermission(PlatformPermissions.Notifications.Default, L("Permission:Notifications"));
        notificationsPermission.AddChild(PlatformPermissions.Notifications.MarkRead, L("Permission:Notifications.MarkRead"));
        notificationsPermission.AddChild(PlatformPermissions.Notifications.Delete, L("Permission:Notifications.Delete"));

        var calendarsPermission = systemGroup.AddPermission(PlatformPermissions.Calendars.Default, L("Permission:Calendars"));
        calendarsPermission.AddChild(PlatformPermissions.Calendars.Connect, L("Permission:Calendars.Connect"));

        var tenantSettingsPermission = systemGroup.AddPermission(PlatformPermissions.TenantSettings.Default, L("Permission:TenantSettings"));
        tenantSettingsPermission.AddChild(PlatformPermissions.TenantSettings.ManageAi, L("Permission:TenantSettings.ManageAi"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}