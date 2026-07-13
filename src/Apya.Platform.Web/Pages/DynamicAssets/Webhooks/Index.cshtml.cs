using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.DynamicAssets.Webhooks;

// OnGetAsync, izin gerektiren IFormAppService.GetListAsync'i ([Authorize(DynamicAssets.Default)])
// çağırıyor. Page-level [Authorize] olmadan yetkisiz/anonim istek (dev'de) 500'e düşüyordu;
// bununla auth middleware'de temiz 302 (login) / 403 döner.
[Authorize(PlatformPermissions.DynamicAssets.Default)]
public class IndexModel : AbpPageModel
{
    private readonly IFormAppService _formAppService;

    /// <summary>DocumentId -> Form başlığı eşlemesi (tabloda dostça ad göstermek için).</summary>
    public Dictionary<string, string> FormNames { get; set; } = new();

    public IndexModel(IFormAppService formAppService)
    {
        _formAppService = formAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        var forms = await _formAppService.GetListAsync(
            new FormListFilterDto { MaxResultCount = 1000 });
        foreach (var f in forms.Items)
        {
            FormNames[f.Id.ToString()] = f.Title;
        }
        return Page();
    }
}
