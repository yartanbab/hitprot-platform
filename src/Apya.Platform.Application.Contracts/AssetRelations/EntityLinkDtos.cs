using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.AssetRelations.Dtos;

/// <summary>
/// Output DTO for an EntityLink record.
/// </summary>
public class EntityLinkDto : CreationAuditedEntityDto<Guid>
{
    public string SourceEntityName { get; set; } = null!;
    public Guid SourceEntityId { get; set; }
    public string TargetEntityName { get; set; } = null!;
    public Guid TargetEntityId { get; set; }
    public string? RelationType { get; set; }
}

/// <summary>
/// Input DTO for creating a new polymorphic link between two entities.
/// </summary>
public class CreateEntityLinkDto
{
    public string SourceEntityName { get; set; } = null!;
    public Guid SourceEntityId { get; set; }
    public string TargetEntityName { get; set; } = null!;
    public Guid TargetEntityId { get; set; }
    public string? RelationType { get; set; }
}
