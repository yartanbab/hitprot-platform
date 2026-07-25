using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Documents;

namespace Apya.Platform.Web.Pages.Documents;

public class EditModalModel : AbpPageModel
{
    private readonly IDocumentAppService _documentAppService;

    [HiddenInput]
    [BindProperty]
    public Guid DocumentId { get; set; }

    [BindProperty]
    public CreateUpdateDocumentDto Document { get; set; } = new();

    public EditModalModel(IDocumentAppService documentAppService)
    {
        _documentAppService = documentAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id)
    {
        DocumentId = id;
        var dto = await _documentAppService.GetAsync(id);

        Document.Title = dto.Title;
        Document.Content = dto.Content;
        Document.Icon = dto.Icon;
        Document.ProjectId = dto.ProjectId;
        Document.ParentDocumentId = dto.ParentDocumentId;
        Document.ExpiryDate = dto.ExpiryDate;

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _documentAppService.UpdateAsync(DocumentId, Document);
        return NoContent();
    }
}
