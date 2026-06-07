using System;
using System.Threading.Tasks;
using Apya.Platform.Ai.Evaluations;
using Apya.Platform.Ai.Evaluations.Dtos;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.AiCenter.Evaluations;

public class DetailModalModel : AbpPageModel
{
    private readonly IAiEvaluationAppService _evaluationAppService;

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public AiEvaluationDetailDto Evaluation { get; set; } = default!;

    public DetailModalModel(IAiEvaluationAppService evaluationAppService)
    {
        _evaluationAppService = evaluationAppService;
    }

    public async Task OnGetAsync()
    {
        Evaluation = await _evaluationAppService.GetAsync(Id);
    }
}
