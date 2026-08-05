using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform;
using Apya.Platform.Storage;
using Microsoft.AspNetCore.Http;
using Volo.Abp;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Web.Services;

/// <summary>
/// IUploadedFileStorage'in disk-tabanlı implementasyonu (geçici çözüm).
/// Üretimde ABP IBlobContainer veya S3/Azure Blob'a geçiş gerekir;
/// bu sınıf değişir, interface ve çağıranlar değişmez.
/// </summary>
public class LocalDiskUploadedFileStorage : IUploadedFileStorage, ITransientDependency
{
    private static readonly string[] AllowedExtensions =
        { ".pdf", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt", ".png", ".jpg", ".jpeg", ".gif", ".txt", ".csv", ".zip", ".rar" };

    private const long MaxFileSize = 25 * 1024 * 1024; // 25 MB

    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;

    public LocalDiskUploadedFileStorage(IUploadedFileRootFolderProvider rootFolderProvider)
    {
        _rootFolderProvider = rootFolderProvider;
    }

    public async Task<string> StoreAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new BusinessException(PlatformDomainErrorCodes.FileUnsupportedExtension);

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
            throw new BusinessException(PlatformDomainErrorCodes.FileUnsupportedExtension);

        if (file.Length > MaxFileSize)
            throw new BusinessException(PlatformDomainErrorCodes.FileSizeExceeded);

        var uploadsFolder = _rootFolderProvider.GetRootFolder();

        var storedFileName = Guid.NewGuid().ToString() + ext;
        var filePath = Path.Combine(uploadsFolder, storedFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return storedFileName;
    }
}
