using System;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Kullanıcı tarafı: geri bildirim gönder + kendi kayıtlarını izle.
/// İZİN GEREKTİRMEZ (yalnızca oturum) — bkz. PlatformPermissions.Feedbacks yorumu.
/// </summary>
public interface IFeedbackAppService : IApplicationService
{
    Task<FeedbackDto> SubmitAsync(CreateFeedbackDto input);

    /// <summary>Yalnızca çağıran kullanıcının kendi gönderdikleri; iç notlar dönmez.</summary>
    Task<PagedResultDto<FeedbackDto>> GetMyListAsync(PagedAndSortedResultRequestDto input);

    /// <summary>Kendi kaydının detayı + kullanıcıya görünen cevaplar.</summary>
    Task<FeedbackDetailDto> GetMyAsync(Guid id);

    /// <summary>
    /// Kendi kaydına ek açıklama yazar. İlk gönderilen metin değişmez (geçmiş korunur);
    /// kayıt "Ek bilgi bekleniyor" durumundaysa sessizce yeniden incelemeye alınır.
    /// </summary>
    Task<FeedbackCommentDto> AddMyCommentAsync(Guid id, AddMyCommentDto input);

    /// <summary>Kendi kaydının ekini indirme için çözer; sahiplik yoksa EntityNotFound.</summary>
    Task<FeedbackAttachmentFileDto> GetMyAttachmentFileAsync(Guid attachmentId);

    /// <summary>Kendi kaydının ekran görüntüsünü indirme için çözer.</summary>
    Task<FeedbackAttachmentFileDto> GetMyScreenshotFileAsync(Guid feedbackId);
}
