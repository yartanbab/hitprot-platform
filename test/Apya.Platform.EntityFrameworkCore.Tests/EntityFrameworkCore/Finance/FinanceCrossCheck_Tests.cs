using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Projects;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore.Finance;

/// <summary>
/// FIN-05 · Alış faturası ↔ gider çapraz uyarısı (ürün kararı, 2026-10-13). Karşılık: aynı proje,
/// aynı para birimi, aynı tutar, tarih ±30 gün; iki tarafta da kalem varsa aynı kalem.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class FinanceCrossCheck_Tests : PlatformEntityFrameworkCoreTestBase
{
    private static readonly DateTime Day = new(2026, 10, 13);

    private readonly IInvoiceAppService _invoices;
    private readonly IExpenseAppService _expenses;
    private readonly IRepository<Project, Guid> _projectRepository;
    private readonly IRepository<CashAccount, Guid> _accountRepository;

    public FinanceCrossCheck_Tests()
    {
        _invoices = GetRequiredService<IInvoiceAppService>();
        _expenses = GetRequiredService<IExpenseAppService>();
        _projectRepository = GetRequiredService<IRepository<Project, Guid>>();
        _accountRepository = GetRequiredService<IRepository<CashAccount, Guid>>();
    }

    private async Task<Guid> ProjectAsync()
    {
        var project = new Project(
            Guid.NewGuid(), null, null, "Karşılık projesi", "KRS-" + Guid.NewGuid().ToString("N")[..8], "");
        await _projectRepository.InsertAsync(project, autoSave: true);
        return project.Id;
    }

    private async Task<Guid> LineAsync(Guid projectId, string code)
        => (await GetRequiredService<Apya.Platform.ProjectBudgets.IProjectBudgetAppService>().CreateLineAsync(
            projectId,
            new Apya.Platform.ProjectBudgets.Dtos.CreateUpdateBudgetLineDto { Code = code, Name = "Kalem " + code, PlannedAmount = 500_000m })).Id;

    /// <summary>KDV %20 → toplam = <paramref name="net"/> × 1,2.</summary>
    private async Task<Guid> InvoiceAsync(
        Guid projectId, decimal net, InvoiceDirection direction = InvoiceDirection.Purchase,
        DateTime? date = null, Guid? lineId = null)
        => (await _invoices.CreateAsync(new CreateInvoiceDto
        {
            ProjectId = projectId,
            Direction = direction,
            BudgetLineId = lineId,
            InvoiceNumber = "KRS-" + Guid.NewGuid().ToString("N")[..8],
            InvoiceDate = date ?? Day,
            DueDate = (date ?? Day).AddDays(30),
            Items = new List<CreateInvoiceItemDto> { new() { Description = "Makine", Quantity = 1, UnitPrice = net } }
        })).Id;

    private async Task<Guid> ExpenseAsync(Guid? projectId, decimal amount, DateTime? date = null, Guid? lineId = null)
    {
        var account = new CashAccount(Guid.NewGuid(), "Karşılık kasası", currency: "TRY");
        await _accountRepository.InsertAsync(account, autoSave: true);

        return (await _expenses.CreateAsync(new CreateUpdateExpenseDto
        {
            Title = "Makine alımı",
            Amount = amount,
            Currency = "TRY",
            ExpenseDate = date ?? Day,
            CashAccountId = account.Id,
            ProjectId = projectId,
            BudgetLineId = lineId
        })).Id;
    }

    private async Task<bool> InvoiceWarnsAsync(Guid id) => (await _invoices.GetExpenseCrossCheckAsync(id)).ShouldWarn;
    private async Task<bool> ExpenseWarnsAsync(Guid id) => (await _expenses.GetInvoiceCrossCheckAsync(id)).ShouldWarn;

    [Fact]
    public async Task Alis_faturasi_gideri_yoksa_uyarir_gider_girilince_susar()
    {
        var projectId = await ProjectAsync();
        var invoiceId = await InvoiceAsync(projectId, 100m);

        (await InvoiceWarnsAsync(invoiceId)).ShouldBeTrue();

        await ExpenseAsync(projectId, 120m, Day.AddDays(12));

        (await InvoiceWarnsAsync(invoiceId)).ShouldBeFalse();
    }

    [Fact]
    public async Task Satis_faturasi_gider_karsiligi_aramaz()
    {
        var invoiceId = await InvoiceAsync(await ProjectAsync(), 100m, InvoiceDirection.Sales);

        (await InvoiceWarnsAsync(invoiceId)).ShouldBeFalse();
    }

    [Fact]
    public async Task Gider_faturasi_yoksa_uyarir_alis_faturasi_girilince_susar()
    {
        var projectId = await ProjectAsync();
        var expenseId = await ExpenseAsync(projectId, 120m);

        (await ExpenseWarnsAsync(expenseId)).ShouldBeTrue();

        // Aynı tutarda SATIŞ faturası karşılık sayılmaz.
        await InvoiceAsync(projectId, 100m, InvoiceDirection.Sales);
        (await ExpenseWarnsAsync(expenseId)).ShouldBeTrue();

        await InvoiceAsync(projectId, 100m);
        (await ExpenseWarnsAsync(expenseId)).ShouldBeFalse();
    }

    [Fact]
    public async Task Projesiz_gider_fatura_karsiligi_aramaz()
    {
        var expenseId = await ExpenseAsync(null, 120m);

        (await ExpenseWarnsAsync(expenseId)).ShouldBeFalse();
    }

    [Fact]
    public async Task Baska_proje_baska_tutar_ya_da_uzak_tarih_karsilik_sayilmaz()
    {
        var projectId = await ProjectAsync();
        var invoiceId = await InvoiceAsync(projectId, 100m);

        await ExpenseAsync(await ProjectAsync(), 120m);          // başka proje
        await ExpenseAsync(projectId, 119m);                     // başka tutar
        await ExpenseAsync(projectId, 120m, Day.AddDays(31));    // pencerenin dışında

        (await InvoiceWarnsAsync(invoiceId)).ShouldBeTrue();

        await ExpenseAsync(projectId, 120m, Day.AddDays(-30));   // pencerenin kenarı sayılır

        (await InvoiceWarnsAsync(invoiceId)).ShouldBeFalse();
    }

    [Fact]
    public async Task Iki_tarafta_da_kalem_varsa_kalem_de_ayni_olmalidir()
    {
        var projectId = await ProjectAsync();
        var machine = await LineAsync(projectId, "1");
        var travel = await LineAsync(projectId, "2");

        var invoiceId = await InvoiceAsync(projectId, 100m, lineId: machine);
        var otherLineExpense = await ExpenseAsync(projectId, 120m, lineId: travel);

        (await InvoiceWarnsAsync(invoiceId)).ShouldBeTrue();
        (await ExpenseWarnsAsync(otherLineExpense)).ShouldBeTrue();

        var sameLineExpense = await ExpenseAsync(projectId, 120m, lineId: machine);

        (await InvoiceWarnsAsync(invoiceId)).ShouldBeFalse();
        (await ExpenseWarnsAsync(sameLineExpense)).ShouldBeFalse();

        // Kalemsiz fatura, kalemli giderin karşılığı sayılır (faturada kalem isteğe bağlıdır).
        var looseInvoice = await InvoiceAsync(projectId, 200m);
        var lineExpense = await ExpenseAsync(projectId, 240m, lineId: travel);
        (await InvoiceWarnsAsync(looseInvoice)).ShouldBeFalse();
        (await ExpenseWarnsAsync(lineExpense)).ShouldBeFalse();
    }
}
