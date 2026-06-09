using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.DynamicAssets.Webhooks;
using Apya.Platform.DynamicAssets.Webhooks.Dtos;
using Apya.Platform.Permissions;

namespace Apya.Platform.Web.Pages.DynamicAssets.Webhooks;

[Authorize(PlatformPermissions.DynamicAssets.Edit)]
public class EditModalModel : AbpPageModel
{
    private readonly IWebhookSubscriptionAppService _webhookAppService;

    [HiddenInput]
    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    [BindProperty]
    public CreateUpdateWebhookSubscriptionDto Subscription { get; set; } = new();

    public EditModalModel(IWebhookSubscriptionAppService webhookAppService)
    {
        _webhookAppService = webhookAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        var dto = await _webhookAppService.GetAsync(Id);
        Subscription = new CreateUpdateWebhookSubscriptionDto
        {
            DocumentId = dto.DocumentId,
            TargetUrl = dto.TargetUrl,
            IsActive = dto.IsActive
            // Secret güvenlik gereği okunamaz; düzenlemede yeniden girilmelidir.
        };
        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _webhookAppService.UpdateAsync(Id, Subscription);
        return NoContent();
    }
}
