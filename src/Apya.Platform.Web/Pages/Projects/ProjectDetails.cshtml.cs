using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Projects;
using Apya.Platform.Projects.Dtos;
using TaskDto = Apya.Platform.Tasks.TaskDto;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.Projects;

/// <summary>
/// ARCH-W-002: Tüm hesaplama mantığı IProjectAppService.GetDetailAsync'e taşındı.
/// Bu PageModel artık yalnızca DTO bağlar — business logic yok.
/// View ile geriye dönük uyum için scalar shim property'leri korunuyor.
/// </summary>
[Authorize(PlatformPermissions.Projects.Default)]
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
    public bool TimeNotStarted { get; set; }

    /// <summary>
    /// Konsolun "Finans" sekmesi. Finans çatısıyla AYNI servisten beslenir —
    /// iki ekranın rakamı ayrışmasın. Bütçe yetkisi yoksa null kalır ve sekme
    /// hiç basılmaz.
    /// </summary>
    public Apya.Platform.ProjectBudgets.Dtos.ProjectBudgetOverviewDto? Budget { get; set; }

    public decimal BudgetSpent { get; set; }
    public int BudgetPercent { get; set; }

    /// <summary>Konsol 8. adım: proje ekibi. Şeritteki facepile artık bunu gösterir.</summary>
    public List<ProjectMemberDto> Members { get; set; } = new();

    private readonly IProjectAppService _projectAppService;
    private readonly Apya.Platform.ProjectBudgets.IProjectBudgetAppService _projectBudgetAppService;
    private readonly IProjectMemberAppService _projectMemberAppService;

    public ProjectDetailsModel(
        IProjectAppService projectAppService,
        IProjectMemberAppService projectMemberAppService,
        Apya.Platform.ProjectBudgets.IProjectBudgetAppService projectBudgetAppService)
    {
        _projectAppService = projectAppService;
        _projectMemberAppService = projectMemberAppService;
        _projectBudgetAppService = projectBudgetAppService;
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
        TimeNotStarted = detail.TimeNotStarted;

        // Yetkisi olmayan kullanıcıda sessizce atlanır; sekme ve bütçe çubuğu basılmaz.
        try { Budget = await _projectBudgetAppService.GetOverviewAsync(Id); }
        catch (Volo.Abp.Authorization.AbpAuthorizationException) { Budget = null; }

        // Şeritteki "Bütçe" çubuğu, Bütçe Durumu modalı ve Finans çatısı AYNI
        // hesaptan beslensin: onaylanan bütçe (kalem + revizyon), Project.TotalBudget
        // değil. Çubuk zaten yüklü olan özeti kullanır, ek sorgu açmaz.
        BudgetSpent = Budget?.SpentAmount ?? 0m;
        BudgetPercent = Budget?.BudgetUsagePercent ?? 0;

        Members = await _projectMemberAppService.GetListByProjectAsync(Id);
    }
}
