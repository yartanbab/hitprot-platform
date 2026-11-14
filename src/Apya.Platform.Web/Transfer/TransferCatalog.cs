using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.DataTransfers;

namespace Apya.Platform.Web.Transfer;

public enum TransferDirection
{
    Export,
    Import
}

/// <summary>
/// Bir aktarım ucu: Razor sayfası (ör. "/Expenses/Index") + handler adı (ör. "Excel"). Erişim
/// süzgeci isteği bu ikiliyle tanır.
/// </summary>
public sealed record TransferEndpoint(string Page, string Handler, TransferDirection Direction);

/// <summary>
/// Bir modülün (<see cref="DataTransferModule"/>) ekrandaki karşılığı: uçları, adresleri, biçimleri.
/// </summary>
/// <param name="Group">Kenar çubuğundaki grubun metin anahtarı; çalışma alanı modülleri buna göre öbekler.</param>
/// <param name="PageUrl">Modülün ekranı.</param>
/// <param name="Formats">Dosya biçimleri ("xlsx", "csv", "json", "pdf"); ilki doğrudan indirmenin biçimidir.</param>
/// <param name="ExportUrl">Bağlam gerektirmeyen doğrudan indirme adresi; yoksa dışa aktarma ekranından yapılır (kayıt seçilerek).</param>
/// <param name="ImportUrl">Ortak içe aktarma penceresinin adresi (şablon → önizleme → onay); yoksa ekranından yapılır.</param>
public sealed record TransferScreen(
    DataTransferModule Module,
    string Group,
    string Icon,
    string PageUrl,
    string[] Formats,
    TransferEndpoint[] Endpoints,
    string? ExportUrl = null,
    string? ImportUrl = null)
{
    public bool HasExport => Endpoints.Any(e => e.Direction == TransferDirection.Export);
    public bool HasImport => Endpoints.Any(e => e.Direction == TransferDirection.Import);
}

/// <summary>
/// Sistemdeki bütün veri aktarım uçlarının tek listesi. Yeni bir "Excel'e aktar" ya da "içe aktar"
/// ucu buraya yazılmadan yayına çıkamaz (bkz. TransferCatalog_Tests): erişim kuralı ve çalışma alanı
/// bu listeye bakar.
/// <para>Kapsam dışı: yazdırma çıktıları (fatura/görev PDF'i, teslim paketi), takvim (.ics),
/// yapay zekâyla belge okuma (görev taslağı, hibe çağrısı) ve arayüzden gizli Cari/Mizan raporları.</para>
/// </summary>
public static class TransferCatalog
{
    private const string Xlsx = "xlsx", Csv = "csv", Json = "json", Pdf = "pdf";

    private static readonly string[] Table = [Xlsx, Csv];

    private static TransferEndpoint Out(string page, string handler = "Excel") => new(page, handler, TransferDirection.Export);

    private static TransferEndpoint In(string page, string handler) => new(page, handler, TransferDirection.Import);

    /// <summary>Ortak içe aktarma penceresinin üç ucu (şablon indirme de içe aktarmanın parçasıdır).</summary>
    private static TransferEndpoint[] Modal(string page) => [In(page, "Template"), In(page, "Preview"), In(page, "Import")];

    private static DataTransferModule M(string key) => DataTransferModules.Get(key);

    public static readonly IReadOnlyList<TransferScreen> Screens =
    [
        // ── İş yönetimi ──
        new(M("tasks"), "Menu:Work", "fa fa-list-check", "/Tasks", Table,
            [Out("/Tasks/Index"), .. Modal("/Tasks/ImportModal")],
            ExportUrl: "/Tasks?handler=Excel", ImportUrl: "/Tasks/ImportModal"),
        new(M("projects"), "Menu:Work", "fa fa-diagram-project", "/Projects", Table,
            [Out("/Projects/Index")],
            ExportUrl: "/Projects?handler=Excel"),

        // ── Finans ──
        new(M("expenses"), "Menu:Finance", "fa fa-receipt", "/Expenses", Table,
            [Out("/Expenses/Index"), .. Modal("/Expenses/ImportModal")],
            ExportUrl: "/Expenses?handler=Excel", ImportUrl: "/Expenses/ImportModal"),
        new(M("incomes"), "Menu:Finance", "fa fa-hand-holding-dollar", "/Incomes", Table,
            [Out("/Incomes/Index"), .. Modal("/Incomes/ImportModal")],
            ExportUrl: "/Incomes?handler=Excel", ImportUrl: "/Incomes/ImportModal"),
        new(M("invoices"), "Menu:Finance", "fa fa-file-invoice", "/Invoices", Table,
            [Out("/Invoices/Index")],
            ExportUrl: "/Invoices?handler=Excel"),
        new(M("exchange-rates"), "Menu:Finance", "fa fa-money-bill-transfer", "/ExchangeRates", Table,
            [Out("/ExchangeRates/Index"), .. Modal("/ExchangeRates/ImportModal")],
            ExportUrl: "/ExchangeRates?handler=Excel", ImportUrl: "/ExchangeRates/ImportModal"),
        // Proje seçilerek yapılır: kalemler bir projenin bütçesine aittir.
        new(M("budget-lines"), "Menu:Finance", "fa fa-sitemap", "/Finance?tab=butce", Table,
            [Out("/Finance/BudgetLineImportModal", "Export"), .. Modal("/Finance/BudgetLineImportModal")]),
        // Kasa seçilerek yapılır.
        new(M("cash-movements"), "Menu:Finance", "fa fa-vault", "/CashAccounts", Table,
            [Out("/CashAccounts/Index", "MovementsExcel")]),
        new(M("ledger"), "Menu:Finance", "fa fa-scale-balanced", "/Finance?tab=gelir-gider", [Xlsx],
            [Out("/Finance/Index", "LedgerExcel")]),
        new(M("project-budget-report"), "Menu:Finance", "fa fa-chart-pie", "/Finance?tab=butce", [Xlsx, Pdf],
            [Out("/Reports/ProjectBudget")]),

        // ── Hibeler ──
        new(M("grant-calls"), "Menu:Grants:Group", "fa fa-bullhorn", "/Grants", Table,
            [Out("/Grants/Index", "CallsExcel")],
            ExportUrl: "/Grants?handler=CallsExcel"),
        new(M("grant-applications"), "Menu:Grants:Group", "fa fa-file-signature", "/Grants/Applications", Table,
            [Out("/Grants/Applications")],
            ExportUrl: "/Grants/Applications?handler=Excel"),
        // Ekrandaki süzülmüş kartlar gönderilir; doğrudan adresi yok.
        new(M("grant-feed"), "Menu:Grants:Group", "fa fa-bullseye", "/Grants", Table,
            [Out("/Grants/Index", "FeedExcel")]),
        new(M("my-grant-applications"), "Menu:Grants:Group", "fa fa-file-signature", "/Grants/MyApplications", Table,
            [Out("/Grants/MyApplications")],
            ExportUrl: "/Grants/MyApplications?handler=Excel"),
        new(M("grant-stage-templates"), "Menu:Grants:Group", "fa fa-layer-group", "/Grants/StageTemplates", [Json],
            [Out("/Grants/StageTemplates", "Export"), In("/Grants/StageTemplates", "Import")]),
        new(M("grant-notification-templates"), "Menu:Grants:Group", "fa fa-envelope-open-text", "/Grants/NotificationTemplates", [Json],
            [Out("/Grants/NotificationTemplates", "Export"), In("/Grants/NotificationTemplates", "Preview"), In("/Grants/NotificationTemplates", "Import")],
            ExportUrl: "/Grants/NotificationTemplates?handler=Export"),

        // ── İçerik ──
        new(M("documents"), "Menu:Content", "fa fa-folder-open", "/Documents", Table,
            [Out("/Documents/Index", "FilesExcel")],
            ExportUrl: "/Documents?handler=FilesExcel"),
        new(M("report-templates"), "Menu:Content", "fa fa-file-lines", "/Documents/ReportBuilder", [Json],
            [Out("/Documents/ReportBuilder", "ExportTemplate"), In("/Documents/ReportBuilder", "ImportTemplate")]),
        new(M("forms"), "Menu:Content", "fa fa-clipboard-list", "/DynamicAssets", [Json],
            [Out("/DynamicAssets/Index", "Export"), In("/DynamicAssets/Index", "Import")]),
        new(M("form-responses"), "Menu:Content", "fa fa-inbox", "/DynamicAssets", [Xlsx],
            [Out("/DynamicAssets/Responses")]),

        // ── Yapay zekâ ──
        new(M("ai-prompts"), "Menu:AiCenter", "fa fa-terminal", "/AiCenter/Prompts", [Json],
            [Out("/AiCenter/Prompts/Index", "Export"), In("/AiCenter/Prompts/Index", "Import")]),
        new(M("ai-workflows"), "Menu:AiCenter", "fa fa-diagram-next", "/AiCenter/Workflows", [Json],
            [Out("/AiCenter/Workflows/Index", "Export"), In("/AiCenter/Workflows/Index", "Import")]),
        new(M("ai-usage-logs"), "Menu:AiCenter", "fa fa-receipt", "/AiCenter/UsageLogs", Table,
            [Out("/AiCenter/UsageLogs/Index")],
            ExportUrl: "/AiCenter/UsageLogs?handler=Excel"),
        new(M("ai-reports"), "Menu:AiCenter", "fa fa-chart-line", "/AiCenter/Reports", [Xlsx, Pdf],
            [Out("/AiCenter/Reports/Index", "ExportExcel"), Out("/AiCenter/Reports/Index", "ExportPdf")]),

        // ── Platform (host) ──
        new(M("tenants"), "Menu:Platform", "fa fa-building", "/TenantManagement/Tenants", Table,
            [Out("/TenantManagement/Tenants/Index")],
            ExportUrl: "/TenantManagement/Tenants?handler=Excel"),
        new(M("registration-requests"), "Menu:Platform", "fa fa-file-signature", "/Admin/RegistrationRequests", Table,
            [Out("/Admin/RegistrationRequests/Index")],
            ExportUrl: "/Admin/RegistrationRequests?handler=Excel"),
        new(M("subscription-invoices"), "Menu:Platform", "fa fa-file-invoice", "/Admin/Billing", Table,
            [Out("/Admin/Billing/Index")],
            ExportUrl: "/Admin/Billing?handler=Excel"),
        new(M("feedback"), "Menu:Platform", "fa fa-comment-dots", "/Admin/Feedback", [Xlsx],
            [Out("/Admin/Feedback/Index")],
            ExportUrl: "/Admin/Feedback?handler=Excel"),
    ];

    /// <summary>
    /// Çalışma alanında listelenmeyen ama aynı erişim kuralına giren uçlar: arayüzden gizli
    /// Cari ekstresi ve Mizan raporlarının Excel çıktıları (adresle hâlâ çağrılabilirler).
    /// </summary>
    private static readonly TransferEndpoint[] Unlisted =
        [Out("/Reports/CustomerStatement"), Out("/Reports/TrialBalance")];

    public static readonly IReadOnlyList<TransferEndpoint> Endpoints =
        [.. Screens.SelectMany(s => s.Endpoints), .. Unlisted];

    private static readonly Dictionary<string, TransferEndpoint> ByEndpoint =
        Endpoints.ToDictionary(e => EndpointKey(e.Page, e.Handler));

    /// <summary>İstek bir aktarım ucuysa onu (yönüyle) verir.</summary>
    public static TransferEndpoint? Find(string? page, string? handler)
        => page != null && handler != null && ByEndpoint.TryGetValue(EndpointKey(page, handler), out var found) ? found : null;

    private static string EndpointKey(string page, string handler) => (page + "?" + handler).ToUpperInvariant();
}
