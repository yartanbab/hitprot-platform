using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CashAccounts;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Export;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Import;

/// <summary>Bir kiracının finans aktarımı için seçenekleri. Kiracının gizli görevleri burada yoktur.</summary>
internal sealed class FinanceTenantContext
{
    public Guid? TenantId { get; init; }

    public string TenantName { get; init; } = string.Empty;

    public IReadOnlyList<CashAccountLookupDto> Accounts { get; init; } = [];

    public List<ProjectLookupDto> Projects { get; init; } = [];

    public Dictionary<Guid, TaskDto> Tasks { get; init; } = [];

    /// <summary>Görev kodu (GRV-12) → kimlik.</summary>
    public Dictionary<string, Guid> TaskCodes { get; init; } = new(StringComparer.OrdinalIgnoreCase);

    /// <summary>Proje → bütçe kalemleri; kiracıda bütçe yetkisi yoksa boş.</summary>
    public Dictionary<Guid, List<(Guid Id, string Label, string Name)>> Lines { get; init; } = [];
}

/// <summary>Çıktı satırı: kayıt ve ait olduğu kiracının seçenekleri.</summary>
internal sealed record FinanceSheetRow<TRecord>(TRecord Record, FinanceTenantContext Context);

/// <summary>Kiracının seçenekleri ve mevcut kayıtları.</summary>
internal sealed record FinanceTenantScope<TRecord>(FinanceTenantContext Context, Dictionary<Guid, TRecord> Records);

/// <summary>Dosya satırı: yalnız kimliksiz satır yazılır; kimlikli satır mevcut kaydı gösterir.</summary>
public sealed class FinanceFullRow<TInput> : IFullParameterRow
{
    public Guid? Id { get; init; }

    public Guid? TenantId { get; init; }

    public TInput? Input { get; init; }

    public bool Unchanged { get; init; }
}

/// <summary>Tam parametreli finans aktarımının istek boyu seçenekleri; kiracı başına bir kez yüklenir.</summary>
public sealed class FinanceFullLookups<TRecord, TInput>
    where TRecord : class
    where TInput : new()
{
    internal FinanceParameterSheet<TRecord, TInput> Sheet { get; init; } = null!;

    internal List<(Guid Id, string Name)> Tenants { get; init; } = [];

    /// <summary>Kiracı (host: <see cref="Guid.Empty"/>) → kapsam; modül kiracıda kapalıysa <c>null</c>.</summary>
    internal Dictionary<Guid, FinanceTenantScope<TRecord>?> Scopes { get; } = [];

    internal HashSet<Guid> SeenIds { get; } = [];
}

/// <summary>
/// Sistem yöneticisine özel finans aktarımı: bütün parametreler, kiracı seçilerek, YALNIZ YENİ KAYIT
/// (ürün kararı 2026-11-23: kasayı etkileyen kayıt toplu güncellenmez). Çıktıdaki mevcut satırlar
/// başvuru içindir; aynen geri yüklenirse atlanır, değiştirilmişse dosya reddedilir. Her yeni satır
/// kiracının bağlamında ekranın oluşturma servisinden geçer (kasa hareketi, kur damgası, bütçe kuralı).
/// </summary>
public abstract class FinanceFullImportPageModel<TRecord, TInput>
    : FullParameterImportPageModel<FinanceFullLookups<TRecord, TInput>, FinanceFullRow<TInput>>
    where TRecord : class
    where TInput : new()
{
    private readonly ITaskAppService _taskAppService;
    private readonly IProjectBudgetAppService _budgetAppService;
    private readonly ITenantRepository _tenantRepository;

    protected FinanceFullImportPageModel(ITaskAppService taskAppService, IProjectBudgetAppService budgetAppService,
        ITenantRepository tenantRepository)
    {
        _taskAppService = taskAppService;
        _budgetAppService = budgetAppService;
        _tenantRepository = tenantRepository;
    }

    protected abstract string ViewPermission { get; }

    protected abstract string CreatePermission { get; }

    private protected abstract FinanceParameterSheet<TRecord, TInput> CreateSheet(IReadOnlyList<string> tenantNames);

    /// <summary>Geçerli kiracının kayıtları.</summary>
    protected abstract Task<IReadOnlyList<TRecord>> GetRecordsAsync();

    protected abstract Task CreateRecordAsync(TInput input);

    /// <summary>Geçerli kiracının kasaları; kasa sütunu olmayan ekranda boş.</summary>
    protected virtual Task<IReadOnlyList<CashAccountLookupDto>> GetAccountsAsync()
        => Task.FromResult<IReadOnlyList<CashAccountLookupDto>>([]);

    /// <summary>Yalnız yeni satırda çalışan ek kural (ör. fatura numarası tekilliği).</summary>
    private protected virtual void ValidateNew(ImportRow row, TInput input, FinanceTenantScope<TRecord> scope)
    {
    }

    protected override IReadOnlyList<ImportColumn> Columns(FinanceFullLookups<TRecord, TInput> lookups) => lookups.Sheet.Columns;

    protected override void CompleteTemplate(XLWorkbook workbook, FinanceFullLookups<TRecord, TInput> lookups)
        => lookups.Sheet.AddGuide(workbook);

    /// <summary>Host ve bütün kiracıların kayıtları, içe aktarmanın sütunlarıyla.</summary>
    public async Task<IActionResult> OnGetExportAsync()
    {
        var lookups = await LoadLookupsAsync();
        var rows = new List<FinanceSheetRow<TRecord>>();
        if (!Request.Query.ContainsKey(TableExport.ColumnsQueryKey))
        {
            foreach (var tenantId in new Guid?[] { null }.Concat(lookups.Tenants.Select(t => (Guid?)t.Id)))
            {
                if (await ScopeAsync(lookups, tenantId) is { } scope)
                {
                    rows.AddRange(scope.Records.Values.Select(r => new FinanceSheetRow<TRecord>(r, scope.Context)));
                }
            }
        }

        return SheetFile(lookups.Sheet, rows);
    }

    protected override async Task<FinanceFullLookups<TRecord, TInput>> LoadLookupsAsync()
    {
        var tenants = (await _tenantRepository.GetListAsync()).Select(t => (t.Id, t.Name)).ToList();
        return new FinanceFullLookups<TRecord, TInput>
        {
            Sheet = CreateSheet(tenants.Select(t => t.Name).ToList()),
            Tenants = tenants
        };
    }

    private async Task<FinanceTenantScope<TRecord>?> ScopeAsync(FinanceFullLookups<TRecord, TInput> lookups, Guid? tenantId)
    {
        var key = tenantId ?? Guid.Empty;
        if (lookups.Scopes.TryGetValue(key, out var cached))
        {
            return cached;
        }

        FinanceTenantScope<TRecord>? scope = null;
        using (CurrentTenant.Change(tenantId))
        {
            if (await AuthorizationService.IsGrantedAsync(ViewPermission)
                && await AuthorizationService.IsGrantedAsync(CreatePermission))
            {
                var context = await LoadContextAsync(lookups, tenantId);
                var records = (await GetRecordsAsync()).ToDictionary(lookups.Sheet.RecordId);
                scope = new FinanceTenantScope<TRecord>(context, records);
            }
        }

        lookups.Scopes[key] = scope;
        return scope;
    }

    private async Task<FinanceTenantContext> LoadContextAsync(FinanceFullLookups<TRecord, TInput> lookups, Guid? tenantId)
    {
        var projects = new List<ProjectLookupDto>();
        var tasks = new Dictionary<Guid, TaskDto>();
        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Tasks.Default))
        {
            projects = await _taskAppService.GetProjectsLookupAsync();
            var all = await ExcelTable.CollectAsync((skip, take) =>
                _taskAppService.GetListAsync(new GetTasksInput { SkipCount = skip, MaxResultCount = take }));
            tasks = all.Items.Where(t => tenantId == null || !t.IsPrivate).ToDictionary(t => t.Id);
        }

        var codes = new Dictionary<string, Guid>(StringComparer.OrdinalIgnoreCase);
        foreach (var task in tasks.Values)
        {
            codes.TryAdd(task.Code, task.Id);
        }

        var lines = new Dictionary<Guid, List<(Guid Id, string Label, string Name)>>();
        if (await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ViewBudget))
        {
            foreach (var project in projects)
            {
                lines[project.Id] = (await _budgetAppService.GetLinesAsync(project.Id))
                    .Select(l => (l.Id, string.IsNullOrWhiteSpace(l.Code) ? l.Name : l.Code, l.Name))
                    .ToList();
            }
        }

        return new FinanceTenantContext
        {
            TenantId = tenantId,
            TenantName = tenantId is { } id ? lookups.Tenants.First(t => t.Id == id).Name : string.Empty,
            Accounts = await GetAccountsAsync(),
            Projects = projects,
            Tasks = tasks,
            TaskCodes = codes,
            Lines = lines
        };
    }

    protected override async Task<FinanceFullRow<TInput>> MapAsync(ImportRow row, FinanceFullLookups<TRecord, TInput> lookups)
    {
        var sheet = lookups.Sheet;

        Guid? tenantId = null;
        var tenantText = row.Text(sheet.TenantHeader);
        if (tenantText.Length > 0)
        {
            if (!TryMatch(row, sheet.TenantHeader, tenantText, lookups.Tenants, t => [t.Name], out var tenant))
            {
                return new FinanceFullRow<TInput>();
            }

            tenantId = tenant.Id;
        }

        var scope = await ScopeAsync(lookups, tenantId);
        if (scope == null)
        {
            row.Errors.Add(L["Import:Error:TenantNoAccess", sheet.TenantHeader, tenantText]);
            return new FinanceFullRow<TInput>();
        }

        // Kimlik yalnız satırın kiracısında aranır: kayıt kiracılar arasında taşınmaz.
        Guid? id = null;
        FinanceSheetRow<TRecord>? current = null;
        var idText = row.Text(sheet.IdHeader);
        if (idText.Length > 0)
        {
            if (!Guid.TryParse(idText, out var parsed) || !scope.Records.TryGetValue(parsed, out var record))
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
                current = new FinanceSheetRow<TRecord>(record, scope.Context);
            }
        }

        sheet.Target = scope.Context;
        var (input, unchanged) = sheet.Read(row, current);
        if (current != null)
        {
            if (!unchanged)
            {
                row.Errors.Add(L["Import:Error:FinanceNewOnly", sheet.IdHeader]);
            }

            return new FinanceFullRow<TInput> { Id = id, TenantId = tenantId, Unchanged = true };
        }

        ValidateNew(row, input, scope);
        return new FinanceFullRow<TInput> { TenantId = tenantId, Input = input };
    }

    protected sealed override async Task SaveAsync(FinanceFullRow<TInput> row)
    {
        using (CurrentTenant.Change(row.TenantId))
        {
            await CreateRecordAsync(row.Input!);
        }
    }
}
