using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>6d · Host: Bildirim ve e-posta şablonları.</summary>
public interface IGrantNotificationTemplateAppService : IApplicationService
{
    Task<GrantNotificationConsoleDto> GetAsync();

    Task<GrantNotificationConsoleDto> SaveAsync(SaveGrantNotificationTemplateInput input);
}
