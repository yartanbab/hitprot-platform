using System;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Documents;

/// <summary>Zaman cizelgesi & butce — is adimi Gantt'i, kapsama ve risk kutugu.</summary>
[Authorize(PlatformPermissions.Projects.Default)]
public class TimelineModel : AbpPageModel
{
    private readonly IProjectTimelineAppService _timelineAppService;

    public TimelineModel(IProjectTimelineAppService timelineAppService)
    {
        _timelineAppService = timelineAppService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnGetTimelineAsync(Guid projectId)
        => new JsonResult(await _timelineAppService.GetAsync(projectId));

    public async Task<IActionResult> OnPostCreateRiskAsync([FromBody] CreateUpdateProjectRiskDto input)
        => new JsonResult(await _timelineAppService.CreateRiskAsync(input));

    public async Task<IActionResult> OnPostUpdateRiskAsync(Guid id, [FromBody] CreateUpdateProjectRiskDto input)
        => new JsonResult(await _timelineAppService.UpdateRiskAsync(id, input));

    public async Task<IActionResult> OnPostSetRiskClosedAsync(Guid id, bool isClosed)
        => new JsonResult(await _timelineAppService.SetRiskClosedAsync(id, isClosed));

    public async Task<IActionResult> OnPostDeleteRiskAsync(Guid id)
    {
        await _timelineAppService.DeleteRiskAsync(id);
        return NoContent();
    }
}
