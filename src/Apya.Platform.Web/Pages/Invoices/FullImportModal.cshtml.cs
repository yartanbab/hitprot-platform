using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Tasks;
using Apya.Platform.Web.Export;
using Apya.Platform.Web.Import;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Pages.Invoices;

/// <summary>
/// Sistem yöneticisine özel toplu fatura aktarımı: bütün parametreler, kiracı seçilerek, yalnız yeni
/// kayıt. Her fatura "Yeni fatura" penceresinin servisinden geçer. Tahsilat kasa hareketi yazdığı
/// için dosyadan alınmaz.
/// </summary>
[Authorize(PlatformPermissions.Invoices.Create)]
public class FullImportModalModel : FinanceFullImportPageModel<InvoiceDto, CreateInvoiceDto>
{
    private readonly IInvoiceAppService _invoiceAppService;

    /// <summary>Kiracı → kullanılan fatura numaraları (veritabanı + bu dosya).</summary>
    private readonly Dictionary<Guid, HashSet<string>> _numbers = [];

    public FullImportModalModel(IInvoiceAppService invoiceAppService, ITaskAppService taskAppService,
        IProjectBudgetAppService budgetAppService, ITenantRepository tenantRepository)
        : base(taskAppService, budgetAppService, tenantRepository)
    {
        _invoiceAppService = invoiceAppService;
    }

    protected override string NameKey => "DataTransfer:Module:InvoicesFull";

    protected override string ViewPermission => PlatformPermissions.Invoices.Default;

    protected override string CreatePermission => PlatformPermissions.Invoices.Create;

    private protected override FinanceParameterSheet<InvoiceDto, CreateInvoiceDto> CreateSheet(IReadOnlyList<string> tenantNames)
        => new InvoiceParameterSheet(L, tenantNames);

    protected override async Task<IReadOnlyList<InvoiceDto>> GetRecordsAsync()
        => (await ExcelTable.CollectAsync((skip, take) =>
            _invoiceAppService.GetListAsync(new GetInvoicesInput { SkipCount = skip, MaxResultCount = take }))).Items;

    private protected override Task ValidateNewAsync(ImportRow row, CreateInvoiceDto input, FinanceTenantScope<InvoiceDto> scope)
    {
        if (input.InvoiceNumber.Length == 0)
        {
            return Task.CompletedTask;
        }

        var key = scope.Context.TenantId ?? Guid.Empty;
        if (!_numbers.TryGetValue(key, out var numbers))
        {
            numbers = scope.Records.Values.Select(i => i.InvoiceNumber).ToHashSet(StringComparer.OrdinalIgnoreCase);
            _numbers[key] = numbers;
        }

        if (!numbers.Add(input.InvoiceNumber))
        {
            row.Errors.Add(L["Import:Error:Duplicate", L["Import:FinanceFull:Number"], input.InvoiceNumber]);
        }

        return Task.CompletedTask;
    }

    protected override Task CreateRecordAsync(CreateInvoiceDto input) => _invoiceAppService.CreateAsync(input);
}
