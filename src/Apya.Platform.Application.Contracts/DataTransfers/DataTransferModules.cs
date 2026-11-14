using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Permissions;

namespace Apya.Platform.DataTransfers;

/// <summary>Modülün verisi hangi tarafta yaşıyor.</summary>
public enum DataTransferSide
{
    Both,
    Host,
    Tenant
}

/// <summary>
/// İçe/dışa aktarımı olan bir modül.
/// </summary>
/// <param name="Key">Kalıcı anahtar; şablon ve geçmiş kayıtları bununla bağlanır, değiştirilmez.</param>
/// <param name="NameKey">Modül adının metin anahtarı.</param>
/// <param name="Permission">Modülün kendi görme izni; dışa aktarma bu izinle yapılır.</param>
/// <param name="ImportPermission">İçe aktarmanın modüldeki izni; içe aktarma yoksa boş.</param>
public sealed record DataTransferModule(
    string Key,
    string NameKey,
    DataTransferSide Side,
    string Permission,
    string? ImportPermission = null)
{
    public bool IsOn(bool host) => Side == DataTransferSide.Both || (Side == DataTransferSide.Host) == host;
}

/// <summary>
/// İçe/dışa aktarımı olan modüllerin tek listesi. Ekran adresleri ve uçlar Web katmanındadır
/// (TransferCatalog); burada yalnız anahtar, taraf ve izinler durur — izin tohumu, şablon ve geçmiş
/// servisleri de aynı listeye bakar.
/// </summary>
public static class DataTransferModules
{
    // AI modülünün izin adları. Application.Contracts → Ai.Application.Contracts bağımlılığı olmadığı
    // için sabitler burada tekrar edilir (bkz. PackageFeatureGates); eşitliği test kilitler.
    public const string AiPrompts = "Ai.Prompts";
    public const string AiWorkflows = "Ai.Workflows";
    public const string AiUsageLogsView = "Ai.UsageLogs.View";
    public const string AiReportsView = "Ai.Reports.View";

    /// <summary>ABP kiracı yönetimi izni (TenantManagementPermissions.Tenants.Default).</summary>
    public const string Tenants = "AbpTenantManagement.Tenants";

    private const DataTransferSide Both = DataTransferSide.Both, Host = DataTransferSide.Host, Tenant = DataTransferSide.Tenant;

    public static readonly IReadOnlyList<DataTransferModule> All =
    [
        new("tasks", "Export:Tasks:Name", Both, PlatformPermissions.Tasks.Default, PlatformPermissions.Tasks.Create),
        new("projects", "Export:Projects:Name", Both, PlatformPermissions.Projects.Default),
        new("expenses", "Export:Expenses:Name", Both, PlatformPermissions.Expenses.Default, PlatformPermissions.Expenses.Create),
        new("incomes", "Export:Incomes:Name", Both, PlatformPermissions.Incomes.Default, PlatformPermissions.Incomes.Create),
        new("invoices", "Export:Invoices:Name", Both, PlatformPermissions.Invoices.Default),
        new("exchange-rates", "Import:ExchangeRates:Name", Both, PlatformPermissions.ExchangeRates.Default, PlatformPermissions.ExchangeRates.Create),
        new("budget-lines", "Import:BudgetLines:Name", Both, PlatformPermissions.Projects.ViewBudget, PlatformPermissions.Projects.ViewBudget),
        new("cash-movements", "Export:CashMovements:Name", Both, PlatformPermissions.CashAccounts.Default),
        new("ledger", "DataTransfer:Module:Ledger", Both, PlatformPermissions.Expenses.Default),
        new("project-budget-report", "DataTransfer:Module:ProjectBudgetReport", Both, PlatformPermissions.Projects.ViewBudget),
        new("grant-calls", "Export:GrantCalls:Name", Host, PlatformPermissions.Grants.Default),
        new("grant-applications", "Export:GrantApplications:Name", Host, PlatformPermissions.Grants.Edit),
        new("grant-feed", "Export:GrantFeed:Name", Tenant, PlatformPermissions.Grants.Default),
        new("my-grant-applications", "Export:MyGrantApplications:Name", Tenant, PlatformPermissions.Grants.Default),
        new("grant-stage-templates", "DataTransfer:Module:GrantStageTemplates", Host, PlatformPermissions.Grants.Edit, PlatformPermissions.Grants.Edit),
        new("grant-notification-templates", "DataTransfer:Module:GrantNotificationTemplates", Host, PlatformPermissions.Grants.Edit, PlatformPermissions.Grants.Edit),
        new("documents", "Export:Documents:Name", Both, PlatformPermissions.Documents.Default),
        new("report-templates", "DataTransfer:Module:ReportTemplates", Both, PlatformPermissions.Documents.Default, PlatformPermissions.Documents.Default),
        new("forms", "DataTransfer:Module:Forms", Both, PlatformPermissions.DynamicAssets.Default, PlatformPermissions.DynamicAssets.Default),
        new("form-responses", "DataTransfer:Module:FormResponses", Both, PlatformPermissions.DynamicAssets.ViewResponses),
        new("ai-prompts", "DataTransfer:Module:AiPrompts", Both, AiPrompts, AiPrompts),
        new("ai-workflows", "DataTransfer:Module:AiWorkflows", Both, AiWorkflows, AiWorkflows),
        new("ai-usage-logs", "Export:AiUsageLogs:Name", Both, AiUsageLogsView),
        new("ai-reports", "DataTransfer:Module:AiReports", Both, AiReportsView),
        new("tenants", "Export:Tenants:Name", Host, Tenants),
        new("registration-requests", "Export:RegistrationRequests:Name", Host, PlatformPermissions.RegistrationRequests.Default),
        new("subscription-invoices", "Export:SubscriptionInvoices:Name", Host, PlatformPermissions.Billing.Default),
        new("feedback", "DataTransfer:Module:Feedback", Host, PlatformPermissions.Feedbacks.Default),
    ];

    public static DataTransferModule? Find(string key) => All.FirstOrDefault(m => m.Key == key);

    public static DataTransferModule Get(string key) => All.First(m => m.Key == key);
}
