using Microsoft.AspNetCore.Authorization;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Pages.DesignSystem;

/// <summary>
/// Tasarım Sistemi (Styleguide) — canlı token referansı.
/// Sayfa hiçbir değeri KOPYALAMAZ; swatch/örnekler doğrudan --apya-* custom
/// property'lerini okur, böylece tokens.css değişince sayfa kendiliğinden
/// güncel kalır. Erişim Paket Yönetimi ile aynı kapıdan (host yöneticisi):
/// yeni permission tanımlamamak için bilinçli tercih.
/// </summary>
[Authorize(TenantManagementPermissions.Tenants.Update)]
public class IndexModel : PlatformPageModel
{
}
