using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Apya.Platform.Notifications;

namespace Apya.Platform.Web.Notifications;

public class NotificationBellViewComponent : AbpViewComponent
{
    protected INotificationAppService NotificationAppService { get; }

    public NotificationBellViewComponent(INotificationAppService notificationAppService)
    {
        NotificationAppService = notificationAppService;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        var unreadCount = await NotificationAppService.GetUnreadCountAsync();
        return View(unreadCount);
    }
}
