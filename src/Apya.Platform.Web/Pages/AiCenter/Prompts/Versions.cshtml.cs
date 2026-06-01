using System;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Prompts.Dtos;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Apya.Platform.Web.Pages.AiCenter.Prompts;

[Authorize(AiPermissions.Prompts.Default)]
public class VersionsModel : PlatformPageModel
{
    private readonly IPromptAppService _promptAppService;

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public PromptDetailDto Prompt { get; set; } = default!;

    [BindProperty]
    public CreatePromptVersionDto NewVersion { get; set; } = new();

    public VersionsModel(IPromptAppService promptAppService)
    {
        _promptAppService = promptAppService;
    }

    public async Task OnGetAsync()
    {
        Prompt = await _promptAppService.GetAsync(Id);
    }

    public async Task<IActionResult> OnPostAddVersionAsync()
    {
        await _promptAppService.AddVersionAsync(Id, NewVersion);
        return RedirectToPage(new { id = Id });
    }

    public async Task<IActionResult> OnPostPublishAsync(Guid versionId)
    {
        await _promptAppService.PublishVersionAsync(Id, versionId);
        return RedirectToPage(new { id = Id });
    }
}
