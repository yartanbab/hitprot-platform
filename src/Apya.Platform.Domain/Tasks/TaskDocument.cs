using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Tasks
{
    /// <summary>
    /// Göreve bağlı zengin metin belgesi — toplantı notu, teknik şartname, teslim
    /// tutanağı gibi ekip içinde YAZILAN içerik. Dosya eki DEĞİLDİR: TaskAttachment
    /// yüklenmiş bir dosyayı saklar, bu ise uygulamanın içinde düzenlenen metni.
    ///
    /// Bir görevde birden çok belge olabilir (sekme önce listeyi gösterir).
    ///
    /// TaskComment ile aynı desen: <see cref="FullAuditedEntity{TKey}"/> — kullanıcı
    /// yazısı olduğu için silme SOFT'tur, yanlışlıkla silinen belge kurtarılabilir.
    /// IMultiTenant YOK; tenant ve gizlilik süzgeci görev üzerinden, AppService'teki
    /// EnsureTaskAccessAllowedAsync guard'ından gelir (TaskChecklistItem /
    /// TaskAttachment ile aynı kural).
    /// </summary>
    public class TaskDocument : FullAuditedEntity<Guid>
    {
        public Guid TaskId { get; set; }

        public string Title { get; set; } = string.Empty;

        /// <summary>Zengin metin gövdesi (HTML). Yeni açılan belge boş başlar.</summary>
        public string? Content { get; set; }

        protected TaskDocument() { }

        public TaskDocument(Guid id, Guid taskId, string title, string? content = null)
            : base(id)
        {
            TaskId = taskId;
            Title = title;
            Content = content;
        }
    }
}
