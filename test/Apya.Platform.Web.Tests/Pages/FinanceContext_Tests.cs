using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Web.Pages.Finance;
using Shouldly;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// Finans tek çatısının bağlam sözleşmesi: hangi projede hangi sekmeler görünür.
///
/// Sekme KODLARI bir URL sözleşmesidir (<c>/Finance?tab=…</c>) — paylaşılmış
/// bağlantılar ve tarayıcı geçmişi onlara bağlı. Bu yüzden testler etiketi değil
/// KODU sabitler.
/// </summary>
public class FinanceContext_Tests
{
    [Theory]
    [InlineData(null, FinanceContextTemplate.Corporate)]              // kiracının kendi kategorisi
    [InlineData(ProjectCategory.Other, FinanceContextTemplate.Corporate)]
    [InlineData(ProjectCategory.GrantProject, FinanceContextTemplate.Grant)]
    [InlineData(ProjectCategory.Event, FinanceContextTemplate.Event)]
    public void Resolve_MapsCategorySystemKeyToTemplate(ProjectCategory? key, FinanceContextTemplate expected)
    {
        FinanceContext.Resolve(key).ShouldBe(expected);
    }

    [Fact]
    public void TabsFor_Corporate_MatchesDesignSet()
    {
        Codes(FinanceContextTemplate.Corporate).ShouldBe(new[]
        {
            FinanceContext.TabOverview,
            FinanceContext.TabBudgetLines,
            FinanceContext.TabTranches,
            FinanceContext.TabLedger,
            FinanceContext.TabInvoices,
            FinanceContext.TabCash,
            FinanceContext.TabDocuments
        });
    }

    [Fact]
    public void TabsFor_Grant_SwapsInvoicesForDonorReporting()
    {
        var grant = Codes(FinanceContextTemplate.Grant);

        grant.ShouldContain(FinanceContext.TabDonor);
        grant.ShouldNotContain(FinanceContext.TabInvoices);
        grant.ShouldContain(FinanceContext.TabTranches);
    }

    /// <summary>
    /// Kur köprüsü YALNIZ hibe şablonunda: donör defteri bir hibe kavramı.
    /// Kurumsal/etkinlik projesinin donör para birimi yok, boş bir ekran basmak
    /// yerine sekme hiç görünmüyor.
    /// </summary>
    [Fact]
    public void FxBridge_yalniz_hibe_sablonunda_var()
    {
        Codes(FinanceContextTemplate.Grant).ShouldContain(FinanceContext.TabFxBridge);
        Codes(FinanceContextTemplate.Corporate).ShouldNotContain(FinanceContext.TabFxBridge);
        Codes(FinanceContextTemplate.Event).ShouldNotContain(FinanceContext.TabFxBridge);
    }

    [Fact]
    public void TabsFor_Event_HasDonationsAndNoTranches()
    {
        var evt = Codes(FinanceContextTemplate.Event);

        evt.ShouldContain(FinanceContext.TabDonations);
        evt.ShouldNotContain(FinanceContext.TabTranches);
        evt.ShouldNotContain(FinanceContext.TabInvoices);
    }

    [Fact]
    public void EveryTemplate_StartsWithOverviewAndKeepsSharedTabs()
    {
        foreach (var template in Enum.GetValues<FinanceContextTemplate>())
        {
            var codes = Codes(template);

            codes.First().ShouldBe(FinanceContext.TabOverview);
            codes.ShouldContain(FinanceContext.TabBudgetLines);
            codes.ShouldContain(FinanceContext.TabLedger);
            codes.ShouldContain(FinanceContext.TabCash);
            codes.ShouldContain(FinanceContext.TabDocuments);
        }
    }

    /// <summary>
    /// Mor nokta elle işaretlenmez, "her şablonda var mı" sorusundan hesaplanır.
    /// Sette olan ama her şablonda olmayan sekme bağlama özeldir.
    /// </summary>
    [Theory]
    [InlineData(FinanceContext.TabTranches, true)]
    [InlineData(FinanceContext.TabInvoices, true)]
    [InlineData(FinanceContext.TabDonor, true)]
    [InlineData(FinanceContext.TabDonations, true)]
    [InlineData(FinanceContext.TabFxBridge, true)]
    [InlineData(FinanceContext.TabOverview, false)]
    [InlineData(FinanceContext.TabBudgetLines, false)]
    [InlineData(FinanceContext.TabLedger, false)]
    [InlineData(FinanceContext.TabCash, false)]
    [InlineData(FinanceContext.TabDocuments, false)]
    public void IsContextual_IsDerivedFromTabSets(string code, bool expected)
    {
        FinanceContext.IsContextual(code).ShouldBe(expected);
    }

    [Fact]
    public void TabCodes_AreUniqueWithinTemplate()
    {
        foreach (var template in Enum.GetValues<FinanceContextTemplate>())
        {
            var codes = Codes(template);
            codes.Distinct().Count().ShouldBe(codes.Length);
        }
    }

    /// <summary>
    /// Sekme izinleri "en az biri" mantığıyla okunur; boş dizi = izin koşulu yok.
    /// Gelir-Gider iki modülden beslendiği için ikisinden birine yetkisi olan
    /// kullanıcı sekmeyi görmelidir.
    /// </summary>
    [Fact]
    public void LedgerTab_IsGrantedByEitherIncomeOrExpensePermission()
    {
        var ledger = FinanceContext.TabsFor(FinanceContextTemplate.Corporate)
            .Single(t => t.Code == FinanceContext.TabLedger);

        ledger.AnyOfPermissions.ShouldBe(new[]
        {
            PlatformPermissions.Incomes.Default,
            PlatformPermissions.Expenses.Default
        });
    }

    [Fact]
    public void OverviewTab_HasNoPermissionGate()
    {
        var overview = FinanceContext.TabsFor(FinanceContextTemplate.Corporate)
            .Single(t => t.Code == FinanceContext.TabOverview);

        overview.AnyOfPermissions.ShouldBeEmpty();
    }

    /// <summary>
    /// Sayfa kapısı (ROL-06): beş finans izninden biri. Documents BİLEREK yok — stajyer/çalışan
    /// belge iznine sahip ama finans görmez.
    /// </summary>
    [Fact]
    public void Sayfa_kapisi_bes_finans_iznidir_belge_izni_degildir()
    {
        FinanceContext.PageAnyOfPermissions.ShouldBe(new[]
        {
            PlatformPermissions.Projects.ViewBudget,
            PlatformPermissions.Incomes.Default,
            PlatformPermissions.Expenses.Default,
            PlatformPermissions.Invoices.Default,
            PlatformPermissions.CashAccounts.Default
        }, ignoreOrder: true);

        FinanceContext.PageAnyOfPermissions.ShouldNotContain(PlatformPermissions.Documents.Default);
    }

    /// <summary>
    /// Değişmez: kapı, belge dışındaki bir sekmeyi görebilen kullanıcıyı asla dışarıda bırakmaz.
    /// Sekme izinleri "en az biri" okunduğu için kesişim yetmez, ALT KÜME gerekir: sekmeye kapıda
    /// olmayan ikinci bir izin eklenirse (ör. Kasa = CashAccounts|CashMovements) yalnız o izne sahip
    /// kullanıcı sekmeyi görür ama sayfa ona 403 döner. Kapı güncellenmezse burası kırmızı verir.
    /// </summary>
    [Fact]
    public void Sayfa_kapisi_belge_disindaki_her_sekme_iznini_kapsar()
    {
        foreach (var template in Enum.GetValues<FinanceContextTemplate>())
        {
            foreach (var tab in FinanceContext.TabsFor(template)
                         .Where(t => t.AnyOfPermissions.Length > 0 && t.Code != FinanceContext.TabDocuments))
            {
                tab.AnyOfPermissions.Except(FinanceContext.PageAnyOfPermissions)
                    .ShouldBeEmpty($"{template}/{tab.Code} sekmesinin izni sayfa kapısında yok");
            }
        }
    }

    /// <summary>
    /// Menü kapısı = sayfa kapısı (FUX-06). Eskiden menü koşulu elle yazılmış üç izindi ve kapının
    /// ALT KÜMESİ olması kilitleniyordu; bu, "yasak sayfaya çağrı"yı önlüyor ama tersini önlemiyordu:
    /// sayfayı açabilen kullanıcı menüde göremeyebiliyordu. Artık koşul kapının listesini okur ve
    /// kendi izin yazmaz. Davranışın kendisi FinanceMenuGate_Tests'te ölçülür; burası koşula yeniden
    /// elle izin eklenmesini yakalar.
    /// </summary>
    [Fact]
    public void Menu_kapisi_sayfa_kapisinin_listesini_okur()
    {
        var resolver = ReadSource("src", "Apya.Platform.Web", "Menus", "PlatformNavigationResolver.cs");

        var item = resolver.IndexOf("\"Apya.Finance.Hub\"", StringComparison.Ordinal);
        item.ShouldBeGreaterThan(0, "Apya.Finance.Hub menü öğesi bulunamadı");
        var condition = resolver.LastIndexOf("if (", item, StringComparison.Ordinal);
        condition.ShouldBeGreaterThan(0, "Apya.Finance.Hub menü öğesinin koşulu bulunamadı");

        var conditionSource = resolver[condition..item];

        conditionSource.ShouldContain("FinanceContext.PageAnyOfPermissions", Case.Sensitive,
            "menü koşulu sayfa kapısının listesini okumuyor");
        Regex.Matches(conditionSource, @"PlatformPermissions\.(\w+)\.(\w+)").Count
            .ShouldBe(0, "menü koşuluna elle izin yazılmış — sayfa kapısından ayrışır");
    }

    private static string[] Codes(FinanceContextTemplate template)
        => FinanceContext.TabsFor(template).Select(t => t.Code).ToArray();

    private static string ReadSource(params string[] relative)
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynaklar depodan okunur.
        var root = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..");
        var path = Path.Combine(root, Path.Combine(relative));

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path).Replace("\r\n", "\n");
    }
}
