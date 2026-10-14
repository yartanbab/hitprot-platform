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
        Menu("GrantsCalls", "Apya.Grants.Calls", Grants, "Menu:Grants:Calls"),
        Menu("GrantsRequests", "Apya.Grants.Requests", Grants, "Menu:Grants:Requests"),
        Menu("GrantsApplications", "Apya.Grants.Applications", Grants, "Menu:Grants:Applications"),
        Menu("GrantsMyApplications", "Apya.Grants.MyApplications", Grants, "Menu:Grants:MyApplications"),

        Menu("Boards", "Apya.Work.Boards", Work, "Menu:Boards"),
        Menu("Projects", "Apya.Work.Projects", Work, "Menu:Projects"),
        Menu("Calendar", "Apya.Calendar", Calendar, "Menu:Calendar"),
        Menu("FinanceHub", "Apya.Finance.Hub", Finance, "Menu:FinanceHub"),
        Menu("Documents", "Apya.Content.Documents", Content, "Menu:Documents")
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

    private static MacroDefinition Menu(string key, string menuName, string area, string titleKey) => new()
    {
        Key = key, Kind = MacroKind.Link, MenuName = menuName, AreaKey = area, TitleKey = titleKey
    };
}
