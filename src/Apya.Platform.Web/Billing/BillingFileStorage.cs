using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Billing;
using Apya.Platform.Billing.Dtos;
using Apya.Platform.Storage;
using Microsoft.AspNetCore.Http;
using Volo.Abp;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Web.Billing;

/// <summary>
/// Fatura ve dekont dosyalarının diske yazılması/okunması.
///
/// <para>Doğrulama (boyut, uzantı) WEB SINIRINDA yapılır: <c>IFormFile</c> burada
/// çözülür ve AppService'e yalnız doğrulanmış bir tanım (<see cref="BillingFileInput"/>)
/// geçer. Böylece uygulama katmanı HTTP tiplerine bağlanmaz.</para>
///
/// <para>🔴 Dosyalar <c>App_Data/uploads</c> altındadır — 2026-08-31'de bu klasör bir
/// deploy sırasında kalıcı olarak kaybedilmişti. Fatura ve dekont MALİ BELGEDİR; deploy
/// öncesi korunacaklar listesinde olduğu teyit edilmeli.</para>
/// </summary>
public class BillingFileStorage : ITransientDependency
{
    private readonly IUploadedFileRootFolderProvider _rootFolderProvider;

    public BillingFileStorage(IUploadedFileRootFolderProvider rootFolderProvider)
    {
        _rootFolderProvider = rootFolderProvider;
    }

    /// <summary>
    /// Dosyayı doğrular ve diske yazar. Saklanan ad GUID'dir: kullanıcının verdiği ad
    /// diskte kullanılsaydı hem çakışır hem de yol manipülasyonuna açık olurdu.
    /// </summary>
    public async Task<BillingFileInput> SaveAsync(IFormFile? file)
    {
        if (file == null || file.Length == 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.BillingFileRequired);
        }

        if (file.Length > BillingConsts.MaxFileSizeBytes)
        {
            throw new BusinessException(PlatformDomainErrorCodes.BillingFileTooLarge)
                .WithData("MaxMb", BillingConsts.MaxFileSizeBytes / (1024 * 1024));
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!BillingConsts.AllowedFileExtensions.Contains(extension))
        {
            throw new BusinessException(PlatformDomainErrorCodes.BillingFileTypeNotAllowed)
                .WithData("Allowed", string.Join(", ", BillingConsts.AllowedFileExtensions));
        }

        var storedFileName = $"{Guid.NewGuid()}{extension}";
        var path = Path.Combine(_rootFolderProvider.GetRootFolder(), storedFileName);

        await using (var stream = new FileStream(path, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return new BillingFileInput
        {
            // Özgün ad yalnız GÖSTERİM için saklanır; diske hiç yazılmaz.
            FileName = Path.GetFileName(file.FileName),
            StoredFileName = storedFileName,
            FileSize = file.Length
        };
    }

    /// <summary>
    /// Diskteki tam yolu döner; dosya yoksa ya da yol kökün dışına taşıyorsa <c>null</c>.
    /// Path traversal denetimi <see cref="IUploadedFileRootFolderProvider"/> tarafında.
    /// </summary>
    public string? ResolveExistingPath(string? storedFileName)
    {
        if (string.IsNullOrWhiteSpace(storedFileName))
        {
            return null;
        }

        var path = _rootFolderProvider.ResolveSafePath(storedFileName);

        return path != null && File.Exists(path) ? path : null;
    }

    /// <summary>İndirme yanıtının içerik türü. Bilinmeyen uzantı ikili olarak iner.</summary>
    public static string ContentType(string? fileName) =>
        Path.GetExtension(fileName ?? string.Empty).ToLowerInvariant() switch
        {
            ".pdf" => "application/pdf",
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            _ => "application/octet-stream"
        };
}
