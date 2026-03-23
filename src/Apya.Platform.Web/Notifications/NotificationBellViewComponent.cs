using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc;
using Apya.Platform.Notifications;
using Volo.Abp.Users;

namespace Apya.Platform.Web.Notifications;

public class NotificationBellViewComponent : AbpViewComponent
{
    protected INotificationAppService NotificationAppService { get; }
    protected ICurrentUser CurrentUser { get; }

    public NotificationBellViewComponent(
        INotificationAppService notificationAppService,
        ICurrentUser currentUser)
    {
        NotificationAppService = notificationAppService;
        CurrentUser = currentUser;
    }

    public async Task<IViewComponentResult> InvokeAsync()
    {
        if (!CurrentUser.IsAuthenticated)
        {
            return View(0);
        }

        var unreadCount = await NotificationAppService.GetUnreadCountAsync();
        return View(unreadCount);
    }
}
