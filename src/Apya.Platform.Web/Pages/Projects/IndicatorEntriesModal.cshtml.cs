using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Projects;

/// <summary>
/// PRJ-08 · Göstergenin ölçümleri: herkes (görme izniyle) listeyi görür; yönetme izni olan yeni
/// ölçüm girer ve ölçüm siler. Kaydetme ucu yönetme iznini ayrıca ister.
/// </summary>
[Authorize(PlatformPermissions.Projects.ViewIndicators)]
public class IndicatorEntriesModalModel : AbpPageModel
{
    private readonly IProjectIndicatorAppService _indicatorAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    [BindProperty(SupportsGet = true)]
    public Guid IndicatorId { get; set; }

    [BindProperty]
    public CreateProjectIndicatorEntryDto Entry { get; set; } = new();

    public ProjectIndicatorDto Indicator { get; set; } = null!;
    public List<ProjectIndicatorEntryDto> Entries { get; set; } = new();
    public List<SelectListItem> Documents { get; set; } = new();
    public bool CanManage { get; set; }

    public IndicatorEntriesModalModel(IProjectIndicatorAppService indicatorAppService)
    {
        _indicatorAppService = indicatorAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        Indicator = (await _indicatorAppService.GetListAsync(ProjectId)).First(x => x.Id == IndicatorId);
        Entries = await _indicatorAppService.GetEntriesAsync(IndicatorId);
        CanManage = await AuthorizationService.IsGrantedAsync(PlatformPermissions.Projects.ManageIndicators);

        if (CanManage)
        {
            Entry.EntryDate = Clock.Now.Date;
            Entry.Value = Indicator.CurrentValue;
            Documents = (await _indicatorAppService.GetDocumentOptionsAsync(IndicatorId))
                .Select(d => new SelectListItem(d.Name, d.DocumentFileId.ToString()))
                .ToList();
        }

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _indicatorAppService.AddEntryAsync(IndicatorId, Entry);
        return NoContent();
    }
}
