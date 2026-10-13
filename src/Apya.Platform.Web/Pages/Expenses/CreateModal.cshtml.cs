using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.CashAccounts;
using Apya.Platform.Customers;
using Apya.Platform.Expenses;
using Apya.Platform.Projects;
using Apya.Platform.Tasks;

namespace Apya.Platform.Web.Pages.Expenses;

[Authorize]
public class CreateModalModel : AbpPageModel
{
    private readonly IExpenseAppService _expenseAppService;
    private readonly ICashAccountAppService _cashAccountAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly ICustomerAppService _customerAppService;
    private readonly ITaskAppService _taskAppService;
    private readonly Apya.Platform.Invoices.IInvoiceAppService _invoiceAppService;

    [BindProperty(SupportsGet = true)]
    public Guid? TaskId { get; set; }

    /// <summary>Proje Finans panelinden açılınca proje ÖNDEN seçili gelir (PR-3b).
    /// TaskId doluysa yok sayılır — görev projeyi zaten belirler.</summary>
    [BindProperty(SupportsGet = true)]
    public Guid? ProjectId { get; set; }

    /// <summary>FIN-05 · "Gider karşılığı yok" uyarısından açılınca alanlar faturadan dolar.</summary>
    [BindProperty(SupportsGet = true)]
    public Guid? FromInvoiceId { get; set; }

    [BindProperty]
    public CreateUpdateExpenseDto Expense { get; set; } = new();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Projects { get; set; } = new();
    public List<SelectListItem> Customers { get; set; } = new();
    public List<SelectListItem> Categories { get; set; } = new();
    public string ProjectDatesJson { get; set; } = "{}";

    /// <summary>Para birimi seçeneği; Kurlar sayfasıyla aynı liste (FinanceLookupShared).</summary>
    public List<SelectListItem> Currencies { get; set; } = FinanceLookupShared.Currencies();

    public CreateModalModel(
        IExpenseAppService expenseAppService,
        ICashAccountAppService cashAccountAppService,
        IProjectAppService projectAppService,
        ICustomerAppService customerAppService,
        ITaskAppService taskAppService,
        Apya.Platform.Invoices.IInvoiceAppService invoiceAppService)
    {
        _invoiceAppService = invoiceAppService;
        _expenseAppService = expenseAppService;
        _cashAccountAppService = cashAccountAppService;
        _projectAppService = projectAppService;
        _customerAppService = customerAppService;
        _taskAppService = taskAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        (Accounts, Projects, Customers, Categories, ProjectDatesJson) =
            await ExpenseLookups.LoadAsync(_cashAccountAppService, _projectAppService, _customerAppService);

        if (FromInvoiceId.HasValue)
        {
            // Fatura izni yoksa GetAsync reddeder; pencere o kullanıcıya zaten bu yoldan açılmaz.
            var invoice = await _invoiceAppService.GetAsync(FromInvoiceId.Value);
            Expense.Title = "Fatura " + invoice.InvoiceNumber;
            Expense.Amount = Math.Round(invoice.TotalAmount, 2);
            Expense.Currency = invoice.Currency;
            Expense.ExpenseDate = invoice.InvoiceDate.Date;
            Expense.ProjectId = invoice.ProjectId;
            Expense.BudgetLineId = invoice.BudgetLineId;
            Expense.CustomerId = invoice.CustomerId;
        }
        else if (TaskId.HasValue)
        {
            Expense.TaskId = TaskId;

            // Görev panelinden açıldığında projeyi de ÖNDEN seç: görev seçicisi
            // proje seçilene kadar gizli olduğu için, proje boş kalırsa gelen
            // TaskId POST'ta kaybolurdu.
            Expense.ProjectId = await FinanceLookupShared.ResolveTaskProjectAsync(_taskAppService, TaskId.Value);
        }
        else if (ProjectId.HasValue)
        {
            // Proje Finans panelinden: yalnız proje ön seçilir, görev boş kalır.
            Expense.ProjectId = ProjectId;
        }

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        var created = await _expenseAppService.CreateAsync(Expense);

        // FIN-05: projeye yazılan giderin alış faturası yoksa pencere kapanınca uyarı çıkar.
        if ((await _expenseAppService.GetInvoiceCrossCheckAsync(created.Id)).ShouldWarn)
        {
            return new JsonResult(new { crossWarning = new { kind = "expense" } });
        }

        return NoContent();
    }
}
