using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Web.Import;

/// <summary>Gider ya da gelir satırı; sayfa bunu kendi oluşturma DTO'suna çevirir.</summary>
public sealed class FinanceImportRow<TCategory> where TCategory : struct, Enum
{
    public string Title { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public TCategory Category { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "TRY";
    public Guid? CashAccountId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? BudgetLineId { get; set; }
    public string? Description { get; set; }
}

/// <summary>Gider/gelir eşlemesinin istek boyu seçenekleri; kalem listesi proje başına bir kez okunur.</summary>
public sealed class FinanceImportLookups<TCategory> where TCategory : struct, Enum
{
    internal IReadOnlyList<CashAccountLookupDto> Accounts { get; init; } = [];
    internal List<(Guid Id, string Name, string Code)> Projects { get; init; } = [];
    internal List<(TCategory Value, string Name)> Categories { get; init; } = [];
    internal bool CanSeeBudget { get; init; }
    internal Dictionary<Guid, ProjectRecordFormLookupDto> Lines { get; } = new();
}

/// <summary>
/// Gider ve gelir pencerelerinin ortak eşlemesi: kasa, kategori, proje ve bütçe kalemi. Her satır
/// ekranın kendi oluşturma servisinden geçer (kasa hareketi, kur damgası, bütçe kalemi kuralı).
/// </summary>
public abstract class FinanceImportPageModel<TCategory>
    : ExcelImportPageModel<FinanceImportLookups<TCategory>, FinanceImportRow<TCategory>>
    where TCategory : struct, Enum
{
    /// <summary>Kategori metninin anahtar öneki (ör. "Expense:Category:").</summary>
    protected abstract string CategoryKeyPrefix { get; }

    protected abstract bool AccountRequired { get; }
    protected abstract int MaxTitleLength { get; }
    protected abstract int MaxDescriptionLength { get; }

    protected abstract Task<IReadOnlyList<CashAccountLookupDto>> GetAccountsAsync();

    private sealed record Headers(string Date, string Title, string Category, string Amount, string Currency,
        string Account, string Project, string BudgetLine, string Description);

    // Başlıklar dışa aktarmayla aynı: ekrandan indirilen dosya geri yüklenebilir.
    private Headers H => new(L["Export:Col:Date"], L["Export:Col:Title"], L["Export:Col:Category"],
        L["Export:Col:Amount"], L["Export:Col:Currency"], L["Export:Col:CashAccount"], L["Export:Col:Project"],
        L["Export:Col:BudgetLine"], L["Export:Col:Description"]);

    protected override IReadOnlyList<ImportColumn> Columns(FinanceImportLookups<TCategory> lookups)
    {
        var h = H;
        return
        [
            new(h.Date, Required: true),
            new(h.Title, Required: true),
            new(h.Category, Options: lookups.Categories.Select(c => c.Name).ToList()),
            new(h.Amount, Required: true),
            new(h.Currency, Options: FinanceLookupShared.Currencies().Select(c => c.Value).ToList()),
            new(h.Account, Required: AccountRequired, Options: lookups.Accounts.Select(a => a.Name).ToList()),
            new(h.Project, Options: lookups.Projects.Select(p => p.Name).ToList()),
            new(h.BudgetLine),
            new(h.Description),
        ];
    }

    protected override async Task<FinanceImportLookups<TCategory>> LoadLookupsAsync()
    {
        var projects = await HttpContext.RequestServices.GetRequiredService<IProjectAppService>()
            .GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = 1000 });
        return new FinanceImportLookups<TCategory>
        {
            Accounts = await GetAccountsAsync(),
            Projects = projects.Items.Select(p => (p.Id, p.Name, p.Code)).ToList(),
            Categories = Enum.GetValues<TCategory>().Select(c => (c, L[CategoryKeyPrefix + c].Value)).ToList(),
            CanSeeBudget = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget)
        };
    }

    protected override async Task<FinanceImportRow<TCategory>> MapAsync(ImportRow row, FinanceImportLookups<TCategory> lookups)
    {
        var h = H;
        var result = new FinanceImportRow<TCategory>();

        result.Title = row.Text(h.Title);
        if (result.Title.Length == 0) row.Errors.Add(L["Import:Error:Required", h.Title]);
        else if (result.Title.Length > MaxTitleLength) row.Errors.Add(L["Import:Error:TooLong", h.Title, MaxTitleLength]);

        var date = ExcelImport.Date(row.Value(h.Date));
        if (date == null) row.Errors.Add(row.Text(h.Date).Length == 0 ? L["Import:Error:Required", h.Date] : L["Import:Error:Date", h.Date]);
        else result.Date = date.Value;

        var amount = ExcelImport.Decimal(row.Value(h.Amount));
        if (amount == null) row.Errors.Add(row.Text(h.Amount).Length == 0 ? L["Import:Error:Required", h.Amount] : L["Import:Error:Number", h.Amount]);
        else if (amount <= 0) row.Errors.Add(L["Import:Error:Positive", h.Amount]);
        else result.Amount = Math.Round(amount.Value, 2);

        var category = row.Text(h.Category);
        if (category.Length > 0 && TryMatch(row, h.Category, category, lookups.Categories,
                c => [c.Name, c.Value.ToString()], out var cat))
        {
            result.Category = cat.Value;
        }

        var accountText = row.Text(h.Account);
        string? accountCurrency = null;
        if (accountText.Length == 0)
        {
            if (AccountRequired) row.Errors.Add(L["Import:Error:Required", h.Account]);
        }
        else if (TryMatch(row, h.Account, accountText, lookups.Accounts, a => [a.Name], out var account))
        {
            (result.CashAccountId, accountCurrency) = (account!.Id, account.Currency);
        }

        // Para birimi boşsa kasanınki: kasaya giren/çıkan para çoğunlukla kasanın para birimindedir.
        var currency = row.Text(h.Currency).ToUpperInvariant();
        if (currency.Length == 0) currency = accountCurrency ?? "TRY";
        if (Regex.IsMatch(currency, "^[A-Z]{3}$")) result.Currency = currency;
        else row.Errors.Add(L["Import:Error:Currency", h.Currency]);

        var projectText = row.Text(h.Project);
        var lineText = row.Text(h.BudgetLine);
        if (projectText.Length > 0)
        {
            if (TryMatch(row, h.Project, projectText, lookups.Projects, p => [p.Name, p.Code], out var project))
            {
                result.ProjectId = project.Id;
                await MapBudgetLineAsync(row, result, lineText, lookups);
            }
        }
        else if (lineText.Length > 0)
        {
            row.Errors.Add(L["Import:Error:BudgetLineWithoutProject", h.BudgetLine, h.Project]);
        }

        result.Description = row.Text(h.Description) is { Length: > 0 } d ? d : null;
        if (result.Description?.Length > MaxDescriptionLength)
        {
            row.Errors.Add(L["Import:Error:TooLong", h.Description, MaxDescriptionLength]);
        }

        return result;
    }

    /// <summary>
    /// Kalem kodla, adla ya da "kod - ad" ile eşleşir. Bütçeyi görme izni yoksa eşleme yapılamaz;
    /// kalem zorunluysa sunucudaki kural kaydı satır numarasıyla reddeder.
    /// </summary>
    private async Task MapBudgetLineAsync(ImportRow row, FinanceImportRow<TCategory> result, string lineText,
        FinanceImportLookups<TCategory> lookups)
    {
        var h = H;
        if (!lookups.CanSeeBudget)
        {
            if (lineText.Length > 0) row.Errors.Add(L["Import:Error:NotFound", h.BudgetLine, lineText]);
            return;
        }

        var projectId = result.ProjectId!.Value;
        if (!lookups.Lines.TryGetValue(projectId, out var lookup))
        {
            lookup = await HttpContext.RequestServices.GetRequiredService<IProjectBudgetAppService>()
                .GetRecordFormLookupAsync(projectId);
            lookups.Lines[projectId] = lookup;
        }

        if (lineText.Length == 0)
        {
            if (lookup.RequiresBudgetLine) row.Errors.Add(L["Import:Error:BudgetLineRequired", h.BudgetLine]);
            return;
        }

        if (TryMatch(row, h.BudgetLine, lineText, lookup.Lines, l => [l.Code, l.Name, $"{l.Code} - {l.Name}"], out var line))
        {
            result.BudgetLineId = line!.Id;
        }
    }
}
