using Microsoft.AspNetCore.Authorization;
using Volo.Abp.AspNetCore.SignalR;

namespace Apya.Platform.Web.Hubs;

[Authorize]
public class NotificationHub : AbpHub
{
    // Hub metotları buraya eklenebilir. 
    // Ancak push-only yapacağımız için genellikle metotta işimiz yok.
}
