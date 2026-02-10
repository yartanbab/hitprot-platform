using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Apya.Platform.Projects; // Sadece bunu kullanın, "Apya.Platform.Domain.Projects" varsa silin.

namespace Apya.Platform.EntityFrameworkCore.Projects;

public class ProjectEntityConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ConfigureByConvention();
        builder.Property(x => x.Name).IsRequired().HasMaxLength(128);
        builder.Property(x => x.Code).IsRequired().HasMaxLength(32);
    }
}