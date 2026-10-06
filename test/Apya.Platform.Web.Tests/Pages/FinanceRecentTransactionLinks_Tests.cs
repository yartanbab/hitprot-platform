using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Projects;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// FUX-05 · Finans Merkezi → Genel → "Son İşlemler" satırları proje bağlamını korur.
///
/// <para>Proje seçiliyken satırlar modülün PROJESİZ liste sayfasına gidiyordu: kullanıcı
/// bir projenin son gelirine basıyor, bütün kiracının gelir listesine düşüyor ve aynı kaydı
/// yeniden arıyordu. Artık satır bu sayfanın kendi proje bağlamlı sekmesine gider.</para>
/// </summary>
public class FinanceRecentTransactionLinks_Tests : PlatformWebTestBase
{
    private static readonly string[] ModulePages = { "/Incomes", "/Expenses", "/Invoices", "/CashAccounts" };

    private async Task<Guid> SeedAsync()
    {
        var projectId = Guid.NewGuid();
        var code = "FUX05-" + Guid.NewGuid().ToString("N")[..6];

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);

        await GetRequiredService<IRepository<Project, Guid>>()
            .InsertAsync(new Project(projectId, null, null, "Son işlemler " + code, code, "test"), autoSave: true);

        var cashId = Guid.NewGuid();
        await GetRequiredService<IRepository<CashAccount, Guid>>()
            .InsertAsync(new CashAccount(cashId, "Kasa " + code), autoSave: true);

        await GetRequiredService<IRepository<Expense, Guid>>().InsertAsync(
            new Expense(Guid.NewGuid(), "Gider " + code, 250m, cashId, DateTime.Today, ExpenseCategory.Service, "TRY", projectId: projectId),
            autoSave: true);

        await GetRequiredService<IRepository<IncomeEntry, Guid>>().InsertAsync(
            new IncomeEntry(Guid.NewGuid(), "Gelir " + code, 1_000m, DateTime.Today, projectId: projectId),
            autoSave: true);

        await uow.CompleteAsync();
        return projectId;
    }

    /// <summary>"Son İşlemler" listesindeki satır bağlantıları (HTML varlık kodları çözülmüş).</summary>
    private async Task<List<string>> RecentTransactionLinksAsync(string url)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(url));

        var rows = doc.DocumentNode.SelectNodes("//a[contains(@class,'list-group-item-action')]");
        return rows == null
            ? new List<string>()
            : rows.Select(a => HtmlEntity.DeEntitize(a.GetAttributeValue("href", ""))).ToList();
    }

    [Fact]
    public async Task Proje_seciliyken_satirlar_proje_baglamli_sekmeye_gider()
    {
        var projectId = await SeedAsync();

        var links = await RecentTransactionLinksAsync($"/Finance?projectId={projectId}&tab=genel");

        links.ShouldContain($"/Finance?projectId={projectId}&tab=gelir-gider&kind=gelir");
        links.ShouldContain($"/Finance?projectId={projectId}&tab=gelir-gider&kind=gider");
        // Gelir ve gider satırı artık projesiz liste sayfasına çıkmaz.
        links.ShouldNotContain("/Incomes");
        links.ShouldNotContain("/Expenses");
    }

    /// <summary>
    /// Proje seçili değilken korunacak bir bağlam yok: satırlar eskisi gibi modül sayfasına gider.
    /// </summary>
    [Fact]
    public async Task Proje_secili_degilken_satirlar_modul_sayfasina_gider()
    {
        await SeedAsync();

        var links = await RecentTransactionLinksAsync("/Finance?tab=genel");

        links.ShouldNotBeEmpty();
        links.ShouldAllBe(href => ModulePages.Contains(href));
    }
}
