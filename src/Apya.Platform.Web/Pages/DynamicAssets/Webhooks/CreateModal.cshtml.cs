using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.DynamicAssets.Webhooks;
using Apya.Platform.DynamicAssets.Webhooks.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.DynamicAssets.Webhooks;

[Authorize(PlatformPermissions.DynamicAssets.Create)]
public class CreateModalModel : AbpPageModel
{
    private readonly IWebhookSubscriptionAppService _webhookAppService;
    private readonly IFormAppService _formAppService;

    [BindProperty]
    public CreateUpdateWebhookSubscriptionDto Subscription { get; set; } = new();

    public List<SelectListItem> Forms { get; set; } = new();

    public CreateModalModel(
        IWebhookSubscriptionAppService webhookAppService,
        IFormAppService formAppService)
    {
        _webhookAppService = webhookAppService;
        _formAppService = formAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        await LoadFormsAsync();
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _webhookAppService.CreateAsync(Subscription);
        return NoContent();
    }

    private async Task LoadFormsAsync()
    {
        var forms = await _formAppService.GetListAsync(
            new FormListFilterDto { MaxResultCount = 1000 });
        Forms = forms.Items
            .Select(f => new SelectListItem(f.Title, f.Id.ToString()))
            .ToList();
    }
}
