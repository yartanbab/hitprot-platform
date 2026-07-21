using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Identity;

namespace Apya.Platform.Tasks
{
    public interface ITaskAppService :
        ICrudAppService<
            TaskDto,
            Guid,
            GetTasksInput, // KİLİT NOKTA: PagedAndSorted... yerine kendi filtremizi ekledik!
            CreateUpdateTaskDto>
    {
        // Kullanıcı Listesi
        Task<ListResultDto<IdentityUserDto>> GetUsersLookupAsync();

        /// <summary>Select2 tag girişinin başlangıç seçenek listesi için tenant'ın tüm etiketleri.</summary>
        Task<List<TagDto>> GetAllTagsAsync();

        // Yorum Metodları
        Task<Guid> AddCommentAsync(Guid taskId, string text);
        Task<Guid> ReplyToCommentAsync(Guid parentCommentId, string text); // Instagram tarzı yanıt
        Task UpdateCommentAsync(Guid commentId, string text);  // yalnızca yorum sahibi
        Task DeleteCommentAsync(Guid commentId);               // yalnızca yorum sahibi
        Task<List<TaskCommentDto>> GetCommentsAsync(Guid taskId);

        Task AddAttachmentAsync(Guid taskId, string fileName, string storedFileName, long fileSize);
        Task<List<TaskAttachmentDto>> GetAttachmentsAsync(Guid taskId);
        Task UpdateStatusAsync(Guid id, Apya.Platform.Tasks.TaskStatus status);

        // Zaman Takibi
        Task StartTimeTrackingAsync(Guid taskId);
        Task StopTimeTrackingAsync(Guid taskId);
        Task<List<TaskTimeLogDto>> GetTimeLogsAsync(Guid taskId);
        Task<TaskTimeLogDto?> GetActiveTimeLogAsync();
    }
}

