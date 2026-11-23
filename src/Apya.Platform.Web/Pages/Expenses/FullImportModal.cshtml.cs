using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Expenses;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.TenantManagement;
using Entry = Apya.Platform.Web.Import.FinanceEntry<Apya.Platform.Expenses.ExpenseCategory>;

namespace Apya.Platform.Web.Pages.Expenses;

/// <summary>Sistem yöneticisine özel toplu gider aktarımı: bütün parametreler, kiracı seçilerek, yalnız yeni kayıt.</summary>
[Authorize(PlatformPermissions.Expenses.Create)]
public class FullImportModalModel : FinanceFullImportPageModel<Entry, Entry>
{
    private readonly IExpenseAppService _expenseAppService;

    public FullImportModalModel(IExpenseAppService expenseAppService, ITaskAppService taskAppService,
        IProjectBudgetAppService budgetAppService, ITenantRepository tenantRepository)
        : base(taskAppService, budgetAppService, tenantRepository)
    {
        _expenseAppService = expenseAppService;
    }

    protected override string NameKey => "DataTransfer:Module:ExpensesFull";

    protected override string ViewPermission => PlatformPermissions.Expenses.Default;

    protected override string CreatePermission => PlatformPermissions.Expenses.Create;

    private protected override FinanceParameterSheet<Entry, Entry> CreateSheet(IReadOnlyList<string> tenantNames)
        => new FinanceEntrySheet<ExpenseCategory>(L, tenantNames, "Expense:Category:", ExpenseCategory.Other,
            ExpenseConsts.MaxTitleLength, ExpenseConsts.MaxDescriptionLength);

    protected override async Task<IReadOnlyList<CashAccountLookupDto>> GetAccountsAsync()
        => (await _expenseAppService.GetCashAccountLookupAsync()).Items;

    protected override async Task<IReadOnlyList<Entry>> GetRecordsAsync()
    {
        var expenses = await ExcelTable.CollectAsync((skip, take) =>
            _expenseAppService.GetListAsync(new GetExpensesInput { SkipCount = skip, MaxResultCount = take }));
        return expenses.Items.Select(e => new Entry
        {
            Id = e.Id,
            Title = e.Title,
            Date = e.ExpenseDate,
            Category = e.Category,
            Amount = e.Amount,
            Currency = e.Currency,
            CashAccountId = e.CashAccountId,
            CashAccountName = e.CashAccountName,
            ProjectId = e.ProjectId,
            TaskId = e.TaskId,
            BudgetLineId = e.BudgetLineId,
            Description = e.Description
        }).ToList();
    }

    protected override Task CreateRecordAsync(Entry input)
        => _expenseAppService.CreateAsync(new CreateUpdateExpenseDto
        {
            Title = input.Title,
            ExpenseDate = input.Date,
            Category = input.Category,
            Amount = input.Amount,
            Currency = input.Currency,
            CashAccountId = input.CashAccountId,
            ProjectId = input.ProjectId,
            TaskId = input.TaskId,
            BudgetLineId = input.BudgetLineId,
            Description = input.Description
        });
}
