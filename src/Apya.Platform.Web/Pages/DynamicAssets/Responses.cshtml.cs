using System;
using System.Collections.Generic;
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

        // Tek istek ABP tarafında 1000 kayıtla sınırlı — export'un eksiksiz olması
        // için TotalCount'a ulaşana dek sayfalanır; aksi halde 1000+ yanıtlı formda
        // Excel sessizce eksik inerdi.
        var allResponses = new List<ResponseListItemDto>();
        const int pageSize = 1000;
        long totalCount;
        do
        {
            var page = await _responseManagementAppService.GetListAsync(new ResponseListFilterDto
            {
                DocumentId = formId,
                Status = status,
                SkipCount = allResponses.Count,
                MaxResultCount = pageSize
            });
            totalCount = page.TotalCount;
            if (page.Items.Count == 0)
            {
                break;
            }
            allResponses.AddRange(page.Items);
        } while (allResponses.Count < totalCount);

        var bytes = Apya.Platform.Web.Pages.Reports.ReportExporter.FormResponsesToExcel(form, allResponses);
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
