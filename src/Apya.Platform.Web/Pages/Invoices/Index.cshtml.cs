using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Invoices;
using Apya.Platform.Invoices.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Export;

namespace Apya.Platform.Web.Pages.Invoices;

[Authorize(PlatformPermissions.Invoices.Default)]
public class IndexModel : PlatformPageModel
{
    private readonly IInvoiceAppService _invoiceAppService;

    public IndexModel(IInvoiceAppService invoiceAppService)
    {
        _invoiceAppService = invoiceAppService;
    }

    public void OnGet()
    {
    }

    /// <summary>
    /// Ekrandaki faturalar (.xlsx). Liste süzgeci istemcide çalışıyor (index.js applyFilter);
    /// aynı kural burada tekrarlanır: status "4" = gecikmiş bayrağı, q = fatura no ya da cari.
    /// </summary>
    public async Task<IActionResult> OnGetExcelAsync(Guid? projectId, string? status, string? q)
    {
        var rows = await ExcelTable.CollectAsync((skip, take) => _invoiceAppService.GetListAsync(new GetInvoicesInput
        {
            ProjectId = projectId,
            Sorting = "invoiceDate desc",
            SkipCount = skip,
            MaxResultCount = take
        }));

        var tr = CultureInfo.GetCultureInfo("tr-TR");
        bool Contains(string? text) => text != null && tr.CompareInfo.IndexOf(text, q!, CompareOptions.IgnoreCase) >= 0;
        var items = rows.Items.Where(x =>
            (string.IsNullOrEmpty(status)
                || (status == "4" ? x.IsOverdue : ((int)x.Status).ToString() == status))
            && (string.IsNullOrWhiteSpace(q) || Contains(x.InvoiceNumber) || Contains(x.CustomerName)));

        var columns = new List<ExcelColumn<InvoiceDto>>
        {
            new(L["Export:Col:InvoiceNumber"], x => x.InvoiceNumber),
            new(L["Export:Col:Direction"], x => L[$"Invoice:Direction:{x.Direction}"].Value),
            new(L["Export:Col:Project"], x => x.ProjectName),
            new(L["Export:Col:Customer"], x => x.CustomerName),
            new(L["Export:Col:Date"], x => x.InvoiceDate, "dd.MM.yyyy"),
            new(L["Export:Col:DueDate"], x => x.DueDate, "dd.MM.yyyy"),
            new(L["Export:Col:Status"], x => L[x.IsOverdue ? "Invoice:Status:Overdue" : $"Invoice:Status:{x.Status}"].Value),
            new(L["Export:Col:TaxRate"], x => x.TaxRate),
            new(L["Export:Col:Total"], x => x.TotalAmount),
            new(L["Export:Col:Paid"], x => x.PaidAmount),
            new(L["Export:Col:Balance"], x => x.Balance),
            new(L["Export:Col:Currency"], x => x.Currency),
            new(L["Export:Col:BudgetLine"], x => x.BudgetLineName),
        };

        var name = L["Export:Invoices:Name"].Value;
        var note = rows.Truncated ? L["Export:Truncated", ExcelTable.MaxRows].Value : null;
        return File(ExcelTable.Build(name, columns, items, note), ExcelTable.ContentType, ExcelTable.FileName(name, Clock.Now));
    }
}
