using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Notifications;

/// <summary>
/// NTF-08 · Kullanıcının bildirim cihazları (tarayıcı bildirimi abonelikleri). Kullanıcı YALNIZ
/// kendi cihazına dokunur.
/// </summary>
public interface INotificationDeviceAppService : IApplicationService
{
    Task<WebPushConfigDto> GetWebPushConfigAsync();

    /// <summary>Aboneliği kaydeder; aynı adres zaten kayıtlıysa anahtarlarını yeniler.</summary>
    Task<NotificationDeviceDto> SubscribeWebPushAsync(RegisterWebPushInput input);

    /// <summary>Adresle aboneliği kaldırır — çıkışta ve tarayıcı aboneliği yenilediğinde.</summary>
    Task UnsubscribeWebPushAsync(UnsubscribeWebPushInput input);

    Task<List<NotificationDeviceDto>> GetListAsync();

    Task DeleteAsync(Guid id);
}
