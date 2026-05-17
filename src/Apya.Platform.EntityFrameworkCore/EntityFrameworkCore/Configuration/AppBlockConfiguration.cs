using Apya.Platform.DynamicAssets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Apya.Platform.EntityFrameworkCore.Configuration;

public class AppBlockConfiguration : IEntityTypeConfiguration<AppBlock>
{
    public void Configure(EntityTypeBuilder<AppBlock> builder)
    {
        builder.ToTable(PlatformConsts.DbTablePrefix + "Blocks", PlatformConsts.DbSchema);
        builder.ConfigureByConvention();

        builder.Property(x => x.Type)
            .IsRequired();

        builder.Property(x => x.Order)
            .IsRequired();

        // JSON columns (Postgres text; promote to jsonb in a follow-up if indexed search is needed)
        builder.Property(x => x.Content)
            .IsRequired()
            .HasColumnType("text");

        builder.Property(x => x.Settings)
            .IsRequired()
            .HasColumnType("text");

        builder.Property(x => x.AgentContext)
            .IsRequired(false)
            .HasColumnType("text");

        // Composite index for efficient ordering queries
        builder.HasIndex(x => new { x.AppDocumentId, x.Order });
    }
}
