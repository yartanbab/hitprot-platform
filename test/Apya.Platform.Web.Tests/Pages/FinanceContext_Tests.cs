using System;
using System.Linq;
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

    private static string[] Codes(FinanceContextTemplate template)
        => FinanceContext.TabsFor(template).Select(t => t.Code).ToArray();
}
