using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Apya.Platform.Web.Pages.AiCenter.Prompts;

[Authorize(AiPermissions.Prompts.Default)]
public class IndexModel : PlatformPageModel
{
    private readonly IPromptCategoryAppService _promptCategoryAppService;

    public List<SelectListItem> Categories { get; set; } = new();

    public IndexModel(IPromptCategoryAppService promptCategoryAppService)
    {
        _promptCategoryAppService = promptCategoryAppService;
    }

    public async Task OnGetAsync()
    {
        var categories = await _promptCategoryAppService.GetListAsync();
        Categories = new List<SelectListItem> { new SelectListItem("Tüm kategoriler", "") };
        Categories.AddRange(categories.Select(c => new SelectListItem(c.Name, c.Id.ToString())));
    }
}
