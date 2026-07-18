using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Pages;

namespace Apya.Platform.Web.Pages.DynamicAssets;

[Authorize(PlatformPermissions.DynamicAssets.ViewResponses)]
public class ResponsesModel : PlatformPageModel
{
    private readonly IFormAppService _formAppService;
    private readonly IResponseManagementAppService _responseManagementAppService;

    public Guid FormId { get; set; }

    public ResponsesModel(
        IFormAppService formAppService,
        IResponseManagementAppService responseManagementAppService)
    {
        _formAppService = formAppService;
        _responseManagementAppService = responseManagementAppService;
    }

    public void OnGet(Guid formId)
    {
        FormId = formId;
    }

    public virtual async Task<IActionResult> OnGetExcelAsync(Guid formId, ResponseStatus? status)
    {
        if (!await AuthorizationService.IsGrantedAsync(PlatformPermissions.DynamicAssets.Export))
        {
            return Forbid();
        }

        var form = await _formAppService.GetAsync(formId);
        var responses = await _responseManagementAppService.GetListAsync(new ResponseListFilterDto
        {
            DocumentId = formId,
            Status = status,
            MaxResultCount = 1000
        });

        var bytes = Apya.Platform.Web.Pages.Reports.ReportExporter.FormResponsesToExcel(form, responses.Items.ToList());
        return File(
            bytes,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"{Slugify(form.Title)}-yanitlar.xlsx");
    }

    private static string Slugify(string title)
    {
        var cleaned = new string(title.Trim().ToLowerInvariant().Select(c => char.IsLetterOrDigit(c) ? c : '-').ToArray());
        while (cleaned.Contains("--")) cleaned = cleaned.Replace("--", "-");
        cleaned = cleaned.Trim('-');
        return cleaned.Length > 0 ? cleaned : "form";
    }
}
