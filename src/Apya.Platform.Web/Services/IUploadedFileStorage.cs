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

    /// <summary>
    /// SİSTEMİN ÜRETTİĞİ dosyayı (teslim paketi PDF/ZIP'i, rapor sürümü) saklar.
    /// Kullanıcı yüklemesi değildir: uzantı beyaz listesi ve boyut sınırı burada
    /// uygulanmaz — içeriği biz üretiyoruz, doğrulanacak bir şey yok.
    /// </summary>
    Task<string> StoreGeneratedAsync(byte[] content, string extension);

    /// <summary>
    /// Kaydı açılamayan yüklemeyi diskten siler: dosya yazıldı ama onu gösterecek satır
    /// oluşmadıysa (yetki, olmayan kayıt, kilitli başvuru…) kimse fark etmez, kimse silmez.
    /// Silme başarısız olursa YUTULUR (loglanır): asıl hata çağırana gitmeli, temizlik
    /// hatası onu maskelememeli.
    /// </summary>
    void TryDelete(string storedFileName);
}
