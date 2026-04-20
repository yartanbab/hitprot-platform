using Apya.Platform.AssetRelations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Apya.Platform.EntityFrameworkCore.Configuration;

public class EntityLinkConfiguration : IEntityTypeConfiguration<EntityLink>
{
    public void Configure(EntityTypeBuilder<EntityLink> builder)
    {
        builder.ToTable(PlatformConsts.DbTablePrefix + "EntityLinks", PlatformConsts.DbSchema);
        builder.ConfigureByConvention();

        builder.Property(x => x.SourceEntityName)
            .IsRequired()
            .HasMaxLength(EntityLinkConsts.MaxEntityNameLength);

        builder.Property(x => x.SourceEntityId)
            .IsRequired();

        builder.Property(x => x.TargetEntityName)
            .IsRequired()
            .HasMaxLength(EntityLinkConsts.MaxEntityNameLength);

        builder.Property(x => x.TargetEntityId)
            .IsRequired();

        builder.Property(x => x.RelationType)
            .IsRequired(false)
            .HasMaxLength(EntityLinkConsts.MaxRelationTypeLength);

        // CRITICAL: Composite index for the primary query pattern:
        // "Get all links for SourceEntityName=X AND SourceEntityId=Y"
        builder.HasIndex(x => new { x.SourceEntityName, x.SourceEntityId })
            .HasDatabaseName("IX_AppEntityLinks_Source");

        // Secondary index for reverse lookups:
        // "Get all links pointing to TargetEntityName=X AND TargetEntityId=Y"
        builder.HasIndex(x => new { x.TargetEntityName, x.TargetEntityId })
            .HasDatabaseName("IX_AppEntityLinks_Target");

        // Prevent duplicate links between same source and target
        builder.HasIndex(x => new { x.SourceEntityName, x.SourceEntityId, x.TargetEntityName, x.TargetEntityId, x.RelationType })
            .IsUnique()
            .HasDatabaseName("IX_AppEntityLinks_UniqueLink");
    }
}
