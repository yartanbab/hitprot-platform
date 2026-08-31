using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Tasks;

/// <summary>
/// Görevi ekip dışına açan süreli linkler.
///
/// <para>İki ayrı kitleye hizmet eder: yetkili kullanıcı linki üretir/iptal eder, misafir
/// ise token'la anonim çağırır. Anonim metotlarda yetki token'ın kendisindedir; bu yüzden
/// hepsi token'ı ilk parametre olarak alır ve doğrulamayı kendi içinde yapar — çağıranın
/// (Web katmanı) yaptığı hiçbir kontrol yetki yerine geçmez.</para>
/// </summary>
public interface ITaskShareAppService : IApplicationService
{
    /* --- Ekip tarafı --- */

    /// <summary>Bir görevin paylaşım linkleri (iptal edilmişler dâhil, en yeni üstte).</summary>
    Task<List<TaskShareLinkDto>> GetListAsync(Guid taskId);

    /// <summary>Yeni link üretir. Token YALNIZ bu yanıtta döner.</summary>
    Task<CreatedTaskShareLinkDto> CreateAsync(CreateTaskShareLinkDto input);

    Task RevokeAsync(Guid id);

    /// <summary>Ekibin bir eki dış paylaşımlara açması/kapatması.</summary>
    Task SetAttachmentGuestVisibilityAsync(Guid attachmentId, bool isVisible);

    /* --- Misafir tarafı (anonim) --- */

    Task<GuestTaskViewDto> ResolveAsync(string token, GuestRequestContextDto context);

    Task<Guid> AddGuestCommentAsync(string token, Guid taskId, string text, GuestRequestContextDto context);

    /// <summary>
    /// Dosya diske YAZILDIKTAN sonra kaydı açar. Yükleme izni ve kapsam burada doğrulanır;
    /// çağıran, doğrulama başarısızsa yazdığı dosyayı silmelidir.
    /// </summary>
    Task RegisterGuestUploadAsync(
        string token, Guid taskId, string fileName, string storedFileName, long fileSize,
        GuestRequestContextDto context);

    /// <summary>Yükleme öncesi kapsam/izin doğrulaması — diske boşuna yazmamak için.</summary>
    Task EnsureGuestUploadAllowedAsync(string token, Guid taskId);

    Task<GuestDownloadDto> PrepareGuestDownloadAsync(string token, Guid attachmentId, GuestRequestContextDto context);
}
