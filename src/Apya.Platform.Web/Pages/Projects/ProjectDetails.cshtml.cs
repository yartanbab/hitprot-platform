using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using TaskDto = Apya.Platform.Tasks.TaskDto;

namespace Apya.Platform.Web.Pages.Projects;

/// <summary>
/// ARCH-W-002: Tüm hesaplama mantığı IProjectAppService.GetDetailAsync'e taşındı.
/// Bu PageModel artık yalnızca DTO bağlar — business logic yok.
/// View ile geriye dönük uyum için scalar shim property'leri korunuyor.
/// </summary>
public class ProjectDetailsModel : PlatformPageModel
{
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public ProjectDto? Project { get; set; }
    public List<TaskDto> Tasks { get; set; } = new();

    public int AiRiskScore { get; set; }
    public string AiRiskMessage { get; set; } = string.Empty;
    public string AiRiskColor { get; set; } = "success";

    public string TenantName { get; set; } = string.Empty;
    public bool IsInternalProject { get; set; } = true;
    public string CurrencySymbol { get; set; } = "₺";

    public int RemainingDays { get; set; }
    public int TotalProjectDays { get; set; }
    public int TimeUsagePercent { get; set; }
    public string TimeHealthColor { get; set; } = "success";
    public string TimeHealthLabel { get; set; } = "Saglam";

    public decimal BudgetSpent { get; set; }
    public int BudgetPercent { get; set; }

    private readonly IProjectAppService _projectAppService;

    public ProjectDetailsModel(IProjectAppService projectAppService)
    {
        _projectAppService = projectAppService;
    }

    public async Task OnGetAsync()
    {
        var detail = await _projectAppService.GetDetailAsync(Id);

        Project = detail;
        Tasks = detail.Tasks;

        AiRiskScore = detail.AiRiskScore;
        AiRiskMessage = detail.AiRiskMessage;
        AiRiskColor = detail.AiRiskColor;

        TenantName = detail.TenantDisplayName;
        IsInternalProject = detail.IsInternalProject;
        CurrencySymbol = detail.CurrencySymbol;

        RemainingDays = detail.RemainingDays;
        TotalProjectDays = detail.TotalProjectDays;
        TimeUsagePercent = detail.TimeUsagePercent;
        TimeHealthColor = detail.TimeHealthColor;
        TimeHealthLabel = detail.TimeHealthLabel;

        BudgetSpent = detail.SpentBudget;
        BudgetPercent = detail.BudgetPercent;
    }
}
