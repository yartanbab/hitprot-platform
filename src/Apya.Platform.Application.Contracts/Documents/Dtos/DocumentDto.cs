using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Documents;

public class DocumentDto : FullAuditedEntityDto<Guid>
{
    public Guid? TenantId { get; set; }
    public Guid? ProjectId { get; set; }
    public Guid? ParentDocumentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? Icon { get; set; }
}
