using System.Collections.Generic;
using Apya.Platform.Tenants;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Apya.Platform.Web.Pages.TenantManagement.Tenants;

/// <summary>
/// Abonelik süresi seçenekleri — Türkçe etiketler. Enum'un kendi adları ("Monthly")
/// ekranda anlamsız olduğu için <c>abp-select</c>'e hazır liste verilir.
/// </summary>
public static class SubscriptionPeriodOptions
{
    public static List<SelectListItem> Build() => new()
    {
        new SelectListItem("Süresiz", nameof(SubscriptionPeriod.Unlimited)),
        new SelectListItem("1 Ay", nameof(SubscriptionPeriod.Monthly)),
        new SelectListItem("3 Ay", nameof(SubscriptionPeriod.Quarterly)),
        new SelectListItem("6 Ay", nameof(SubscriptionPeriod.SemiAnnual)),
        new SelectListItem("1 Yıl", nameof(SubscriptionPeriod.Annual))
    };
}
