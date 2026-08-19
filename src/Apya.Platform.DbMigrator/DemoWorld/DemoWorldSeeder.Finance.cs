using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashMovements;
using Apya.Platform.CustomerLedger;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Invoices;
using Apya.Platform.Projects;

namespace Apya.Platform.DbMigrator.DemoWorld;

public partial class DemoWorldSeeder
{
    /// <summary>
    /// Tam mali zincir: satış/alış faturası → cari tahakkuk, tahsilat → kasa hareketi +
    /// ters yön cari kaydı, gider/gelir → kasa hareketi, kasalar arası transfer.
    ///
    /// <para>NOT: <c>InvoiceManager</c> yerine kayıtlar burada doğrudan kuruluyor.
    /// İki sebep: (1) manager tahsilat tarihini <c>Clock.Now</c>'dan alır, geriye dönük
    /// nakit akışı üretemez; (2) her çağrıda ayrı ayrı kaydeder — 150 projede tohumlama
    /// dakikalarca sürerdi. Üretilen satırlar manager'ın ürettiğiyle birebir aynı şekildedir.</para>
    /// </summary>
    private async Task SeedFinanceAsync(Guid? tenantId, List<DemoProject> projects, Guid[] customerIds, Guid[] cashIds)
    {
        var invoices = new List<Invoice>();
        var payments = new List<Payment>();
        var ledger = new List<CustomerLedgerEntry>();
        var movements = new List<CashMovement>();
        var expenses = new List<Expense>();
        var incomes = new List<IncomeEntry>();

        var tryCash = cashIds[1];   // Ziraat - Vadesiz TL
        var pettyCash = cashIds[0]; // Merkez Nakit Kasa
        var usdCash = cashIds[2];   // Garanti - USD
        var cardCash = cashIds[3];  // Kredi kartı


        foreach (var project in projects)
        {
            // ---------- SATIŞ FATURALARI ----------
            var salesCount = Rand(1, 4);
            for (var s = 0; s < salesCount; s++)
            {
                _invoiceNo++;

                // Senaryo dağılımı: ödenmiş / gecikmiş / kısmi / yaklaşan / ileri tarihli
                var scenario = _invoiceNo % 6;
                var (issueOffset, dueOffset, paidRatio) = scenario switch
                {
                    0 => (-Rand(120, 200), -Rand(90, 119), 1.0m),   // tamamı tahsil
                    1 => (-Rand(60, 100), -Rand(20, 55), 0m),       // gecikmiş, hiç ödenmemiş
                    2 => (-Rand(60, 90), -Rand(15, 45), 0.4m),      // gecikmiş, kısmi
                    3 => (-Rand(20, 40), Rand(1, 8), 0m),           // bu hafta vadesi doluyor
                    4 => (-Rand(5, 20), Rand(15, 45), 0m),          // ileri vadeli
                    _ => (-Rand(90, 150), -Rand(50, 85), 1.0m),     // tamamı tahsil
                };

                var isForeign = Chance(12);
                var currency = isForeign ? "USD" : "TRY";
                var unit = isForeign ? project.Budget / 40m : project.Budget / Rand(3, 8);

                var invoice = new Invoice(
                    _guid.Create(), tenantId, project.Id,
                    $"FTR-{_today.Year}-{_invoiceNo:D4}",
                    Day(issueOffset), Day(dueOffset),
                    20m, currency, InvoiceDirection.Sales, project.CustomerId, null);

                invoice.AddItem(_guid.Create(), $"{project.Name} - {s + 1}. hakedis", 1m, Math.Round(unit, 2));
                if (Chance(35))
                {
                    invoice.AddItem(_guid.Create(), "Danismanlik ve destek", Rand(2, 10), Math.Round(unit / 12m, 2));
                }

                invoices.Add(invoice);

                // Fatura tahakkuku — satışta müşteri borçlanır.
                ledger.Add(new CustomerLedgerEntry(
                    _guid.Create(), project.CustomerId, CustomerLedgerDirection.Debit,
                    invoice.TotalAmount, invoice.InvoiceDate, CustomerLedgerSource.Invoice,
                    invoice.Currency, invoice.Id, project.Id,
                    "Satis faturasi: " + invoice.InvoiceNumber, tenantId));

                if (paidRatio > 0)
                {
                    var amount = Math.Round(invoice.TotalAmount * paidRatio, 2);
                    var payDate = Day(dueOffset + Rand(-8, 4));
                    var cashId = isForeign ? usdCash : tryCash;

                    var payment = new Payment(_guid.Create(), invoice.Id, amount, payDate, "Havale")
                    {
                        TenantId = tenantId,
                        ReferenceNumber = $"DEMO-{invoice.InvoiceNumber}",
                        CashAccountId = cashId
                    };
                    payments.Add(payment);

                    movements.Add(new CashMovement(
                        _guid.Create(), cashId, CashMovementDirection.In, amount, payDate,
                        "Fatura tahsilati: " + invoice.InvoiceNumber,
                        CashMovementSource.Invoice, payment.Id, tenantId));

                    ledger.Add(new CustomerLedgerEntry(
                        _guid.Create(), project.CustomerId, CustomerLedgerDirection.Credit,
                        amount, payDate, CustomerLedgerSource.Payment, invoice.Currency,
                        payment.Id, project.Id, "Tahsilat: " + invoice.InvoiceNumber, tenantId));

                    invoice.UpdateStatus(amount);
                }
                else
                {
                    // Kesilmiş ve gönderilmiş ama tahsil edilmemiş fatura "Taslak" görünmemeli.
                    invoice.UpdateStatus(0m);
                }
            }

            // ---------- ALIŞ FATURASI (tedarikçi) ----------
            if (Chance(55))
            {
                _purchaseNo++;
                var supplierId = customerIds[Rand(0, 10)];
                var issue = -Rand(20, 120);
                var due = issue + Rand(20, 45);
                var paid = due < 0 && Chance(60);

                var purchase = new Invoice(
                    _guid.Create(), tenantId, project.Id,
                    $"ALS-{_today.Year}-{_purchaseNo:D4}",
                    Day(issue), Day(due), 20m, "TRY",
                    InvoiceDirection.Purchase, supplierId, null);

                purchase.AddItem(_guid.Create(), "Tedarik / dis kaynak hizmeti", 1m, Math.Round(project.Budget / Rand(8, 20), 2));
                invoices.Add(purchase);

                // Alışta biz borçlanırız → cari Alacak.
                ledger.Add(new CustomerLedgerEntry(
                    _guid.Create(), supplierId, CustomerLedgerDirection.Credit,
                    purchase.TotalAmount, purchase.InvoiceDate, CustomerLedgerSource.Invoice,
                    "TRY", purchase.Id, project.Id,
                    "Alis faturasi: " + purchase.InvoiceNumber, tenantId));

                if (paid)
                {
                    var payDate = Day(due + Rand(-5, 3));
                    var payment = new Payment(_guid.Create(), purchase.Id, purchase.TotalAmount, payDate, "EFT")
                    {
                        TenantId = tenantId,
                        ReferenceNumber = $"DEMO-{purchase.InvoiceNumber}",
                        CashAccountId = tryCash
                    };
                    payments.Add(payment);

                    movements.Add(new CashMovement(
                        _guid.Create(), tryCash, CashMovementDirection.Out, purchase.TotalAmount, payDate,
                        "Tedarikci odemesi: " + purchase.InvoiceNumber,
                        CashMovementSource.Invoice, payment.Id, tenantId));

                    ledger.Add(new CustomerLedgerEntry(
                        _guid.Create(), supplierId, CustomerLedgerDirection.Debit,
                        purchase.TotalAmount, payDate, CustomerLedgerSource.Payment, "TRY",
                        payment.Id, project.Id, "Tedarikci odemesi: " + purchase.InvoiceNumber, tenantId));

                    purchase.UpdateStatus(purchase.TotalAmount);
                }
                else
                {
                    purchase.UpdateStatus(0m);
                }
            }

            // ---------- GİDERLER ----------
            var expenseCount = Rand(2, 5);
            for (var e = 0; e < expenseCount; e++)
            {
                var spec = Pick(DemoWorldData.ExpenseTitles);
                var date = Day(-Rand(2, 150));
                // Küçük tutarlar nakit/karttan, büyük tutarlar bankadan çıkar.
                var amount = Math.Round(project.Budget / Rand(15, 60), 2);
                var cashId = amount < 60_000m ? (Chance(50) ? pettyCash : cardCash) : tryCash;

                var expense = new Expense(
                    _guid.Create(), spec.Title, amount, cashId, date,
                    (ExpenseCategory)spec.Category, "TRY",
                    projectId: project.Id,
                    customerId: Chance(30) ? customerIds[Rand(0, 10)] : null,
                    description: null, taskId: null, tenantId: tenantId);

                expenses.Add(expense);

                // ExpenseAppService ile ayni yan etki: kasadan otomatik cikis.
                movements.Add(new CashMovement(
                    _guid.Create(), cashId, CashMovementDirection.Out, amount, date,
                    "Gider: " + spec.Title, CashMovementSource.Expense, expense.Id, tenantId));
            }

            // ---------- GELİRLER ----------
            var isGrantProject = project.Category == ProjectCategory.GrantProject;
            if (isGrantProject || Chance(30))
            {
                var spec = isGrantProject
                    ? DemoWorldData.IncomeTitles[0]
                    : Pick(DemoWorldData.IncomeTitles);

                var date = Day(-Rand(5, 160));
                var amount = Math.Round(project.Budget / Rand(3, 8), 2);
                var cashId = amount < 80_000m ? pettyCash : tryCash;

                var income = new IncomeEntry(
                    _guid.Create(), spec.Title, amount, date,
                    (IncomeCategory)spec.Category, "TRY",
                    cashAccountId: cashId,
                    projectId: project.Id,
                    customerId: isGrantProject ? project.CustomerId : null,
                    description: null, taskId: null, tenantId: tenantId);

                incomes.Add(income);

                // IncomeEntryAppService ile ayni yan etki: kasaya otomatik giris.
                movements.Add(new CashMovement(
                    _guid.Create(), cashId, CashMovementDirection.In, amount, date,
                    "Gelir: " + spec.Title, CashMovementSource.Income, income.Id, tenantId));
            }
        }

        // ---------- KASALAR ARASI TRANSFER ----------
        // Bankadan nakit kasaya iki ayrı besleme — transfer ekranı boş kalmasın.
        foreach (var offset in new[] { -75, -25 })
        {
            const decimal transferAmount = 150_000m;
            var date = Day(offset);
            var reference = _guid.Create();

            movements.Add(new CashMovement(
                _guid.Create(), tryCash, CashMovementDirection.Out, transferAmount, date,
                "Kasalar arasi transfer: nakit kasaya besleme",
                CashMovementSource.Transfer, reference, tenantId));

            movements.Add(new CashMovement(
                _guid.Create(), pettyCash, CashMovementDirection.In, transferAmount, date,
                "Kasalar arasi transfer: bankadan gelen",
                CashMovementSource.Transfer, reference, tenantId));
        }

        await Repo<Invoice>().InsertManyAsync(invoices, autoSave: true);
        await Repo<Payment>().InsertManyAsync(payments, autoSave: true);
        await Repo<CustomerLedgerEntry>().InsertManyAsync(ledger, autoSave: true);
        await Repo<Expense>().InsertManyAsync(expenses, autoSave: true);
        await Repo<IncomeEntry>().InsertManyAsync(incomes, autoSave: true);
        await Repo<CashMovement>().InsertManyAsync(movements, autoSave: true);
    }
}
