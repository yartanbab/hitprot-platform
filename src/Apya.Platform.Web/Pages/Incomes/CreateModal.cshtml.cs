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
using Apya.Platform.Tasks;
using Apya.Platform.Web.Services;

namespace Apya.Platform.Web.Pages.Incomes;

[Authorize]
public class CreateModalModel : AbpPageModel
{
    private readonly IIncomeEntryAppService _incomeAppService;
    private readonly IProjectAppService _projectAppService;
    private readonly ITaskAppService _taskAppService;
    private readonly IFinanceDocumentAppService _financeDocuments;
    private readonly FinanceDocumentUploads _uploads;

    [BindProperty(SupportsGet = true)]
    public Guid? TaskId { get; set; }

    /// <summary>Finans Merkezi'nden açılınca proje ÖNDEN seçili gelir (FUX-01; gider
    /// penceresindeki eşinin aynısı). TaskId doluysa yok sayılır — görev projeyi zaten belirler.</summary>
    [BindProperty(SupportsGet = true)]
    public Guid? ProjectId { get; set; }

    [BindProperty]
    public CreateUpdateIncomeEntryDto Income { get; set; } = new();

    /// <summary>"Belge ekle" alanından gelen dekont/yazı dosyaları.</summary>
    [BindProperty]
    public List<IFormFile> DocumentFiles { get; set; } = new();

    public bool CanAttachDocuments { get; set; }

    /// <summary>Yeni kayıtta bağlı belge yok; alan düzenleme penceresiyle ortak.</summary>
    public IReadOnlyList<ProjectExpenseDocumentDto> LinkedDocuments { get; } = Array.Empty<ProjectExpenseDocumentDto>();

    public List<SelectListItem> Accounts { get; set; } = new();
    public List<SelectListItem> Projects { get; set; } = new();
    public List<SelectListItem> Categories { get; set; } = new();
    public string ProjectDatesJson { get; set; } = "{}";

    /// <summary>Para birimi seçeneği; Kurlar sayfasıyla aynı liste (FinanceLookupShared).</summary>
    public List<SelectListItem> Currencies { get; set; } = FinanceLookupShared.Currencies();

    public CreateModalModel(
        IIncomeEntryAppService incomeAppService,
        IProjectAppService projectAppService,
        ITaskAppService taskAppService,
        IFinanceDocumentAppService financeDocuments,
        FinanceDocumentUploads uploads)
    {
        _incomeAppService = incomeAppService;
        _projectAppService = projectAppService;
        _taskAppService = taskAppService;
        _financeDocuments = financeDocuments;
        _uploads = uploads;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        (Accounts, Projects, Categories, ProjectDatesJson) =
            await IncomeLookups.LoadAsync(_incomeAppService, _projectAppService);
        CanAttachDocuments = await _financeDocuments.CanAttachAsync();
        if (TaskId.HasValue)
        {
            Income.TaskId = TaskId;

            // Görev panelinden açıldığında projeyi de ÖNDEN seç: görev seçicisi
            // proje seçilene kadar gizli olduğu için, proje boş kalırsa gelen
            // TaskId POST'ta kaybolurdu.
            Income.ProjectId = await FinanceLookupShared.ResolveTaskProjectAsync(_taskAppService, TaskId.Value);
        }
        else if (ProjectId.HasValue)
        {
            Income.ProjectId = ProjectId;
        }

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();

        // Dosyalar kayıttan ÖNCE doğrulanır: reddedilen dosya geliri yarım bırakmaz.
        var uploads = await _uploads.StoreAsync(DocumentFiles);
        try
        {
            var created = await _incomeAppService.CreateAsync(Income);
            foreach (var upload in uploads)
            {
                await _financeDocuments.AttachToIncomeAsync(
                    created.Id, upload.FileName, upload.StoredFileName, upload.ContentType, upload.FileSize);
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
