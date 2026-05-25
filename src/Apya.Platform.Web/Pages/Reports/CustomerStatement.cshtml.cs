using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.CustomerLedger;
using Apya.Platform.Customers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Reports;

[Authorize(Apya.Platform.Permissions.PlatformPermissions.Customers.Default)]
public class CustomerStatementModel : AbpPageModel
{
    private readonly ICustomerLedgerAppService _ledgerService;
    private readonly ICustomerAppService _customerService;

    [BindProperty(SupportsGet = true)]
    public Guid? CustomerId { get; set; }

    [BindProperty(SupportsGet = true)]
    public DateTime? FromDate { get; set; }

    [BindProperty(SupportsGet = true)]
    public DateTime? ToDate { get; set; }

    public CustomerStatementDto? Statement { get; set; }
    public List<CustomerDto> Customers { get; set; } = new();

    public CustomerStatementModel(
        ICustomerLedgerAppService ledgerService,
        ICustomerAppService customerService)
    {
        _ledgerService = ledgerService;
        _customerService = customerService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        var result = await _customerService.GetListAsync(
            new GetCustomersInput { MaxResultCount = 1000, Sorting = "Name asc" });
        Customers = result.Items.ToList();

        if (CustomerId.HasValue)
            Statement = await _ledgerService.GetStatementAsync(CustomerId.Value, FromDate, ToDate);

        return Page();
    }

    public virtual async Task<IActionResult> OnGetExcelAsync()
    {
        if (!CustomerId.HasValue) return BadRequest();
        var s = await _ledgerService.GetStatementAsync(CustomerId.Value, FromDate, ToDate);
        var bytes = ReportExporter.CustomerStatementToExcel(s, FromDate, ToDate);
        var fileName = $"Ekstre_{s.CustomerName.Replace(" ", "_")}.xlsx";
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
    }

    public virtual async Task<IActionResult> OnGetPdfAsync()
    {
        if (!CustomerId.HasValue) return BadRequest();
        var s = await _ledgerService.GetStatementAsync(CustomerId.Value, FromDate, ToDate);
        var bytes = ReportExporter.CustomerStatementToPdf(s, FromDate, ToDate);
        var fileName = $"Ekstre_{s.CustomerName.Replace(" ", "_")}.pdf";
        return File(bytes, "application/pdf", fileName);
    }
}
