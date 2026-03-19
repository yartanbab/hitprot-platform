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
using Volo.Abp.EntityFrameworkCore.Modeling;

using Apya.Platform.Projects;
using Apya.Platform.Grants;
using Apya.Platform.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Calendars;

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
        /* --- PROJE MODÜLÜ TABLOLARI --- */
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectAnalysis> ProjectAnalyses { get; set; }
        public DbSet<ProjectTask> ProjectTasks { get; set; }
        public DbSet<Grant> Grants { get; set; }

        // YENİ: ProjectTask'ın Alt Görevleri ve Yorumları (Açık Adresleriyle!)
        public DbSet<Apya.Platform.Projects.SubTask> ProjectSubTasks { get; set; }
        public DbSet<Apya.Platform.Projects.TaskComment> ProjectTaskComments { get; set; }


        /* --- ESKİ/DİĞER TASK MODÜLÜ TABLOLARI --- */
        public DbSet<TaskItem> Tasks { get; set; }
        // DİKKAT: Eski Task modülündeki yorumlar (Açık Adresiyle!)
        public DbSet<Apya.Platform.Tasks.TaskComment> TaskComments { get; set; }
        public DbSet<TaskAttachment> TaskAttachments { get; set; }
        public DbSet<TaskDependency> TaskDependencies { get; set; }

        /* --- BİLDİRİM MODÜLÜ --- */
        public DbSet<Notification> Notifications { get; set; }

        /* --- TAKVİM MODÜLÜ --- */
        public DbSet<ExternalCalendarAccount> ExternalCalendarAccounts { get; set; }
        public DbSet<CalendarSyncMapping> CalendarSyncMappings { get; set; }


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


            /* --- PROJE MODÜLÜ YAPILANDIRMASI --- */

            builder.Entity<Project>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Projects", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(128);
                b.Property(x => x.Code).IsRequired().HasMaxLength(32);
                b.HasOne<Grant>().WithMany().HasForeignKey(x => x.GrantId);
            });

            builder.Entity<ProjectAnalysis>(b =>
            {
                b.ToTable("AppProjectAnalyses");
                b.ConfigureByConvention();
            });

            builder.Entity<Grant>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Grants", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(128);
                b.Property(x => x.Issuer).IsRequired().HasMaxLength(64);
                b.Property(x => x.MinMatchScore).IsRequired();
                b.Property(x => x.MaxAmount).IsRequired();
            });

            builder.Entity<ProjectTask>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ProjectTasks", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Title).IsRequired().HasMaxLength(256);
                b.HasOne<Project>().WithMany().HasForeignKey(x => x.ProjectId).IsRequired();
            });

            // YENİ: Project SubTask Yapılandırması
            builder.Entity<Apya.Platform.Projects.SubTask>(b =>
            {
                // Tablo adını ProjectSubTasks yaptık ki eskilerle çakışmasın
                b.ToTable(PlatformConsts.DbTablePrefix + "ProjectSubTasks", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasOne<Apya.Platform.Projects.ProjectTask>().WithMany(x => x.SubTasks).HasForeignKey(x => x.ProjectTaskId).IsRequired();
            });

            // YENİ: Project Task Comment Yapılandırması
            builder.Entity<Apya.Platform.Projects.TaskComment>(b =>
            {
                // Tablo adını ProjectTaskComments yaptık
                b.ToTable(PlatformConsts.DbTablePrefix + "ProjectTaskComments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasOne<Apya.Platform.Projects.ProjectTask>().WithMany(x => x.Comments).HasForeignKey(x => x.ProjectTaskId).IsRequired();
            });

            builder.Entity<ProjectAttachment>(b =>
            {
                b.ToTable("AppProjectAttachments");
                b.ConfigureByConvention();
            });


            /* --- ESKİ / DİĞER TASK MODÜLÜ YAPILANDIRMASI --- */

            builder.Entity<TaskItem>(b =>
            {
                b.ToTable("AppTasks");
                b.ConfigureByConvention();

                b.HasOne(t => t.Assignee)
                 .WithMany()
                 .HasForeignKey(t => t.AssigneeId)
                 .OnDelete(DeleteBehavior.SetNull);

                b.HasOne(t => t.ParentTask)
                 .WithMany(t => t.SubTasks)
                 .HasForeignKey(t => t.ParentTaskId)
                 .IsRequired(false)
                 .OnDelete(DeleteBehavior.Restrict);

                b.HasMany(t => t.Comments)
                 .WithOne()
                 .HasForeignKey(c => c.TaskId)
                 .IsRequired();

                b.HasMany(t => t.Attachments)
                 .WithOne()
                 .HasForeignKey(a => a.TaskId)
                 .IsRequired();
            });

            builder.Entity<Apya.Platform.Tasks.TaskComment>(b =>
            {
                b.ToTable("AppTaskComments");
                b.ConfigureByConvention();
            });

            builder.Entity<TaskAttachment>(b =>
            {
                b.ToTable("AppTaskAttachments");
                b.ConfigureByConvention();
            });

            builder.Entity<TaskDependency>(b =>
            {
                b.ToTable("AppTaskDependencies");
                b.ConfigureByConvention();
                b.HasIndex(x => new { x.TaskId, x.PredecessorTaskId });
            });

            /* --- BİLDİRİM MODÜLÜ YAPILANDIRMASI --- */
            builder.Entity<Notification>(b =>
            {
                b.ToTable("AppNotifications");
                b.ConfigureByConvention();
                b.Property(x => x.Title).IsRequired().HasMaxLength(NotificationConsts.MaxTitleLength);
                b.Property(x => x.Body).HasMaxLength(NotificationConsts.MaxBodyLength);
                b.Property(x => x.EntityType).HasMaxLength(NotificationConsts.MaxEntityType);
                // Performans için index
                b.HasIndex(x => new { x.UserId, x.IsRead });
                b.HasIndex(x => x.CreationTime);
            });

            /* --- TAKVİM MODÜLÜ YAPILANDIRMASI --- */
            builder.Entity<ExternalCalendarAccount>(b =>
            {
                b.ToTable("AppExternalCalendarAccounts");
                b.ConfigureByConvention();
                b.Property(x => x.ExternalEmail).IsRequired().HasMaxLength(256);
                b.Property(x => x.AccessToken).IsRequired();
                b.HasIndex(x => new { x.UserId, x.Provider });
            });

            builder.Entity<CalendarSyncMapping>(b =>
            {
                b.ToTable("AppCalendarSyncMappings");
                b.ConfigureByConvention();
                b.HasIndex(x => new { x.TaskId, x.ExternalCalendarAccountId });
                b.HasIndex(x => x.ExternalEventId);
            });
        }
    }
}