using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Projects;
using HtmlAgilityPack;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Uow;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// 🔴 FUX-01 · Finans Merkezi'nde kayıt eklerken proje bağlamı korunur.
///
/// <para>Gelir-Gider sekmesindeki "Gelir ekle" / "Gider ekle" çıplak <c>/Incomes</c> ve
/// <c>/Expenses</c> sayfalarına gidiyordu. O sayfalar hiçbir parametre okumuyor: kullanıcı
/// merkezde seçtiği projeyi kaybediyor, pencerede yeniden seçiyor — ya da seçmeyi unutup
/// kaydı yanlış projeye (veya projesiz) giriyordu. Proje konsolu aynı işi doğru yapıyordu.</para>
/// </summary>
public class FinanceLedgerAddButtons_Tests : PlatformWebTestBase
{
    private async Task<Guid> CreateProjectAsync()
    {
        var projectId = Guid.NewGuid();
        var code = "FUX01-" + Guid.NewGuid().ToString("N")[..6];

        var uowManager = GetRequiredService<IUnitOfWorkManager>();
        using var uow = uowManager.Begin(requiresNew: true);
        await GetRequiredService<IRepository<Project, Guid>>()
            .InsertAsync(new Project(projectId, null, null, "Kayıt bağlamı " + code, code, "test"), autoSave: true);
        await uow.CompleteAsync();

        return projectId;
    }

    private async Task<HtmlDocument> LoadAsync(string url)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(await GetResponseAsStringAsync(url));
        return doc;
    }

    [Fact]
    public async Task Proje_seciliyken_ekle_dugmeleri_pencereyi_proje_bagliyla_acar()
    {
        var projectId = await CreateProjectAsync();

        var doc = await LoadAsync($"/Finance?projectId={projectId}&tab=gelir-gider");

        // Düğmeler artık sayfa değiştiren bağlantı değil; pencereyi açan düğme.
        doc.DocumentNode.SelectSingleNode("//button[@id='fin-ledger-add-income']").ShouldNotBeNull();
        doc.DocumentNode.SelectSingleNode("//button[@id='fin-ledger-add-expense']").ShouldNotBeNull();

        // Betik projeyi buradan okur.
        var scope = doc.DocumentNode.SelectSingleNode("//*[@data-fin-ledger-project]");
        scope.ShouldNotBeNull();
        scope!.GetAttributeValue("data-fin-ledger-project", "").ShouldBe(projectId.ToString());

        // Betik paketleyiciden "Pages.Finance.Ledger.<özet>.js" adıyla çıkar; adın kendisi aranır.
        System.Text.RegularExpressions.Regex.IsMatch(doc.DocumentNode.OuterHtml, @"Finance[./]Ledger[^""]*[.]js")
            .ShouldBeTrue("düğmeleri bağlayan betik sayfaya eklenmemiş. Betikler: " + string.Join(" | ",
                (doc.DocumentNode.SelectNodes("//script[@src]") ?? new HtmlNodeCollection(null))
                    .Select(n => n.GetAttributeValue("src", ""))));
    }

    /// <summary>Proje seçili değilken korunacak bağlam yok; düğmeler eskisi gibi liste sayfasına gider.</summary>
    [Fact]
    public async Task Proje_secili_degilken_ekle_dugmeleri_liste_sayfasina_gider()
    {
        var doc = await LoadAsync("/Finance?tab=gelir-gider");

        doc.DocumentNode.SelectSingleNode("//a[@href='/Incomes' and contains(@class,'btn')]").ShouldNotBeNull();
        doc.DocumentNode.SelectSingleNode("//a[@href='/Expenses' and contains(@class,'btn')]").ShouldNotBeNull();
        doc.DocumentNode.SelectSingleNode("//button[@id='fin-ledger-add-income']").ShouldBeNull();
    }

    /// <summary>
    /// Zincirin öbür ucu: pencere gelen projeyi ÖNDEN seçili açar. Gider penceresi bunu
    /// yapıyordu (proje konsolu kullanıyor); gelir penceresi parametreyi hiç okumuyordu.
    /// </summary>
    [Theory]
    [InlineData("/Incomes/CreateModal", "Income_ProjectId")]
    [InlineData("/Expenses/CreateModal", "Expense_ProjectId")]
    public async Task Kayit_penceresi_gelen_projeyi_onden_secer(string modalUrl, string selectId)
    {
        var projectId = await CreateProjectAsync();

        var doc = await LoadAsync($"{modalUrl}?ProjectId={projectId}");

        var selected = doc.DocumentNode.SelectSingleNode($"//select[@id='{selectId}']/option[@selected]");
        selected.ShouldNotBeNull("pencerede hiçbir proje seçili değil");
        selected!.GetAttributeValue("value", "").ShouldBe(projectId.ToString());
    }
}
