using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.AssetRelations;

/// <summary>
/// Aggregate Root representing a polymorphic, loosely-coupled link between
/// any two entities in the system (e.g., Task → Document, Project → Document).
/// Uses string-based entity names to avoid hard FK dependencies between bounded contexts.
/// </summary>
public class EntityLink : CreationAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    /// <summary>
    /// The type name of the source entity (e.g., "Task", "Project").
    /// </summary>
    public string SourceEntityName { get; private set; } = null!;

    /// <summary>
    /// The ID of the source entity.
    /// </summary>
    public Guid SourceEntityId { get; private set; }

    /// <summary>
    /// The type name of the target entity (e.g., "Document").
    /// </summary>
    public string TargetEntityName { get; private set; } = null!;

    /// <summary>
    /// The ID of the target entity.
    /// </summary>
    public Guid TargetEntityId { get; private set; }

    /// <summary>
    /// Optional relation type descriptor (e.g., "Primary_Form", "Reference").
    /// </summary>
    public string? RelationType { get; private set; }

    /// <summary>
    /// Required by EF Core and ABP for deserialization.
    /// </summary>
    protected EntityLink()
    {
    }

    public EntityLink(
        Guid id,
        string sourceEntityName,
        Guid sourceEntityId,
        string targetEntityName,
        Guid targetEntityId,
        string? relationType = null)
        : base(id)
    {
        SourceEntityName = Check.NotNullOrWhiteSpace(
            sourceEntityName,
            nameof(sourceEntityName),
            maxLength: EntityLinkConsts.MaxEntityNameLength);

        SourceEntityId = sourceEntityId;

        TargetEntityName = Check.NotNullOrWhiteSpace(
            targetEntityName,
            nameof(targetEntityName),
            maxLength: EntityLinkConsts.MaxEntityNameLength);

        TargetEntityId = targetEntityId;

        RelationType = relationType;
    }
}
