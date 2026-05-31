using Apya.Platform.DynamicAssets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Apya.Platform.EntityFrameworkCore.Configuration;

public class AppResponseConfiguration : IEntityTypeConfiguration<AppResponse>
{
    public void Configure(EntityTypeBuilder<AppResponse> builder)
    {
        builder.ToTable(PlatformConsts.DbTablePrefix + "Responses", PlatformConsts.DbSchema);
        builder.ConfigureByConvention();

        builder.Property(x => x.DocumentId)
            .IsRequired();

        // JSON columns (Postgres text; promote to jsonb in a follow-up if indexed search is needed)
        builder.Property(x => x.Answers)
            .IsRequired()
            .HasColumnType("text");

        builder.Property(x => x.Status)
            .IsRequired();

        builder.Property(x => x.TagsJson)
            .IsRequired(false)
            .HasColumnType("text");

        builder.Property(x => x.RespondentMetaJson)
            .IsRequired(false)
            .HasColumnType("text");

        // Comments — child collection with FK
        builder.HasMany(x => x.Comments)
            .WithOne()
            .HasForeignKey(x => x.AppResponseId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(x => x.Comments)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasIndex(x => x.DocumentId);
        builder.HasIndex(x => x.RespondentId);
        builder.HasIndex(x => new { x.TenantId, x.Status });
    }
}
