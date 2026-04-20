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

        // JSON column → MSSQL nvarchar(max)
        builder.Property(x => x.Answers)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.HasIndex(x => x.DocumentId);
        builder.HasIndex(x => x.RespondentId);
    }
}
