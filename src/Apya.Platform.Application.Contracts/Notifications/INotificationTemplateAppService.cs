using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Notifications;

/// <summary>Faz 4 · Host: hibe dışı bildirimlerin (Görev, Proje, Finans) metni ve aç/kapa.</summary>
public interface INotificationTemplateAppService : IApplicationService
{
    Task<NotificationTemplateConsoleDto> GetAsync();

    Task<NotificationTemplateConsoleDto> SaveAsync(SaveNotificationTemplateInput input);
}
