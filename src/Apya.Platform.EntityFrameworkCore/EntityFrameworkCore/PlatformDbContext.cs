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
using Apya.Platform.Invoices;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Webhooks;
using Apya.Platform.AssetRelations;

using Apya.Platform.Tasks.Drafts;
using Apya.Platform.EntityFrameworkCore.Configuration;

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
        // (BUG-001) ProjectTask, ProjectSubTasks, ProjectTaskComments kaldırıldı.
        public DbSet<Grant> Grants { get; set; }


        /* --- ESKİ/DİĞER TASK MODÜLÜ TABLOLARI --- */
        public DbSet<TaskItem> Tasks { get; set; }
        // DİKKAT: Eski Task modülündeki yorumlar (Açık Adresiyle!)
        public DbSet<Apya.Platform.Tasks.TaskComment> TaskComments { get; set; }
        public DbSet<TaskAttachment> TaskAttachments { get; set; }
        public DbSet<TaskDependency> TaskDependencies { get; set; }
        public DbSet<DraftTaskItem> DraftTasks { get; set; }
        public DbSet<TaskTimeLog> TaskTimeLogs { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        public DbSet<Payment> Payments { get; set; }

        /* --- BİLDİRİM MODÜLÜ --- */
        public DbSet<Notification> Notifications { get; set; }

        /* --- TAKVİM MODÜLÜ --- */
        public DbSet<ExternalCalendarAccount> ExternalCalendarAccounts { get; set; }
        public DbSet<CalendarSyncMapping> CalendarSyncMappings { get; set; }

        /* --- DOKÜMAN (WIKI) MODÜLÜ --- */
        public DbSet<Apya.Platform.Documents.Document> Documents { get; set; }

        /* --- DİNAMİK VARLIKLAR (DYNAMIC ASSETS) MODÜLÜ --- */
        public DbSet<AppDocument> AppDocuments { get; set; }
        public DbSet<AppBlock> AppBlocks { get; set; }
        public DbSet<AppResponse> AppResponses { get; set; }

        /* --- POLİMORFİK BAĞLANTI (ASSET RELATIONS) MODÜLÜ --- */
        public DbSet<EntityLink> EntityLinks { get; set; }

        /* --- WEBHOOK (DYNAMIC ASSETS WEBHOOKS) MODÜLÜ --- */
        public DbSet<WebhookSubscription> WebhookSubscriptions { get; set; }
        public DbSet<WebhookDeliveryLog> WebhookDeliveryLogs { get; set; }


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

        public DbSet<Apya.Platform.Tenants.TenantProfile> TenantProfiles { get; set; }

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

            /* --- TENANT PROFILE YAPILANDIRMASI --- */
            builder.Entity<Apya.Platform.Tenants.TenantProfile>(b => 
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TenantProfiles", PlatformConsts.DbSchema);
                b.ConfigureByConvention(); // Auto configure for the base class props
                b.HasIndex(x => x.TenantId).IsUnique(); // 1:1 relation logic
                b.Property(x => x.TaxNumber).HasMaxLength(50);
                b.Property(x => x.CorporateEmail).HasMaxLength(256);
            });

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

            // (BUG-001) ProjectTask, SubTask, ProjectTaskComment konfigürasyonları kaldırıldı.

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

                // REV-004: Performans indeksleri
                b.HasIndex(x => x.ProjectId);
                b.HasIndex(x => x.ParentTaskId);
                b.HasIndex(x => new { x.Status, x.AssigneeId });
            });

            builder.Entity<Apya.Platform.Tasks.TaskComment>(b =>
            {
                b.ToTable("AppTaskComments");
                b.ConfigureByConvention();
                b.HasIndex(x => x.TaskId); // REV-004
            });

            builder.Entity<TaskAttachment>(b =>
            {
                b.ToTable("AppTaskAttachments");
                b.ConfigureByConvention();
                b.HasIndex(x => x.TaskId); // REV-004
            });

            // APYA-30: TaskDependency
            builder.Entity<TaskDependency>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskDependencies", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasIndex(x => new { x.TaskId, x.PredecessorTaskId }).IsUnique();
            });

            // FEA-007: DraftTaskItem
            builder.Entity<DraftTaskItem>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DraftTasks", PlatformConsts.DbSchema);
                b.ConfigureByConvention(); 
                b.Property(x => x.Title).IsRequired().HasMaxLength(200);
                b.HasIndex(x => x.ImportBatchId); // O batch'i kolayca çekebilmek için
            });

            builder.Entity<TaskTimeLog>(b =>
            {
                b.ToTable("AppTaskTimeLogs");
                b.ConfigureByConvention();
                b.HasIndex(x => new { x.TaskId, x.UserId });
            });

            builder.Entity<Invoice>(b =>
            {
                b.ToTable("AppInvoices");
                b.ConfigureByConvention();
                b.HasIndex(x => x.InvoiceNumber).IsUnique();
                b.HasIndex(x => x.ProjectId);
                b.HasIndex(x => x.Status);
                b.HasMany(x => x.Items).WithOne().HasForeignKey(x => x.InvoiceId).IsRequired();
            });

            builder.Entity<InvoiceItem>(b =>
            {
                b.ToTable("AppInvoiceItems");
                b.ConfigureByConvention();
            });

            builder.Entity<Payment>(b =>
            {
                b.ToTable("AppPayments");
                b.ConfigureByConvention();
                b.HasIndex(x => x.InvoiceId);
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

            /* --- DOKÜMAN (WIKI) YAPILANDIRMASI --- */
            builder.Entity<Apya.Platform.Documents.Document>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Documents", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                
                b.Property(x => x.Title).IsRequired().HasMaxLength(255);
                b.Property(x => x.Content).HasColumnType("nvarchar(max)"); // Özelleştirilmiş uzunluk / Markdown desteği
                b.Property(x => x.Icon).HasMaxLength(16);

                // Hierarchy relation (Self-referencing)
                b.HasOne<Apya.Platform.Documents.Document>()
                 .WithMany()
                 .HasForeignKey(x => x.ParentDocumentId)
                 .OnDelete(DeleteBehavior.Restrict);

                // Project relation
                b.HasOne<Project>()
                 .WithMany()
                 .HasForeignKey(x => x.ProjectId)
                 .OnDelete(DeleteBehavior.SetNull);

                b.HasIndex(x => x.ProjectId);
                b.HasIndex(x => x.ParentDocumentId);
            });

            /* --- DİNAMİK VARLIKLAR (DYNAMIC ASSETS) YAPILANDIRMASI --- */
            builder.ApplyConfiguration(new AppDocumentConfiguration());
            builder.ApplyConfiguration(new AppBlockConfiguration());
            builder.ApplyConfiguration(new AppResponseConfiguration());

            /* --- POLİMORFİK BAĞLANTI (ASSET RELATIONS) YAPILANDIRMASI --- */
            builder.ApplyConfiguration(new EntityLinkConfiguration());

            /* --- WEBHOOK (DYNAMIC ASSETS WEBHOOKS) YAPILANDIRMASI --- */
            builder.ApplyConfiguration(new WebhookSubscriptionConfiguration());
            builder.ApplyConfiguration(new WebhookDeliveryLogConfiguration());
        }
    }
}