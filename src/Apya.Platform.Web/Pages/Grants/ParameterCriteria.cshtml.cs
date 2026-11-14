using System;
using System.Threading.Tasks;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// Programın kurum parametrelerine koyduğu ölçütler. <c>Grants.Edit</c> tanım gereği host'a
/// özgüdür. Ölçüt eklemek, o parametreyi bu program için eşleştirmeye DAHİL etmektir.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class ParameterCriteriaModel : AbpPageModel
{
    private readonly IGrantParameterCriterionAppService _service;

    public ParameterCriteriaModel(IGrantParameterCriterionAppService service)
    {
        _service = service;
    }

    [BindProperty(SupportsGet = true)]
    public Guid GrantId { get; set; }

    [BindProperty]
    public AddGrantParameterCriterionDto Input { get; set; } = new();

    public GrantParameterCriteriaDto Data { get; private set; } = new();

    public string? ErrorMessage { get; private set; }

    public async Task OnGetAsync()
    {
        Data = await _service.GetAsync(GrantId);
    }

    public async Task<IActionResult> OnPostAddAsync()
    {
        Input.GrantId = GrantId;
        try
        {
            await _service.AddAsync(Input);
        }
        catch (BusinessException ex) when (ex.Code?.StartsWith("Platform:GrantCriterion:") == true)
        {
            ErrorMessage = FirmParameterErrors.Localize(L, ex);
            Data = await _service.GetAsync(GrantId);
            return Page();
        }

        return RedirectToPage(new { grantId = GrantId });
    }

    public async Task<IActionResult> OnPostDeleteAsync(Guid id)
    {
        await _service.DeleteAsync(id);
        return RedirectToPage(new { grantId = GrantId });
    }
}
