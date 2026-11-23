using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Application.Dtos;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Pages.Projects;

/// <summary>Dosya satırı: kimlik doluysa proje güncellenir, boşsa hedef kiracıda yeni proje açılır.</summary>
public sealed class ProjectFullImportRow : IFullParameterRow
{
    public Guid? Id { get; init; }

    public CreateProjectDto Input { get; init; } = new();

    public bool Unchanged { get; init; }
}

/// <summary>Tam parametreli proje aktarımının istek boyu seçenekleri.</summary>
public sealed class ProjectFullImportLookups
{
    internal ProjectParameterSheet Sheet { get; init; } = null!;

    internal List<(Guid Id, string Name)> Tenants { get; init; } = [];

    internal List<Guid> ProjectIds { get; init; } = [];

    internal Dictionary<Guid, IReadOnlyList<(Guid Id, string Name)>> Categories { get; } = [];

    /// <summary>Dosyada görülen kodlar, hedef kiracıyla ("kiracı|KOD").</summary>
    internal HashSet<string> Codes { get; } = new(StringComparer.OrdinalIgnoreCase);

    internal HashSet<Guid> SeenIds { get; } = [];
}

/// <summary>
/// Sistem yöneticisine özel toplu aktarım: projelerin bütün parametreleri, kiracı seçilerek. Yeni
/// proje kiracının bağlamında açılır: paket proje sınırı ve kategori kuralları o kiracınınkidir.
/// Her satır "Yeni Proje" ve düzenleme ekranının servisinden geçer.
/// </summary>
[Authorize(PlatformPermissions.Projects.Create)]
[Authorize(PlatformPermissions.Projects.Edit)]
public class FullImportModalModel : FullParameterImportPageModel<ProjectFullImportLookups, ProjectFullImportRow>
{
    private readonly IProjectAppService _projectAppService;
    private readonly IProjectCategoryAppService _categoryAppService;
    private readonly IGrantAppService _grantAppService;
    private readonly ITenantRepository _tenantRepository;

    public FullImportModalModel(IProjectAppService projectAppService, IProjectCategoryAppService categoryAppService,
        IGrantAppService grantAppService, ITenantRepository tenantRepository)
    {
        _projectAppService = projectAppService;
        _categoryAppService = categoryAppService;
        _grantAppService = grantAppService;
        _tenantRepository = tenantRepository;
    }

    protected override string NameKey => "DataTransfer:Module:ProjectsFull";

    protected override IReadOnlyList<ImportColumn> Columns(ProjectFullImportLookups lookups) => lookups.Sheet.Columns;

    protected override void CompleteTemplate(XLWorkbook workbook, ProjectFullImportLookups lookups)
        => lookups.Sheet.AddGuide(workbook);

    /// <summary>Bütün kiracıların projeleri, içe aktarmanın sütunlarıyla.</summary>
    public async Task<IActionResult> OnGetExportAsync()
    {
        var lookups = await LoadLookupsAsync();
        var rows = new List<ProjectDto>();
        if (!Request.Query.ContainsKey(TableExport.ColumnsQueryKey))
        {
            foreach (var id in lookups.ProjectIds)
            {
                rows.Add(await _projectAppService.GetAsync(id));
            }
        }

        return SheetFile(lookups.Sheet, rows);
    }

    protected override async Task<ProjectFullImportLookups> LoadLookupsAsync()
    {
        var tenants = (await _tenantRepository.GetListAsync()).Select(t => (t.Id, t.Name)).ToList();
        var programs = await ExcelTable.CollectAsync((skip, take) => _grantAppService.GetListAsync(
            new PagedAndSortedResultRequestDto { SkipCount = skip, MaxResultCount = take }));
        var projects = await ExcelTable.CollectAsync((skip, take) => _projectAppService.GetListAsync(
            new PagedAndSortedResultRequestDto { SkipCount = skip, MaxResultCount = take }));

        // Aynı adlı programlar kurumla ayrılır: hücredeki değer tek programı göstermeli.
        var repeated = programs.Items.GroupBy(p => ExcelImport.Normalize(p.Name)).Where(g => g.Count() > 1).Select(g => g.Key).ToHashSet();
        var grants = programs.Items
            .Select(p => (p.Id, Label: repeated.Contains(ExcelImport.Normalize(p.Name)) ? $"{p.Name} ({p.Issuer})" : p.Name))
            .ToList();

        return new ProjectFullImportLookups
        {
            Sheet = new ProjectParameterSheet(L, tenants, grants),
            Tenants = tenants,
            ProjectIds = projects.Items.Select(p => p.Id).ToList()
        };
    }

    protected override async Task<ProjectFullImportRow> MapAsync(ImportRow row, ProjectFullImportLookups lookups)
    {
        var sheet = lookups.Sheet;
        Guid? id = null;
        ProjectDto? current = null;

        var idText = row.Text(sheet.IdHeader);
        if (idText.Length > 0)
        {
            if (!Guid.TryParse(idText, out var parsed) || !lookups.ProjectIds.Contains(parsed))
            {
                row.Errors.Add(L["Import:Error:NotFound", sheet.IdHeader, idText]);
            }
            else if (!lookups.SeenIds.Add(parsed))
            {
                row.Errors.Add(L["Import:Error:Duplicate", sheet.IdHeader, idText]);
            }
            else
            {
                id = parsed;
                current = await _projectAppService.GetAsync(parsed);
            }
        }

        // Proje kiracılar arasında taşınmaz; yeni satır kiracısını hücreden alır.
        var tenantText = row.Text(sheet.TenantHeader);
        var tenantId = current?.TenantId;
        if (current != null)
        {
            if (row.Has(sheet.TenantHeader) && !Same(tenantText, sheet.TenantName(current.TenantId)))
            {
                row.Errors.Add(L["Import:Error:TenantLocked", sheet.TenantHeader]);
            }
        }
        else if (tenantText.Length > 0 && TryMatch(row, sheet.TenantHeader, tenantText, lookups.Tenants, t => [t.Name], out var match))
        {
            tenantId = match.Id;
        }

        sheet.TargetTenantId = tenantId;
        sheet.TargetCategories = await CategoriesAsync(lookups, tenantId);

        var (input, unchanged) = sheet.Read(row, current);
        if (unchanged)
        {
            return new ProjectFullImportRow { Id = id, Input = input, Unchanged = true };
        }

        if (current != null && input.AddTemplateTasks)
        {
            row.Errors.Add(L["Import:Error:NewOnly", sheet.TemplateTasksHeader]);
        }

        if (current != null && input.Code.Length == 0)
        {
            row.Errors.Add(L["Import:Error:Required", sheet.CodeHeader]);
        }

        // Kod hedef kiracıda tekil: veritabanında ve bu dosyada. Yeni satırda boşsa kayıtta verilir.
        var codeChanged = current == null || !string.Equals(current.Code, input.Code, StringComparison.OrdinalIgnoreCase);
        if (input.Code.Length > 0 && codeChanged
            && (!lookups.Codes.Add($"{tenantId}|{input.Code}") || !(await _projectAppService.CheckCodeAsync(input.Code, tenantId)).IsAvailable))
        {
            row.Errors.Add(L["Import:Error:Duplicate", sheet.CodeHeader, input.Code]);
        }

        // Bütçe yetkisi kapalı kiracıda servis tutarı sessizce 0 yazardı.
        if (current == null && (input.TotalBudget > 0 || input.HourlyRate > 0))
        {
            using (CurrentTenant.Change(tenantId))
            {
                if (!await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget))
                {
                    row.Errors.Add(L["Import:Error:NoBudget", sheet.TotalBudgetHeader]);
                }
            }
        }

        return new ProjectFullImportRow { Id = id, Input = input };
    }

    private async Task<IReadOnlyList<(Guid Id, string Name)>> CategoriesAsync(ProjectFullImportLookups lookups, Guid? tenantId)
    {
        var key = tenantId ?? Guid.Empty;
        if (!lookups.Categories.TryGetValue(key, out var categories))
        {
            using (CurrentTenant.Change(tenantId))
            {
                categories = (await _categoryAppService.GetSelectableAsync()).Select(c => (c.Id, c.Name)).ToList();
            }

            lookups.Categories[key] = categories;
        }

        return categories;
    }

    protected override async Task SaveAsync(ProjectFullImportRow row)
    {
        if (row.Id is { } id)
        {
            await _projectAppService.UpdateAsync(id, row.Input);
            return;
        }

        if (row.Input.Code.Length == 0)
        {
            row.Input.Code = await _projectAppService.GetNextCodeAsync(row.Input.TenantId);
        }

        using (CurrentTenant.Change(row.Input.TenantId))
        {
            await _projectAppService.CreateAsync(row.Input);
        }
    }
}
