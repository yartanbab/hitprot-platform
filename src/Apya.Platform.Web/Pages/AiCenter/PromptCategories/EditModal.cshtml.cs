using System;
using System.Threading.Tasks;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Prompts.Dtos;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.AiCenter.PromptCategories;

public class EditModalModel : AbpPageModel
{
    private readonly IPromptCategoryAppService _promptCategoryAppService;

    [HiddenInput]
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    [BindProperty]
    public CreateUpdatePromptCategoryDto Category { get; set; } = new();

    public EditModalModel(IPromptCategoryAppService promptCategoryAppService)
    {
        _promptCategoryAppService = promptCategoryAppService;
    }

    public async Task OnGetAsync()
    {
        var dto = await _promptCategoryAppService.GetAsync(Id);
        Category = new CreateUpdatePromptCategoryDto
        {
            Name = dto.Name,
            Code = dto.Code,
            ParentId = dto.ParentId,
            Description = dto.Description
        };
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _promptCategoryAppService.UpdateAsync(Id, Category);
        return NoContent();
    }
}
