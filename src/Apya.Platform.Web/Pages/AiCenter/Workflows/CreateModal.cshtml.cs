using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Bindings;
using Apya.Platform.Ai.Workflows;
using Apya.Platform.Ai.Workflows.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.AiCenter.Workflows;

public class CreateModalModel : AbpPageModel
{
    private readonly IAiWorkflowAppService _workflowAppService;
    private readonly IAiFormBindingAppService _bindingAppService;

    [BindProperty]
    public CreateUpdateAiWorkflowDto Workflow { get; set; } = new();

    public List<SelectListItem> Forms { get; set; } = new();
    public List<SelectListItem> Prompts { get; set; } = new();

    public CreateModalModel(IAiWorkflowAppService workflowAppService, IAiFormBindingAppService bindingAppService)
    {
        _workflowAppService = workflowAppService;
        _bindingAppService = bindingAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadLookupsAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _workflowAppService.CreateAsync(Workflow);
        return NoContent();
    }

    private async Task LoadLookupsAsync()
    {
        Forms = new List<SelectListItem> { new SelectListItem("(Tüm formlar)", "") };
        Forms.AddRange((await _bindingAppService.GetFormLookupAsync())
            .Select(x => new SelectListItem(x.DisplayName, x.Id.ToString())));

        Prompts = new List<SelectListItem> { new SelectListItem("(Tüm promptlar)", "") };
        Prompts.AddRange((await _bindingAppService.GetPromptLookupAsync())
            .Select(x => new SelectListItem(x.DisplayName, x.Id.ToString())));
    }
}
