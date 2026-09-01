using System;
using System.IO;
using System.IO.Compression;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Apya.Platform.Grants;
using Apya.Platform.Grants.Dtos;
using Apya.Platform.Permissions;
using Apya.Platform.Storage;
using Apya.Platform.Web.Pages;
using Apya.Platform.Web.Services;

namespace Apya.Platform.Web.Pages.Grants;

/// <summary>
/// 2b · İki taraflı evrak takibi.
///
/// <para>Dosya baytları BURADA işlenir: <see cref="IUploadedFileStorage"/> Web
/// katmanında tanımlıdır (uzantı beyaz listesi + boyut sınırı orada). AppService
/// yalnız diskteki adı saklar; katman kuralı korunur.</para>
/// </summary>
[Authorize(PlatformPermissions.Grants.Default)]
public class DocumentsModel : PlatformPageModel
{
    private readonly IGrantApplicationDocumentAppService _documents;
    private readonly IUploadedFileStorage _fileStorage;
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;

    public DocumentsModel(
        IGrantApplicationDocumentAppService documents,
        IUploadedFileStorage fileStorage,
        IUploadedFileRootFolderProvider rootFolderProvider)
    {
        _documents = documents;
        _fileStorage = fileStorage;
        _rootFolderProvider = rootFolderProvider;
    }

    [BindProperty(SupportsGet = true)]
    public Guid Id { get; set; }

    public IActionResult OnGet()
    {
        return Id == Guid.Empty ? Redirect("/Grants") : Page();
    }

    /// <summary>Evraka yeni sürüm yükler.</summary>
    public async Task<IActionResult> OnPostUploadAsync(Guid documentId, IFormFile? file, string? note)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(L["Grants:Documents:NoFile"].Value);
        }

        var storedFileName = await _fileStorage.StoreAsync(file);
        await _documents.RegisterVersionAsync(new RegisterGrantDocumentVersionInput
        {
            DocumentId = documentId,
            StoredFileName = storedFileName,
            OriginalFileName = Path.GetFileName(file.FileName),
            SizeBytes = file.Length,
            Note = note
        });

        return new JsonResult(new { ok = true });
    }

    /// <summary>Bir sürümü indirir.</summary>
    public async Task<IActionResult> OnGetDownloadAsync(Guid versionId)
    {
        var reference = await _documents.GetFileRefAsync(versionId);
        var path = _rootFolderProvider.ResolveSafePath(reference.StoredFileName);
        if (path == null || !System.IO.File.Exists(path))
        {
            return NotFound();
        }

        // İçerik türü tahmin edilmez: tarayıcı dosyayı çalıştırmasın, indirsin.
        return PhysicalFile(path, "application/octet-stream", reference.OriginalFileName);
    }

    /// <summary>Onaylı evrakları tek zip'te paketler ve başvuruya bağlar.</summary>
    public async Task<IActionResult> OnPostCreatePackageAsync(Guid applicationId)
    {
        var content = await _documents.GetPackageContentAsync(applicationId);
        if (content.Entries.Count == 0)
        {
            return BadRequest(L["Grants:Documents:PackageEmpty"].Value);
        }

        byte[] bytes;
        using (var buffer = new MemoryStream())
        {
            using (var archive = new ZipArchive(buffer, ZipArchiveMode.Create, leaveOpen: true))
            {
                foreach (var entry in content.Entries)
                {
                    var path = _rootFolderProvider.ResolveSafePath(entry.StoredFileName);
                    if (path == null || !System.IO.File.Exists(path)) { continue; }

                    var zipEntry = archive.CreateEntry(entry.EntryName, CompressionLevel.Optimal);
                    await using var target = zipEntry.Open();
                    await using var source = System.IO.File.OpenRead(path);
                    await source.CopyToAsync(target);
                }
            }
            bytes = buffer.ToArray();
        }

        var storedFileName = await _fileStorage.StoreGeneratedAsync(bytes, ".zip");
        await _documents.RegisterPackageAsync(new RegisterGrantDocumentPackageInput
        {
            ApplicationId = applicationId,
            StoredFileName = storedFileName
        });

        return new JsonResult(new { ok = true, entryCount = content.Entries.Count, isComplete = content.IsComplete });
    }

    /// <summary>Üretilmiş paketi indirir.</summary>
    public async Task<IActionResult> OnGetDownloadPackageAsync(Guid applicationId)
    {
        var reference = await _documents.GetPackageRefAsync(applicationId);
        var path = _rootFolderProvider.ResolveSafePath(reference.StoredFileName);
        if (path == null || !System.IO.File.Exists(path))
        {
            return NotFound();
        }

        return PhysicalFile(path, "application/zip", reference.OriginalFileName);
    }
}
