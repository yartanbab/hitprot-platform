using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Bindings;
using Apya.Platform.Ai.Bindings.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.AiCenter.Bindings;

public class CreateModalModel : AbpPageModel
{
    private readonly IAiFormBindingAppService _bindingAppService;

    [BindProperty]
    public CreateUpdateAiFormBindingDto Binding { get; set; } = new();

    public List<SelectListItem> Forms { get; set; } = new();
    public List<SelectListItem> Prompts { get; set; } = new();
    public List<SelectListItem> TriggerModes { get; set; } = new();

    public CreateModalModel(IAiFormBindingAppService bindingAppService)
    {
        _bindingAppService = bindingAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadLookupsAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _bindingAppService.CreateAsync(Binding);
        return NoContent();
    }

    private async Task LoadLookupsAsync()
    {
        Forms = (await _bindingAppService.GetFormLookupAsync())
            .Select(x => new SelectListItem(x.DisplayName, x.Id.ToString())).ToList();
        Prompts = (await _bindingAppService.GetPromptLookupAsync())
            .Select(x => new SelectListItem(x.DisplayName, x.Id.ToString())).ToList();
        TriggerModes = Enum.GetValues<BindingTriggerMode>()
            .Select(v => new SelectListItem(v.ToString(), ((int)v).ToString())).ToList();
    }
}
