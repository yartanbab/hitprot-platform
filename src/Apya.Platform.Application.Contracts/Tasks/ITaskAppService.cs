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
            PagedAndSortedResultRequestDto,
            CreateUpdateTaskDto>
    {
        // Kullanıcı Listesi
        Task<ListResultDto<IdentityUserDto>> GetUsersLookupAsync();

        // Yorum Metodları
        Task AddCommentAsync(Guid taskId, string text);
        Task<List<TaskCommentDto>> GetCommentsAsync(Guid taskId);

        // --- EKSİK OLAN DOSYA METODLARI (BUNLARI EKLEDİK) ---
        Task AddAttachmentAsync(Guid taskId, string fileName, string storedFileName, long fileSize);
        Task<List<TaskAttachmentDto>> GetAttachmentsAsync(Guid taskId);
    }
}