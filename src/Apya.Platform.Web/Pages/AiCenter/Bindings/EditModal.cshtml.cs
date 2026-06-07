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

public class EditModalModel : AbpPageModel
{
    private readonly IAiFormBindingAppService _bindingAppService;

    [HiddenInput]
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    [BindProperty]
    public CreateUpdateAiFormBindingDto Binding { get; set; } = new();

    public string? FormTitle { get; set; }
    public string? PromptName { get; set; }
    public List<SelectListItem> TriggerModes { get; set; } = new();

    public EditModalModel(IAiFormBindingAppService bindingAppService)
    {
        _bindingAppService = bindingAppService;
    }

    public async Task OnGetAsync()
    {
        var dto = await _bindingAppService.GetAsync(Id);
        Binding = new CreateUpdateAiFormBindingDto
        {
            DocumentId = dto.DocumentId,
            PromptId = dto.PromptId,
            TriggerMode = dto.TriggerMode,
            Order = dto.Order,
            IsActive = dto.IsActive
        };
        FormTitle = dto.DocumentTitle;
        PromptName = dto.PromptName;
        TriggerModes = Enum.GetValues<BindingTriggerMode>()
            .Select(v => new SelectListItem(v.ToString(), ((int)v).ToString())).ToList();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _bindingAppService.UpdateAsync(Id, Binding);
        return NoContent();
    }
}
