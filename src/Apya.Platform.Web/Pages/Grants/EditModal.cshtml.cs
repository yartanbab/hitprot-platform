using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Web.Pages.Grants;

public class EditModalModel : AbpPageModel
{
    private readonly IGrantAppService _grantAppService;

    [HiddenInput]
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    [BindProperty]
    public CreateUpdateGrantDto Grant { get; set; } = new();

    public EditModalModel(IGrantAppService grantAppService)
    {
        _grantAppService = grantAppService;
    }

    public async Task OnGetAsync()
    {
        var dto = await _grantAppService.GetAsync(Id);
        Grant = new CreateUpdateGrantDto
        {
            Name          = dto.Name,
            Issuer        = dto.Issuer,
            Description   = dto.Description,
            MaxAmount     = dto.MaxAmount,
            MinMatchScore = dto.MinMatchScore
        };
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _grantAppService.UpdateAsync(Id, Grant);
        return NoContent();
    }
}
