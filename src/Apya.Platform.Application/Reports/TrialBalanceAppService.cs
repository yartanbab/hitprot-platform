using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.CustomerLedger;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;

namespace Apya.Platform.Reports;

/// <summary>
/// APYA-139a: Yönetim özet mizanı. Faturalı işlemler cariye (AR/AP) yansır;
/// faturasız gelir/gider ayrı grup. Bu tam çift-taraflı THP mizanı DEĞİLDİR
/// (o ayrı faz — mali müşavir girdisiyle).
/// </summary>
// SEC-007: Çıplak [Authorize] mizanı izinsiz kullanıcıya sızdırıyordu; sayfayla (Reports.TrialBalance) hizalandı.
[Authorize(PlatformPermissions.Reports.TrialBalance)]
public class TrialBalanceAppService : ApplicationService, ITrialBalanceAppService
{
    private readonly IRepository<CashAccount, Guid> _cashAccountRepository;
    private readonly IRepository<CashMovement, Guid> _cashMovementRepository;
    private readonly IRepository<CustomerLedgerEntry, Guid> _ledgerRepository;
    private readonly IRepository<IncomeEntry, Guid> _incomeRepository;
    private readonly IRepository<Expense, Guid> _expenseRepository;

    public TrialBalanceAppService(
        IRepository<CashAccount, Guid> cashAccountRepository,
        IRepository<CashMovement, Guid> cashMovementRepository,
        IRepository<CustomerLedgerEntry, Guid> ledgerRepository,
        IRepository<IncomeEntry, Guid> incomeRepository,
        IRepository<Expense, Guid> expenseRepository)
    {
        _cashAccountRepository = cashAccountRepository;
        _cashMovementRepository = cashMovementRepository;
        _ledgerRepository = ledgerRepository;
        _incomeRepository = incomeRepository;
        _expenseRepository = expenseRepository;
    }

    public async Task<TrialBalanceReportDto> GetAsync(GetTrialBalanceInput input)
    {
        var from = input.FromDate?.Date;
        var to = input.ToDate?.Date;

        var report = new TrialBalanceReportDto { FromDate = from, ToDate = to };

        // --- 100 KASA / BANKA ---
        var accounts = await _cashAccountRepository.GetListAsync();
        var movements = await _cashMovementRepository.GetListAsync(m =>
            (from == null || m.MovementDate >= from) && (to == null || m.MovementDate <= to));
        var cashIn = movements.Where(m => m.Direction == CashMovementDirection.In).Sum(m => m.Amount);
        var cashOut = movements.Where(m => m.Direction == CashMovementDirection.Out).Sum(m => m.Amount);
        // Açılış bakiyeleri dönem başlangıcı kabul edilir (her zaman dahil)
        var openings = accounts.Sum(a => a.OpeningBalance);
        report.Lines.Add(new TrialBalanceLineDto
        {
            GroupCode = "100",
            GroupName = "Kasa / Banka",
            Debit = openings + cashIn,
            Credit = cashOut
        });

        // --- 120 / 320 CARİ (AR / AP) ---
        var ledger = await _ledgerRepository.GetListAsync(l =>
            (from == null || l.EntryDate >= from) && (to == null || l.EntryDate <= to));
        var perCustomer = ledger
            .GroupBy(l => l.CustomerId)
            .Select(g => g.Sum(x => x.SignedAmount)) // + müşteri bize borçlu (AR), − biz borçluyuz (AP)
            .ToList();
        var arDebit = perCustomer.Where(b => b > 0).Sum();
        var apCredit = perCustomer.Where(b => b < 0).Sum(b => -b);
        report.Lines.Add(new TrialBalanceLineDto
        {
            GroupCode = "120",
            GroupName = "Cari — Alıcılar (Alacaklarımız)",
            Debit = arDebit,
            Credit = 0
        });
        report.Lines.Add(new TrialBalanceLineDto
        {
            GroupCode = "320",
            GroupName = "Cari — Satıcılar (Borçlarımız)",
            Debit = 0,
            Credit = apCredit
        });

        // --- 600 GELİRLER (faturasız; faturalı gelir cariye yansıdı) ---
        var incomes = await _incomeRepository.GetListAsync(i =>
            (from == null || i.IncomeDate >= from) && (to == null || i.IncomeDate <= to));
        report.Lines.Add(new TrialBalanceLineDto
        {
            GroupCode = "600",
            GroupName = "Gelirler (faturasız / hibe)",
            Debit = 0,
            Credit = incomes.Sum(i => i.Amount)
        });

        // --- 770 GİDERLER (faturasız; faturalı gider cariye yansıdı) ---
        var expenses = await _expenseRepository.GetListAsync(e =>
            (from == null || e.ExpenseDate >= from) && (to == null || e.ExpenseDate <= to));
        report.Lines.Add(new TrialBalanceLineDto
        {
            GroupCode = "770",
            GroupName = "Giderler",
            Debit = expenses.Sum(e => e.Amount),
            Credit = 0
        });

        report.TotalDebit = report.Lines.Sum(l => l.Debit);
        report.TotalCredit = report.Lines.Sum(l => l.Credit);
        return report;
    }
}
