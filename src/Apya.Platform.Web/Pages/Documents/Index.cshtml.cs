using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Documents;
using Apya.Platform.Web.Services;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Documents;

public class IndexModel : AbpPageModel
{
    private readonly IDocumentAppService _documentAppService;
    private readonly IUploadedFileStorage _fileStorage;

    public IndexModel(IDocumentAppService documentAppService, IUploadedFileStorage fileStorage)
    {
        _documentAppService = documentAppService;
        _fileStorage = fileStorage;
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

    public async Task<IActionResult> OnGetAttachmentsAsync(Guid documentId)
    {
        var attachments = await _documentAppService.GetAttachmentsAsync(documentId);
        return new JsonResult(attachments);
    }

    public async Task<IActionResult> OnPostDeleteAttachmentAsync(Guid attachmentId)
    {
        await _documentAppService.DeleteAttachmentAsync(attachmentId);
        return NoContent();
    }
}
