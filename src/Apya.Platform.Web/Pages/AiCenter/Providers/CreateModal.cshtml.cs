using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Providers;
using Apya.Platform.Ai.Providers.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.AiCenter.Providers;

public class CreateModalModel : AbpPageModel
{
    private readonly IAiProviderAppService _aiProviderAppService;

    [BindProperty]
    public CreateUpdateAiProviderConfigDto Config { get; set; } = new();

    public List<SelectListItem> Providers { get; set; } = new();

    public CreateModalModel(IAiProviderAppService aiProviderAppService)
    {
        _aiProviderAppService = aiProviderAppService;
    }

    public void OnGet()
    {
        LoadProviders();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _aiProviderAppService.CreateAsync(Config);
        return NoContent();
    }

    private void LoadProviders()
    {
        Providers = Enum.GetValues<AiProviderType>()
            .Select(v => new SelectListItem(v.ToString(), ((int)v).ToString()))
            .ToList();
    }
}
