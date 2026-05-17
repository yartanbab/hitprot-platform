using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.FxRevaluations;

namespace Apya.Platform.Web.Pages.FxRevaluations;

public class DetailModalModel : AbpPageModel
{
    private readonly IFxRevaluationAppService _fxRevaluationAppService;

    public FxRevaluationSnapshotDto Snapshot { get; set; } = new();

    public DetailModalModel(IFxRevaluationAppService fxRevaluationAppService)
    {
        _fxRevaluationAppService = fxRevaluationAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id)
    {
        Snapshot = await _fxRevaluationAppService.GetAsync(id);
        return Page();
    }
}
