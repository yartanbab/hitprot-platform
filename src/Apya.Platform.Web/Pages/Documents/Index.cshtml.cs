using System;
using System.IO;
using System.Threading.Tasks;
using Apya.Platform.Storage;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Apya.Platform.Projects;
using Apya.Platform.Web.Services;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Documents;

[Authorize(PlatformPermissions.Documents.Default)]
public class IndexModel : AbpPageModel
{
    private readonly IDocumentAppService _documentAppService;
    private readonly IDocumentFileAppService _documentFileAppService;
    private readonly IDocumentTypeAppService _documentTypeAppService;
    private readonly IProjectWorkStepAppService _workStepAppService;
    private readonly IComplianceAppService _complianceAppService;
    private readonly IDocumentActivityAppService _documentActivityAppService;
    private readonly IUploadedFileStorage _fileStorage;
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;

    public IndexModel(
        IDocumentAppService documentAppService,
        IDocumentFileAppService documentFileAppService,
        IDocumentTypeAppService documentTypeAppService,
        IProjectWorkStepAppService workStepAppService,
        IComplianceAppService complianceAppService,
        IDocumentActivityAppService documentActivityAppService,
        IUploadedFileStorage fileStorage,
        IUploadedFileRootFolderProvider rootFolderProvider)
    {
        _documentAppService = documentAppService;
        _documentFileAppService = documentFileAppService;
        _documentTypeAppService = documentTypeAppService;
        _workStepAppService = workStepAppService;
        _complianceAppService = complianceAppService;
        _documentActivityAppService = documentActivityAppService;
        _fileStorage = fileStorage;
        _rootFolderProvider = rootFolderProvider;
    }

    public void OnGet()
    {
    }

    /* ─── Belge (DocumentFile) uçları ─────────────────────────────────────
       Dinamik ABP proxy'si yerine Razor handler: modülün mevcut deseni bu
       (bkz. dosya başındaki ek/indirme handler'ları). Yetkilendirme yine
       AppService üzerindeki [Authorize] ile uygulanır — buradan geçmek
       izin kontrolünü atlamaz. */

    public async Task<IActionResult> OnGetFilesAsync([FromQuery] GetDocumentFilesInput input)
    {
        var result = await _documentFileAppService.GetListAsync(input);
        return new JsonResult(result);
    }

    public async Task<IActionResult> OnGetFileAsync(Guid id)
    {
        var file = await _documentFileAppService.GetAsync(id);
        return new JsonResult(file);
    }

    public async Task<IActionResult> OnPostUpdateFileMetaAsync(Guid id, [FromBody] UpdateDocumentFileMetaDto input)
    {
        var file = await _documentFileAppService.UpdateMetaAsync(id, input);
        return new JsonResult(file);
    }

    public async Task<IActionResult> OnPostMoveFileAsync(Guid id, Guid targetDocumentId)
    {
        var file = await _documentFileAppService.MoveAsync(id, targetDocumentId);
        return new JsonResult(file);
    }

    public async Task<IActionResult> OnPostBulkMoveAsync([FromBody] BulkMoveDocumentFilesDto input)
    {
        await _documentFileAppService.BulkMoveAsync(input);
        return NoContent();
    }

    public async Task<IActionResult> OnPostBulkTagAsync([FromBody] BulkTagDocumentFilesDto input)
    {
        await _documentFileAppService.BulkTagAsync(input);
        return NoContent();
    }

    public async Task<IActionResult> OnPostDeleteFileAsync(Guid id)
    {
        await _documentFileAppService.DeleteAsync(id);
        return NoContent();
    }

    public async Task<IActionResult> OnGetDocumentTypesAsync()
    {
        var types = await _documentTypeAppService.GetListAsync();
        return new JsonResult(types);
    }

    public async Task<IActionResult> OnGetWorkStepsAsync(Guid? projectId)
    {
        var steps = await _workStepAppService.GetListAsync(projectId);
        return new JsonResult(steps);
    }

    public async Task<IActionResult> OnGetTagListAsync()
    {
        var tags = await _documentFileAppService.GetTagsAsync();
        return new JsonResult(tags);
    }

    /* ─── Uygunluk (Faz B) ─────────────────────────────────────────────── */

    public async Task<IActionResult> OnGetCompliancePackagesAsync(Guid? projectId)
    {
        var packages = await _complianceAppService.GetPackagesAsync(projectId);
        return new JsonResult(packages);
    }

    public async Task<IActionResult> OnGetComplianceOverviewAsync(Guid projectId, string? periodCode)
    {
        var overview = await _complianceAppService.GetOverviewAsync(projectId, periodCode);
        return new JsonResult(overview);
    }

    public async Task<IActionResult> OnPostApplyCompliancePackageAsync([FromBody] ApplyCompliancePackageDto input)
    {
        var checklist = await _complianceAppService.ApplyPackageAsync(input);
        return new JsonResult(checklist);
    }

    public async Task<IActionResult> OnPostRemoveComplianceAssignmentAsync(Guid assignmentId)
    {
        await _complianceAppService.RemoveAssignmentAsync(assignmentId);
        return NoContent();
    }

    public async Task<IActionResult> OnPostWaiveComplianceItemAsync([FromBody] WaiveComplianceItemDto input)
    {
        var item = await _complianceAppService.WaiveItemAsync(input);
        return new JsonResult(item);
    }

    public async Task<IActionResult> OnPostLinkComplianceDocumentAsync([FromBody] LinkComplianceDocumentDto input)
    {
        var item = await _complianceAppService.LinkDocumentAsync(input);
        return new JsonResult(item);
    }

    /* ─── Etkinlik / denetim izi (Faz B) ───────────────────────────────── */

    public async Task<IActionResult> OnGetActivityAsync([FromQuery] GetDocumentActivityInput input)
    {
        var result = await _documentActivityAppService.GetListAsync(input);
        return new JsonResult(result);
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
