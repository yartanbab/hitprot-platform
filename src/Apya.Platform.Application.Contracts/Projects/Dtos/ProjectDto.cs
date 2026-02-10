using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects.Dtos;

public class ProjectDto : AuditedEntityDto<Guid>
{
    public Guid GrantId { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
}
