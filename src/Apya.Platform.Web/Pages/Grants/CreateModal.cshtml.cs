using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;

namespace Apya.Platform.Web.Pages.Grants;

public class CreateModalModel : AbpPageModel
{
    private readonly IGrantAppService _grantAppService;

    [BindProperty]
    public CreateUpdateGrantDto Grant { get; set; } = new();

    public CreateModalModel(IGrantAppService grantAppService)
    {
        _grantAppService = grantAppService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostAsync()
    {
        await _grantAppService.CreateAsync(Grant);
        return NoContent();
    }
}
