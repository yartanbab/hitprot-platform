using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Documents;

namespace Apya.Platform.Web.Pages.Documents;

public class CreateModalModel : AbpPageModel
{
    private readonly IDocumentAppService _documentAppService;

    [HiddenInput]
    [BindProperty(SupportsGet = true)]
    public Guid? ParentDocumentId { get; set; }

    [BindProperty]
    public CreateUpdateDocumentDto Document { get; set; } = new();

    public CreateModalModel(IDocumentAppService documentAppService)
    {
        _documentAppService = documentAppService;
    }

    public virtual Task<IActionResult> OnGetAsync()
    {
        Document.ParentDocumentId = ParentDocumentId;
        return Task.FromResult<IActionResult>(Page());
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        Document.ParentDocumentId = ParentDocumentId;
        await _documentAppService.CreateAsync(Document);
        return NoContent();
    }
}
