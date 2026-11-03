using System;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// Projenin destek oranı. Boş bırakılırsa hibe programının oranı geçerli olur;
/// kurum payı her zaman 100 − oran olarak türetilir, ayrıca girilmez.
/// </summary>
[Authorize(PlatformPermissions.Projects.ViewBudget)]
public class SupportRateModalModel : AbpPageModel
{
    private readonly IProjectBudgetAppService _budgetAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    [BindProperty]
    public UpdateSupportRateDto Rate { get; set; } = new();

    /// <summary>Projeye oran girilmemişse kullanılan program oranı (bilgi amaçlı).</summary>
    public decimal? ProgramRatePercent { get; set; }

    public SupportRateModalModel(IProjectBudgetAppService budgetAppService)
    {
        _budgetAppService = budgetAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        var overview = await _budgetAppService.GetOverviewAsync(ProjectId);
        if (overview.SupportRateFromProgram)
        {
            ProgramRatePercent = overview.SupportRatePercent;
        }
        else
        {
            Rate.SupportRatePercent = overview.SupportRatePercent;
        }

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _budgetAppService.UpdateSupportRateAsync(ProjectId, Rate);
        return NoContent();
    }
}
