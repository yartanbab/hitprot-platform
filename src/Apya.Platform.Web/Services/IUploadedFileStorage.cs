using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Apya.Platform.Web.Services;

/// <summary>
/// PageModel'lerde tekrar tekrar yazılan dosya doğrulama + diske yazma
/// mantığını tek bir yerde topla. İlerde IBlobContainer veya S3'e geçişte
/// yalnızca implementasyon değiştirilir; çağıran kod değişmez.
/// </summary>
public interface IUploadedFileStorage
{
    /// <summary>Doğrula ve diske yaz; saklanan dosya adını döner.</summary>
    Task<string> StoreAsync(IFormFile file);
}
