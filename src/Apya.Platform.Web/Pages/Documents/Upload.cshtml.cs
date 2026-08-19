using System;
using System.Threading.Tasks;
using Apya.Platform.Documents;
using Apya.Platform.Permissions;
using Apya.Platform.Web.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace Apya.Platform.Web.Pages.Documents;

/// <summary>
/// Yükleme kuyruğu. Sıra ve ilerleme İSTEMCİDE yönetilir: her dosya ayrı bir
/// isteğe gider, böylece biri patlarsa diğerleri devam eder ve yalnız hatalı
/// olan yeniden denenir. Sunucu tarafında yeni bir iş kuyruğu YOK — mevcut
/// tekil yükleme ucu aynen kullanılır.
///
/// Doğrulama (uzantı + 25 MB) hem burada hem istemcide yapılır; istemci
/// tarafındaki yalnız erken uyarı içindir, yetkili olan sunucudur.
/// </summary>
[Authorize(PlatformPermissions.Documents.Default)]
public class UploadModel : AbpPageModel
{
    private readonly IDocumentAppService _documentAppService;
    private readonly IDocumentFileAppService _documentFileAppService;
    private readonly IDocumentTypeAppService _documentTypeAppService;
    private readonly IUploadedFileStorage _fileStorage;

    public UploadModel(
        IDocumentAppService documentAppService,
        IDocumentFileAppService documentFileAppService,
        IDocumentTypeAppService documentTypeAppService,
        IUploadedFileStorage fileStorage)
    {
        _documentAppService = documentAppService;
        _documentFileAppService = documentFileAppService;
        _documentTypeAppService = documentTypeAppService;
        _fileStorage = fileStorage;
    }

    public void OnGet()
    {
    }

    /// <summary>
    /// Tek dosya yükler. Kuyruk bunu dosya başına bir kez çağırır.
    /// Dönen DocumentFileId, yükleme sonrası toplu künye atamasında kullanılır.
    /// </summary>
    public async Task<IActionResult> OnPostUploadAsync(Guid documentId, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("Geçersiz veya boş dosya.");
        }

        var storedFileName = await _fileStorage.StoreAsync(file);

        var attachment = await _documentAppService.AddAttachmentAsync(
            documentId, file.FileName, storedFileName, file.ContentType, file.Length);

        return new JsonResult(attachment);
    }

    public async Task<IActionResult> OnGetDocumentTypesAsync()
        => new JsonResult(await _documentTypeAppService.GetListAsync());

    /// <summary>Yükleme bitince partiye toplu künye (tür / dönem) atamak için.</summary>
    public async Task<IActionResult> OnPostSetMetaAsync(Guid id, [FromBody] UpdateDocumentFileMetaDto input)
        => new JsonResult(await _documentFileAppService.UpdateMetaAsync(id, input));
}
