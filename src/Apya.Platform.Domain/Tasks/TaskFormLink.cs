using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks
{
    /// <summary>
    /// Bir göreve bağlanmış form (DynamicAssets <c>AppDocument</c>). Formun KENDİSİ
    /// kopyalanmaz — aynı form birden çok göreve bağlanabilir; bağ, "bu görev için
    /// şu form dolduruluyor" demenin yoludur.
    ///
    /// <para>IMultiTenant BİLEREK uygulanıyor (TaskChecklistItem/TaskAttachment'ten
    /// farklı olarak): bu kayıt ANONİM misafir yolunda da okunuyor. Orada çoklu-kiracı
    /// süzgeci kapatıldığı için tenant'ı çağıran elle doğrulamak zorunda ve
    /// doğrulayacağı alanın kaydın üstünde durması gerekiyor — TaskShareLink ile aynı
    /// gerekçe.</para>
    /// </summary>
    public class TaskFormLink : CreationAuditedEntity<Guid>, IMultiTenant
    {
        public Guid? TenantId { get; set; }

        public Guid TaskId { get; private set; }

        /// <summary>Bağlanan formun <c>AppDocument</c> kimliği.</summary>
        public Guid DocumentId { get; private set; }

        /// <summary>
        /// Misafirin bu formu süreli link üzerinden doldurmasına izin verilir mi.
        /// Varsayılan KAPALI: bir formu göreve bağlamak, onu ekip dışına açmakla
        /// aynı şey değildir; dışarı açmak ayrı ve bilinçli bir karardır.
        /// </summary>
        public bool IsGuestFillable { get; private set; }

        protected TaskFormLink() { }

        public TaskFormLink(Guid id, Guid taskId, Guid documentId, bool isGuestFillable = false)
            : base(id)
        {
            TaskId = taskId;
            DocumentId = documentId;
            IsGuestFillable = isGuestFillable;
        }

        public void SetGuestFillable(bool value) => IsGuestFillable = value;
    }
}
