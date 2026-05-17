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

        // JSON column (Postgres text; promote to jsonb in a follow-up if indexed search is needed)
        builder.Property(x => x.Answers)
            .IsRequired()
            .HasColumnType("text");

        builder.HasIndex(x => x.DocumentId);
        builder.HasIndex(x => x.RespondentId);
    }
}
