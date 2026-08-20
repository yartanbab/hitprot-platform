using System;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Documents;

/// <summary>
/// Proje kapsami — proje > is adimi > belge/eksik kalem, kardes dalda gorevler.
///
/// Handler'lar AppService'e ince bir kopru; yetki AppService uzerindeki
/// [Authorize] ile uygulanir (handler metoduna konan [Authorize] ASP.NET Core
/// tarafindan SESSIZCE yok sayilir).
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class ScopeModel : AbpPageModel
{
    private readonly IProjectScopeAppService _scopeAppService;

    public ScopeModel(IProjectScopeAppService scopeAppService)
    {
        _scopeAppService = scopeAppService;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnGetOverviewAsync()
        => new JsonResult(await _scopeAppService.GetOverviewAsync());

    public async Task<IActionResult> OnGetBranchAsync(Guid projectId)
        => new JsonResult(await _scopeAppService.GetBranchAsync(projectId));
}
