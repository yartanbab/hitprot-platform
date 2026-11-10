using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Expenses;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Uow;

namespace Apya.Platform.Web.Pages.Expenses;

/// <summary>
/// Giderleri Excel'den içe aktarma: şablon → önizleme → onay. Her satır gider penceresinin
/// kullandığı <see cref="IExpenseAppService.CreateAsync"/>'ten geçer (kasa hareketi, kur damgası,
/// bütçe kalemi kuralı aynen çalışır). Tek satır düşerse hiçbir satır yazılmaz.
/// </summary>
[Authorize(PlatformPermissions.Expenses.Create)]
public class ImportModalModel : PlatformPageModel
{
    private readonly IExpenseAppService _expenseAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly IProjectBudgetAppService _budgetAppService;

    public ImportModalModel(
        IExpenseAppService expenseAppService,
        IProjectAppService projectAppService,
        IProjectBudgetAppService budgetAppService)
    {
        _expenseAppService = expenseAppService;
        _projectAppService = projectAppService;
        _budgetAppService = budgetAppService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnGetTemplateAsync()
    {
        var lookups = await LoadLookupsAsync();
        var name = L["Export:Expenses:Name"].Value;
        var bytes = ExcelImport.Template(name, L["Import:OptionsSheet"], Columns(lookups));
        return File(bytes, ExcelTable.ContentType, ExcelTable.FileName($"{L["Import:Template"]}_{name}", Clock.Now));
    }

    public async Task<IActionResult> OnPostPreviewAsync(IFormFile? file)
    {
        var (sheet, _) = await ReadAsync(file);
        return new JsonResult(ImportResponse.Preview(sheet, L));
    }

    public async Task<IActionResult> OnPostImportAsync(IFormFile? file, [FromServices] IUnitOfWorkManager unitOfWorkManager)
    {
        var (sheet, dtos) = await ReadAsync(file);
        if (sheet.Errors.Count > 0 || sheet.Rows.Any(r => r.Errors.Count > 0))
        {
            return new JsonResult(ImportResponse.Preview(sheet, L));
        }

        // Ayrı ve işlemli iş birimi: sayfanın kendi iş birimi yakalanan hatayı başarı sayıp
        // önceki satırları kaydederdi. Burada Complete çağrılmadan çıkılırsa her şey geri alınır.
        using var uow = unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
        for (var i = 0; i < dtos.Count; i++)
        {
            try
            {
                await _expenseAppService.CreateAsync(dtos[i]);
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex, "Gider içe aktarma satır {Row} reddedildi", sheet.Rows[i].Number);
                return new JsonResult(ImportResponse.Failed(L["Import:Error:Row", sheet.Rows[i].Number, this.UserMessage(ex)]));
            }
        }

        await uow.CompleteAsync();
        return new JsonResult(ImportResponse.Done(L["Import:Done", dtos.Count]));
    }

    private sealed record Lookups(
        List<(Guid Id, string Name, string Currency)> Accounts,
        List<(Guid Id, string Name)> Projects,
        List<(ExpenseCategory Value, string Name)> Categories,
        bool CanSeeBudget);

    private sealed record Headers(string Date, string Title, string Category, string Amount, string Currency,
        string Account, string Project, string BudgetLine, string Description);

    private Headers H => new(L["Export:Col:Date"], L["Export:Col:Title"], L["Export:Col:Category"],
        L["Export:Col:Amount"], L["Export:Col:Currency"], L["Export:Col:CashAccount"], L["Export:Col:Project"],
        L["Export:Col:BudgetLine"], L["Export:Col:Description"]);

    private List<ImportColumn> Columns(Lookups lookups)
    {
        var h = H;
        return
        [
            new(h.Date, Required: true),
            new(h.Title, Required: true),
            new(h.Category, Options: lookups.Categories.Select(c => c.Name).ToList()),
            new(h.Amount, Required: true),
            new(h.Currency, Options: FinanceLookupShared.Currencies().Select(c => c.Value).ToList()),
            new(h.Account, Required: true, Options: lookups.Accounts.Select(a => a.Name).ToList()),
            new(h.Project, Options: lookups.Projects.Select(p => p.Name).ToList()),
            new(h.BudgetLine),
            new(h.Description),
        ];
    }

    private async Task<Lookups> LoadLookupsAsync()
    {
        var accounts = (await _expenseAppService.GetCashAccountLookupAsync()).Items
            .Select(a => (a.Id, a.Name, a.Currency)).ToList();
        var projects = (await _projectAppService.GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = 1000 }))
            .Items.Select(p => (p.Id, p.Name)).ToList();
        var categories = Enum.GetValues<ExpenseCategory>()
            .Select(c => (c, L[$"Expense:Category:{c}"].Value)).ToList();
        var canSeeBudget = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget);
        return new Lookups(accounts, projects, categories, canSeeBudget);
    }

    private async Task<(ImportSheet Sheet, List<CreateUpdateExpenseDto> Dtos)> ReadAsync(IFormFile? file)
    {
        var dtos = new List<CreateUpdateExpenseDto>();
        if (file == null || file.Length == 0)
        {
            return (new ImportSheet(new List<string>(), new List<ImportRow>(), [L["Import:ChooseFile"]]), dtos);
        }

        var lookups = await LoadLookupsAsync();
        await using var stream = file.OpenReadStream();
        var sheet = ExcelImport.Read(stream, Columns(lookups), L);
        var lines = new Dictionary<Guid, ProjectRecordFormLookupDto>();

        foreach (var row in sheet.Rows)
        {
            dtos.Add(await MapAsync(row, lookups, lines));
        }

        return (sheet, dtos);
    }

    private async Task<CreateUpdateExpenseDto> MapAsync(ImportRow row, Lookups lookups,
        Dictionary<Guid, ProjectRecordFormLookupDto> lines)
    {
        var h = H;
        var dto = new CreateUpdateExpenseDto();

        dto.Title = row.Text(h.Title);
        if (dto.Title.Length == 0) row.Errors.Add(L["Import:Error:Required", h.Title]);
        else if (dto.Title.Length > ExpenseConsts.MaxTitleLength) row.Errors.Add(L["Import:Error:TooLong", h.Title, ExpenseConsts.MaxTitleLength]);

        var date = ExcelImport.Date(row.Value(h.Date));
        if (date == null) row.Errors.Add(row.Text(h.Date).Length == 0 ? L["Import:Error:Required", h.Date] : L["Import:Error:Date", h.Date]);
        else dto.ExpenseDate = date.Value;

        var amount = ExcelImport.Decimal(row.Value(h.Amount));
        if (amount == null) row.Errors.Add(row.Text(h.Amount).Length == 0 ? L["Import:Error:Required", h.Amount] : L["Import:Error:Number", h.Amount]);
        else if (amount <= 0) row.Errors.Add(L["Import:Error:Positive", h.Amount]);
        else dto.Amount = Math.Round(amount.Value, 2);

        var category = row.Text(h.Category);
        if (category.Length > 0)
        {
            var match = lookups.Categories.Where(c => Same(c.Name, category) || Same(c.Value.ToString(), category)).ToList();
            if (match.Count == 1) dto.Category = match[0].Value;
            else row.Errors.Add(L["Import:Error:NotFound", h.Category, category]);
        }

        var accountText = row.Text(h.Account);
        string? accountCurrency = null;
        if (accountText.Length == 0)
        {
            row.Errors.Add(L["Import:Error:Required", h.Account]);
        }
        else
        {
            var match = lookups.Accounts.Where(a => Same(a.Name, accountText)).ToList();
            if (match.Count == 1) (dto.CashAccountId, accountCurrency) = (match[0].Id, match[0].Currency);
            else row.Errors.Add(L[match.Count == 0 ? "Import:Error:NotFound" : "Import:Error:Ambiguous", h.Account, accountText]);
        }

        // Para birimi boşsa kasanınki: kasadan çıkan para çoğunlukla kasanın para birimindedir.
        var currency = row.Text(h.Currency).ToUpperInvariant();
        if (currency.Length == 0) currency = accountCurrency ?? "TRY";
        if (Regex.IsMatch(currency, "^[A-Z]{3}$")) dto.Currency = currency;
        else row.Errors.Add(L["Import:Error:Currency", h.Currency]);

        var projectText = row.Text(h.Project);
        var lineText = row.Text(h.BudgetLine);
        if (projectText.Length > 0)
        {
            var match = lookups.Projects.Where(p => Same(p.Name, projectText)).ToList();
            if (match.Count == 1)
            {
                dto.ProjectId = match[0].Id;
                await MapBudgetLineAsync(row, dto, lineText, lookups, lines);
            }
            else
            {
                row.Errors.Add(L[match.Count == 0 ? "Import:Error:NotFound" : "Import:Error:Ambiguous", h.Project, projectText]);
            }
        }
        else if (lineText.Length > 0)
        {
            row.Errors.Add(L["Import:Error:BudgetLineWithoutProject", h.BudgetLine, h.Project]);
        }

        dto.Description = row.Text(h.Description) is { Length: > 0 } d ? d : null;
        if (dto.Description?.Length > ExpenseConsts.MaxDescriptionLength)
        {
            row.Errors.Add(L["Import:Error:TooLong", h.Description, ExpenseConsts.MaxDescriptionLength]);
        }

        return dto;
    }

    /// <summary>
    /// Kalem kodla, adla ya da "kod - ad" ile eşleşir. Bütçeyi görme izni yoksa eşleme yapılamaz;
    /// kalem zorunluysa sunucudaki kural kaydı satır numarasıyla reddeder.
    /// </summary>
    private async Task MapBudgetLineAsync(ImportRow row, CreateUpdateExpenseDto dto, string lineText, Lookups lookups,
        Dictionary<Guid, ProjectRecordFormLookupDto> lines)
    {
        var h = H;
        if (!lookups.CanSeeBudget)
        {
            if (lineText.Length > 0) row.Errors.Add(L["Import:Error:NotFound", h.BudgetLine, lineText]);
            return;
        }

        if (!lines.TryGetValue(dto.ProjectId!.Value, out var lookup))
        {
            lookup = await _budgetAppService.GetRecordFormLookupAsync(dto.ProjectId.Value);
            lines[dto.ProjectId.Value] = lookup;
        }

        if (lineText.Length == 0)
        {
            if (lookup.RequiresBudgetLine) row.Errors.Add(L["Import:Error:BudgetLineRequired", h.BudgetLine]);
            return;
        }

        var match = lookup.Lines
            .Where(l => Same(l.Code, lineText) || Same(l.Name, lineText) || Same($"{l.Code} - {l.Name}", lineText))
            .ToList();
        if (match.Count == 1) dto.BudgetLineId = match[0].Id;
        else row.Errors.Add(L[match.Count == 0 ? "Import:Error:NotFound" : "Import:Error:Ambiguous", h.BudgetLine, lineText]);
    }

    private static bool Same(string a, string b) => ExcelImport.Normalize(a) == ExcelImport.Normalize(b);
}
