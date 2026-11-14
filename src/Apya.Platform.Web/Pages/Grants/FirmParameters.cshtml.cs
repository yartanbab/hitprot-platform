using System;
using System.Collections.Generic;
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
/// Kurum Parametreleri — kurumlardan istenen bilgilerin kataloğu. <c>Grants.Edit</c> tanım
/// gereği host'a özgüdür; sayfa yalnız host'ta açılır.
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class FirmParametersModel : AbpPageModel
{
    private readonly IFirmParameterAdminAppService _service;

    public FirmParametersModel(IFirmParameterAdminAppService service)
    {
        _service = service;
    }

    public List<FirmParameterDefinitionDto> Definitions { get; private set; } = new();

    public string? ErrorMessage { get; private set; }

    public async Task OnGetAsync()
    {
        Definitions = await _service.GetListAsync();
    }

    public async Task<IActionResult> OnPostDeleteAsync(Guid id)
    {
        try
        {
            await _service.DeleteAsync(id);
        }
        catch (BusinessException ex) when (ex.Code?.StartsWith("Platform:FirmParameter:") == true)
        {
            ErrorMessage = FirmParameterErrors.Localize(L, ex);
            Definitions = await _service.GetListAsync();
            return Page();
        }

        TempData["FirmParamsMessage"] = L["FirmParams:Deleted"].Value;
        return RedirectToPage();
    }
}
