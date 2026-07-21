using Microsoft.AspNetCore.Authorization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Pages.PackageManagement;

[Authorize(TenantManagementPermissions.Tenants.Update)]
public class IndexModel : AbpPageModel
{
}
