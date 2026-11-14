using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Pages.Projects;

/// <summary>Proje içe aktarmanın istek boyu seçenekleri.</summary>
public sealed class ProjectImportLookups
{
    internal List<(Guid Id, string Name)> Categories { get; init; } = [];
    internal List<(Guid Id, string Name)> Tenants { get; init; } = [];
    internal bool CanSetBudget { get; init; }

    /// <summary>Dosyada şimdiye dek görülen kodlar, hedef kiracıyla ("kiracı|KOD").</summary>
    internal HashSet<string> Codes { get; } = new(StringComparer.OrdinalIgnoreCase);
}

/// <summary>
/// Projeleri Excel/CSV'den içe aktarır. Her satır "Yeni Proje" penceresinin servisinden
/// (<see cref="IProjectAppService.CreateAsync"/>) geçer: paket proje sınırı, kod tekilliği ve bütçe
/// izni orada uygulanır. Kod boşsa sıradaki kod verilir. Durum ve görev sayıları alınmaz (yeni proje
/// "Planlama" ile açılır); host'ta "Kiracı" sütunu projenin hangi kiracıya açılacağını söyler.
/// </summary>
[Authorize(PlatformPermissions.Projects.Create)]
public class ImportModalModel : ExcelImportPageModel<ProjectImportLookups, CreateProjectDto>
{
    private const int MaxNameLength = 128;
    private const int MaxCodeLength = 32;

    private readonly IProjectAppService _projectAppService;
    private readonly IProjectCategoryAppService _categoryAppService;
    private readonly ITenantRepository _tenantRepository;

    public ImportModalModel(IProjectAppService projectAppService, IProjectCategoryAppService categoryAppService,
        ITenantRepository tenantRepository)
    {
        _projectAppService = projectAppService;
        _categoryAppService = categoryAppService;
        _tenantRepository = tenantRepository;
    }

    protected override string NameKey => "Export:Projects:Name";

    private bool Host => CurrentTenant.Id == null;

    private sealed record Headers(string Code, string Name, string Tenant, string Category, string StartDate,
        string EndDate, string Budget, string Currency);

    // Başlıklar dışa aktarmayla aynı: ekrandan indirilen dosya geri yüklenebilir.
    private Headers H => new(L["Export:Col:Code"], L["Export:Col:Name"], L["Export:Col:Tenant"], L["Export:Col:Category"],
        L["Export:Col:StartDate"], L["Export:Col:EndDate"], L["Export:Col:Budget"], L["Export:Col:Currency"]);

    protected override IReadOnlyList<ImportColumn> Columns(ProjectImportLookups lookups)
    {
        var h = H;
        var columns = new List<ImportColumn> { new(h.Code), new(h.Name, Required: true) };
        if (Host)
        {
            columns.Add(new(h.Tenant, Options: lookups.Tenants.Select(t => t.Name).ToList()));
        }

        columns.AddRange(
        [
            new(h.Category, Options: lookups.Categories.Select(c => c.Name).ToList()),
            new(h.StartDate),
            new(h.EndDate),
        ]);
        if (lookups.CanSetBudget)
        {
            columns.Add(new(h.Budget));
            columns.Add(new(h.Currency, Options: FinanceLookupShared.Currencies().Select(c => c.Value).ToList()));
        }

        return columns;
    }

    protected override async Task<ProjectImportLookups> LoadLookupsAsync() => new()
    {
        Categories = (await _categoryAppService.GetSelectableAsync()).Select(c => (c.Id, c.Name)).ToList(),
        Tenants = Host ? (await _tenantRepository.GetListAsync()).Select(t => (t.Id, t.Name)).ToList() : [],
        CanSetBudget = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget)
    };

    protected override async Task<CreateProjectDto> MapAsync(ImportRow row, ProjectImportLookups lookups)
    {
        var h = H;
        var dto = new CreateProjectDto();

        dto.Name = row.Text(h.Name);
        if (dto.Name.Length == 0) row.Errors.Add(L["Import:Error:Required", h.Name]);
        else if (dto.Name.Length > MaxNameLength) row.Errors.Add(L["Import:Error:TooLong", h.Name, MaxNameLength]);

        if (Host)
        {
            var tenant = row.Text(h.Tenant);
            if (tenant.Length > 0 && TryMatch(row, h.Tenant, tenant, lookups.Tenants, t => [t.Name], out var match))
            {
                dto.TenantId = match.Id;
            }
        }

        // Kod hedef kiracıda tekil olmalı: hem veritabanında hem bu dosyada. Boşsa kayıt sırasında verilir.
        dto.Code = row.Text(h.Code);
        if (dto.Code.Length > MaxCodeLength)
        {
            row.Errors.Add(L["Import:Error:TooLong", h.Code, MaxCodeLength]);
        }
        else if (dto.Code.Length > 0)
        {
            if (!lookups.Codes.Add($"{dto.TenantId}|{dto.Code}")
                || !(await _projectAppService.CheckCodeAsync(dto.Code, dto.TenantId)).IsAvailable)
            {
                row.Errors.Add(L["Import:Error:Duplicate", h.Code, dto.Code]);
            }
        }

        var category = row.Text(h.Category);
        if (category.Length > 0 && TryMatch(row, h.Category, category, lookups.Categories, c => [c.Name], out var cat))
        {
            dto.CategoryId = cat.Id;
        }

        dto.StartDate = OptionalDate(row, h.StartDate);
        dto.EndDate = OptionalDate(row, h.EndDate);
        if (dto.StartDate.HasValue && dto.EndDate < dto.StartDate)
        {
            row.Errors.Add(L["Import:Error:DueBeforeStart", h.EndDate, h.StartDate]);
        }

        if (lookups.CanSetBudget)
        {
            if (row.Text(h.Budget).Length > 0)
            {
                var budget = ExcelImport.Decimal(row.Value(h.Budget));
                if (budget == null) row.Errors.Add(L["Import:Error:Number", h.Budget]);
                else if (budget < 0) row.Errors.Add(L["Import:Error:Negative", h.Budget]);
                else dto.TotalBudget = Math.Round(budget.Value, 2);
            }

            var currency = row.Text(h.Currency).ToUpperInvariant();
            if (currency.Length == 0) dto.Currency = "TRY";
            else if (Regex.IsMatch(currency, "^[A-Z]{3}$")) dto.Currency = currency;
            else row.Errors.Add(L["Import:Error:Currency", h.Currency]);
        }

        return dto;
    }

    private DateTime? OptionalDate(ImportRow row, string header)
    {
        if (row.Text(header).Length == 0)
        {
            return null;
        }

        var date = ExcelImport.Date(row.Value(header));
        if (date == null) row.Errors.Add(L["Import:Error:Date", header]);
        return date;
    }

    protected override async Task CreateAsync(CreateProjectDto row)
    {
        if (string.IsNullOrWhiteSpace(row.Code))
        {
            row.Code = await _projectAppService.GetNextCodeAsync(row.TenantId);
        }

        await _projectAppService.CreateAsync(row);
    }
}
