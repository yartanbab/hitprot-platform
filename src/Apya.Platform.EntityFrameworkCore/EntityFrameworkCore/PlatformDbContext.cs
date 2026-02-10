using Microsoft.EntityFrameworkCore;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using Apya.Platform.Projects;
using Apya.Platform.Grants;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Apya.Platform.Tasks;


namespace Apya.Platform.EntityFrameworkCore
{
    [ReplaceDbContext(typeof(IIdentityDbContext))]
    [ReplaceDbContext(typeof(ITenantManagementDbContext))]
    [ConnectionStringName("Default")]
    public class PlatformDbContext :
        AbpDbContext<PlatformDbContext>,
        IIdentityDbContext,
        ITenantManagementDbContext
    {
        /* Add DbSet properties for your Aggregate Roots / Entities here. */
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectAnalysis> ProjectAnalyses { get; set; }
        public DbSet<ProjectTask> ProjectTasks { get; set; }
        public DbSet<Grant> Grants { get; set; } //KOSGEB, TÜBİTAK gibi kurumların açtığı destek programları.

        //TaskItem için DbSet
        public DbSet<TaskItem> Tasks { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }
        public DbSet<TaskAttachment> TaskAttachments { get; set; }

        #region Entities from the Modules

        //Identity
        public DbSet<IdentityUser> Users { get; set; }
        public DbSet<IdentityRole> Roles { get; set; }
        public DbSet<IdentityClaimType> ClaimTypes { get; set; }
        public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
        public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
        public DbSet<IdentityLinkUser> LinkUsers { get; set; }
        public DbSet<IdentityUserDelegation> UserDelegations { get; set; }
        public DbSet<IdentitySession> Sessions { get; set; }

        public DbSet<ProjectAttachment> ProjectAttachments { get; set; }

        // Tenant Management
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

        #endregion

        public PlatformDbContext(DbContextOptions<PlatformDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            /* Include modules to your migration db context */

            builder.ConfigurePermissionManagement();
            builder.ConfigureSettingManagement();
            builder.ConfigureBackgroundJobs();
            builder.ConfigureAuditLogging();
            builder.ConfigureIdentity();
            builder.ConfigureOpenIddict();
            builder.ConfigureFeatureManagement();
            builder.ConfigureTenantManagement();

            /* Configure your own tables/entities inside here */

            // PROJE TABLOSU
            builder.Entity<Project>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Projects", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(128);
                b.Property(x => x.Code).IsRequired().HasMaxLength(32);

                // Hibe ile ilişki (Opsiyonel ama iyi olur)
                b.HasOne<Grant>().WithMany().HasForeignKey(x => x.GrantId).IsRequired();
            });

            // ANALİZ TABLOSU
            builder.Entity<ProjectAnalysis>(b =>
            {
                b.ToTable("AppProjectAnalyses");
                b.ConfigureByConvention();
            });

            // HİBE (GRANT) TABLOSU
            builder.Entity<Grant>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Grants", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Name).IsRequired().HasMaxLength(128);
                // "Agency" yerine "Issuer" kullanıyoruz
                b.Property(x => x.Issuer).IsRequired().HasMaxLength(64);
                b.Property(x => x.MinMatchScore).IsRequired();
                b.Property(x => x.MaxAmount).IsRequired();
            });

            // GÖREV (PROJECT TASK) TABLOSU (Eski modülünüz)
            builder.Entity<ProjectTask>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ProjectTasks", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Title).IsRequired().HasMaxLength(256);

                // İlişki (Bir görevin bir projesi olur)
                b.HasOne<Project>().WithMany().HasForeignKey(x => x.ProjectId).IsRequired();
            });

            // --- YENİ TASK MODÜLÜ YAPILANDIRMASI (TaskItem) ---
            builder.Entity<TaskItem>(b =>
            {
                // Tablo adı
                b.ToTable("AppTasks");

                // ABP'nin standart audit alanlarını yapılandırır
                b.ConfigureByConvention();

                // Assignee (Atanan Kişi) İlişkisi
                b.HasOne(t => t.Assignee)
                 .WithMany()
                 .HasForeignKey(t => t.AssigneeId)
                 .OnDelete(DeleteBehavior.SetNull);

                // Sub-Task (Kendi Kendine) İlişkisi
                b.HasOne(t => t.ParentTask)
                 .WithMany(t => t.SubTasks)
                 .HasForeignKey(t => t.ParentTaskId)
                 .IsRequired(false)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // --- Task Comment ---
            builder.Entity<TaskComment>(b =>
            {
                b.ToTable("AppTaskComments");
                b.ConfigureByConvention();
                b.HasOne<TaskItem>().WithMany().HasForeignKey(x => x.TaskId).IsRequired();
            });

            // --- Task Attachment ---
            builder.Entity<TaskAttachment>(b =>
            {
                b.ToTable("AppTaskAttachments");
                b.ConfigureByConvention();
                b.HasOne<TaskItem>().WithMany().HasForeignKey(x => x.TaskId).IsRequired();
            });

            // OnModelCreating içine:
            builder.Entity<ProjectAttachment>(b =>
            {
                b.ToTable("AppProjectAttachments");
                b.ConfigureByConvention();
            });
        }
    }
}