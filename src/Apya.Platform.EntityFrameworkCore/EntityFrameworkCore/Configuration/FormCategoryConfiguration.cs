using Apya.Platform.DynamicAssets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Apya.Platform.EntityFrameworkCore.Configuration;

public class FormCategoryConfiguration : IEntityTypeConfiguration<FormCategory>
{
    public void Configure(EntityTypeBuilder<FormCategory> builder)
    {
        builder.ToTable(PlatformConsts.DbTablePrefix + "FormCategories", PlatformConsts.DbSchema);
        builder.ConfigureByConvention();

        builder.Property(x => x.Name)
            .IsRequired()
            .HasMaxLength(FormCategoryConsts.MaxNameLength);

        builder.Property(x => x.Color)
            .IsRequired(false)
            .HasMaxLength(FormCategoryConsts.MaxColorLength);

        builder.Property(x => x.Icon)
            .IsRequired(false)
            .HasMaxLength(FormCategoryConsts.MaxIconLength);

        builder.HasIndex(x => new { x.TenantId, x.Name });
        builder.HasIndex(x => new { x.TenantId, x.Order });
    }
}
