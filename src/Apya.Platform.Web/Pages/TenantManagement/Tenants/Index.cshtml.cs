using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Tenants;
using Apya.Platform.Web.Export;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.Application.Dtos;
using Volo.Abp.TenantManagement;
using Microsoft.AspNetCore.Authorization;

namespace Apya.Platform.Web.Pages.TenantManagement.Tenants;

[Authorize(TenantManagementPermissions.Tenants.Default)]
public class IndexModel : PlatformPageModel
{
    public virtual Task<IActionResult> OnGetAsync()
    {
        return Task.FromResult<IActionResult>(Page());
    }

    /// <summary>Kiracılar (.xlsx), ada göre sıralı. Ekrandaki tabloyla aynı uçtan (TenantProfile.GetList) okunur.</summary>
    public async Task<IActionResult> OnGetExcelAsync([FromServices] ITenantProfileAppService tenantProfiles)
    {
        var rows = await ExcelTable.CollectAsync((skip, take) => tenantProfiles.GetListAsync(
            new PagedAndSortedResultRequestDto { SkipCount = skip, MaxResultCount = take }));

        var columns = new List<ExcelColumn<TenantProfileDto>>
        {
            new(L["Export:Col:Name"], t => t.TenantName),
            new(L["Export:Col:Status"], t => L[t.IsActive ? "Export:Active" : "Export:Passive"].Value),
            new(L["Export:Col:Plan"], t => t.PackageCode.ToString()),
            new(L["Export:Col:EndDate"], t => t.SubscriptionEndDate, "dd.MM.yyyy"),
            new(L["Export:Col:LegalName"], t => t.LegalName),
            new(L["Export:Col:CompanyType"], t => Enum.IsDefined(t.CompanyType)
                ? L[$"RegistrationRequest:CompanyType:{t.CompanyType}"].Value
                : null),
            new(L["Export:Col:TaxNumber"], t => t.TaxNumber),
            new(L["Export:Col:TaxOffice"], t => t.TaxOffice),
            new(L["Export:Col:Email"], t => t.CorporateEmail),
            new(L["Export:Col:LegalRepresentative"], t => t.LegalRepresentativeName),
            new(L["Export:Col:Phone"], t => t.LegalRepresentativePhone),
            new(L["Export:Col:OperationalContact"], t => t.OperationalContactName),
            new(L["Export:Col:Address"], t => t.Address),
        };

        var name = L["Export:Tenants:Name"].Value;
        var note = rows.Truncated ? L["Export:Truncated", ExcelTable.MaxRows].Value : null;
        var ordered = rows.Items.OrderBy(t => t.TenantName, StringComparer.Create(new System.Globalization.CultureInfo("tr-TR"), true));
        return File(ExcelTable.Build(name, columns, ordered, note), ExcelTable.ContentType, ExcelTable.FileName(name, Clock.Now));
    }
}
