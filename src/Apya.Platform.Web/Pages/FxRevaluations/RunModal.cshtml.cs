using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.FxRevaluations;

namespace Apya.Platform.Web.Pages.FxRevaluations;

public class RunModalModel : AbpPageModel
{
    private readonly IFxRevaluationAppService _fxRevaluationAppService;

    [BindProperty]
    public RunFxRevaluationDto Input { get; set; } = new();

    public RunModalModel(IFxRevaluationAppService fxRevaluationAppService)
    {
        _fxRevaluationAppService = fxRevaluationAppService;
    }

    public virtual Task<IActionResult> OnGetAsync()
    {
        return Task.FromResult<IActionResult>(Page());
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _fxRevaluationAppService.RunAsync(Input);
        return NoContent();
    }
}
