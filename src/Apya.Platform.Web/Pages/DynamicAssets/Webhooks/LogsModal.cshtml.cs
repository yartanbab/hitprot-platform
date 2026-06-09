using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.DynamicAssets.Webhooks;
using Apya.Platform.DynamicAssets.Webhooks.Dtos;

namespace Apya.Platform.Web.Pages.DynamicAssets.Webhooks;

[Authorize]
public class LogsModalModel : AbpPageModel
{
    private readonly IWebhookSubscriptionAppService _webhookAppService;

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public List<WebhookDeliveryLogDto> Logs { get; set; } = new();

    public LogsModalModel(IWebhookSubscriptionAppService webhookAppService)
    {
        _webhookAppService = webhookAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync()
    {
        Logs = await _webhookAppService.GetDeliveryLogsAsync(Id);
        return Page();
    }
}
