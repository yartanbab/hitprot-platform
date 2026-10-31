using Apya.Platform.Web.Pages;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Pages.Notifications;

/// <summary>
/// Faz 4 · Host: hibe dışı bildirimlerin (Görev, Proje, Finans) metni ve aç/kapa. Hibe şablonları kendi
/// ekranındadır (<c>/Grants/NotificationTemplates</c>); bu ekran oraya bağlantı verir.
/// </summary>
[Authorize(TenantManagementPermissions.Tenants.Update)]
public class TemplatesModel : PlatformPageModel
{
}
