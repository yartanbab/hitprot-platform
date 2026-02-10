//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Metadata.Builders;
//using Apya.Platform.Domain.Projects;
//using Volo.Abp.EntityFrameworkCore.Modeling;

//namespace Apya.Platform.EntityFrameworkCore.Configurations;

//public class ProjectConfiguration : IEntityTypeConfiguration<Project>
//{
//    public void Configure(EntityTypeBuilder<Project> builder)
//    {
//        // ABP standartları (Id, audit, vs.)
//        builder.ConfigureByConvention();

//        // 🔥 VALUE OBJECT – OWNED CONFIG
//        builder.OwnsOne(p => p.Code, pc =>
//        {
//            pc.Property(x => x.Value)
//              .HasColumnName("Code")
//              .IsRequired();
//        });
//    }
//}
