using System;
using System.IO;
using Microsoft.Extensions.Hosting;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Storage;

/// <summary>
/// Yüklenen dosyaların App_Data/uploads kökünü tek yerden hesaplar. HttpApi katmanı
/// Web'e referans veremediği için bu kök daha önce FileController, TaskAttachmentController,
/// LocalDiskUploadedFileStorage ve Documents/Index.cshtml.cs'te elle kopyalanmıştı; hepsi
/// buraya taşındı (bkz. task_1160f74b).
/// </summary>
public interface IUploadedFileRootFolderProvider
{
    /// <summary>Kök klasörü döner, yoksa oluşturur.</summary>
    string GetRootFolder();

    /// <summary>
    /// Dosya adını kök klasörle birleştirip path traversal'a karşı doğrular.
    /// Geçersizse (boş ad veya kök dışına taşan yol) null döner.
    /// </summary>
    string? ResolveSafePath(string fileName);
}

public class UploadedFileRootFolderProvider : IUploadedFileRootFolderProvider, ITransientDependency
{
    private readonly IHostEnvironment _environment;

    public UploadedFileRootFolderProvider(IHostEnvironment environment)
    {
        _environment = environment;
    }

    public string GetRootFolder()
    {
        var folder = Path.Combine(_environment.ContentRootPath, "App_Data", "uploads");
        if (!Directory.Exists(folder))
        {
            Directory.CreateDirectory(folder);
        }

        return folder;
    }

    public string? ResolveSafePath(string fileName)
    {
        var safeFileName = Path.GetFileName(fileName);
        if (string.IsNullOrEmpty(safeFileName))
            return null;

        var root = Path.GetFullPath(GetRootFolder());
        var resolvedPath = Path.GetFullPath(Path.Combine(root, safeFileName));
        if (!resolvedPath.StartsWith(root + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
            return null;

        return resolvedPath;
    }
}
