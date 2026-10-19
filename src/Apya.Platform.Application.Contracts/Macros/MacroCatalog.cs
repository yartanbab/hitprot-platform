using System.Collections.Generic;
using Apya.Platform.Permissions;

namespace Apya.Platform.Macros;

/// <summary>
/// Makro Ekran'ın (/Makro) yapabildiği işlerin TEK listesi. Sıra, kullanıcı hiçbir şey
/// sabitlememişken ekrandaki varsayılan sıradır.
///
/// <para>Bileşik (çok adımlı, ön izlemeli) makro BİLEREK yok: şartnamenin vitrin akışı
/// ("Çağrıdan başvuru başlat") kiracıda çalışamıyor — kiracı başvuru açamaz. Motor, taşıyacağı
/// gerçek akış belli olunca eklenir (docs/design/makro-ekran/uygulama-notlari.md).</para>
///
/// <para>"Takvime etkinlik" yok: takvimde etkinlik oluşturma penceresi bulunmuyor, Takvim
/// bağlantısı yeterli. Pencereler dışarıdan açılabilecek biçimde yazılmış; aynı adresleri
/// "+ Yeni" menüsü ve komut paleti de kullanıyor.</para>
/// </summary>
public static class MacroCatalog
{
    private const string Work = "Menu:Work";
    private const string Calendar = "Menu:Calendar";
    private const string Grants = "Menu:Grants:Group";
    private const string Finance = "Menu:Finance";
    private const string Content = "Menu:Content";

    public static IReadOnlyList<MacroDefinition> All { get; } = new List<MacroDefinition>
    {
        Modal("TaskCreate", "/Tasks/CreateModal", PlatformPermissions.Tasks.Create, "fa fa-plus", Work),
        Modal("ProjectCreate", "/Projects/CreateModal", PlatformPermissions.Projects.Create, "fa fa-folder-plus", Work),

        // Sayfa yalnız [Authorize]; kayıt Expenses.Create ister — kaydedemeyecek kullanıcıya göstermiyoruz.
        Page("ExpenseCapture", "/Expenses/Capture", PlatformPermissions.Expenses.Create, "fa fa-camera", Finance),
        Modal("ExpenseCreate", "/Expenses/CreateModal", PlatformPermissions.Expenses.Create, "fa fa-arrow-up", Finance),
        Modal("IncomeCreate", "/Incomes/CreateModal", PlatformPermissions.Incomes.Create, "fa fa-arrow-down", Finance),
        Modal("InvoiceCreate", "/Invoices/CreateModal", PlatformPermissions.Invoices.Create, "fa fa-file-invoice", Finance),
        Modal("CashMovementCreate", "/CashMovements/CreateModal", PlatformPermissions.CashMovements.Create, "fa fa-cash-register", Finance),

        // Hibe: host ve kiracı ayrı öğeler görür; hangisinin basılacağına menü ağacı karar verir.
        // Başlık anahtarı yalnız host yönetim ekranı içindir; Makro Ekran menü öğesinin CANLI
        // etiketini kullanır (ör. "Çağrılar" kiracıda "Fırsatlar" okunur).
        Menu("GrantsToday", "Apya.Grants.Today", Grants, "Menu:Grants:Today"),
        Menu("GrantsCalls", "Apya.Grants.Calls", Grants, "Menu:Grants:Calls",
            "/Grants", "/Grants/Detail", "/Grants/Journey", "/Grants/Invitation"),
        Menu("GrantsRequests", "Apya.Grants.Requests", Grants, "Menu:Grants:Requests", "/Grants/Requests"),
        Menu("GrantsApplications", "Apya.Grants.Applications", Grants, "Menu:Grants:Applications", "/Grants/DetailHost"),
        Menu("GrantsMyApplications", "Apya.Grants.MyApplications", Grants, "Menu:Grants:MyApplications",
            "/Grants/MyApplications", "/Grants/Wizard", "/Grants/Appeal", "/Grants/Documents", "/Grants/Implementation"),

        Menu("Boards", "Apya.Work.Boards", Work, "Menu:Boards", "/Tasks/Detail"),
        Menu("Projects", "Apya.Work.Projects", Work, "Menu:Projects", "/Projects/ProjectDetails"),
        Menu("Calendar", "Apya.Calendar", Calendar, "Menu:Calendar"),
        // B-16 · Geciken fatura bildirimi (/Invoices?invoiceId=) de finans çatısının rozetine düşer.
        Menu("FinanceHub", "Apya.Finance.Hub", Finance, "Menu:FinanceHub", "/Reports/ProjectBudget", "/Invoices"),
        Menu("Documents", "Apya.Content.Documents", Content, "Menu:Documents", "/Documents")
    };

    private static MacroDefinition Modal(string key, string url, string permission, string icon, string area) => new()
    {
        Key = key, Kind = MacroKind.Modal, Url = url, Permission = permission,
        TitleKey = "Macro:" + key, Icon = icon, AreaKey = area
    };

    private static MacroDefinition Page(string key, string url, string permission, string icon, string area) => new()
    {
        Key = key, Kind = MacroKind.Link, Url = url, Permission = permission,
        TitleKey = "Macro:" + key, Icon = icon, AreaKey = area
    };

    private static MacroDefinition Menu(string key, string menuName, string area, string titleKey,
        params string[] notificationPaths) => new()
    {
        Key = key, Kind = MacroKind.Link, MenuName = menuName, AreaKey = area, TitleKey = titleKey,
        NotificationPaths = notificationPaths
    };

    /// <summary>
    /// Bildirim bağlantısının sayıldığı makro (güncelleme rozeti). Yol parçası düzeyinde EN UZUN eşleşme
    /// kazanır: <c>/Grants/Wizard?id=…</c> "Çağrılar"ın <c>/Grants</c>'ına değil "Başvurularım"a düşer.
    /// Eşleşmeyen bildirim (geri bildirim, abonelik, yapay zekâ…) hiçbir rozete sayılmaz.
    /// </summary>
    public static string? MatchNotificationLink(string? link)
    {
        if (string.IsNullOrEmpty(link)) { return null; }

        var cut = link.IndexOfAny(new[] { '?', '#' });
        var path = cut >= 0 ? link[..cut] : link;

        string? key = null;
        var best = -1;
        foreach (var definition in All)
        {
            foreach (var prefix in definition.NotificationPaths)
            {
                var hit = path.Equals(prefix, System.StringComparison.OrdinalIgnoreCase)
                          || path.StartsWith(prefix + "/", System.StringComparison.OrdinalIgnoreCase);
                if (hit && prefix.Length > best) { key = definition.Key; best = prefix.Length; }
            }
        }

        return key;
    }
}
