using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Incomes;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.TenantManagement;
using Entry = Apya.Platform.Web.Import.FinanceEntry<Apya.Platform.Incomes.IncomeCategory>;

namespace Apya.Platform.Web.Pages.Incomes;

/// <summary>Sistem yöneticisine özel toplu gelir aktarımı: bütün parametreler, kiracı seçilerek, yalnız yeni kayıt.</summary>
[Authorize(PlatformPermissions.Incomes.Create)]
public class FullImportModalModel : FinanceEntryFullImportPageModel<IncomeCategory>
{
    private readonly IIncomeEntryAppService _incomeAppService;

    public FullImportModalModel(IIncomeEntryAppService incomeAppService, ITaskAppService taskAppService,
        IProjectBudgetAppService budgetAppService, ITenantRepository tenantRepository)
        : base(taskAppService, budgetAppService, tenantRepository)
    {
        _incomeAppService = incomeAppService;
    }

    protected override string NameKey => "DataTransfer:Module:IncomesFull";

    protected override string ViewPermission => PlatformPermissions.Incomes.Default;

    protected override string CreatePermission => PlatformPermissions.Incomes.Create;

    private protected override FinanceParameterSheet<Entry, Entry> CreateSheet(IReadOnlyList<string> tenantNames)
        => new FinanceEntrySheet<IncomeCategory>(L, tenantNames, "Income:Category:", IncomeCategory.Other,
            IncomeConsts.MaxTitleLength, IncomeConsts.MaxDescriptionLength);

    protected override async Task<IReadOnlyList<CashAccountLookupDto>> GetAccountsAsync()
        => (await _incomeAppService.GetCashAccountLookupAsync()).Items;

    protected override async Task<IReadOnlyList<Entry>> GetEntriesAsync(DateTime? day)
    {
        var incomes = await ExcelTable.CollectAsync((skip, take) => _incomeAppService.GetListAsync(
            new GetIncomeEntriesInput { SkipCount = skip, MaxResultCount = take, FromDate = day, ToDate = EndOfDay(day) }));
        return incomes.Items.Select(e => new Entry
        {
            Id = e.Id,
            Title = e.Title,
            Date = e.IncomeDate,
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
        => _incomeAppService.CreateAsync(new CreateUpdateIncomeEntryDto
        {
            Title = input.Title,
            IncomeDate = input.Date,
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
