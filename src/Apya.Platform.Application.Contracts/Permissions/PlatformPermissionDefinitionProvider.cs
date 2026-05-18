using Apya.Platform.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace Apya.Platform.Permissions;

public class PlatformPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(PlatformPermissions.GroupName, L("Permission:Platform"));

        // --- GELİR YETKİLERİ ---
        var incomesPermission = myGroup.AddPermission(PlatformPermissions.Incomes.Default, L("Permission:Incomes"));
        incomesPermission.AddChild(PlatformPermissions.Incomes.Create, L("Permission:Incomes.Create"));
        incomesPermission.AddChild(PlatformPermissions.Incomes.Edit, L("Permission:Incomes.Edit"));
        incomesPermission.AddChild(PlatformPermissions.Incomes.Delete, L("Permission:Incomes.Delete"));

        // --- YIL SONU DEĞERLEME YETKİLERİ ---
        var fxRevaluationPermission = myGroup.AddPermission(PlatformPermissions.FxRevaluations.Default, L("Permission:FxRevaluations"));
        fxRevaluationPermission.AddChild(PlatformPermissions.FxRevaluations.Run, L("Permission:FxRevaluations.Run"));
        fxRevaluationPermission.AddChild(PlatformPermissions.FxRevaluations.Delete, L("Permission:FxRevaluations.Delete"));

        // --- CARİ (MÜŞTERİ) YETKİLERİ ---
        var customersPermission = myGroup.AddPermission(PlatformPermissions.Customers.Default, L("Permission:Customers"));
        customersPermission.AddChild(PlatformPermissions.Customers.Create, L("Permission:Customers.Create"));
        customersPermission.AddChild(PlatformPermissions.Customers.Edit, L("Permission:Customers.Edit"));
        customersPermission.AddChild(PlatformPermissions.Customers.Delete, L("Permission:Customers.Delete"));

        // --- KASA YETKİLERİ ---
        var cashAccountsPermission = myGroup.AddPermission(PlatformPermissions.CashAccounts.Default, L("Permission:CashAccounts"));
        cashAccountsPermission.AddChild(PlatformPermissions.CashAccounts.Create, L("Permission:CashAccounts.Create"));
        cashAccountsPermission.AddChild(PlatformPermissions.CashAccounts.Edit, L("Permission:CashAccounts.Edit"));
        cashAccountsPermission.AddChild(PlatformPermissions.CashAccounts.Delete, L("Permission:CashAccounts.Delete"));

        // --- DÖVİZ KURU YETKİLERİ ---
        var exchangeRatesPermission = myGroup.AddPermission(PlatformPermissions.ExchangeRates.Default, L("Permission:ExchangeRates"));
        exchangeRatesPermission.AddChild(PlatformPermissions.ExchangeRates.Create, L("Permission:ExchangeRates.Create"));
        exchangeRatesPermission.AddChild(PlatformPermissions.ExchangeRates.Edit, L("Permission:ExchangeRates.Edit"));
        exchangeRatesPermission.AddChild(PlatformPermissions.ExchangeRates.Delete, L("Permission:ExchangeRates.Delete"));

        // --- KASA HAREKETİ YETKİLERİ ---
        var cashMovementsPermission = myGroup.AddPermission(PlatformPermissions.CashMovements.Default, L("Permission:CashMovements"));
        cashMovementsPermission.AddChild(PlatformPermissions.CashMovements.Create, L("Permission:CashMovements.Create"));
        cashMovementsPermission.AddChild(PlatformPermissions.CashMovements.Edit, L("Permission:CashMovements.Edit"));
        cashMovementsPermission.AddChild(PlatformPermissions.CashMovements.Delete, L("Permission:CashMovements.Delete"));

        // --- GİDER YETKİLERİ ---
        var expensesPermission = myGroup.AddPermission(PlatformPermissions.Expenses.Default, L("Permission:Expenses"));
        expensesPermission.AddChild(PlatformPermissions.Expenses.Create, L("Permission:Expenses.Create"));
        expensesPermission.AddChild(PlatformPermissions.Expenses.Edit, L("Permission:Expenses.Edit"));
        expensesPermission.AddChild(PlatformPermissions.Expenses.Delete, L("Permission:Expenses.Delete"));

        // --- PROJE YETKİLERİ ---
        var projectsPermission = myGroup.AddPermission(PlatformPermissions.Projects.Default, L("Permission:Projects"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Create, L("Permission:Projects.Create"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Edit, L("Permission:Projects.Edit"));
        projectsPermission.AddChild(PlatformPermissions.Projects.Delete, L("Permission:Projects.Delete"));
        projectsPermission.AddChild(PlatformPermissions.Projects.ViewBudget, L("Permission:Projects.ViewBudget"));
        projectsPermission.AddChild(PlatformPermissions.Projects.ManageTeam, L("Permission:Projects.ManageTeam"));
        projectsPermission.AddChild(PlatformPermissions.Projects.UseAiFeatures, L("Permission:UseAiFeatures"));

        // --- GÖREV (TASK) YETKİLERİ --- (Burası Eksik Olabilir)
        var tasksPermission = myGroup.AddPermission(PlatformPermissions.Tasks.Default, L("Permission:Tasks"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Create, L("Permission:Tasks.Create"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Edit, L("Permission:Tasks.Edit"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Delete, L("Permission:Tasks.Delete"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.Assign, L("Permission:Tasks.Assign"));
        tasksPermission.AddChild(PlatformPermissions.Tasks.ChangeStatus, L("Permission:Tasks.ChangeStatus"));

        // --- DOKÜMAN YETKİLERİ ---
        var docsPermission = myGroup.AddPermission(PlatformPermissions.Documents.Default, L("Permission:Documents"));
        docsPermission.AddChild(PlatformPermissions.Documents.Create, L("Permission:Documents.Create"));
        docsPermission.AddChild(PlatformPermissions.Documents.Edit, L("Permission:Documents.Edit"));
        docsPermission.AddChild(PlatformPermissions.Documents.Delete, L("Permission:Documents.Delete"));

        // --- BİLDİRİM YETKİLERİ ---
        var notificationsPermission = myGroup.AddPermission(PlatformPermissions.Notifications.Default, L("Permission:Notifications"));
        notificationsPermission.AddChild(PlatformPermissions.Notifications.MarkRead, L("Permission:Notifications.MarkRead"));
        notificationsPermission.AddChild(PlatformPermissions.Notifications.Delete, L("Permission:Notifications.Delete"));

        // --- TAKVİM YETKİLERİ ---
        var calendarsPermission = myGroup.AddPermission(PlatformPermissions.Calendars.Default, L("Permission:Calendars"));
        calendarsPermission.AddChild(PlatformPermissions.Calendars.Connect, L("Permission:Calendars.Connect"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PlatformResource>(name);
    }
}