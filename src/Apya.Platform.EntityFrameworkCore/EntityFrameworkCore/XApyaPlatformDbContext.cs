//using Microsoft.EntityFrameworkCore;
//using Volo.Abp.Data;
//using Volo.Abp.EntityFrameworkCore;
//using Apya.Platform.Domain.Projects;

//namespace Apya.Platform.EntityFrameworkCore;

//[ConnectionStringName("Default")]
//public class PlatformDbContext
//    : AbpDbContext<PlatformDbContext>
//{
//    public DbSet<Project> Projects => Set<Project>();

//    public PlatformDbContext(
//        DbContextOptions<PlatformDbContext> options)
//        : base(options)
//    {
//    }

//    protected override void OnModelCreating(ModelBuilder builder)
//    {
//        base.OnModelCreating(builder);

//        builder.ApplyConfigurationsFromAssembly(
//            typeof(PlatformDbContext).Assembly
//        );
//    }
//}
