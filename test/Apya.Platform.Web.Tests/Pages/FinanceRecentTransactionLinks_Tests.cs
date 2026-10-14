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

    private Guid _expenseId;
    private Guid _incomeId;

    private async Task<Guid> SeedAsync()
    {
        var projectId = Guid.NewGuid();
        _expenseId = Guid.NewGuid();
        _incomeId = Guid.NewGuid();
        var code = "FUX05-" + Guid.NewGuid().ToString("N")[..6];

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);

        await GetRequiredService<IRepository<Project, Guid>>()
            .InsertAsync(new Project(projectId, null, null, "Son işlemler " + code, code, "test"), autoSave: true);

        var cashId = Guid.NewGuid();
        await GetRequiredService<IRepository<CashAccount, Guid>>()
            .InsertAsync(new CashAccount(cashId, "Kasa " + code), autoSave: true);

        await GetRequiredService<IRepository<Expense, Guid>>().InsertAsync(
            new Expense(_expenseId, "Gider " + code, 250m, cashId, DateTime.Today, ExpenseCategory.Service, "TRY", projectId: projectId),
            autoSave: true);

        await GetRequiredService<IRepository<IncomeEntry, Guid>>().InsertAsync(
            new IncomeEntry(_incomeId, "Gelir " + code, 1_000m, DateTime.Today, projectId: projectId),
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

        // Satır kaydın kendisine gider: Gelir-Gider tablosundaki satırın çapası.
        links.ShouldContain($"/Finance?projectId={projectId}&tab=gelir-gider&kind=gelir#fin-ledger-{_incomeId}");
        links.ShouldContain($"/Finance?projectId={projectId}&tab=gelir-gider&kind=gider#fin-ledger-{_expenseId}");
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
        // Fatura satırı faturayı seçili açtırır (?invoiceId=…); gelir ve gider sayfaları kayda
        // odaklanmayı bilmez, onlara yalın adres gider.
        links.ShouldAllBe(href => ModulePages.Contains(href) || href.StartsWith("/Invoices?invoiceId="));
    }

    /// <summary>FUX-05 · Çapanın hedefi: Gelir-Gider tablosunda her satır kendi kimliğiyle basılır.</summary>
    [Fact]
    public async Task Gelir_gider_satiri_capa_hedefini_tasir()
    {
        var projectId = await SeedAsync();

        var html = await GetResponseAsStringAsync($"/Finance?projectId={projectId}&tab=gelir-gider");

        html.ShouldContain($"id=\"fin-ledger-{_expenseId}\"");
        html.ShouldContain($"id=\"fin-ledger-{_incomeId}\"");
    }

    /// <summary>
    /// FUX-05 · Fatura listesi adresteki <c>invoiceId</c>'yi okur ve ilk yüklemede o faturayı seçer
    /// (/Invoices ve Finans Merkezi Faturalar sekmesi aynı betiği kullanır).
    /// </summary>
    [Fact]
    public void Fatura_listesi_adresteki_faturayi_secer()
    {
        var path = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..",
            "src", "Apya.Platform.Web", "Pages", "Invoices", "index.js");
        System.IO.File.Exists(path).ShouldBeTrue();
        var js = System.IO.File.ReadAllText(path);

        js.ShouldContain("new URLSearchParams(window.location.search).get('invoiceId')");
        js.ShouldContain("if (focusing) { state.selectedId = focusInvoiceId; }");
    }
}
