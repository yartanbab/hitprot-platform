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
/// Projenin KDV istisna belgesi. Belge no doluysa ve fatura tarihinde geçerliyse yeni faturalar
/// varsayılan olarak KDV istisnalı açılır; numara boş bırakılırsa istisna kaldırılır.
/// </summary>
[Authorize(PlatformPermissions.Projects.ViewBudget)]
public class VatExemptionModalModel : AbpPageModel
{
    private readonly IProjectBudgetAppService _budgetAppService;

    [BindProperty(SupportsGet = true)]
    public Guid ProjectId { get; set; }

    [BindProperty]
    public UpdateVatExemptionDto Exemption { get; set; } = new();

    public VatExemptionModalModel(IProjectBudgetAppService budgetAppService)
    {
        _budgetAppService = budgetAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        var overview = await _budgetAppService.GetOverviewAsync(ProjectId);
        Exemption.VatExemptionCertificateNo = overview.VatExemptionCertificateNo;
        Exemption.VatExemptionValidUntil = overview.VatExemptionValidUntil;
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _budgetAppService.UpdateVatExemptionAsync(ProjectId, Exemption);
        return NoContent();
    }
}
