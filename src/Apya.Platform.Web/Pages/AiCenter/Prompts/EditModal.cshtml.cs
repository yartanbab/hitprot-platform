using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Prompts.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.AiCenter.Prompts;

public class EditModalModel : AbpPageModel
{
    private readonly IPromptAppService _promptAppService;
    private readonly IPromptCategoryAppService _promptCategoryAppService;

    [HiddenInput]
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    // Display-only; the prompt code is immutable after creation.
    public string Code { get; set; } = string.Empty;

    [BindProperty]
    public UpdatePromptDto Prompt { get; set; } = new();

    public List<SelectListItem> Categories { get; set; } = new();

    public EditModalModel(
        IPromptAppService promptAppService,
        IPromptCategoryAppService promptCategoryAppService)
    {
        _promptAppService = promptAppService;
        _promptCategoryAppService = promptCategoryAppService;
    }

    public async Task OnGetAsync()
    {
        var dto = await _promptAppService.GetAsync(Id);
        Code = dto.Code;
        Prompt = new UpdatePromptDto
        {
            Name = dto.Name,
            Description = dto.Description,
            CategoryId = dto.CategoryId,
            IsActive = dto.IsActive
        };
        await LoadCategoriesAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _promptAppService.UpdateAsync(Id, Prompt);
        return NoContent();
    }

    private async Task LoadCategoriesAsync()
    {
        var categories = await _promptCategoryAppService.GetListAsync();
        Categories = new List<SelectListItem> { new SelectListItem("(Kategori yok)", "") };
        Categories.AddRange(categories.Select(c => new SelectListItem(c.Name, c.Id.ToString())));
    }
}
