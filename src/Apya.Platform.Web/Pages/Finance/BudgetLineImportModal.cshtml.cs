using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>Bir kalem satırı; üst kalem dosyada daha yukarıdaysa kimliği kayıt sırasında bulunur.</summary>
public sealed class BudgetLineImportRow
{
    public CreateUpdateBudgetLineDto Line { get; } = new();

    /// <summary>Üst kalem bu dosyanın kaçıncı satırı (0 tabanlı); mevcut kalemse <c>null</c>.</summary>
    public int? ParentRowIndex { get; set; }
}

/// <summary>Kalem eşlemesinin istek boyu seçenekleri: mevcut kalemler + dosyada şimdiye dek okunanlar.</summary>
public sealed class BudgetLineImportLookups
{
    internal List<ProjectBudgetLineDto> Existing { get; init; } = [];
    internal List<(string Code, string Name)> FileRows { get; } = [];
}

/// <summary>
/// Projenin bütçe kalemlerini Excel'den içe aktarır. Her satır "Kalem ekle" penceresinin
/// servisinden (<see cref="IProjectBudgetAppService.CreateLineAsync"/>) geçer; yazma kapısı da
/// onunki (bütçe yönetimi ya da proje düzenleme).
/// </summary>
[Authorize(PlatformPermissions.Projects.ViewBudget)]
public class BudgetLineImportModalModel : ExcelImportPageModel<BudgetLineImportLookups, BudgetLineImportRow>
{
    private readonly IProjectBudgetAppService _budgetAppService;

    /// <summary>Bu istekte oluşturulan kalemler, dosya sırasıyla; alt satırın üst kalemi buradan bulunur.</summary>
    private readonly List<Guid> _created = [];

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    public BudgetLineImportModalModel(IProjectBudgetAppService budgetAppService)
    {
        _budgetAppService = budgetAppService;
    }

    protected override string NameKey => "Import:BudgetLines:Name";

    private sealed record Headers(string Code, string Name, string Parent, string Planned, string Approved, string Grant);

    private Headers H => new(L["Export:Col:Code"], L["Import:Col:LineName"], L["Import:Col:ParentLine"],
        L["Import:Col:PlannedAmount"], L["Export:Col:ApprovedAmount"], L["Import:Col:GrantAmount"]);

    protected override IReadOnlyList<ImportColumn> Columns(BudgetLineImportLookups lookups)
    {
        var h = H;
        return
        [
            new(h.Code),
            new(h.Name, Required: true),
            new(h.Parent),
            new(h.Planned, Required: true),
            new(h.Approved),
            new(h.Grant),
        ];
    }

    /// <summary>
    /// Projenin kalemleri, içe aktarmanın sütunlarıyla (üst kalem önce): dosya başka bir projeye
    /// geri yüklenebilir. Yalnız okur; bütçeyi görme izni yeter.
    /// </summary>
    public async Task<IActionResult> OnGetExportAsync()
    {
        var h = H;
        var lines = await _budgetAppService.GetLinesAsync(ProjectId);
        var byId = lines.ToDictionary(l => l.Id);
        var columns = new List<ExcelColumn<ProjectBudgetLineDto>>
        {
            new(h.Code, l => l.Code),
            new(h.Name, l => l.Name),
            new(h.Parent, l => l.ParentId is { } id && byId.TryGetValue(id, out var parent)
                ? (parent.Code.Length > 0 ? parent.Code : parent.Name)
                : null),
            new(h.Planned, l => l.PlannedAmount),
            new(h.Approved, l => l.ApprovedAmount),
            new(h.Grant, l => l.GrantAmount),
        };

        return this.TableFile(L[NameKey].Value, columns, lines);
    }

    protected override async Task<BudgetLineImportLookups> LoadLookupsAsync()
    {
        await BudgetWritePermission.CheckAsync(AuthorizationService);
        return new BudgetLineImportLookups { Existing = await _budgetAppService.GetLinesAsync(ProjectId) };
    }

    protected override Task<BudgetLineImportRow> MapAsync(ImportRow row, BudgetLineImportLookups lookups)
    {
        var h = H;
        var result = new BudgetLineImportRow();
        var line = result.Line;

        var code = row.Text(h.Code);
        if (code.Length > ProjectBudgetConsts.MaxCodeLength)
        {
            row.Errors.Add(L["Import:Error:TooLong", h.Code, ProjectBudgetConsts.MaxCodeLength]);
        }
        else if (code.Length > 0 && (lookups.Existing.Any(l => Same(l.Code, code)) || lookups.FileRows.Any(f => Same(f.Code, code))))
        {
            row.Errors.Add(L["Import:Error:Duplicate", h.Code, code]);
        }
        line.Code = code.Length > 0 ? code : null;

        line.Name = row.Text(h.Name);
        if (line.Name.Length == 0) row.Errors.Add(L["Import:Error:Required", h.Name]);
        else if (line.Name.Length > ProjectBudgetConsts.MaxNameLength) row.Errors.Add(L["Import:Error:TooLong", h.Name, ProjectBudgetConsts.MaxNameLength]);

        line.PlannedAmount = Amount(row, h.Planned, required: true) ?? 0;
        line.ApprovedAmount = Amount(row, h.Approved, required: false);
        line.GrantAmount = Amount(row, h.Grant, required: false);

        // Üst kalem: mevcut kalem ya da dosyada daha yukarıdaki satır (ağaç tek dosyada kurulabilsin).
        var parent = row.Text(h.Parent);
        if (parent.Length > 0)
        {
            var options = lookups.Existing.Select(l => (Id: (Guid?)l.Id, Index: (int?)null, l.Code, l.Name))
                .Concat(lookups.FileRows.Select((f, i) => (Id: (Guid?)null, Index: (int?)i, f.Code, f.Name)));
            if (TryMatch(row, h.Parent, parent, options,
                    o => o.Code.Length > 0 ? [o.Code, o.Name, $"{o.Code} - {o.Name}"] : [o.Name], out var match))
            {
                line.ParentId = match.Id;
                result.ParentRowIndex = match.Index;
            }
        }

        lookups.FileRows.Add((code, line.Name));
        return Task.FromResult(result);
    }

    private decimal? Amount(ImportRow row, string header, bool required)
    {
        if (row.Text(header).Length == 0)
        {
            if (required) row.Errors.Add(L["Import:Error:Required", header]);
            return null;
        }

        var value = ExcelImport.Decimal(row.Value(header));
        if (value == null) row.Errors.Add(L["Import:Error:Number", header]);
        else if (value < 0) row.Errors.Add(L["Import:Error:Negative", header]);
        return value == null ? null : Math.Round(value.Value, 2);
    }

    protected override async Task CreateAsync(BudgetLineImportRow row)
    {
        if (row.ParentRowIndex.HasValue)
        {
            row.Line.ParentId = _created[row.ParentRowIndex.Value];
        }

        var created = await _budgetAppService.CreateLineAsync(ProjectId, row.Line);
        _created.Add(created.Id);
    }
}
