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

        /// <summary>Görev "Proje" seçici için tenant'ın projeleri (id + ad).</summary>
        Task<List<ProjectLookupDto>> GetProjectsLookupAsync();

        /// <summary>Liste şeridindeki sayaç barları. Girdinin kapsamını (proje vb.)
        /// kullanır; RootOnly yok sayılır (alt görevler de sayılır).</summary>
        Task<TaskListSummaryDto> GetSummaryAsync(GetTasksInput input);

        /// <summary>Select2 tag girişinin başlangıç seçenek listesi için tenant'ın tüm etiketleri.</summary>
        Task<List<TagDto>> GetAllTagsAsync();

        // Yorum Metodları
        Task<Guid> AddCommentAsync(Guid taskId, string text);
        Task<Guid> ReplyToCommentAsync(Guid parentCommentId, string text); // Instagram tarzı yanıt
        Task UpdateCommentAsync(Guid commentId, string text);  // yalnızca yorum sahibi
        Task DeleteCommentAsync(Guid commentId);               // yalnızca yorum sahibi
        Task<List<TaskCommentDto>> GetCommentsAsync(Guid taskId);

        /// <summary>Mevcut kullanıcı için görev favorisini aç/kapat; yeni durumu döner (true=favori).</summary>
        Task<bool> ToggleFavoriteAsync(Guid taskId);

        /// <summary>Mevcut kullanıcı için görev takibini aç/kapat; yeni durumu döner (true=takipte).</summary>
        Task<bool> ToggleWatchAsync(Guid taskId);

        /// <summary>Görevi bir veya birden çok projeye taşır/kopyalar (görev detayı transfer diyaloğu).</summary>
        Task<Dtos.TransferTaskResultDto> TransferAsync(Guid id, Dtos.TransferTaskDto input);

        Task AddAttachmentAsync(Guid taskId, string fileName, string storedFileName, long fileSize);
        Task<List<TaskAttachmentDto>> GetAttachmentsAsync(Guid taskId);
        Task DeleteAttachmentAsync(Guid attachmentId);
        Task UpdateStatusAsync(Guid id, Apya.Platform.Tasks.TaskStatus status);

        /// <summary>Yalnız atananı değiştirir (null = atamayı kaldır). Toplu işlem
        /// tüm görevi okuyup yazmasın diye granüler uç — UpdateStatusAsync ile aynı desen.</summary>
        Task SetAssigneeAsync(Guid id, Guid? assigneeId);

        /// <summary>Yalnız önceliği değiştirir. Toplu işlem için granüler uç.</summary>
        Task SetPriorityAsync(Guid id, Apya.Platform.Tasks.TaskPriority priority);

        /// <summary>
        /// Görevin son tarihini <paramref name="days"/> gün ileri alır ("Ötele").
        /// Son tarihi olmayan görev bugünden itibaren tarihlenir. Yalnız DueDate'e
        /// dokunur — tam DTO ile UpdateAsync round-trip'i etiket/bağımlılık/planlama
        /// alanlarını riske atacağı için ayrı metot (UpdateStatusAsync ile aynı desen).
        /// Güncellenen görevi döner ki istemci yeni tarihi tekrar sormadan gösterebilsin.
        /// </summary>
        Task<TaskDto> DeferAsync(Guid id, int days);

        // Feature Registry (Faz 3)
        Task<List<string>> GetFeatureAssignmentsAsync(Guid taskId);
        Task AddFeatureAsync(Guid taskId, string featureCode);
        Task RemoveFeatureAsync(Guid taskId, string featureCode);

        // Kontrol Listesi (Faz 4)
        Task<List<TaskChecklistItemDto>> GetChecklistItemsAsync(Guid taskId);
        Task<Guid> AddChecklistItemAsync(Guid taskId, string text);
        Task ToggleChecklistItemAsync(Guid itemId);
        Task DeleteChecklistItemAsync(Guid itemId);

        // Zaman Takibi
        Task StartTimeTrackingAsync(Guid taskId);
        Task StopTimeTrackingAsync(Guid taskId);
        Task<List<TaskTimeLogDto>> GetTimeLogsAsync(Guid taskId);
        Task<TaskTimeLogDto?> GetActiveTimeLogAsync();
    }
}

