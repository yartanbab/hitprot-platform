using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

public class DocumentAccessLogDto : CreationAuditedEntityDto<Guid>
{
    public Guid DocumentId { get; set; }
    public Guid? AttachmentId { get; set; }
    public DocumentAccessAction Action { get; set; }
    public string ActorName { get; set; } = string.Empty;
}
