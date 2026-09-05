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

        /// <summary>Konsolun "Dosya galerisi" görünümü: süzülmüş görevlerin GÖRSEL
        /// eklerini tek turda döner. Liste DTO'su yalnız ek SAYISINI taşıdığı için
        /// galeri onunla beslenemez; görev başına ayrı istek de N+1 olurdu.
        /// RootOnly yok sayılır — alt görevlere yüklenen görseller de galeride görünür.</summary>
        Task<List<TaskGalleryItemDto>> GetGalleryAsync(GetTasksInput input);

        /// <summary>Konsolun Takvim ve Gösterge Paneli görünümleri için YALIN görev
        /// listesi: tek sorgu, tek projeksiyon, zenginleştirme YOK. GetListAsync'in
        /// altı ek turu (etiket, favori, alt görev sayacı, proje adı, kart meta…)
        /// bu görünümlerde kullanılmıyor ve 1000 satırda saniyelere mal oluyordu.
        /// RootOnly yok sayılır — alt görevlerin tarihleri de takvime düşmeli.</summary>
        Task<List<TaskPointDto>> GetPointsAsync(GetTasksInput input);

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

        /// <summary>Faz 4b: görevi nedeniyle birlikte iptal eder (panodaki İptal kolonu).</summary>
        Task CancelAsync(Guid id, string? reason);

        /// <summary>Faz 4b: iptali geri alır — görev iptalden ÖNCEKİ durumuna döner.</summary>
        Task RestoreFromCancelAsync(Guid id);

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

        // --- Belgeler ---
        // Göreve bağlı zengin metin belgeleri (TaskDocument). Dosya ekinden ayrıdır:
        // ek yüklenmiş dosyayı saklar, belge uygulama içinde YAZILAN metni.
        // Yetki kapısı görevin kendisidir — ayrı izin tanımlanmadı.

        /// <summary>Görevin belgeleri. Content BOŞ döner (liste uzun gövdelerle
        /// şişmesin); tam gövde için GetDocumentAsync kullanılır.</summary>
        Task<List<TaskDocumentDto>> GetDocumentsAsync(Guid taskId);

        /// <summary>Tek belgenin tam gövdesiyle birlikte hâli.</summary>
        Task<TaskDocumentDto> GetDocumentAsync(Guid documentId);

        Task<TaskDocumentDto> CreateDocumentAsync(Guid taskId, string title);

        /// <summary>Belgeyi kaydeder. Girdi DÜZ PARAMETRE DEĞİL, DTO'dur: ABP'nin
        /// otomatik API'si basit tipleri query string'e koyar ve kilobaytlık bir
        /// gövde URL sınırını aşardı (bkz. UpdateTaskDocumentDto).</summary>
        Task<TaskDocumentDto> UpdateDocumentAsync(Guid documentId, UpdateTaskDocumentDto input);

        Task DeleteDocumentAsync(Guid documentId);

        // --- Formlar ---
        // Göreve bağlanmış DynamicAssets formları. Form KOPYALANMAZ; bağ kurulur,
        // aynı form birden çok göreve bağlanabilir. Yetki kapısı görevin kendisi:
        // okuma için göreve erişim, yazma için Tasks.Edit.

        /// <summary>Göreve bağlı formlar. Yanıt sayısı YALNIZ bu görev bağlamında
        /// toplananları sayar — formun toplam yanıt sayısı değil.</summary>
        Task<List<TaskFormLinkDto>> GetLinkedFormsAsync(Guid taskId);

        /// <summary>Form seçicisi: kiracının formları, bu göreve bağlı olanlar işaretli.</summary>
        Task<List<TaskFormOptionDto>> GetFormOptionsAsync(Guid taskId);

        Task<TaskFormLinkDto> LinkFormAsync(Guid taskId, Guid documentId);
        Task UnlinkFormAsync(Guid linkId);

        /// <summary>Formu görevin süreli paylaşım linkine açar/kapatır.
        /// Bağlamak dışarı açmak DEĞİLDİR; bu ayrı ve bilinçli bir karardır.</summary>
        Task SetFormGuestFillableAsync(Guid linkId, bool isGuestFillable);

        /// <summary>Bu görev bağlamında toplanmış yanıtlar (en yeni üstte).</summary>
        Task<List<TaskFormResponseDto>> GetFormResponsesAsync(Guid taskId, Guid documentId);

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
