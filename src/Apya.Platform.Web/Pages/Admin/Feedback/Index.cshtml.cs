using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks;
using Apya.Platform.Feedbacks.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Feedbacks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Web.Pages.Reports;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Volo.Abp.Domain.Entities;
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
    private readonly FeedbackFileStorage _fileStorage;

    public List<TenantOption> Tenants { get; set; } = new();

    public IndexModel(
        IFeedbackAdminAppService feedbackAdminAppService,
        ITenantRepository tenantRepository,
        FeedbackFileStorage fileStorage)
    {
        _feedbackAdminAppService = feedbackAdminAppService;
        _tenantRepository = tenantRepository;
        _fileStorage = fileStorage;
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
    /// Ekran görüntüsünü sunar. Dosyalar wwwroot DIŞINDA (FeedbackFileStorage);
    /// erişim feedbackId üzerinden AppService'te çözülür — ham dosya adı URL'de taşınmaz.
    /// </summary>
    public async Task<IActionResult> OnGetScreenshotAsync(Guid feedbackId)
    {
        return await ServeAsync(() => _feedbackAdminAppService.GetScreenshotFileAsync(feedbackId));
    }

    /// <summary>Ek dosyayı sunar (host).</summary>
    public async Task<IActionResult> OnGetAttachmentAsync(Guid attachmentId)
    {
        return await ServeAsync(() => _feedbackAdminAppService.GetAttachmentFileAsync(attachmentId));
    }

    private async Task<IActionResult> ServeAsync(Func<Task<FeedbackAttachmentFileDto>> resolver)
    {
        FeedbackAttachmentFileDto file;
        try
        {
            file = await resolver();
        }
        catch (EntityNotFoundException)
        {
            return NotFound();
        }

        var stream = _fileStorage.OpenRead(file.StoredFileName);
        if (stream is null)
        {
            return NotFound();
        }

        var contentType = file.ContentType ?? FeedbackFileStorage.GetContentType(file.StoredFileName);
        return File(stream, contentType, file.FileName);
    }

    public record TenantOption(Guid Id, string Name);
}
