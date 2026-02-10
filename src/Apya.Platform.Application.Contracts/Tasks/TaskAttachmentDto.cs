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
    }
}