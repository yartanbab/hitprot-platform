using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.ProjectBudgets.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Finance;

/// <summary>
/// Kur politikası ayarı. Donör para birimi boşaltılırsa sunucu politikayı ve
/// sabit kuru da temizler (<c>Project.SetFxBridge</c>) — yarım yapılandırma kalmaz.
/// </summary>
public class FxPolicyModalModel : AbpPageModel
{
    private readonly IProjectFxAppService _fxAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    [BindProperty]
    public UpdateProjectFxPolicyDto Policy { get; set; } = new();

    public string ProjectCurrency { get; set; } = "TRY";

    public List<SelectListItem> Currencies { get; set; } = FinanceLookupShared.Currencies();

    public List<SelectListItem> Policies { get; set; } = new()
    {
        new("Harcama günü kuru", ((int)FxPolicy.SpendDate).ToString()),
        new("Dilim (tahsil) kuru", ((int)FxPolicy.TrancheDate).ToString()),
        new("Aylık donör kuru", ((int)FxPolicy.MonthlyDonor).ToString()),
        new("Sabit sözleşme kuru", ((int)FxPolicy.FixedContract).ToString())
    };

    public FxPolicyModalModel(IProjectFxAppService fxAppService)
    {
        _fxAppService = fxAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        var current = await _fxAppService.GetPolicyAsync(ProjectId);
        ProjectCurrency = current.ProjectCurrency;
        Policy = new UpdateProjectFxPolicyDto
        {
            DonorCurrency = current.DonorCurrency,
            Policy = current.Policy,
            FixedDonorRate = current.FixedDonorRate
        };

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _fxAppService.UpdatePolicyAsync(ProjectId, Policy);
        return NoContent();
    }
}
