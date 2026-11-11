using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Documents;
using Apya.Platform.Incomes;
using Apya.Platform.ProjectBudgets.Dtos;
using Apya.Platform.Projects;
using Apya.Platform.Web.Services;

namespace Apya.Platform.Web.Pages.Incomes;

[Authorize]
public class EditModalModel : AbpPageModel
{
    private readonly IIncomeEntryAppService _incomeAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly IFinanceDocumentAppService _financeDocuments;
    private readonly FinanceDocumentUploads _uploads;

    [HiddenInput]
    [BindProperty]
    public Guid IncomeId { get; set; }

    [BindProperty]
    public CreateUpdateIncomeEntryDto Income { get; set; } = new();

    /// <summary>"Belge ekle" alanından gelen dekont/yazı dosyaları.</summary>
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
        IIncomeEntryAppService incomeAppService,
        IProjectAppService projectAppService,
        IFinanceDocumentAppService financeDocuments,
        FinanceDocumentUploads uploads)
    {
        _incomeAppService = incomeAppService;
        _projectAppService = projectAppService;
        _financeDocuments = financeDocuments;
        _uploads = uploads;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id)
    {
        IncomeId = id;
        var dto = await _incomeAppService.GetAsync(id);

        Income.Title = dto.Title;
        Income.Amount = dto.Amount;
        Income.Currency = dto.Currency;
        Income.IncomeDate = dto.IncomeDate;
        Income.Category = dto.Category;
        Income.CashAccountId = dto.CashAccountId;
        Income.ProjectId = dto.ProjectId;
        Income.BudgetLineId = dto.BudgetLineId;
        // Giderdeki ile aynı sessiz kayıp buradaydı: TaskId kopyalanmadığı için
        // düzenleme kaydın görev bağını siliyordu.
        Income.TaskId = dto.TaskId;
        Income.CustomerId = dto.CustomerId;
        Income.Description = dto.Description;

        (Accounts, Projects, Categories, ProjectDatesJson) =
            await IncomeLookups.LoadAsync(_incomeAppService, _projectAppService);

        CanAttachDocuments = await _financeDocuments.CanAttachAsync();
        if (CanAttachDocuments)
        {
            LinkedDocuments = await _financeDocuments.GetIncomeDocumentsAsync(id);
        }

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();

        var uploads = await _uploads.StoreAsync(DocumentFiles);
        try
        {
            await _incomeAppService.UpdateAsync(IncomeId, Income);
            foreach (var upload in uploads)
            {
                await _financeDocuments.AttachToIncomeAsync(
                    IncomeId, upload.FileName, upload.StoredFileName, upload.ContentType, upload.FileSize);
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
