using System;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Documents;

/// <summary>
/// Doküman yönetimi: meta şema, kural motoru, şablon galerisi, entegrasyonlar,
/// alan bazlı izinler ve konsolide rapor.
///
/// Documents modülünün diğer sayfalarıyla aynı desen — handler'lar app service'e
/// ince bir köprü, yetki AppService üzerindeki [Authorize] ile uygulanır.
/// </summary>
[Authorize(PlatformPermissions.Documents.Administer)]
public class AdminModel : AbpPageModel
{
    private readonly IDocumentAdminAppService _adminAppService;
    private readonly IDocumentTypeAppService _typeAppService;
    private readonly IReportTemplateAppService _templateAppService;

    public AdminModel(
        IDocumentAdminAppService adminAppService,
        IDocumentTypeAppService typeAppService,
        IReportTemplateAppService templateAppService)
    {
        _adminAppService = adminAppService;
        _typeAppService = typeAppService;
        _templateAppService = templateAppService;
    }

    public void OnGet()
    {
    }

    /* ─── Meta şema ───────────────────────────────────────────────────── */

    public async Task<IActionResult> OnGetTypesAsync()
        => new JsonResult(await _typeAppService.GetListAsync());

    public async Task<IActionResult> OnPostCreateTypeAsync([FromBody] CreateUpdateDocumentTypeDto input)
        => new JsonResult(await _adminAppService.CreateTypeAsync(input));

    public async Task<IActionResult> OnPostUpdateTypeAsync(Guid id, [FromBody] CreateUpdateDocumentTypeDto input)
        => new JsonResult(await _adminAppService.UpdateTypeAsync(id, input));

    public async Task<IActionResult> OnPostDeleteTypeAsync(Guid id)
    {
        await _adminAppService.DeleteTypeAsync(id);
        return NoContent();
    }

    public async Task<IActionResult> OnPostCreateFieldAsync([FromBody] CreateUpdateDocumentTypeFieldDto input)
        => new JsonResult(await _adminAppService.CreateFieldAsync(input));

    public async Task<IActionResult> OnPostUpdateFieldAsync(Guid id, [FromBody] CreateUpdateDocumentTypeFieldDto input)
        => new JsonResult(await _adminAppService.UpdateFieldAsync(id, input));

    public async Task<IActionResult> OnPostDeleteFieldAsync(Guid id)
    {
        await _adminAppService.DeleteFieldAsync(id);
        return NoContent();
    }

    /* ─── Kural motoru ────────────────────────────────────────────────── */

    public async Task<IActionResult> OnGetRulesAsync()
        => new JsonResult(await _adminAppService.GetRulesAsync());

    public async Task<IActionResult> OnPostCreateRuleAsync([FromBody] CreateUpdateDocumentRuleDto input)
        => new JsonResult(await _adminAppService.CreateRuleAsync(input));

    public async Task<IActionResult> OnPostUpdateRuleAsync(Guid id, [FromBody] CreateUpdateDocumentRuleDto input)
        => new JsonResult(await _adminAppService.UpdateRuleAsync(id, input));

    public async Task<IActionResult> OnPostDeleteRuleAsync(Guid id)
    {
        await _adminAppService.DeleteRuleAsync(id);
        return NoContent();
    }

    public async Task<IActionResult> OnPostSetRuleEnabledAsync(Guid id, bool isEnabled)
        => new JsonResult(await _adminAppService.SetRuleEnabledAsync(id, isEnabled));

    /// <summary>Kuru çalıştırma — hiçbir belge değişmez.</summary>
    public async Task<IActionResult> OnPostDryRunAsync(Guid ruleId)
        => new JsonResult(await _adminAppService.DryRunAsync(ruleId));

    public async Task<IActionResult> OnPostRunRuleAsync(Guid ruleId)
        => new JsonResult(await _adminAppService.RunAsync(ruleId));

    /* ─── Alan bazlı izinler ──────────────────────────────────────────── */

    public async Task<IActionResult> OnGetFieldPermissionsAsync(Guid documentTypeId)
        => new JsonResult(await _adminAppService.GetFieldPermissionMatrixAsync(documentTypeId));

    public async Task<IActionResult> OnPostSetFieldPermissionAsync([FromBody] SetFieldPermissionDto input)
    {
        await _adminAppService.SetFieldPermissionAsync(input);
        return NoContent();
    }

    /* ─── Entegrasyonlar ──────────────────────────────────────────────── */

    public async Task<IActionResult> OnGetIntegrationsAsync()
        => new JsonResult(await _adminAppService.GetIntegrationsAsync());

    public async Task<IActionResult> OnPostSaveIntegrationAsync(
        Guid? id, [FromBody] CreateUpdateDocumentIntegrationDto input)
        => new JsonResult(await _adminAppService.SaveIntegrationAsync(id, input));

    public async Task<IActionResult> OnPostDeleteIntegrationAsync(Guid id)
    {
        await _adminAppService.DeleteIntegrationAsync(id);
        return NoContent();
    }

    /* ─── Şablon galerisi + konsolide rapor ───────────────────────────── */

    public async Task<IActionResult> OnGetTemplatesAsync()
        => new JsonResult(await _templateAppService.GetListAsync());

    public async Task<IActionResult> OnGetConsolidatedAsync()
        => new JsonResult(await _adminAppService.GetConsolidatedReportAsync());
}
