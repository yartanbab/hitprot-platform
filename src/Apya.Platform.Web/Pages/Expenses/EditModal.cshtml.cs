using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Documents;
using Apya.Platform.Expenses;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Web.Services;

namespace Apya.Platform.Web.Pages.Expenses;

[Authorize]
public class EditModalModel : AbpPageModel
{
    private readonly IExpenseAppService _expenseAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly IFinanceDocumentAppService _financeDocuments;
    private readonly FinanceDocumentUploads _uploads;

    [HiddenInput]
    [BindProperty]
    public Guid ExpenseId { get; set; }

    [BindProperty]
    public CreateUpdateExpenseDto Expense { get; set; } = new();

    /// <summary>"Belge ekle" alanından gelen fatura/fiş/dekont dosyaları.</summary>
    [BindProperty]
    public List<IFormFile> DocumentFiles { get; set; } = new();

    public bool CanAttachDocuments { get; set; }

    public IReadOnlyList<ProjectExpenseDocumentDto> LinkedDocuments { get; set; } = Array.Empty<ProjectExpenseDocumentDto>();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Projects { get; set; } = new();
    public List<SelectListItem> Categories { get; set; } = new();
    public string ProjectDatesJson { get; set; } = "{}";

    /// <summary>Para birimi seçeneği; Kurlar sayfasıyla aynı liste (FinanceLookupShared).</summary>
    public List<SelectListItem> Currencies { get; set; } = FinanceLookupShared.Currencies();

    public EditModalModel(
        IExpenseAppService expenseAppService,
        IProjectAppService projectAppService,
        IFinanceDocumentAppService financeDocuments,
        FinanceDocumentUploads uploads)
    {
        _expenseAppService = expenseAppService;
        _projectAppService = projectAppService;
        _financeDocuments = financeDocuments;
        _uploads = uploads;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id)
    {
        ExpenseId = id;
        var dto = await _expenseAppService.GetAsync(id);

        Expense.Title = dto.Title;
        Expense.Amount = dto.Amount;
        Expense.Currency = dto.Currency;
        Expense.ExpenseDate = dto.ExpenseDate;
        Expense.Category = dto.Category;
        Expense.CashAccountId = dto.CashAccountId;
        Expense.ProjectId = dto.ProjectId;
        Expense.BudgetLineId = dto.BudgetLineId;
        // TaskId BURAYA HİÇ KOPYALANMIYORDU: form da basmadığı için düzenleme
        // POST'unda null gidiyor ve gider, görevin Finans sekmesinden SESSİZCE
        // düşüyordu. Alan artık forma da basıldığı için burada da doldurulur.
        Expense.TaskId = dto.TaskId;
        Expense.CustomerId = dto.CustomerId;
        Expense.Description = dto.Description;

        (Accounts, Projects, Categories, ProjectDatesJson) =
            await ExpenseLookups.LoadAsync(_expenseAppService, _projectAppService);

        CanAttachDocuments = await _financeDocuments.CanAttachAsync();
        if (CanAttachDocuments)
        {
            LinkedDocuments = await _financeDocuments.GetExpenseDocumentsAsync(id);
        }

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();

        var uploads = await _uploads.StoreAsync(DocumentFiles);
        try
        {
            await _expenseAppService.UpdateAsync(ExpenseId, Expense);
            foreach (var upload in uploads)
            {
                await _financeDocuments.AttachToExpenseAsync(
                    ExpenseId, upload.FileName, upload.StoredFileName, upload.ContentType, upload.FileSize);
            }
        }
        catch
        {
            _uploads.Discard(uploads);
            throw;
        }

        return NoContent();
    }
}
