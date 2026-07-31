using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Apya.Platform.Feedbacks.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace Apya.Platform.Feedbacks;

/// <summary>
/// Host yöneticisi tarafı: tüm tenant'lardan gelen geri bildirim havuzu.
/// Yalnızca host bağlamında çalışır (CurrentTenant.Id == null).
/// </summary>
public interface IFeedbackAdminAppService : IApplicationService
{
    Task<PagedResultDto<FeedbackDto>> GetListAsync(GetFeedbackListInput input);

    Task<FeedbackDetailDto> GetAsync(Guid id);

    Task<FeedbackStatsDto> GetStatsAsync();

    Task UpdateStatusAsync(Guid id, UpdateFeedbackStatusDto input);

    Task UpdatePriorityAsync(Guid id, UpdateFeedbackPriorityDto input);

    Task UpdateTagsAsync(Guid id, UpdateFeedbackTagsDto input);

    Task BulkUpdateStatusAsync(BulkUpdateFeedbackStatusDto input);

    Task UpdateImpactAsync(Guid id, UpdateFeedbackImpactDto input);

    Task AssignAsync(Guid id, AssignFeedbackDto input);

    /// <summary>Atama açılır listesi — host tarafındaki yönetici kullanıcıları.</summary>
    Task<List<FeedbackAssigneeDto>> GetAssigneesAsync();

    /// <summary>Kaydın zaman çizelgesi (eskiden yeniye).</summary>
    Task<List<FeedbackActivityDto>> GetActivitiesAsync(Guid id);

    /// <summary>Filtre açılır listesi için kullanımdaki modül kodları.</summary>
    Task<List<string>> GetModuleCodesAsync();

    Task<FeedbackCommentDto> AddCommentAsync(Guid id, AddFeedbackCommentDto input);

    Task DeleteAsync(Guid id);

    /// <summary>Excel çıktısı Web katmanında üretilir; burada yalnızca ham satırlar döner.</summary>
    Task<List<FeedbackDto>> GetAllForExportAsync(GetFeedbackListInput input);

    /// <summary>Herhangi bir kaydın ekini indirme için çözer (host).</summary>
    Task<FeedbackAttachmentFileDto> GetAttachmentFileAsync(Guid attachmentId);

    /// <summary>Herhangi bir kaydın ekran görüntüsünü indirme için çözer (host).</summary>
    Task<FeedbackAttachmentFileDto> GetScreenshotFileAsync(Guid feedbackId);
}
