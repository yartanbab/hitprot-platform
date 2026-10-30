using System;
using System.Threading.Tasks;
using Apya.Platform.Grants.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Grants;

/// <summary>6d · Host: Bildirim ve e-posta şablonları.</summary>
public interface IGrantNotificationTemplateAppService : IApplicationService
{
    Task<GrantNotificationConsoleDto> GetAsync();

    Task<GrantNotificationConsoleDto> SaveAsync(SaveGrantNotificationTemplateInput input);

    /// <summary>Genel şablonu bir role kopyalar; o roldeki alıcılar artık kopyanın metnini alır.</summary>
    Task<GrantNotificationConsoleDto> DuplicateAsync(DuplicateGrantNotificationTemplateInput input);

    /// <summary>Rol şablonunu siler; o roldeki alıcılar yeniden Genel şablonu alır. Genel şablon silinemez.</summary>
    Task<GrantNotificationConsoleDto> DeleteAsync(Guid id);
}
