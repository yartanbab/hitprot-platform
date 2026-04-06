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

        // Yorum Metodları
        Task AddCommentAsync(Guid taskId, string text);
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

