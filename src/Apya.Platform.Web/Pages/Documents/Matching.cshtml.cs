using System;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Documents;

/// <summary>Harcama-belge eslestirme tezgahi.</summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class MatchingModel : AbpPageModel
{
    private readonly IDocumentMatchingAppService _matchingAppService;

    public MatchingModel(IDocumentMatchingAppService matchingAppService)
    {
        _matchingAppService = matchingAppService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnGetBoardAsync(Guid projectId)
        => new JsonResult(await _matchingAppService.GetBoardAsync(projectId));

    public async Task<IActionResult> OnGetCandidatesAsync(Guid expenseId)
        => new JsonResult(await _matchingAppService.GetCandidatesAsync(expenseId));

    public async Task<IActionResult> OnGetMatchesAsync(Guid projectId)
        => new JsonResult(await _matchingAppService.GetMatchesAsync(projectId));

    public async Task<IActionResult> OnPostCreateMatchAsync([FromBody] CreateMatchDto input)
        => new JsonResult(await _matchingAppService.CreateMatchAsync(input));

    public async Task<IActionResult> OnPostRemoveMatchAsync(Guid matchId)
    {
        await _matchingAppService.RemoveMatchAsync(matchId);
        return NoContent();
    }
}
