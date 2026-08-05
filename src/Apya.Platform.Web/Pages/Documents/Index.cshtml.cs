using System;
using System.IO;
using System.Threading.Tasks;
using Apya.Platform.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Services;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Documents;

[Authorize(PlatformPermissions.Documents.Default)]
public class IndexModel : AbpPageModel
{
    private readonly IDocumentAppService _documentAppService;
    private readonly IUploadedFileStorage _fileStorage;
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;

    public IndexModel(IDocumentAppService documentAppService, IUploadedFileStorage fileStorage, IUploadedFileRootFolderProvider rootFolderProvider)
    {
        _documentAppService = documentAppService;
        _fileStorage = fileStorage;
        _rootFolderProvider = rootFolderProvider;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostUploadFileAsync(Guid documentId, IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("Geçersiz veya boş dosya.");

        var storedFileName = await _fileStorage.StoreAsync(file);
        var attachment = await _documentAppService.AddAttachmentAsync(documentId, file.FileName, storedFileName, file.ContentType, file.Length);
        return new JsonResult(attachment);
    }

    public async Task<IActionResult> OnGetAttachmentsAsync(Guid documentId, bool includeHistory = false)
    {
        var attachments = await _documentAppService.GetAttachmentsAsync(documentId, includeHistory);
        return new JsonResult(attachments);
    }

    public async Task<IActionResult> OnPostDeleteAttachmentAsync(Guid attachmentId)
    {
        await _documentAppService.DeleteAttachmentAsync(attachmentId);
        return NoContent();
    }

    public async Task<IActionResult> OnGetAccessLogAsync(Guid documentId)
    {
        var logs = await _documentAppService.GetAccessLogAsync(documentId);
        return new JsonResult(logs);
    }

    public async Task<IActionResult> OnGetDownloadAttachmentAsync(Guid attachmentId)
    {
        // Tenant/izin doğrulaması + DocumentAccessLog(Downloaded) kaydı AppService içinde yapılır.
        var download = await _documentAppService.PrepareDownloadAsync(attachmentId);

        var resolvedPath = _rootFolderProvider.ResolveSafePath(download.StoredFileName);
        if (resolvedPath == null)
            return BadRequest("Geçersiz dosya adı.");

        if (!System.IO.File.Exists(resolvedPath))
            return NotFound();

        return PhysicalFile(resolvedPath, download.ContentType, download.FileName);
    }
}
