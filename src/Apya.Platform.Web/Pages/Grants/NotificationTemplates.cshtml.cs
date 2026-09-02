using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 6d · Host: Bildirim ve E-posta Şablonları.
///
/// <para>Yalnız host görür; servis kiracı bağlamında ayrıca yetki hatası verir
/// (izin kapısı tek başına yetmez, kiracı yöneticisi de Grants.Edit taşıyabilir).</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class NotificationTemplatesModel : PlatformPageModel
{
}
