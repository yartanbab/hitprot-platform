using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Volo.Abp;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Web.Feedbacks;

/// <summary>
/// Geri bildirim ekleri için depolama. IUploadedFileStorage'dan BİLİNÇLİ olarak ayrı:
/// o wwwroot/uploads'a yazar ve static file middleware dosyaları oturumsuz herkese
/// servis eder. Ekran görüntüleri KVKK'lı ekran içeriği taşıyabildiği için burada
/// wwwroot DIŞINA (App_Data) yazılır — erişim yalnızca yetki kontrolü yapan
/// handler'lar üzerinden mümkündür.
/// </summary>
public class FeedbackFileStorage : ITransientDependency
{
    // Ekran görüntüsü + teşhise yarayan belge türleri; ofis/arşiv formatları bilinçli dışarıda.
    private static readonly string[] AllowedExtensions =
        { ".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf", ".txt", ".log", ".csv" };

    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

    private readonly IWebHostEnvironment _environment;

    public FeedbackFileStorage(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public long MaxFileSize => MaxFileSizeBytes;

    /// <summary>Doğrula ve diske yaz; saklanan (rastgele) dosya adını döner.</summary>
    public async Task<string> StoreAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FileUnsupportedExtension);
        }

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(ext))
        {
            throw new BusinessException(PlatformDomainErrorCodes.FileUnsupportedExtension);
        }

        if (file.Length > MaxFileSizeBytes)
        {
            throw new BusinessException(PlatformDomainErrorCodes.FileSizeExceeded);
        }

        var folder = GetRootFolder();
        Directory.CreateDirectory(folder);

        var storedFileName = Guid.NewGuid().ToString("N") + ext;
        var filePath = Path.Combine(folder, storedFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return storedFileName;
    }

    /// <summary>
    /// Saklanan dosyayı okumaya açar; yoksa null. Path traversal'a karşı ad
    /// yalnızca dosya adına indirgenir ve kök klasör altına çözülmesi zorunludur.
    /// </summary>
    public FileStream? OpenRead(string storedFileName)
    {
        var root = Path.GetFullPath(GetRootFolder());
        var safeName = Path.GetFileName(storedFileName ?? string.Empty);

        if (string.IsNullOrEmpty(safeName))
        {
            return null;
        }

        var resolved = Path.GetFullPath(Path.Combine(root, safeName));
        if (!resolved.StartsWith(root + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        return File.Exists(resolved) ? File.OpenRead(resolved) : null;
    }

    /// <summary>
    /// Saklanan dosyayı diskten siler (KVKK saklama süresi imhası). Path traversal'a
    /// karşı ad yalnızca dosya adına indirgenir ve kök klasör altına çözülmesi zorunludur.
    /// Dosya yoksa sessizce döner. İşlem başarısını (silindi/zaten yok) döner.
    /// </summary>
    public bool Delete(string storedFileName)
    {
        var root = Path.GetFullPath(GetRootFolder());
        var safeName = Path.GetFileName(storedFileName ?? string.Empty);

        if (string.IsNullOrEmpty(safeName))
        {
            return false;
        }

        var resolved = Path.GetFullPath(Path.Combine(root, safeName));
        if (!resolved.StartsWith(root + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        if (File.Exists(resolved))
        {
            File.Delete(resolved);
        }
        return true;
    }

    /// <summary>İçerik türü — indirmede Content-Type başlığı için.</summary>
    public static string GetContentType(string fileName)
    {
        return Path.GetExtension(fileName).ToLowerInvariant() switch
        {
            ".png"  => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".gif"  => "image/gif",
            ".webp" => "image/webp",
            ".pdf"  => "application/pdf",
            ".csv"  => "text/csv",
            _       => "application/octet-stream"
        };
    }

    private string GetRootFolder()
    {
        // ContentRootPath (proje kökü) altında, wwwroot DIŞINDA.
        return Path.Combine(_environment.ContentRootPath, "App_Data", "feedback-uploads");
    }
}
