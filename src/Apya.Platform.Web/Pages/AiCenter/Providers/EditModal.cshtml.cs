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

public class EditModalModel : AbpPageModel
{
    private readonly IAiProviderAppService _aiProviderAppService;

    [HiddenInput]
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    [BindProperty]
    public CreateUpdateAiProviderConfigDto Config { get; set; } = new();

    public List<SelectListItem> Providers { get; set; } = new();

    public bool HasApiKey { get; set; }

    public EditModalModel(IAiProviderAppService aiProviderAppService)
    {
        _aiProviderAppService = aiProviderAppService;
    }

    public async Task OnGetAsync()
    {
        var dto = await _aiProviderAppService.GetAsync(Id);
        Config = new CreateUpdateAiProviderConfigDto
        {
            Provider = dto.Provider,
            DisplayName = dto.DisplayName,
            Model = dto.Model,
            IsDefault = dto.IsDefault,
            IsEnabled = dto.IsEnabled
        };
        HasApiKey = dto.HasApiKey;
        LoadProviders();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _aiProviderAppService.UpdateAsync(Id, Config);
        return NoContent();
    }

    private void LoadProviders()
    {
        Providers = Enum.GetValues<AiProviderType>()
            .Select(v => new SelectListItem(v.ToString(), ((int)v).ToString()))
            .ToList();
    }
}
