using Apya.Platform.DynamicAssets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Apya.Platform.EntityFrameworkCore.Configuration;

public class AppDocumentConfiguration : IEntityTypeConfiguration<AppDocument>
{
    public void Configure(EntityTypeBuilder<AppDocument> builder)
    {
        builder.ToTable(PlatformConsts.DbTablePrefix + "Documents_Dynamic", PlatformConsts.DbSchema);
        builder.ConfigureByConvention();

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(AppDocumentConsts.MaxTitleLength);

        builder.Property(x => x.Slug)
            .IsRequired()
            .HasMaxLength(AppDocumentConsts.MaxSlugLength);

        builder.HasIndex(x => x.Slug).IsUnique();
        builder.HasIndex(x => x.ParentTemplateId);
        builder.HasIndex(x => x.IsTemplate);

        // Blocks — owned collection with FK
        builder.HasMany(x => x.Blocks)
            .WithOne()
            .HasForeignKey(x => x.AppDocumentId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // Metadata for the backing field
        builder.Navigation(x => x.Blocks)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
