using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects
{
    /// <summary>
    /// Projeye eklenen dosya (sözleşme, rapor, görsel…). Fiziksel dosya
    /// App_Data/uploads altında; burada yalnız meta veri tutulur.
    /// </summary>
    public class ProjectAttachment : CreationAuditedEntity<Guid>, IMultiTenant
    {
        public Guid? TenantId { get; set; }

        public Guid ProjectId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string StoredFileName { get; set; } = string.Empty;

        /// <summary>MIME türü (application/pdf, image/png…). Önizleme/indirme başlığı buna bakar.</summary>
        public string ContentType { get; set; } = string.Empty;

        /// <summary>Kullanıcının verdiği kısa açıklama — opsiyonel.</summary>
        public string? Title { get; set; }

        public long FileSize { get; set; }
        public ProjectAttachment() { }
    }
}
