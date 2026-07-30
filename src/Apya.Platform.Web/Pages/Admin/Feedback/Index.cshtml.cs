using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Web.Pages.Reports;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.TenantManagement;

namespace Apya.Platform.Web.Pages.Admin.Feedback;

/// <summary>
/// Host'un tüm tenant'lardan gelen geri bildirim havuzu. Yalnızca host bağlamında
/// anlamlıdır (IFeedbackAdminAppService kendi içinde host kontrolü yapar).
/// </summary>
[Authorize(PlatformPermissions.Feedbacks.Default)]
public class IndexModel : AbpPageModel
{
    private readonly IFeedbackAdminAppService _feedbackAdminAppService;
    private readonly ITenantRepository _tenantRepository;
    private readonly IWebHostEnvironment _environment;

    public List<TenantOption> Tenants { get; set; } = new();

    public IndexModel(
        IFeedbackAdminAppService feedbackAdminAppService,
        ITenantRepository tenantRepository,
        IWebHostEnvironment environment)
    {
        _feedbackAdminAppService = feedbackAdminAppService;
        _tenantRepository = tenantRepository;
        _environment = environment;
    }

    public async Task OnGetAsync()
    {
        var tenants = await _tenantRepository.GetListAsync();
        Tenants = tenants.ConvertAll(t => new TenantOption(t.Id, t.Name));
    }

    public async Task<IActionResult> OnGetExcelAsync(
        FeedbackType? type, FeedbackStatus? status, FeedbackPriority? priority,
        Guid? tenantId, string? filter, bool? onlyUnanswered)
    {
        // MaxResultCount kasıtlı olarak set edilmiyor: GetAllForExportAsync onu kullanmıyor,
        // kendi içindeki MaxExportRows (10.000) sınırını uyguluyor. int.MaxValue geçmek
        // ABP'nin LimitedResultRequestDto doğrulamasını (üst sınır 1000) ihlal ederdi.
        var items = await _feedbackAdminAppService.GetAllForExportAsync(new GetFeedbackListInput
        {
            Type = type,
            Status = status,
            Priority = priority,
            TenantId = tenantId,
            Filter = filter,
            OnlyUnanswered = onlyUnanswered
        });

        var bytes = ReportExporter.FeedbackListToExcel(items);
        return File(bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "GeriBildirimler.xlsx");
    }

    /// <summary>
    /// Ekran görüntüsünü sunar. Yol geçişi (path traversal) koruması Documents
    /// sayfasındaki desenle aynı — dosya adı GUID olduğundan tahmin edilemez,
    /// ama yine de yalnızca "uploads" klasörü altına çözülmesi zorunlu kılınır.
    /// </summary>
    public IActionResult OnGetScreenshotAsync(string fileName)
    {
        var uploadsRoot = Path.GetFullPath(Path.Combine(_environment.WebRootPath, "uploads"));
        var safeFileName = Path.GetFileName(fileName);
        var resolvedPath = Path.GetFullPath(Path.Combine(uploadsRoot, safeFileName));

        if (string.IsNullOrEmpty(safeFileName) || !resolvedPath.StartsWith(uploadsRoot + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest("Geçersiz dosya adı.");
        }

        if (!System.IO.File.Exists(resolvedPath))
        {
            return NotFound();
        }

        var ext = Path.GetExtension(resolvedPath).ToLowerInvariant();
        var contentType = ext switch
        {
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".gif" => "image/gif",
            _ => "application/octet-stream"
        };

        return PhysicalFile(resolvedPath, contentType);
    }

    public record TenantOption(Guid Id, string Name);
}
