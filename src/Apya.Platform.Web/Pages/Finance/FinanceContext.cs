using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// Finans tek çatısının bağlam şablonu. Ayrı bir varlık DEĞİL — projenin
/// kategorisinden türer (<see cref="ProjectCategoryDefinition"/>.SystemKey).
/// Kiracının kendi eklediği kategorilerde SystemKey null'dır; onlar kurumsal
/// şablona düşer.
/// </summary>
public enum FinanceContextTemplate
{
    /// <summary>Kurumsal proje — kategori "Diğer / Genel" ya da kiracı kategorisi.</summary>
    Corporate,

    /// <summary>Hibe projesi — kategori "Hibe Projesi".</summary>
    Grant,

    /// <summary>Dernek etkinliği — kategori "Etkinlik".</summary>
    Event
}

/// <summary>Sekme şeridindeki tek bir sekmenin tanımı.</summary>
/// <param name="Code">URL'de taşınan kod (<c>?tab=</c>). Kalıcıdır, değiştirilirse kayıtlı bağlantılar kırılır.</param>
/// <param name="LabelKey">Localization anahtarı (Platform kaynağı).</param>
/// <param name="Icon">FontAwesome sınıfı, aile öneki olmadan.</param>
/// <param name="AnyOfPermissions">Boş değilse sekme yalnız bu izinlerden EN AZ BİRİ varken basılır.</param>
public sealed record FinanceTabDefinition(
    string Code,
    string LabelKey,
    string Icon,
    string[] AnyOfPermissions);

/// <summary>
/// Şablon → sekme seti eşlemesi (tek kaynak). Tasarım prototipindeki
/// <c>TAB_SETS</c> tablosunun karşılığı.
///
/// TASARIMDAN BİLİNÇLİ SAPMA — prototipte DÖRT şablon var, burada ÜÇ:
/// "İnsani yardım" şablonunun karşılığı olan bir sistem kategorisi yok
/// (<see cref="ProjectCategory"/> yalnız Other/GrantProject/Event tanımlıyor) ve
/// o şablonun iki sekmesinin ("Faydalanıcı &amp; dağıtım", "Saha avansları")
/// arkasında hiçbir veri modeli yok. Olmayan ekrana sekme açmıyoruz; şablon
/// ancak kendi veri modeliyle birlikte gelir.
/// </summary>
public static class FinanceContext
{
    // Sekme kodları URL sözleşmesidir — sabite alındı ki hem tanım hem sayfa
    // hem test aynı değeri kullansın.
    public const string TabOverview = "genel";
    public const string TabBudgetLines = "kalemler";
    public const string TabTranches = "dilimler";
    public const string TabLedger = "gelir-gider";
    public const string TabInvoices = "faturalar";
    public const string TabDonor = "donor";
    public const string TabDonations = "bagis";
    public const string TabCash = "kasa";
    public const string TabFxBridge = "kur-koprusu";
    public const string TabDocuments = "belgeler";

    private static readonly FinanceTabDefinition Overview =
        new(TabOverview, "Finance:Tab:Overview", "fa-chart-pie", Array.Empty<string>());

    private static readonly FinanceTabDefinition BudgetLines =
        new(TabBudgetLines, "Finance:Tab:BudgetLines", "fa-list-ul", new[] { PlatformPermissions.Projects.ViewBudget });

    private static readonly FinanceTabDefinition Tranches =
        new(TabTranches, "Finance:Tab:Tranches", "fa-scissors", new[] { PlatformPermissions.Projects.ViewBudget });

    private static readonly FinanceTabDefinition Ledger =
        new(TabLedger, "Finance:Tab:Ledger", "fa-right-left",
            new[] { PlatformPermissions.Incomes.Default, PlatformPermissions.Expenses.Default });

    private static readonly FinanceTabDefinition Invoices =
        new(TabInvoices, "Finance:Tab:Invoices", "fa-file-invoice-dollar", new[] { PlatformPermissions.Invoices.Default });

    private static readonly FinanceTabDefinition Donor =
        new(TabDonor, "Finance:Tab:Donor", "fa-file-export", new[] { PlatformPermissions.Projects.ViewBudget });

    private static readonly FinanceTabDefinition Donations =
        new(TabDonations, "Finance:Tab:Donations", "fa-hand-holding-heart", new[] { PlatformPermissions.Incomes.Default });

    private static readonly FinanceTabDefinition Cash =
        new(TabCash, "Finance:Tab:Cash", "fa-cash-register", new[] { PlatformPermissions.CashAccounts.Default });

    // Donör defteri bir HİBE kavramı: kur köprüsü yalnız hibe şablonunda çıkar.
    // Kurumsal/etkinlik projesinin donör para birimi yoktur, boş bir ekran basmak
    // yerine sekme hiç görünmez.
    private static readonly FinanceTabDefinition FxBridge =
        new(TabFxBridge, "Finance:Tab:FxBridge", "fa-arrow-right-arrow-left", new[] { PlatformPermissions.Projects.ViewBudget });

    private static readonly FinanceTabDefinition Documents =
        new(TabDocuments, "Finance:Tab:Documents", "fa-folder-open", new[] { PlatformPermissions.Documents.Default });

    private static readonly Dictionary<FinanceContextTemplate, FinanceTabDefinition[]> Sets = new()
    {
        [FinanceContextTemplate.Corporate] = new[] { Overview, BudgetLines, Tranches, Ledger, Invoices, Cash, Documents },
        [FinanceContextTemplate.Grant] = new[] { Overview, BudgetLines, Tranches, Ledger, Donor, FxBridge, Cash, Documents },
        [FinanceContextTemplate.Event] = new[] { Overview, BudgetLines, Ledger, Donations, Cash, Documents }
    };

    /// <summary>
    /// Şeritte mor nokta alan sekmeler. Elle işaretlenmez, HESAPLANIR: bir sekme
    /// her şablonda yoksa "bağlama özel"dir. Set değişince nokta kendiliğinden
    /// doğru yere kayar — iki listeyi elle eşit tutma yükü doğmaz.
    /// </summary>
    private static readonly HashSet<string> ContextualCodes = Sets.Values
        .SelectMany(set => set)
        .GroupBy(tab => tab.Code)
        .Where(g => g.Count() < Sets.Count)
        .Select(g => g.Key)
        .ToHashSet(StringComparer.Ordinal);

    /// <summary>Kategori davranış anahtarından şablonu çözer. Bilinmeyen/boş → kurumsal.</summary>
    public static FinanceContextTemplate Resolve(ProjectCategory? categorySystemKey) => categorySystemKey switch
    {
        ProjectCategory.GrantProject => FinanceContextTemplate.Grant,
        ProjectCategory.Event => FinanceContextTemplate.Event,
        _ => FinanceContextTemplate.Corporate
    };

    /// <summary>Şablonun sekme seti — şeritteki sırayla.</summary>
    public static IReadOnlyList<FinanceTabDefinition> TabsFor(FinanceContextTemplate template)
        => Sets.TryGetValue(template, out var set) ? set : Sets[FinanceContextTemplate.Corporate];

    /// <summary>Sekme her şablonda yoksa bağlama özeldir (şeritte mor nokta alır).</summary>
    public static bool IsContextual(string tabCode) => ContextualCodes.Contains(tabCode);

    /// <summary>Şablonun kullanıcıya gösterilecek adının localization anahtarı.</summary>
    public static string LabelKeyOf(FinanceContextTemplate template) => template switch
    {
        FinanceContextTemplate.Grant => "Finance:Template:Grant",
        FinanceContextTemplate.Event => "Finance:Template:Event",
        _ => "Finance:Template:Corporate"
    };
}
