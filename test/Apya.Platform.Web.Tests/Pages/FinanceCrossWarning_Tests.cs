using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.Pages;

/// <summary>
/// FIN-05 · Fatura ↔ gider çapraz uyarısının ekran yarısı: "gider karşılığı yok" uyarısından açılan
/// gider penceresi faturadan dolar; uyarıyı taşıyan yanıt alanı ile onu okuyan betik aynı adı kullanır.
/// </summary>
public class FinanceCrossWarning_Tests : PlatformWebTestBase
{
    private static string ReadSource(params string[] parts)
    {
        // Test, Web.Tests'in bin klasöründen koşar; kaynak depodan okunur.
        var path = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "..", "..", "src", "Apya.Platform.Web");
        foreach (var part in parts)
        {
            path = Path.Combine(path, part);
        }

        File.Exists(path).ShouldBeTrue($"Kaynak bulunamadı: {Path.GetFullPath(path)}");
        return File.ReadAllText(path);
    }

    [Fact]
    public async Task Gider_penceresi_faturadan_acilinca_alanlar_faturadan_dolar()
    {
        var project = new Project(
            Guid.NewGuid(), null, null, "Çapraz uyarı projesi", "CPR-" + Guid.NewGuid().ToString("N")[..8], "");
        await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(project, autoSave: true);

        var lineId = (await GetRequiredService<IProjectBudgetAppService>().CreateLineAsync(
            project.Id, new CreateUpdateBudgetLineDto { Code = "1", Name = "Makine", PlannedAmount = 500_000m })).Id;

        var invoice = await GetRequiredService<IInvoiceAppService>().CreateAsync(new CreateInvoiceDto
        {
            ProjectId = project.Id,
            Direction = InvoiceDirection.Purchase,
            BudgetLineId = lineId,
            InvoiceNumber = "CPR-2026-001",
            InvoiceDate = new DateTime(2026, 10, 13),
            DueDate = new DateTime(2026, 11, 13),
            Items = new List<CreateInvoiceItemDto> { new() { Description = "Makine", Quantity = 1, UnitPrice = 100m } }
        });

        var html = await GetResponseAsStringAsync("/Expenses/CreateModal?FromInvoiceId=" + invoice.Id);

        html.ShouldContain("value=\"Fatura CPR-2026-001\"", Case.Sensitive);
        html.ShouldContain("value=\"2026-10-13\"", Case.Sensitive);
        // Kalem seçenekleri betikle dolar; seçilecek kalem betiğe buradan verilir.
        html.ShouldContain("selectedLineId: '" + lineId + "'", Case.Sensitive);
        // Proje önden seçili gelir (seçenek sırası etiket yardımcısına bağlı; iki yazımı da kabul et).
        (html.Contains("selected=\"selected\" value=\"" + project.Id + "\"", StringComparison.Ordinal)
            || html.Contains("value=\"" + project.Id + "\" selected=\"selected\"", StringComparison.Ordinal))
            .ShouldBeTrue("Fatura projesi gider penceresinde seçili gelmedi.");
    }

    [Fact]
    public void Uyari_alani_adi_sayfa_ile_betikte_aynidir()
    {
        var script = ReadSource("wwwroot", "js", "apya-finance-modal.js");
        var invoicePage = ReadSource("Pages", "Invoices", "CreateModal.cshtml.cs");
        var expensePage = ReadSource("Pages", "Expenses", "CreateModal.cshtml.cs");

        // Sayfalar uyarıyı bu alanla döndürür…
        invoicePage.ShouldContain("crossWarning = new { kind = \"invoice\", invoiceId = created.Id }", Case.Sensitive);
        expensePage.ShouldContain("crossWarning = new { kind = \"expense\" }", Case.Sensitive);

        // …betik aynı alanı, aynı iki pencerenin POST yanıtında okur.
        script.ShouldContain("xhr.responseJSON.crossWarning", Case.Sensitive);
        script.ShouldContain("url.indexOf('Invoices/CreateModal')", Case.Sensitive);
        script.ShouldContain("url.indexOf('Expenses/CreateModal')", Case.Sensitive);
        script.ShouldContain("w.kind === 'invoice'", Case.Sensitive);

        // Gider penceresini faturayla açan parametre adı, sayfa modelindeki özellikle aynıdır.
        script.ShouldContain("modal.open({ FromInvoiceId: w.invoiceId })", Case.Sensitive);
        expensePage.ShouldContain("public Guid? FromInvoiceId { get; set; }", Case.Sensitive);
    }
}
