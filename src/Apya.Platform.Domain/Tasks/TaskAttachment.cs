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

        public TaskAttachment() { }
    }
}