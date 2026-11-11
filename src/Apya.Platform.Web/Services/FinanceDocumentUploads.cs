using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Volo.Abp.DependencyInjection;

namespace Apya.Platform.Web.Services;

/// <summary>Diske yazılmış, henüz kayda bağlanmamış yükleme.</summary>
public sealed record StoredUpload(string FileName, string StoredFileName, string ContentType, long FileSize);

/// <summary>
/// Gider/gelir penceresindeki "Belge ekle" alanının dosya yarısı.
///
/// Dosyaların HEPSİ kayıt açılmadan ÖNCE doğrulanıp yazılır: biri reddedilirse (uzantı, 25 MB)
/// kayıt hiç açılmaz ve kullanıcı aynı gideri ikinci kez girmek zorunda kalmaz. Sonraki bir adım
/// patlarsa çağıran <see cref="Discard"/> ile diski temizler; kayıt da isteğin iş birimiyle geri alınır.
/// </summary>
public class FinanceDocumentUploads : ITransientDependency
{
    private readonly IUploadedFileStorage _storage;

    public FinanceDocumentUploads(IUploadedFileStorage storage)
    {
        _storage = storage;
    }

    public async Task<List<StoredUpload>> StoreAsync(IEnumerable<IFormFile>? files)
    {
        var stored = new List<StoredUpload>();

        try
        {
            foreach (var file in (files ?? Enumerable.Empty<IFormFile>()).Where(f => f.Length > 0))
            {
                var storedFileName = await _storage.StoreAsync(file);
                stored.Add(new StoredUpload(file.FileName, storedFileName, file.ContentType ?? "", file.Length));
            }
        }
        catch
        {
            Discard(stored);
            throw;
        }

        return stored;
    }

    public void Discard(IEnumerable<StoredUpload> uploads)
    {
        foreach (var upload in uploads)
        {
            _storage.TryDelete(upload.StoredFileName);
        }
    }
}
