using System.Threading.Tasks;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Prompts.Dtos;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.AiCenter.PromptCategories;

public class CreateModalModel : AbpPageModel
{
    private readonly IPromptCategoryAppService _promptCategoryAppService;

    [BindProperty]
    public CreateUpdatePromptCategoryDto Category { get; set; } = new();

    public CreateModalModel(IPromptCategoryAppService promptCategoryAppService)
    {
        _promptCategoryAppService = promptCategoryAppService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _promptCategoryAppService.CreateAsync(Category);
        return NoContent();
    }
}
