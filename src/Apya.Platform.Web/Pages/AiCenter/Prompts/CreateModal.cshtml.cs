using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Prompts.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.AiCenter.Prompts;

public class CreateModalModel : AbpPageModel
{
    private readonly IPromptAppService _promptAppService;
    private readonly IPromptCategoryAppService _promptCategoryAppService;

    [BindProperty]
    public CreatePromptDto Prompt { get; set; } = new();

    public List<SelectListItem> Categories { get; set; } = new();

    public CreateModalModel(
        IPromptAppService promptAppService,
        IPromptCategoryAppService promptCategoryAppService)
    {
        _promptAppService = promptAppService;
        _promptCategoryAppService = promptCategoryAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadCategoriesAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _promptAppService.CreateAsync(Prompt);
        return NoContent();
    }

    private async Task LoadCategoriesAsync()
    {
        var categories = await _promptCategoryAppService.GetListAsync();
        Categories = new List<SelectListItem> { new SelectListItem("(Kategori yok)", "") };
        Categories.AddRange(categories.Select(c => new SelectListItem(c.Name, c.Id.ToString())));
    }
}
