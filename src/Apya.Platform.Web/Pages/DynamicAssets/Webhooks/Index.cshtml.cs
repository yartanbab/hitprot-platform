using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;

namespace Apya.Platform.Web.Pages.DynamicAssets.Webhooks;

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
