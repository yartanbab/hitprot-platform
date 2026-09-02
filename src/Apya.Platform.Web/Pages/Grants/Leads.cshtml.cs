using Apya.Platform.Grants;
using Microsoft.AspNetCore.Authorization;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 5a · Host: Ön Değerlendirme Talepleri (lead kutusu).
///
/// <para>Yalnız host görür; servis kiracı bağlamında ayrıca yetki hatası verir.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Edit)]
public class LeadsModel : PlatformPageModel
{
    /// <summary>
    /// Isı eşiği KPI etiketinde geçiyor. Sunucudan verilir ki ilk boyamada da
    /// doğru yazsın; anahtar {0} taşıdığı için argümansız çağrılırsa Razor
    /// FormatException ile sayfayı komple düşürür.
    /// </summary>
    public int QualifiedThreshold => GrantLeadHeatCalculator.QualifiedThreshold;
}
