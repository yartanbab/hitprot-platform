using System;

namespace Apya.Platform.Tasks
{
    /// <summary>
    /// Konsoldaki "Dosya galerisi" görünümünün tek satırı: bir görevin bir GÖRSEL eki.
    /// Yeni tablo yoktur — <see cref="TaskAttachment"/> kayıtları görev bilgisiyle
    /// birlikte düzleştirilir, böylece görünüm görev başına ayrı istek atmaz.
    /// </summary>
    public class TaskGalleryItemDto
    {
        public Guid TaskId { get; set; }
        public string TaskTitle { get; set; } = string.Empty;

        /// <summary>Kullanıcıya gösterilen görev kodu — "GRV-17".</summary>
        public string TaskCode { get; set; } = string.Empty;

        public Guid AttachmentId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string DownloadUrl { get; set; } = string.Empty;
        public string UploaderName { get; set; } = string.Empty;
        public DateTime CreationTime { get; set; }
    }
}
