using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Tasks
{
    public class TaskAttachment : CreationAuditedEntity<Guid>
    {
        public Guid TaskId { get; set; }

        public string FileName { get; set; } = null!;      // Kullanıcının gördüğü isim (örn: Rapor.pdf)
        public string StoredFileName { get; set; } = null!; // Sunucudaki benzersiz isim (örn: guid_Rapor.pdf)
        public string ContentType { get; set; } = null!;   // Dosya türü (application/pdf vb.)
        public long FileSize { get; set; }        // Boyut (Byte)

        // Dosyayı bir misafir mi yükledi? Dolu ise hangi paylaşım linkinden geldiği.
        // CreatorId misafirde null kalır (kimlik yok) — yükleyenin adı bu link üzerinden
        // çözülür.
        public Guid? ShareLinkId { get; set; }

        // Ekibin yüklediği bir dosyanın dış paylaşımlara açılması. Varsayılan KAPALI:
        // misafir yalnız kendi yüklediklerini (ShareLinkId) ve bu bayrağı açık olanları
        // indirebilir. Kapsamdaki her eki açsaydık göreve iliştirilmiş iç dosyalar da
        // dışarı sızardı.
        public bool IsVisibleToGuests { get; set; }

        public TaskAttachment() { }
    }
}