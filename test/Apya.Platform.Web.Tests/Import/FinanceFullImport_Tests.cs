using System;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;
using ClosedXML.Excel;
using Shouldly;
using Volo.Abp.Domain.Repositories;
using Xunit;

namespace Apya.Platform.Import;

/// <summary>Finans aktarımının ortak kurulumu: kiracı, EUR kasa ve proje.</summary>
public abstract class FinanceFullImportTestBase : FullImportTestBase
{
    protected string AccountName => "Tam kasa " + Code;

    protected string ProjectCode => "FP-" + Code;

    protected async Task<(Guid TenantId, Guid AccountId, Guid ProjectId)> SeedFinanceAsync()
    {
        var tenantId = await SeedTenantAsync();
        var accountId = Guid.NewGuid();
        var projectId = Guid.NewGuid();
        await InTenantAsync(tenantId, async () =>
        {
            await GetRequiredService<IRepository<CashAccount, Guid>>().InsertAsync(
                new CashAccount(accountId, AccountName, currency: "EUR", tenantId: tenantId), autoSave: true);
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(projectId, tenantId, null, "Finans projesi " + Code, ProjectCode, ""), autoSave: true);
        });
        return (tenantId, accountId, projectId);
    }

    protected static void AddEntry(IXLWorksheet ws, string tenant, string title, double amount, string? account = null,
        string? project = null, string? task = null)
    {
        var next = NextRow(ws);
        ws.Cell(next, ColumnOf(ws, "Kiracı")).Value = tenant;
        ws.Cell(next, ColumnOf(ws, "Başlık")).Value = title;
        ws.Cell(next, ColumnOf(ws, "Tarih")).Value = new DateTime(2026, 11, 10);
        ws.Cell(next, ColumnOf(ws, "Tutar")).Value = amount;
        if (account != null) ws.Cell(next, ColumnOf(ws, "Kasa")).Value = account;
        if (project != null) ws.Cell(next, ColumnOf(ws, "Proje")).Value = project;
        if (task != null) ws.Cell(next, ColumnOf(ws, "Görev")).Value = task;
    }
}

public class ExpenseFullImport_Tests : FinanceFullImportTestBase
{
    protected override string Url => "/Expenses/FullImportModal";

    private async Task<Guid> SeedExpenseAsync(Guid tenantId, Guid accountId)
    {
        Guid id = default;
        await InTenantAsync(tenantId, async () =>
            id = (await GetRequiredService<IExpenseAppService>().CreateAsync(new CreateUpdateExpenseDto
            {
                Title = "Mevcut gider " + Code,
                Amount = 100.25m,
                Currency = "EUR",
                ExpenseDate = new DateTime(2026, 3, 5, 14, 30, 0),
                CashAccountId = accountId
            })).Id);
        return id;
    }

    [Fact]
    public async Task Mevcut_satir_yazilmaz_yeni_satir_kiracida_kasadan_duser()
    {
        var seed = await SeedFinanceAsync();
        var existingId = await SeedExpenseAsync(seed.TenantId, seed.AccountId);

        var file = await ExportAsync();
        HasId(file, existingId).ShouldBeTrue();
        ShouldBeDone(await PostAsync("Import", file), "Yeni: 0 · Güncellenen: 0");

        var title = "Yeni gider " + Code;
        ShouldBeDone(await PostAsync("Import", Edit(file, ws => AddEntry(ws, TenantName, title, 1250.75, AccountName, ProjectCode))),
            "Yeni: 1 · Güncellenen: 0");

        await InTenantAsync(seed.TenantId, async () =>
        {
            var expenses = GetRequiredService<IRepository<Expense, Guid>>();
            (await expenses.CountAsync(e => e.TenantId == seed.TenantId)).ShouldBe(2);

            var created = await expenses.SingleAsync(e => e.Title == title);
            created.Amount.ShouldBe(1250.75m);
            created.Currency.ShouldBe("EUR"); // boş para birimi kasanınki
            created.ProjectId.ShouldBe(seed.ProjectId);

            var movements = GetRequiredService<IRepository<CashMovement, Guid>>();
            var movement = await movements.SingleAsync(m => m.ReferenceId == created.Id);
            movement.Direction.ShouldBe(CashMovementDirection.Out);
            movement.Amount.ShouldBe(1250.75m);
            movement.CashAccountId.ShouldBe(seed.AccountId);
            movement.TenantId.ShouldBe(seed.TenantId);

            // Mevcut kaydın kasa hareketi tek kalır.
            (await movements.CountAsync(m => m.ReferenceId == existingId)).ShouldBe(1);
        });
    }

    [Fact]
    public async Task Degisen_mevcut_satir_reddedilir_ve_kayit_degismez()
    {
        var seed = await SeedFinanceAsync();
        var existingId = await SeedExpenseAsync(seed.TenantId, seed.AccountId);
        var file = await ExportAsync();

        var changed = Edit(file, ws => ws.Cell(RowOf(ws, existingId), ColumnOf(ws, "Tutar")).Value = 999);
        var preview = await PostAsync("Preview", changed);
        preview.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(preview).ShouldContain("değiştirilemez");

        await PostAsync("Import", changed);
        await InTenantAsync(seed.TenantId, async () =>
        {
            (await GetRequiredService<IRepository<Expense, Guid>>().GetAsync(existingId)).Amount.ShouldBe(100.25m);
            (await GetRequiredService<IRepository<CashMovement, Guid>>().SingleAsync(m => m.ReferenceId == existingId)).Amount.ShouldBe(100.25m);
        });
    }

    [Fact]
    public async Task Baska_kiracinin_kasasi_kalemsiz_satir_ve_yabanci_gorev_reddedilir()
    {
        var seed = await SeedFinanceAsync();
        var otherTenant = await SeedTenantAsync("baska-finans-" + Code);
        var otherAccount = "Yabancı kasa " + Code;
        var otherProject = Guid.NewGuid();
        await InTenantAsync(otherTenant, () => GetRequiredService<IRepository<CashAccount, Guid>>().InsertAsync(
            new CashAccount(Guid.NewGuid(), otherAccount, tenantId: otherTenant), autoSave: true));
        await InTenantAsync(seed.TenantId, async () =>
        {
            await GetRequiredService<IRepository<ProjectBudgetLine, Guid>>().InsertAsync(
                new ProjectBudgetLine(Guid.NewGuid(), seed.TenantId, seed.ProjectId, "B1", "Personel", 1000m, 1000m), autoSave: true);
            await GetRequiredService<IRepository<Project, Guid>>().InsertAsync(
                new Project(otherProject, seed.TenantId, null, "İkinci proje " + Code, "IP-" + Code, ""), autoSave: true);
            var task = new TaskItem(Guid.NewGuid(), "İkinci projenin görevi " + Code, projectId: otherProject, tenantId: seed.TenantId, now: DateTime.Now);
            task.AssignNumber(1);
            await GetRequiredService<IRepository<TaskItem, Guid>>().InsertAsync(task, autoSave: true);
        });
        var file = await ExportAsync();

        var foreignAccount = await PostAsync("Preview", Edit(file, ws => AddEntry(ws, TenantName, "Yabancı kasa", 10, otherAccount)));
        foreignAccount.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(foreignAccount).ShouldContain(otherAccount);

        var noLine = await PostAsync("Preview", Edit(file, ws => AddEntry(ws, TenantName, "Kalemsiz", 10, project: ProjectCode)));
        noLine.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(noLine).ShouldContain("Bütçe kalemi");

        var mismatch = await PostAsync("Preview", Edit(file, ws => AddEntry(ws, TenantName, "Yanlış görev", 10, project: ProjectCode, task: "GRV-1")));
        mismatch.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(mismatch).ShouldContain("projeye ait değil");
    }
}

public class IncomeFullImport_Tests : FinanceFullImportTestBase
{
    protected override string Url => "/Incomes/FullImportModal";

    [Fact]
    public async Task Yeni_gelir_kiracida_kasaya_girer_mevcut_satir_yazilmaz()
    {
        var seed = await SeedFinanceAsync();
        Guid existingId = default;
        await InTenantAsync(seed.TenantId, async () =>
            existingId = (await GetRequiredService<IIncomeEntryAppService>().CreateAsync(new CreateUpdateIncomeEntryDto
            {
                Title = "Mevcut gelir " + Code,
                Amount = 80m,
                Currency = "EUR",
                IncomeDate = new DateTime(2026, 3, 5),
                CashAccountId = seed.AccountId
            })).Id);

        var file = await ExportAsync();
        HasId(file, existingId).ShouldBeTrue();

        var title = "Yeni gelir " + Code;
        ShouldBeDone(await PostAsync("Import", Edit(file, ws => AddEntry(ws, TenantName, title, 300, AccountName))), "Yeni: 1 · Güncellenen: 0");

        await InTenantAsync(seed.TenantId, async () =>
        {
            var incomes = GetRequiredService<IRepository<IncomeEntry, Guid>>();
            (await incomes.CountAsync(e => e.TenantId == seed.TenantId)).ShouldBe(2);
            var created = await incomes.SingleAsync(e => e.Title == title);
            created.Currency.ShouldBe("EUR");

            var movement = await GetRequiredService<IRepository<CashMovement, Guid>>().SingleAsync(m => m.ReferenceId == created.Id);
            movement.Direction.ShouldBe(CashMovementDirection.In);
            movement.Amount.ShouldBe(300m);
            movement.TenantId.ShouldBe(seed.TenantId);
        });
    }
}

public class InvoiceFullImport_Tests : FinanceFullImportTestBase
{
    protected override string Url => "/Invoices/FullImportModal";

    private string ExistingNumber => "FTR-" + Code;

    private async Task<Guid> SeedInvoiceAsync(Guid tenantId, Guid projectId)
    {
        Guid id = default;
        await InTenantAsync(tenantId, async () =>
            id = (await GetRequiredService<IInvoiceAppService>().CreateAsync(new CreateInvoiceDto
            {
                ProjectId = projectId,
                InvoiceNumber = ExistingNumber,
                InvoiceDate = new DateTime(2026, 3, 5),
                DueDate = new DateTime(2026, 4, 5),
                TaxRate = 20,
                Items =
                [
                    new CreateInvoiceItemDto { Description = "B kalemi; özel", Quantity = 1, UnitPrice = 100 },
                    new CreateInvoiceItemDto { Description = "A kalemi", Quantity = 1.5m, UnitPrice = 50.5m }
                ]
            })).Id);
        return id;
    }

    private void AddInvoice(IXLWorksheet ws, string number, string items)
    {
        var next = NextRow(ws);
        ws.Cell(next, ColumnOf(ws, "Kiracı")).Value = TenantName;
        ws.Cell(next, ColumnOf(ws, "Fatura numarası")).Value = number;
        ws.Cell(next, ColumnOf(ws, "Proje")).Value = ProjectCode;
        ws.Cell(next, ColumnOf(ws, "Tarih")).Value = new DateTime(2026, 11, 10);
        ws.Cell(next, ColumnOf(ws, "Kalemler")).Value = items;
    }

    [Fact]
    public async Task Mevcut_fatura_yazilmaz_yeni_fatura_kalemleriyle_kiracida_acilir()
    {
        var seed = await SeedFinanceAsync();
        var existingId = await SeedInvoiceAsync(seed.TenantId, seed.ProjectId);

        var file = await ExportAsync();
        HasId(file, existingId).ShouldBeTrue();
        ShouldBeDone(await PostAsync("Import", file), "Yeni: 0 · Güncellenen: 0");

        var number = "YENI-" + Code;
        ShouldBeDone(await PostAsync("Import", Edit(file, ws => AddInvoice(ws, number, "Danışmanlık | 2 | 1500,50; Yol | 1 | 300"))),
            "Yeni: 1 · Güncellenen: 0");

        await InTenantAsync(seed.TenantId, async () =>
        {
            var created = await GetRequiredService<IRepository<Invoice, Guid>>().SingleAsync(i => i.InvoiceNumber == number);
            created.TenantId.ShouldBe(seed.TenantId);
            created.DueDate.ShouldBe(created.InvoiceDate); // boş vade fatura tarihi
            created.TaxRate.ShouldBe(20m);

            var dto = await GetRequiredService<IInvoiceAppService>().GetAsync(created.Id);
            dto.Items.Count.ShouldBe(2);
            dto.Items.Single(i => i.Description == "Danışmanlık").UnitPrice.ShouldBe(1500.50m);
            dto.TotalAmount.ShouldBe(3961.20m);
            dto.PaidAmount.ShouldBe(0m);

            (await GetRequiredService<IRepository<CashMovement, Guid>>().CountAsync(m => m.ReferenceId == created.Id)).ShouldBe(0);
        });
    }

    [Fact]
    public async Task Numara_cakismasi_bozuk_kalem_ve_degisen_mevcut_satir_reddedilir()
    {
        var seed = await SeedFinanceAsync();
        var existingId = await SeedInvoiceAsync(seed.TenantId, seed.ProjectId);
        var file = await ExportAsync();

        var inDatabase = await PostAsync("Preview", Edit(file, ws => AddInvoice(ws, ExistingNumber, "Kalem | 1 | 10")));
        inDatabase.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(inDatabase).ShouldContain("zaten kullanılıyor");

        var inFile = await PostAsync("Preview", Edit(file, ws =>
        {
            AddInvoice(ws, "AYNI-" + Code, "Kalem | 1 | 10");
            AddInvoice(ws, "AYNI-" + Code, "Kalem | 1 | 20");
        }));
        inFile.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(inFile).ShouldContain("zaten kullanılıyor");

        var badItem = await PostAsync("Preview", Edit(file, ws => AddInvoice(ws, "BOZUK-" + Code, "Yalnız açıklama")));
        badItem.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(badItem).ShouldContain("okunamadı");

        var changed = await PostAsync("Preview", Edit(file, ws => ws.Cell(RowOf(ws, existingId), ColumnOf(ws, "Not")).Value = "Değişti"));
        changed.GetProperty("ok").GetBoolean().ShouldBeFalse();
        Describe(changed).ShouldContain("değiştirilemez");
    }
}
