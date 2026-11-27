using System;
using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Grants;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;
using Apya.Platform.Web.Pages.TenantManagement.Tenants;

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

    /// <summary>22b · Talepler'den gelinen talep; listede seçili açılır. Yoksa ilk talep seçilir.</summary>
    [BindProperty(SupportsGet = true)]
    public Guid? Id { get; set; }

    // "Müşteri olarak aç" formunun seçenekleri. Değerler SAYI: JS vekili enum'u sayıyla gönderir.

    /// <summary>Standart seçili gelir: Basic'te hibe modülü kapalı.</summary>
    public List<SelectListItem> PackageOptions { get; } = Enum.GetValues<PackageCode>()
        .Select(code => new SelectListItem(code.ToString(), ((int)code).ToString(), code == PackageCode.Standard))
        .ToList();

    /// <summary>"Yeni Müşteri" modalıyla aynı etiketler; ilk seçenek (Süresiz) seçili gelir.</summary>
    public List<SelectListItem> PeriodOptions { get; } = SubscriptionPeriodOptions.Build()
        .Select(o => new SelectListItem(o.Text, ((int)Enum.Parse<SubscriptionPeriod>(o.Value)).ToString()))
        .ToList();
}
