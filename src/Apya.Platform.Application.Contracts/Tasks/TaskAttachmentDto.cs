using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks
{
    public class TaskAttachmentDto : CreationAuditedEntityDto<Guid>
    {
        public string FileName { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string DownloadUrl { get; set; } = string.Empty;
        public string UploaderName { get; set; } = string.Empty;

        /// <summary>Dosyayı ekip dışından biri süreli link üzerinden yükledi.</summary>
        public bool IsGuestUpload { get; set; }

        /// <summary>Ekibin bu dosyayı dış paylaşımlara açıp açmadığı (misafir yüklemesinde anlamsız).</summary>
        public bool IsVisibleToGuests { get; set; }
    }
}