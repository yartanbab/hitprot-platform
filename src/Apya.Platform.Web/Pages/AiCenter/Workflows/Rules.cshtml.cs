using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Workflows;
using Apya.Platform.Ai.Workflows.Dtos;
using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Apya.Platform.Web.Pages.AiCenter.Workflows;

[Authorize(AiPermissions.Workflows.Default)]
public class RulesModel : PlatformPageModel
{
    private readonly IAiWorkflowAppService _workflowAppService;

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public AiWorkflowDetailDto Workflow { get; set; } = default!;

    [BindProperty]
    public CreateWorkflowRuleDto NewRule { get; set; } = new();

    public List<SelectListItem> Operators { get; set; } = new();
    public List<SelectListItem> ActionTypes { get; set; } = new();

    public RulesModel(IAiWorkflowAppService workflowAppService)
    {
        _workflowAppService = workflowAppService;
    }

    public async Task OnGetAsync()
    {
        await LoadAsync();
    }

    public async Task<IActionResult> OnPostAddRuleAsync()
    {
        await _workflowAppService.AddRuleAsync(Id, NewRule);
        return RedirectToPage(new { id = Id });
    }

    public async Task<IActionResult> OnPostRemoveRuleAsync(Guid ruleId)
    {
        await _workflowAppService.RemoveRuleAsync(Id, ruleId);
        return RedirectToPage(new { id = Id });
    }

    private async Task LoadAsync()
    {
        Workflow = await _workflowAppService.GetAsync(Id);
        Operators = Enum.GetValues<RuleOperator>()
            .Select(v => new SelectListItem(v.ToString(), ((int)v).ToString())).ToList();
        ActionTypes = Enum.GetValues<WorkflowActionType>()
            .Select(v => new SelectListItem(v.ToString(), ((int)v).ToString())).ToList();
    }
}
