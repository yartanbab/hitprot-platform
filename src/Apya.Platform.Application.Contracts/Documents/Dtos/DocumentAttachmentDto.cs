using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

public class DocumentAttachmentDto : CreationAuditedEntityDto<Guid>
{
    public Guid DocumentId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string DownloadUrl { get; set; } = string.Empty;
    public string UploaderName { get; set; } = string.Empty;
    public Guid VersionGroupId { get; set; }
    public int VersionNumber { get; set; }
    public bool IsLatest { get; set; }
}
