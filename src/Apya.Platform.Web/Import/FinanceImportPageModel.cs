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
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Uow;

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

/// <summary>
/// Gider ve gelir pencerelerinin ortak "Excel'den içe aktar" gövdesi: şablon → önizleme → onay.
/// Her satır ekranın kendi oluşturma servisinden geçer (kasa hareketi, kur damgası, bütçe kalemi
/// kuralı aynen çalışır). Satırlar ayrı ve işlemli iş biriminde yazılır: tek satır düşerse hiçbiri
/// kalmaz. Sayfanın kendi iş birimi kullanılmaz — yakalanan hatayı başarı sayıp önceki satırları
/// kaydederdi (bkz. <see cref="PlatformPageModel.OnPageHandlerExecuted"/>).
/// </summary>
public abstract class FinanceImportPageModel<TCategory> : PlatformPageModel where TCategory : struct, Enum
{
    /// <summary>Şablon sayfası ve dosya adı (ör. "Export:Expenses:Name").</summary>
    protected abstract string NameKey { get; }

    /// <summary>Kategori metninin anahtar öneki (ör. "Expense:Category:").</summary>
    protected abstract string CategoryKeyPrefix { get; }

    protected abstract bool AccountRequired { get; }
    protected abstract int MaxTitleLength { get; }
    protected abstract int MaxDescriptionLength { get; }

    protected abstract Task<IReadOnlyList<CashAccountLookupDto>> GetAccountsAsync();

    protected abstract Task CreateAsync(FinanceImportRow<TCategory> row);

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnGetTemplateAsync()
    {
        var lookups = await LoadLookupsAsync();
        var name = L[NameKey].Value;
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
        var (sheet, rows) = await ReadAsync(file);
        if (sheet.Errors.Count > 0 || sheet.Rows.Any(r => r.Errors.Count > 0))
        {
            return new JsonResult(ImportResponse.Preview(sheet, L));
        }

        // Complete çağrılmadan çıkılırsa (reddedilen satır) bütün satırlar geri alınır.
        using var uow = unitOfWorkManager.Begin(requiresNew: true, isTransactional: true);
        for (var i = 0; i < rows.Count; i++)
        {
            try
            {
                await CreateAsync(rows[i]);
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex, "{Page} içe aktarma satır {Row} reddedildi", GetType().Name, sheet.Rows[i].Number);
                return new JsonResult(ImportResponse.Failed(L["Import:Error:Row", sheet.Rows[i].Number, this.UserMessage(ex)]));
            }
        }

        await uow.CompleteAsync();
        return new JsonResult(ImportResponse.Done(L["Import:Done", rows.Count]));
    }

    private sealed record Lookups(
        IReadOnlyList<CashAccountLookupDto> Accounts,
        List<(Guid Id, string Name)> Projects,
        List<(TCategory Value, string Name)> Categories,
        bool CanSeeBudget);

    private sealed record Headers(string Date, string Title, string Category, string Amount, string Currency,
        string Account, string Project, string BudgetLine, string Description);

    // Başlıklar dışa aktarmayla aynı: ekrandan indirilen dosya geri yüklenebilir.
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
            new(h.Account, Required: AccountRequired, Options: lookups.Accounts.Select(a => a.Name).ToList()),
            new(h.Project, Options: lookups.Projects.Select(p => p.Name).ToList()),
            new(h.BudgetLine),
            new(h.Description),
        ];
    }

    private async Task<Lookups> LoadLookupsAsync()
    {
        var projects = (await Service<IProjectAppService>().GetListAsync(new PagedAndSortedResultRequestDto { MaxResultCount = 1000 }))
            .Items.Select(p => (p.Id, p.Name)).ToList();
        var categories = Enum.GetValues<TCategory>().Select(c => (c, L[CategoryKeyPrefix + c].Value)).ToList();
        var canSeeBudget = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget);
        return new Lookups(await GetAccountsAsync(), projects, categories, canSeeBudget);
    }

    private T Service<T>() where T : notnull => HttpContext.RequestServices.GetRequiredService<T>();

    private async Task<(ImportSheet Sheet, List<FinanceImportRow<TCategory>> Rows)> ReadAsync(IFormFile? file)
    {
        var rows = new List<FinanceImportRow<TCategory>>();
        if (file == null || file.Length == 0)
        {
            return (new ImportSheet(new List<string>(), new List<ImportRow>(), [L["Import:ChooseFile"]]), rows);
        }

        var lookups = await LoadLookupsAsync();
        await using var stream = file.OpenReadStream();
        var sheet = ExcelImport.Read(stream, Columns(lookups), L);
        var lines = new Dictionary<Guid, ProjectRecordFormLookupDto>();

        foreach (var row in sheet.Rows)
        {
            rows.Add(await MapAsync(row, lookups, lines));
        }

        return (sheet, rows);
    }

    private async Task<FinanceImportRow<TCategory>> MapAsync(ImportRow row, Lookups lookups,
        Dictionary<Guid, ProjectRecordFormLookupDto> lines)
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
        if (category.Length > 0)
        {
            var match = lookups.Categories.Where(c => Same(c.Name, category) || Same(c.Value.ToString(), category)).ToList();
            if (match.Count == 1) result.Category = match[0].Value;
            else row.Errors.Add(L["Import:Error:NotFound", h.Category, category]);
        }

        var accountText = row.Text(h.Account);
        string? accountCurrency = null;
        if (accountText.Length == 0)
        {
            if (AccountRequired) row.Errors.Add(L["Import:Error:Required", h.Account]);
        }
        else
        {
            var match = lookups.Accounts.Where(a => Same(a.Name, accountText)).ToList();
            if (match.Count == 1) (result.CashAccountId, accountCurrency) = (match[0].Id, match[0].Currency);
            else row.Errors.Add(L[match.Count == 0 ? "Import:Error:NotFound" : "Import:Error:Ambiguous", h.Account, accountText]);
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
            var match = lookups.Projects.Where(p => Same(p.Name, projectText)).ToList();
            if (match.Count == 1)
            {
                result.ProjectId = match[0].Id;
                await MapBudgetLineAsync(row, result, lineText, lookups, lines);
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
    private async Task MapBudgetLineAsync(ImportRow row, FinanceImportRow<TCategory> result, string lineText, Lookups lookups,
        Dictionary<Guid, ProjectRecordFormLookupDto> lines)
    {
        var h = H;
        if (!lookups.CanSeeBudget)
        {
            if (lineText.Length > 0) row.Errors.Add(L["Import:Error:NotFound", h.BudgetLine, lineText]);
            return;
        }

        var projectId = result.ProjectId!.Value;
        if (!lines.TryGetValue(projectId, out var lookup))
        {
            lookup = await Service<IProjectBudgetAppService>().GetRecordFormLookupAsync(projectId);
            lines[projectId] = lookup;
        }

        if (lineText.Length == 0)
        {
            if (lookup.RequiresBudgetLine) row.Errors.Add(L["Import:Error:BudgetLineRequired", h.BudgetLine]);
            return;
        }

        var match = lookup.Lines
            .Where(l => Same(l.Code, lineText) || Same(l.Name, lineText) || Same($"{l.Code} - {l.Name}", lineText))
            .ToList();
        if (match.Count == 1) result.BudgetLineId = match[0].Id;
        else row.Errors.Add(L[match.Count == 0 ? "Import:Error:NotFound" : "Import:Error:Ambiguous", h.BudgetLine, lineText]);
    }

    private static bool Same(string a, string b) => ExcelImport.Normalize(a) == ExcelImport.Normalize(b);
}
