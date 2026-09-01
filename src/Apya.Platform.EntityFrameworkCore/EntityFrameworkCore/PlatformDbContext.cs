using Microsoft.EntityFrameworkCore;
using Volo.Abp.AuditLogging;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.FeatureManagement;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.OpenIddict.Applications;
using Volo.Abp.OpenIddict.Authorizations;
using Volo.Abp.OpenIddict.EntityFrameworkCore;
using Volo.Abp.OpenIddict.Scopes;
using Volo.Abp.OpenIddict.Tokens;
using Volo.Abp.PermissionManagement;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;

using Apya.Platform.Customers;
using Apya.Platform.CustomerLedger;
using Apya.Platform.CashAccounts;
using Apya.Platform.CashMovements;
using Apya.Platform.Expenses;
using Apya.Platform.Incomes;
using Apya.Platform.ExchangeRates;
using Apya.Platform.FxRevaluations;
using Apya.Platform.Projects;
using Apya.Platform.ProjectBudgets;
using Apya.Platform.Grants;
using Apya.Platform.Tasks;
using Apya.Platform.Notifications;
using Apya.Platform.Feedbacks;
using Apya.Platform.Telemetry;
using Apya.Platform.IssueTasks;
using Apya.Platform.Calendars;
using Apya.Platform.Invoices;
using Apya.Platform.DynamicAssets;
using Apya.Platform.DynamicAssets.Webhooks;
using Apya.Platform.AssetRelations;

using Apya.Platform.Ai.Drafts;
using Apya.Platform.EntityFrameworkCore.Configuration;
using Apya.Platform.Ai;

namespace Apya.Platform.EntityFrameworkCore
{
    [ReplaceDbContext(typeof(IIdentityDbContext))]
    [ReplaceDbContext(typeof(ITenantManagementDbContext))]
    [ReplaceDbContext(typeof(IPermissionManagementDbContext))]
    [ReplaceDbContext(typeof(ISettingManagementDbContext))]
    [ReplaceDbContext(typeof(IFeatureManagementDbContext))]
    [ReplaceDbContext(typeof(IBackgroundJobsDbContext))]
    [ReplaceDbContext(typeof(IAuditLoggingDbContext))]
    [ReplaceDbContext(typeof(IOpenIddictDbContext))]
    [ConnectionStringName("Default")]
    public class PlatformDbContext :
        AbpDbContext<PlatformDbContext>,
        IIdentityDbContext,
        ITenantManagementDbContext,
        IPermissionManagementDbContext,
        ISettingManagementDbContext,
        IFeatureManagementDbContext,
        IBackgroundJobsDbContext,
        IAuditLoggingDbContext,
        IOpenIddictDbContext
    {
        // --- ABP Permission Management (IPermissionManagementDbContext) ---
        public DbSet<PermissionGroupDefinitionRecord> PermissionGroups { get; set; }
        public DbSet<PermissionDefinitionRecord> Permissions { get; set; }
        public DbSet<PermissionGrant> PermissionGrants { get; set; }

        // --- ABP Setting Management (ISettingManagementDbContext) ---
        public DbSet<Setting> Settings { get; set; }
        public DbSet<SettingDefinitionRecord> SettingDefinitionRecords { get; set; }

        // --- ABP Feature Management (IFeatureManagementDbContext) ---
        public DbSet<FeatureGroupDefinitionRecord> FeatureGroups { get; set; }
        public DbSet<FeatureDefinitionRecord> Features { get; set; }
        public DbSet<FeatureValue> FeatureValues { get; set; }

        // --- ABP Background Jobs (IBackgroundJobsDbContext) ---
        public DbSet<BackgroundJobRecord> BackgroundJobs { get; set; }

        // --- ABP Audit Logging (IAuditLoggingDbContext) ---
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<AuditLogExcelFile> AuditLogExcelFiles { get; set; }

        // --- ABP OpenIddict (IOpenIddictDbContext) ---
        public DbSet<OpenIddictApplication> Applications { get; set; }
        public DbSet<OpenIddictAuthorization> Authorizations { get; set; }
        public DbSet<OpenIddictScope> Scopes { get; set; }
        public DbSet<OpenIddictToken> Tokens { get; set; }

        /* --- CARİ (MÜŞTERİ) MODÜLÜ TABLOLARI --- */
        public DbSet<Customer> Customers { get; set; }
        public DbSet<CustomerLedgerEntry> CustomerLedgerEntries { get; set; }
        public DbSet<CashAccount> CashAccounts { get; set; }
        public DbSet<ExchangeRate> ExchangeRates { get; set; }
        public DbSet<CashMovement> CashMovements { get; set; }
        public DbSet<Expense> Expenses { get; set; }
        public DbSet<IncomeEntry> IncomeEntries { get; set; }
        public DbSet<FxRevaluationSnapshot> FxRevaluationSnapshots { get; set; }

        /* --- PROJE MODÜLÜ TABLOLARI --- */
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectCategoryDefinition> ProjectCategories { get; set; }

        /* Proje bütçesi — kalem kırılımı, fonlama dilimleri, kesinti ve revizyon geçmişi */
        public DbSet<ProjectBudgetLine> ProjectBudgetLines { get; set; }
        public DbSet<FundingTranche> FundingTranches { get; set; }
        public DbSet<TrancheDeduction> TrancheDeductions { get; set; }
        public DbSet<BudgetRevision> BudgetRevisions { get; set; }
        public DbSet<BudgetRevisionLine> BudgetRevisionLines { get; set; }
        // (BUG-001) ProjectTask, ProjectSubTasks, ProjectTaskComments kaldırıldı.
        public DbSet<Grant> Grants { get; set; }
        public DbSet<GrantCall> GrantCalls { get; set; }
        public DbSet<GrantCriteriaTag> GrantCriteriaTags { get; set; }
        public DbSet<FirmProfile> FirmProfiles { get; set; }
        public DbSet<FirmProfileTag> FirmProfileTags { get; set; }
        public DbSet<GrantApplication> GrantApplications { get; set; }
        public DbSet<GrantRecommendation> GrantRecommendations { get; set; }
        public DbSet<GrantDisbursementTranche> GrantDisbursementTranches { get; set; }
        public DbSet<GrantMilestone> GrantMilestones { get; set; }


        /* --- ESKİ/DİĞER TASK MODÜLÜ TABLOLARI --- */
        public DbSet<TaskItem> Tasks { get; set; }
        // DİKKAT: Eski Task modülündeki yorumlar (Açık Adresiyle!)
        public DbSet<Apya.Platform.Tasks.TaskComment> TaskComments { get; set; }
        public DbSet<TaskAttachment> TaskAttachments { get; set; }
        public DbSet<TaskShareLink> TaskShareLinks { get; set; }
        public DbSet<TaskShareAccessLog> TaskShareAccessLogs { get; set; }
        public DbSet<TaskDependency> TaskDependencies { get; set; }
        public DbSet<TaskTimeLog> TaskTimeLogs { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<TaskTagAssignment> TaskTagAssignments { get; set; }
        public DbSet<TaskFeatureAssignment> TaskFeatureAssignments { get; set; }
        public DbSet<TaskChecklistItem> TaskChecklistItems { get; set; }
        public DbSet<TaskFavorite> TaskFavorites { get; set; }
        public DbSet<TaskWatcher> TaskWatchers { get; set; }
        public DbSet<TaskTemplate> TaskTemplates { get; set; }
        public DbSet<TaskTemplateItem> TaskTemplateItems { get; set; }
        public DbSet<TaskTemplateFeature> TaskTemplateFeatures { get; set; }
        public DbSet<TaskTemplateTag> TaskTemplateTags { get; set; }
        public DbSet<Apya.Platform.Projects.BoardColumn> BoardColumns { get; set; } // Faz 2: configure edilebilir kanban
        public DbSet<Apya.Platform.Projects.ProjectMember> ProjectMembers { get; set; } // Konsol 8. adım: ekip yönetimi
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        public DbSet<Payment> Payments { get; set; }

        /* --- BİLDİRİM MODÜLÜ --- */
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<NotificationPreference> NotificationPreferences { get; set; }

        /* --- GERİ BİLDİRİM MODÜLÜ --- */
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<FeedbackComment> FeedbackComments { get; set; }
        public DbSet<FeedbackAttachment> FeedbackAttachments { get; set; }
        public DbSet<FeedbackActivity> FeedbackActivities { get; set; }

        /* --- İSTEMCİ HATA TELEMETRİSİ --- */
        public DbSet<ClientError> ClientErrors { get; set; }

        /* --- SİNYALDEN GÖREVE KÖPRÜSÜ --- */
        public DbSet<IssueTaskLink> IssueTaskLinks { get; set; }

        /* --- RIZA / KVKK OMURGASI --- */
        public DbSet<Apya.Platform.Consents.ConsentRecord> ConsentRecords { get; set; }

        /* --- DEMO TALEPLERİ (giriş ekranı) --- */
        public DbSet<Apya.Platform.DemoRequests.DemoRequest> DemoRequests { get; set; }

        /* --- DASHBOARD --- */
        public DbSet<Apya.Platform.Dashboard.DashboardLayout> DashboardLayouts { get; set; }

        /* --- TAKVİM MODÜLÜ --- */
        public DbSet<ExternalCalendarAccount> ExternalCalendarAccounts { get; set; }
        public DbSet<CalendarSyncMapping> CalendarSyncMappings { get; set; }
        public DbSet<CalendarSyncLogEntry> CalendarSyncLogEntries { get; set; }
        public DbSet<CalendarFeedToken> CalendarFeedTokens { get; set; }
        public DbSet<IcalSubscription> IcalSubscriptions { get; set; }

        /* --- DOKÜMAN (WIKI) MODÜLÜ --- */
        public DbSet<Apya.Platform.Documents.Document> Documents { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentAttachment> DocumentAttachments { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentAccessLog> DocumentAccessLogs { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentFile> DocumentFiles { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentType> DocumentTypes { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentTypeField> DocumentTypeFields { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentFieldValue> DocumentFieldValues { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentTag> DocumentTags { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentFileTag> DocumentFileTags { get; set; }
        public DbSet<ProjectWorkStep> ProjectWorkSteps { get; set; }
        public DbSet<Apya.Platform.Documents.CompliancePackage> CompliancePackages { get; set; }
        public DbSet<Apya.Platform.Documents.ComplianceRequirement> ComplianceRequirements { get; set; }
        public DbSet<Apya.Platform.Documents.ComplianceAssignment> ComplianceAssignments { get; set; }
        public DbSet<Apya.Platform.Documents.ComplianceItemState> ComplianceItemStates { get; set; }
        public DbSet<Apya.Platform.Documents.ReportTemplate> ReportTemplates { get; set; }
        public DbSet<Apya.Platform.Documents.ReportSection> ReportSections { get; set; }
        public DbSet<Apya.Platform.Documents.ReportRun> ReportRuns { get; set; }
        public DbSet<Apya.Platform.Documents.DeliveryPackage> DeliveryPackages { get; set; }
        public DbSet<Apya.Platform.Documents.DeliveryPackageItem> DeliveryPackageItems { get; set; }
        public DbSet<Apya.Platform.Documents.ExternalShareLink> ExternalShareLinks { get; set; }
        public DbSet<Apya.Platform.Documents.ExternalShareAccessLog> ExternalShareAccessLogs { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentRule> DocumentRules { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentRuleCondition> DocumentRuleConditions { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentRuleAction> DocumentRuleActions { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentRuleRun> DocumentRuleRuns { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentSuggestionDismissal> DocumentSuggestionDismissals { get; set; }
        public DbSet<Apya.Platform.Documents.ReportSchedule> ReportSchedules { get; set; }
        public DbSet<Apya.Platform.Documents.ReportSubscriber> ReportSubscribers { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentFieldPermission> DocumentFieldPermissions { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentIntegration> DocumentIntegrations { get; set; }
        public DbSet<Apya.Platform.Documents.DocumentExpenseMatch> DocumentExpenseMatches { get; set; }
        public DbSet<ProjectRisk> ProjectRisks { get; set; }

        /* --- AI MODÜLÜ --- */
        public DbSet<DraftBatch> DraftBatches { get; set; }
        public DbSet<DraftTaskItem> DraftTasks { get; set; }
        public DbSet<AiRequest> AiRequests { get; set; }
        public DbSet<AiDecisionTrace> AiDecisionTraces { get; set; }
        public DbSet<Apya.Platform.Ai.Tenants.TenantAiSettings> TenantAiSettings { get; set; }

        /* --- AI DEĞERLENDİRME MERKEZİ — PROMPT YÖNETİMİ (S1) --- */
        public DbSet<Apya.Platform.Ai.Prompts.PromptCategory> AiPromptCategories { get; set; }
        public DbSet<Apya.Platform.Ai.Prompts.Prompt> AiPrompts { get; set; }
        public DbSet<Apya.Platform.Ai.Prompts.PromptVersion> AiPromptVersions { get; set; }

        /* --- AI DEĞERLENDİRME MERKEZİ — PROVIDER YAPILANDIRMASI (S2) --- */
        public DbSet<Apya.Platform.Ai.Providers.AiProviderConfig> AiProviderConfigs { get; set; }

        /* --- AI DEĞERLENDİRME MERKEZİ — DEĞERLENDİRME PIPELINE (S3) --- */
        public DbSet<Apya.Platform.Ai.Bindings.AiFormBinding> AiFormBindings { get; set; }
        public DbSet<Apya.Platform.Ai.Evaluations.AiEvaluation> AiEvaluations { get; set; }
        public DbSet<Apya.Platform.Ai.Evaluations.AiEvaluationResult> AiEvaluationResults { get; set; }

        /* --- AI DEĞERLENDİRME MERKEZİ — WORKFLOW (S4) --- */
        public DbSet<Apya.Platform.Ai.Workflows.AiWorkflow> AiWorkflows { get; set; }
        public DbSet<Apya.Platform.Ai.Workflows.AiWorkflowRule> AiWorkflowRules { get; set; }

        /* --- DİNAMİK VARLIKLAR (DYNAMIC ASSETS) MODÜLÜ --- */
        public DbSet<AppDocument> AppDocuments { get; set; }
        public DbSet<AppBlock> AppBlocks { get; set; }
        public DbSet<AppResponse> AppResponses { get; set; }
        public DbSet<FormCategory> FormCategories { get; set; }
        public DbSet<ResponseComment> ResponseComments { get; set; }

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

        public DbSet<Apya.Platform.Tenants.TenantSubscription> TenantSubscriptions { get; set; }

        public DbSet<Apya.Platform.Tenants.PlatformPackage> PlatformPackages { get; set; }
        public DbSet<Apya.Platform.Tenants.PlatformPackageFeature> PlatformPackageFeatures { get; set; }
        public DbSet<Apya.Platform.Tenants.PlatformPackagePermission> PlatformPackagePermissions { get; set; }

        #endregion

        public PlatformDbContext(DbContextOptions<PlatformDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Provider-özel SQL parçaları için (filtered index WHERE, kolon tipi remap).
            var isSqlServer = Database.ProviderName == "Microsoft.EntityFrameworkCore.SqlServer";

            /* Include modules to your migration db context */
            builder.ConfigurePermissionManagement();
            builder.ConfigureSettingManagement();
            builder.ConfigureBackgroundJobs();
            builder.ConfigureAuditLogging();
            builder.ConfigureIdentity();
            builder.ConfigureOpenIddict();
            builder.ConfigureFeatureManagement();
            builder.ConfigureTenantManagement();

            /* AI bounded context — entity mappings come in 109.3 */
            builder.ConfigureAi();

            /* --- TENANT PROFILE YAPILANDIRMASI --- */
            builder.Entity<Apya.Platform.Tenants.TenantProfile>(b => 
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TenantProfiles", PlatformConsts.DbSchema);
                b.ConfigureByConvention(); // Auto configure for the base class props
                b.HasIndex(x => x.TenantId).IsUnique(); // 1:1 relation logic
                b.Property(x => x.TaxNumber).HasMaxLength(50);
                b.Property(x => x.CorporateEmail).HasMaxLength(256);
                // Paket (edition): mevcut profiller migration'da Basic'e düşsün (enum 0 değil).
                b.Property(x => x.PackageCode).HasDefaultValue(Apya.Platform.Tenants.PackageCode.Basic);
            });

            /* --- ABONELİK (PAKET SÜRESİ) — host-side, TenantProfile ile aynı ray --- */
            builder.Entity<Apya.Platform.Tenants.TenantSubscription>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TenantSubscriptions", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.ExternalReference).HasMaxLength(128);
                // Yürürlükteki aboneliği bulma sorgusu: süre işleyicisi her turda, kiracı
                // listesi her sayfada sorar. TenantId tek başına yetmez — geçmiş satırlar
                // (Superseded/Expired) zamanla birikir.
                b.HasIndex(x => new { x.TenantId, x.Status });
                // Süre işleyicisinin tarama sorgusu: bitişi gelmiş satırlar.
                b.HasIndex(x => x.EndDate);
            });

            /* --- PAKET (EDITION) — Faz 2: host-side, düzenlenebilir --- */
            builder.Entity<Apya.Platform.Tenants.PlatformPackage>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "PlatformPackages", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(64);
                b.Property(x => x.Description).HasMaxLength(256);
                b.HasIndex(x => x.Code).IsUnique();
                b.HasMany(x => x.Features).WithOne().HasForeignKey(f => f.PackageId).IsRequired();
                b.HasMany(x => x.Permissions).WithOne().HasForeignKey(p => p.PackageId).IsRequired();
            });
            builder.Entity<Apya.Platform.Tenants.PlatformPackageFeature>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "PlatformPackageFeatures", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.FeatureName).IsRequired().HasMaxLength(128);
                b.Property(x => x.Value).IsRequired().HasMaxLength(64);
                b.HasIndex(x => new { x.PackageId, x.FeatureName }).IsUnique();
            });
            builder.Entity<Apya.Platform.Tenants.PlatformPackagePermission>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "PlatformPackagePermissions", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.PermissionName).IsRequired().HasMaxLength(128);
                // Soft-delete YOK (Entity<Guid>) → filtresiz tekil indeks güvenli:
                // çıkarılan izin satırı gerçekten silinir, tekrar eklenebilir.
                b.HasIndex(x => new { x.PackageId, x.PermissionName }).IsUnique();
            });

            /* --- CARİ (MÜŞTERİ) MODÜLÜ YAPILANDIRMASI --- */
            builder.Entity<Customer>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Customers", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(CustomerConsts.MaxNameLength);
                b.Property(x => x.TaxNumber).HasMaxLength(CustomerConsts.MaxTaxNumberLength);
                b.Property(x => x.TaxOffice).HasMaxLength(CustomerConsts.MaxTaxOfficeLength);
                b.Property(x => x.Address).HasMaxLength(CustomerConsts.MaxAddressLength);
                b.Property(x => x.Phone).HasMaxLength(CustomerConsts.MaxPhoneLength);
                b.Property(x => x.Email).HasMaxLength(CustomerConsts.MaxEmailLength);
                b.Property(x => x.Notes).HasMaxLength(CustomerConsts.MaxNotesLength);
                b.HasIndex(x => new { x.TenantId, x.Name });
                b.HasIndex(x => new { x.TenantId, x.IsActive });
            });

            /* --- CARİ HAREKET (CUSTOMER LEDGER) MODÜLÜ YAPILANDIRMASI — APYA-142 --- */
            builder.Entity<CustomerLedgerEntry>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "CustomerLedgerEntries", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Amount).HasColumnType("decimal(18,2)");
                b.Property(x => x.Currency).IsRequired().HasMaxLength(CustomerLedgerConsts.CurrencyLength);
                b.Property(x => x.Description).HasMaxLength(CustomerLedgerConsts.MaxDescriptionLength);
                b.HasOne<Customer>().WithMany().HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.Restrict);
                b.HasIndex(x => new { x.TenantId, x.CustomerId, x.EntryDate });
                b.HasIndex(x => x.ReferenceId);
            });

            /* --- KASA MODÜLÜ YAPILANDIRMASI — APYA-133 --- */
            builder.Entity<CashAccount>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "CashAccounts", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(CashAccountConsts.MaxNameLength);
                b.Property(x => x.Currency).IsRequired().HasMaxLength(CashAccountConsts.CurrencyLength);
                b.Property(x => x.Description).HasMaxLength(CashAccountConsts.MaxDescriptionLength);
                b.Property(x => x.BankName).HasMaxLength(CashAccountConsts.MaxBankNameLength);
                b.Property(x => x.Branch).HasMaxLength(CashAccountConsts.MaxBranchLength);
                b.Property(x => x.Iban).HasMaxLength(CashAccountConsts.MaxIbanLength);
                b.Property(x => x.OpeningBalance).HasColumnType("decimal(18,2)");
                b.HasIndex(x => new { x.TenantId, x.Name });
                b.HasIndex(x => new { x.TenantId, x.Type });
            });

            /* --- YIL SONU DEĞERLEME MODÜLÜ YAPILANDIRMASI — APYA-138 --- */
            builder.Entity<FxRevaluationSnapshot>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "FxRevaluationSnapshots", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.TotalTryValue).HasColumnType("decimal(18,2)");
                b.Property(x => x.Notes).HasMaxLength(500);
                b.HasMany(x => x.Lines).WithOne().HasForeignKey(x => x.SnapshotId).IsRequired();
                b.HasIndex(x => new { x.TenantId, x.AsOfDate });
            });
            builder.Entity<FxRevaluationLine>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "FxRevaluationLines", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.CashAccountName).IsRequired().HasMaxLength(200);
                b.Property(x => x.Currency).IsRequired().HasMaxLength(3);
                b.Property(x => x.Balance).HasColumnType("decimal(18,2)");
                b.Property(x => x.Rate).HasColumnType("decimal(18,6)");
                b.Property(x => x.TryValue).HasColumnType("decimal(18,2)");
            });

            /* --- GİDER MODÜLÜ YAPILANDIRMASI — APYA-135 --- */
            builder.Entity<Expense>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Expenses", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Title).IsRequired().HasMaxLength(ExpenseConsts.MaxTitleLength);
                b.Property(x => x.Description).HasMaxLength(ExpenseConsts.MaxDescriptionLength);
                b.Property(x => x.Currency).IsRequired().HasMaxLength(ExpenseConsts.CurrencyLength);
                b.Property(x => x.Amount).HasColumnType("decimal(18,2)");
                b.HasOne<CashAccount>().WithMany().HasForeignKey(x => x.CashAccountId).OnDelete(DeleteBehavior.Restrict);
                b.HasIndex(x => new { x.TenantId, x.ExpenseDate });
                b.HasIndex(x => new { x.TenantId, x.Category });
                b.HasIndex(x => x.ProjectId);
                b.HasIndex(x => x.TaskId);
                b.HasIndex(x => x.CustomerId);
                // Kalem tablosundaki "Harcanan" kolonu bu indeks üzerinden toplanır.
                // FK KURULMADI: kalem silinince gideri de silmek ya da güncellemek
                // istemiyoruz — silme zaten ProjectBudgetManager'da bağlı kayıt varsa
                // reddediliyor, ikinci bir kaskad davranışı yalnız sürpriz üretir.
                b.HasIndex(x => x.BudgetLineId);
                b.Property(x => x.BookAmount).HasColumnType("decimal(18,2)");
                b.Property(x => x.BookRate).HasColumnType("decimal(18,6)");
                b.Property(x => x.DonorAmount).HasColumnType("decimal(18,2)");
                b.Property(x => x.DonorRate).HasColumnType("decimal(18,6)");
            });

            /* --- GELİR MODÜLÜ YAPILANDIRMASI — APYA-142d --- */
            builder.Entity<IncomeEntry>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "IncomeEntries", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Title).IsRequired().HasMaxLength(IncomeConsts.MaxTitleLength);
                b.Property(x => x.Description).HasMaxLength(IncomeConsts.MaxDescriptionLength);
                b.Property(x => x.Currency).IsRequired().HasMaxLength(IncomeConsts.CurrencyLength);
                b.Property(x => x.Amount).HasColumnType("decimal(18,2)");
                b.HasIndex(x => new { x.TenantId, x.IncomeDate });
                b.HasIndex(x => new { x.TenantId, x.Category });
                b.HasIndex(x => x.ProjectId);
                b.HasIndex(x => x.TaskId);
                b.HasIndex(x => x.CustomerId);
                b.HasIndex(x => x.BudgetLineId); // gerekçe: Expense tarafındaki notla aynı
                b.Property(x => x.BookAmount).HasColumnType("decimal(18,2)");
                b.Property(x => x.BookRate).HasColumnType("decimal(18,6)");
                b.Property(x => x.DonorAmount).HasColumnType("decimal(18,2)");
                b.Property(x => x.DonorRate).HasColumnType("decimal(18,6)");
            });

            /* --- PROJE BÜTÇESİ — kalem / dilim / kesinti / revizyon --- */
            builder.Entity<ProjectBudgetLine>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ProjectBudgetLines", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Code).HasMaxLength(ProjectBudgetConsts.MaxCodeLength);
                b.Property(x => x.Name).IsRequired().HasMaxLength(ProjectBudgetConsts.MaxNameLength);
                b.Property(x => x.PlannedAmount).HasColumnType("decimal(18,2)");
                b.Property(x => x.ApprovedAmount).HasColumnType("decimal(18,2)");
                b.Property(x => x.TransferLimitPercent).HasColumnType("decimal(5,2)");
                b.HasOne<Project>().WithMany().HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(x => new { x.ProjectId, x.Order });
                // Kod tekilliği VERİTABANINDA zorlanmaz: boş kod serbest ve soft-delete
                // ile silinmiş bir kalemin kodu yeniden kullanılabilmeli. Kural
                // ProjectBudgetManager.EnsureCodeIsFreeAsync'te (silinmişleri saymaz).
                b.HasIndex(x => new { x.ProjectId, x.Code });
            });

            builder.Entity<FundingTranche>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "FundingTranches", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Title).HasMaxLength(ProjectBudgetConsts.MaxNameLength);
                b.Property(x => x.Note).HasMaxLength(ProjectBudgetConsts.MaxNoteLength);
                b.Property(x => x.PlannedAmount).HasColumnType("decimal(18,2)");
                b.Property(x => x.ReceivedAmount).HasColumnType("decimal(18,2)");
                b.HasOne<Project>().WithMany().HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(x => new { x.ProjectId, x.SequenceNo });
                b.HasIndex(x => x.IncomeEntryId);
                b.HasMany(x => x.Deductions).WithOne().HasForeignKey(x => x.TrancheId).IsRequired();
            });

            builder.Entity<TrancheDeduction>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TrancheDeductions", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Reason).IsRequired().HasMaxLength(ProjectBudgetConsts.MaxReasonLength);
                b.Property(x => x.Amount).HasColumnType("decimal(18,2)");
                b.HasIndex(x => x.TrancheId);
                b.HasIndex(x => x.BudgetRevisionId);
            });

            builder.Entity<BudgetRevision>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "BudgetRevisions", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Reason).HasMaxLength(ProjectBudgetConsts.MaxReasonLength);
                b.Property(x => x.TotalApprovedAmount).HasColumnType("decimal(18,2)");
                b.HasOne<Project>().WithMany().HasForeignKey(x => x.ProjectId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(x => new { x.ProjectId, x.RevisionNo });
                b.HasMany(x => x.Lines).WithOne().HasForeignKey(x => x.BudgetRevisionId).IsRequired();
            });

            builder.Entity<BudgetRevisionLine>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "BudgetRevisionLines", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.PreviousAmount).HasColumnType("decimal(18,2)");
                b.Property(x => x.NewAmount).HasColumnType("decimal(18,2)");
                b.HasIndex(x => x.BudgetLineId);
            });

            /* --- KASA HAREKETİ MODÜLÜ YAPILANDIRMASI — APYA-134 --- */
            builder.Entity<CashMovement>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "CashMovements", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Amount).HasColumnType("decimal(18,2)");
                b.Property(x => x.Description).HasMaxLength(CashMovementConsts.MaxDescriptionLength);
                b.HasOne<CashAccount>().WithMany().HasForeignKey(x => x.CashAccountId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(x => new { x.TenantId, x.CashAccountId, x.MovementDate });
                b.HasIndex(x => x.ReferenceId);
            });

            /* --- KUR MODÜLÜ YAPILANDIRMASI — APYA-137 --- */
            builder.Entity<ExchangeRate>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ExchangeRates", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.FromCurrency).IsRequired().HasMaxLength(ExchangeRateConsts.CurrencyLength);
                b.Property(x => x.ToCurrency).IsRequired().HasMaxLength(ExchangeRateConsts.CurrencyLength);
                b.Property(x => x.Rate).HasColumnType("decimal(18,6)");
                b.HasIndex(x => new { x.TenantId, x.FromCurrency, x.ToCurrency, x.RateDate });
            });

            /* --- PROJE MODÜLÜ YAPILANDIRMASI --- */

            builder.Entity<Project>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Projects", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(128);
                b.Property(x => x.Code).IsRequired().HasMaxLength(32);
                b.Property(x => x.CoverImageFileName).HasMaxLength(256);
                b.HasOne<Grant>().WithMany().HasForeignKey(x => x.GrantId);
                // APYA-132: Customer ilişkisi + Type filtreleme
                b.HasOne<Customer>().WithMany().HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.SetNull);
                b.HasIndex(x => x.CustomerId);
                b.HasOne<ProjectCategoryDefinition>().WithMany()
                    .HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
                b.HasIndex(x => new { x.TenantId, x.CategoryId });
                // Kur köprüsü: donör PB'si boşsa proje tek defterlidir.
                b.Property(x => x.DonorCurrency).HasMaxLength(3);
                b.Property(x => x.FixedDonorRate).HasColumnType("decimal(18,6)");
            });

            /* --- PROJE KATEGORİSİ TANIMLARI --- */
            builder.Entity<ProjectCategoryDefinition>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ProjectCategories", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(ProjectCategoryConsts.MaxNameLength);
                b.Property(x => x.Icon).IsRequired().HasMaxLength(ProjectCategoryConsts.MaxIconLength);
                b.Property(x => x.Tone).IsRequired().HasMaxLength(ProjectCategoryConsts.MaxToneLength);
                // Sistem kayıtları TenantId = null ile global tutulur; aynı ad kiracı
                // içinde tekrarlanamaz ama farklı kiracılar aynı adı kullanabilir.
                b.HasIndex(x => new { x.TenantId, x.Name }).IsUnique();
                b.HasIndex(x => x.SystemKey);
            });

            builder.Entity<Grant>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Grants", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(128);
                b.Property(x => x.Issuer).IsRequired().HasMaxLength(64);
                b.Property(x => x.MinMatchScore).IsRequired();
                b.Property(x => x.MaxAmount).IsRequired();
                b.Property(x => x.EligibleCompanySizes).IsRequired().HasDefaultValue(0);
            });

            builder.Entity<GrantCall>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "GrantCalls", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Period).IsRequired().HasMaxLength(32);
                b.Property(x => x.Reference).HasMaxLength(64);
                b.HasOne<Grant>().WithMany(g => g.Calls).HasForeignKey(x => x.GrantId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(x => x.GrantId);
                b.HasIndex(x => x.Deadline);
            });

            builder.Entity<GrantCriteriaTag>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "GrantCriteriaTags", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Value).IsRequired().HasMaxLength(64);
                b.HasOne<Grant>().WithMany(g => g.CriteriaTags).HasForeignKey(x => x.GrantId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(x => x.GrantId);
            });

            builder.Entity<FirmProfile>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "FirmProfiles", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                // Tenant başına tekil profil.
                b.HasIndex(x => x.TenantId).IsUnique();
            });

            builder.Entity<FirmProfileTag>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "FirmProfileTags", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Value).IsRequired().HasMaxLength(64);
                b.HasOne<FirmProfile>().WithMany(p => p.Tags).HasForeignKey(x => x.FirmProfileId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(x => x.FirmProfileId);
            });

            builder.Entity<GrantApplication>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "GrantApplications", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasOne<GrantCall>().WithMany().HasForeignKey(x => x.GrantCallId).OnDelete(DeleteBehavior.Cascade);
                // Aynı tenant + çağrı için tek başvuru.
                b.HasIndex(x => new { x.TenantId, x.GrantCallId }).IsUnique();
            });

            builder.Entity<GrantDisbursementTranche>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "GrantDisbursementTranches", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasOne<GrantApplication>().WithMany().HasForeignKey(x => x.GrantApplicationId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(x => x.GrantApplicationId);
            });

            builder.Entity<GrantMilestone>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "GrantMilestones", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Title).IsRequired().HasMaxLength(128);
                b.HasOne<GrantApplication>().WithMany().HasForeignKey(x => x.GrantApplicationId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(x => x.GrantApplicationId);
            });

            builder.Entity<GrantRecommendation>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "GrantRecommendations", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Note).HasMaxLength(256);
                b.HasOne<GrantCall>().WithMany().HasForeignKey(x => x.GrantCallId).OnDelete(DeleteBehavior.Cascade);
                // Aynı tenant + çağrı için tek (host-push) öneri kaydı — tekrar gönderim idempotent.
                b.HasIndex(x => new { x.TenantId, x.GrantCallId }).IsUnique();
            });

            // (BUG-001) ProjectTask, SubTask, ProjectTaskComment konfigürasyonları kaldırıldı.

            builder.Entity<ProjectAttachment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ProjectAttachments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.FileName).IsRequired().HasMaxLength(256);
                b.Property(x => x.StoredFileName).IsRequired().HasMaxLength(256);
                b.Property(x => x.ContentType).HasMaxLength(128);
                b.Property(x => x.Title).HasMaxLength(256);
                // Ek listesi daima proje bağlamında okunur (düzenleme ekranı, detay).
                b.HasIndex(x => x.ProjectId);
            });


            /* --- ESKİ / DİĞER TASK MODÜLÜ YAPILANDIRMASI --- */

            builder.Entity<TaskItem>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Tasks", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                // Bütçe bağı — FK KURULMADI, Expense/IncomeEntry ile aynı gerekçe:
                // kalem silme zaten ProjectBudgetManager'da bağlı kayıt varsa
                // reddediliyor; ikinci bir kaskad davranışı sürpriz üretir.
                b.Property(t => t.PlannedAmount).HasColumnType("decimal(18,2)");
                b.HasIndex(t => t.BudgetLineId);

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

                b.Property(x => x.TaskType).HasMaxLength(64);
                b.Property(x => x.Sprint).HasMaxLength(32);
                b.Property(x => x.EstimatedHours).HasPrecision(9, 2);
                b.Property(x => x.CancelReason).HasMaxLength(256); // Faz 4b: iptal nedeni

                // REV-004: Performans indeksleri
                b.HasIndex(x => x.ProjectId);
                // TenantId öneki: liste sorguları hep "TenantId + ParentTaskId IS NULL" (kök
                // görevler) ya da "TenantId + Status IN (...)" gelir; öneksiz hâlde SQL Server
                // diğer kiracıların satırlarını okuyup ayıklıyordu — maliyet kiracı sayısıyla
                // büyür. GUID kolonlu indeksler (ProjectId vb.) zaten seçici, önek gerekmez.
                b.HasIndex(x => new { x.TenantId, x.ParentTaskId });
                b.HasIndex(x => new { x.TenantId, x.Status, x.AssigneeId });

                /* Görev kodu (GRV-N) tenant içinde tekil. UNIQUE DEĞİL bilinçli olarak:
                   soft-delete'li görevler tabloda kalıyor ve numaraları serbest bırakılmıyor,
                   ama host bağlamında TenantId null olan satırlar da var — unique index
                   çok-kiracılı geçmiş veride kırılgan olur. MAX+1 ataması TaskManager'da
                   tek yerde yapılıyor; index yalnız o sorgunun (MAX) hızı için. */
                b.HasIndex(x => new { x.TenantId, x.Number });
            });

            builder.Entity<Apya.Platform.Tasks.TaskComment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskComments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasIndex(x => x.TaskId); // REV-004
                b.HasIndex(x => x.ParentCommentId); // Instagram tarzı yanıt sorgusu
                b.HasIndex(x => x.ShareLinkId); // misafir thread'i: linke bağlı yorumlar
            });

            builder.Entity<Apya.Platform.Projects.BoardColumn>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "BoardColumns", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(64);
                b.Property(x => x.ColorClass).HasMaxLength(32);
                b.HasIndex(x => x.ProjectId); // Faz 2: proje bazında kolon sorgusu
            });

            builder.Entity<Apya.Platform.Projects.ProjectMember>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ProjectMembers", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                // Aynı kullanıcı bir projeye iki kez eklenemez. IsDeleted filtreli DEĞİL:
                // ABP soft-delete kullandığı için silinmiş bir üyeyi yeniden eklemek
                // ihlal yaratırdı — AppService silinmiş kaydı yeniden canlandırıyor.
                b.HasIndex(x => new { x.ProjectId, x.UserId }).IsUnique();
            });

            builder.Entity<TaskAttachment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskAttachments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasIndex(x => x.TaskId); // REV-004
                b.HasIndex(x => x.ShareLinkId); // misafirin yüklediklerini linke göre listeleme
            });

            builder.Entity<TaskShareLink>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskShareLinks", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.TokenHash).IsRequired().HasMaxLength(TaskShareConsts.TokenHashLength);
                b.Property(x => x.RecipientName).IsRequired().HasMaxLength(TaskShareConsts.MaxRecipientNameLength);
                b.Property(x => x.RecipientEmail).HasMaxLength(TaskShareConsts.MaxRecipientEmailLength);

                // Anonim çözümleme yalnız bu indeksle çalışır; token'ın kendisi saklanmaz.
                b.HasIndex(x => x.TokenHash).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
                b.HasIndex(x => x.TaskId);
            });

            builder.Entity<TaskShareAccessLog>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskShareAccessLogs", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.IpHash).HasMaxLength(64);
                b.Property(x => x.UserAgent).HasMaxLength(400);

                b.HasOne<TaskShareLink>()
                 .WithMany()
                 .HasForeignKey(x => x.ShareLinkId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(x => new { x.ShareLinkId, x.CreationTime });
            });

            // APYA-30: TaskDependency
            builder.Entity<TaskDependency>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskDependencies", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasIndex(x => new { x.TaskId, x.PredecessorTaskId }).IsUnique();
            });

            builder.Entity<Tag>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Tags", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(64);
                b.HasIndex(x => new { x.TenantId, x.Name }); // tenant-bazlı isim araması/get-or-create
            });

            builder.Entity<TaskTagAssignment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskTagAssignments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasIndex(x => new { x.TaskId, x.TagId }).IsUnique();
            });

            builder.Entity<TaskFeatureAssignment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskFeatureAssignments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.FeatureCode).IsRequired().HasMaxLength(64);
                b.HasIndex(x => new { x.TaskId, x.FeatureCode }).IsUnique();
            });

            builder.Entity<TaskFavorite>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskFavorites", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasIndex(x => new { x.UserId, x.TaskId }).IsUnique();
            });

            // ── Görev şablonları ──
            builder.Entity<TaskTemplate>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskTemplates", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Name).IsRequired().HasMaxLength(TaskTemplateConsts.MaxNameLength);
                b.Property(x => x.Description).HasMaxLength(TaskTemplateConsts.MaxDescriptionLength);
                b.Property(x => x.TaskTitle).IsRequired().HasMaxLength(TaskTemplateConsts.MaxTitleLength);
                b.Property(x => x.TaskType).HasMaxLength(TaskTemplateConsts.MaxTaskTypeLength);
                // Aynı tenant'ta aynı adlı iki şablon kafa karıştırır; UNIQUE DEĞİL çünkü
                // TenantId NULL (host) satırları bileşik index'te tekrar edebilir — bkz.
                // (TenantId, Number) kararı. Yalnız listeleme/arama için index.
                b.HasIndex(x => new { x.TenantId, x.Name });

                b.HasMany(x => x.Items).WithOne().HasForeignKey(x => x.TaskTemplateId).OnDelete(DeleteBehavior.Cascade);
                b.HasMany(x => x.Features).WithOne().HasForeignKey(x => x.TaskTemplateId).OnDelete(DeleteBehavior.Cascade);
                b.HasMany(x => x.Tags).WithOne().HasForeignKey(x => x.TaskTemplateId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<TaskTemplateItem>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskTemplateItems", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Title).IsRequired().HasMaxLength(TaskTemplateConsts.MaxTitleLength);
                b.HasIndex(x => new { x.TaskTemplateId, x.Order });
            });

            builder.Entity<TaskTemplateFeature>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskTemplateFeatures", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.FeatureCode).IsRequired().HasMaxLength(TaskTemplateConsts.MaxFeatureCodeLength);
                b.HasIndex(x => new { x.TaskTemplateId, x.FeatureCode }).IsUnique();
            });

            builder.Entity<TaskTemplateTag>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskTemplateTags", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.TagName).IsRequired().HasMaxLength(TaskTemplateConsts.MaxTagNameLength);
                b.HasIndex(x => new { x.TaskTemplateId, x.TagName }).IsUnique();
            });

            builder.Entity<TaskWatcher>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskWatchers", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasIndex(x => new { x.UserId, x.TaskId }).IsUnique();
                b.HasIndex(x => x.TaskId);
            });

            builder.Entity<TaskChecklistItem>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskChecklistItems", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Text).IsRequired().HasMaxLength(500);
                b.HasIndex(x => x.TaskId);
            });

            builder.Entity<TaskTimeLog>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "TaskTimeLogs", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasIndex(x => new { x.TaskId, x.UserId });
            });

            builder.Entity<Invoice>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Invoices", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                // Fatura numarası KİRACI BAZINDA tekildir. Önceden tekillik yalnız
                // InvoiceNumber üzerindeydi, yani numara tüm kurulumda global tekil oluyordu:
                // iki farklı kiracı "FTR-2026-0001" numarasını kullanamıyor, ikincisi
                // "duplicate key" ile patlıyordu. (Soft-delete not: indeks IsDeleted'a
                // bakmaz — silinmiş bir faturanın numarası aynı kiracıda yeniden kullanılamaz;
                // bu davranış eskisiyle aynı, değiştirilmedi.)
                b.HasIndex(x => new { x.TenantId, x.InvoiceNumber }).IsUnique();

                // Host (TenantId NULL) faturaları yukarıdaki indeksin KAPSAMI DIŞINDA kalır:
                // SQL Server nullable kolonlu tekil indekse otomatik "[TenantId] IS NOT NULL"
                // filtresi ekler, Postgres'te ise NULL'lar birbirinden farklı sayılır — iki
                // yolda da host tarafında tekillik kaybolurdu. Bu filtreli ikinci indeks
                // host bağlamındaki tekilliği korur.
                // (.HasFilter içeren HER indeks provider-özeldir: köşeli parantez vs çift tırnak.)
                b.HasIndex(x => x.InvoiceNumber)
                    .IsUnique()
                    .HasDatabaseName("IX_AppInvoices_InvoiceNumber_Host")
                    .HasFilter(isSqlServer ? "[TenantId] IS NULL" : "\"TenantId\" IS NULL");
                b.HasIndex(x => x.ProjectId);
                // TenantId öneki: Status düşük seçicilikli — TaskItem indekslerindeki gerekçeyle aynı.
                b.HasIndex(x => new { x.TenantId, x.Status });
                b.HasIndex(x => x.CustomerId); // APYA-142c
                b.HasMany(x => x.Items).WithOne().HasForeignKey(x => x.InvoiceId).IsRequired();
            });

            builder.Entity<InvoiceItem>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "InvoiceItems", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
            });

            builder.Entity<Payment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Payments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.HasIndex(x => x.InvoiceId);
                b.HasIndex(x => x.CashAccountId); // APYA-136
                // ARCH-009: Payment idempotency — aynı (TenantId, InvoiceId, ReferenceNumber)
                // ile retry'da duplicate önlenir. Empty string referansı dışlamak için
                // partial unique (boş ref = manuel giriş, idempotency beklenmez).
                b.HasIndex(x => new { x.TenantId, x.InvoiceId, x.ReferenceNumber })
                    .IsUnique()
                    .HasFilter(isSqlServer ? "[ReferenceNumber] <> ''" : "\"ReferenceNumber\" <> ''");
            });

            /* --- BİLDİRİM MODÜLÜ YAPILANDIRMASI --- */
            builder.Entity<Notification>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Notifications", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Title).IsRequired().HasMaxLength(NotificationConsts.MaxTitleLength);
                b.Property(x => x.Body).HasMaxLength(NotificationConsts.MaxBodyLength);
                b.Property(x => x.EntityType).HasMaxLength(NotificationConsts.MaxEntityType);
                b.Property(x => x.GroupKey).HasMaxLength(NotificationConsts.MaxGroupKey);
                b.Property(x => x.ActorName).HasMaxLength(NotificationConsts.MaxActorName);
                // Performans için index
                b.HasIndex(x => new { x.UserId, x.IsRead });
                b.HasIndex(x => x.CreationTime);
                // Kategori sekmeleri ve önem sıralaması bu index üzerinden okunur
                b.HasIndex(x => new { x.UserId, x.Category, x.IsRead });
                // Gruplama: aynı kayda ait okunmamış bildirimin aranması
                b.HasIndex(x => new { x.UserId, x.GroupKey, x.IsRead });
            });

            builder.Entity<NotificationPreference>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "NotificationPreferences", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                // Kullanıcı başına kategori başına tek satır; her bildirimde okunuyor
                b.HasIndex(x => new { x.UserId, x.Category }).IsUnique();
            });

            /* --- TAKVİM MODÜLÜ YAPILANDIRMASI --- */
            builder.Entity<ExternalCalendarAccount>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ExternalCalendarAccounts", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.ExternalEmail).IsRequired().HasMaxLength(256);
                b.Property(x => x.AccessToken).IsRequired();
                // Kaynak listesi "1,2,6" gibi kısa; proje listesi Guid CSV'si (36+1 karakter).
                b.Property(x => x.SyncSources).HasMaxLength(64);
                b.Property(x => x.SyncProjectIds).HasMaxLength(2048);
                b.HasIndex(x => new { x.UserId, x.Provider });
            });

            builder.Entity<CalendarFeedToken>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "CalendarFeedTokens", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.TokenHash).IsRequired().HasMaxLength(64);
                b.Property(x => x.TokenProtected).IsRequired().HasMaxLength(1024);
                // Anonim uc token ile ARAR: benzersiz indeks hem hiz hem cakisma korumasi.
                b.HasIndex(x => x.TokenHash).IsUnique();
                b.HasIndex(x => x.UserId);
            });

            builder.Entity<IcalSubscription>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "IcalSubscriptions", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Url).IsRequired().HasMaxLength(2048);
                b.Property(x => x.DisplayName).IsRequired().HasMaxLength(128);
                b.Property(x => x.Color).HasMaxLength(32);
                b.Property(x => x.LastError).HasMaxLength(512);
                b.HasIndex(x => x.UserId);
            });

            builder.Entity<CalendarSyncLogEntry>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "CalendarSyncLogEntries", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Message).IsRequired().HasMaxLength(512);
                // Drawer "hesabın son N satırı"nı sorar — sorgu deseni bu indekse oturur.
                b.HasIndex(x => new { x.ExternalCalendarAccountId, x.CreationTime });
            });

            builder.Entity<CalendarSyncMapping>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "CalendarSyncMappings", PlatformConsts.DbSchema);
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
                b.Property(x => x.Content).HasColumnType("text"); // Uzun metin / Markdown desteği
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

            builder.Entity<Apya.Platform.Documents.DocumentAttachment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentAttachments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.ContentHash).HasMaxLength(Apya.Platform.Documents.DocumentConsts.ContentHashLength);
                b.Property(x => x.OcrText).HasColumnType("text");
                b.HasIndex(x => x.DocumentId);
                b.HasIndex(x => new { x.DocumentId, x.VersionGroupId });
                b.HasIndex(x => x.DocumentFileId);
                b.HasIndex(x => x.ContentHash); // çift kayıt tespiti (Faz E)
            });

            builder.Entity<Apya.Platform.Documents.DocumentAccessLog>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentAccessLogs", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.Detail).HasMaxLength(500);
                b.Property(x => x.ActorRole).HasMaxLength(64);
                b.HasIndex(x => x.DocumentId);
                // Etkinlik sekmesi belge bazında ve daima tarihe göre azalan okur.
                b.HasIndex(x => new { x.DocumentFileId, x.CreationTime });
                b.HasIndex(x => new { x.TenantId, x.CreationTime });
            });

            /* --- KURUM UYGUNLUĞU (COMPLIANCE) --- */
            builder.Entity<Apya.Platform.Documents.CompliancePackage>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "CompliancePackages", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Name).IsRequired().HasMaxLength(Apya.Platform.Documents.ComplianceConsts.MaxPackageNameLength);
                b.Property(x => x.Issuer).IsRequired().HasMaxLength(Apya.Platform.Documents.ComplianceConsts.MaxIssuerLength);
                b.Property(x => x.Code).IsRequired().HasMaxLength(Apya.Platform.Documents.ComplianceConsts.MaxPackageCodeLength);
                b.Property(x => x.Description).HasMaxLength(Apya.Platform.Documents.ComplianceConsts.MaxDescriptionLength);

                b.HasIndex(x => new { x.TenantId, x.Code }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
            });

            builder.Entity<Apya.Platform.Documents.ComplianceRequirement>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ComplianceRequirements", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Title).IsRequired().HasMaxLength(Apya.Platform.Documents.ComplianceConsts.MaxRequirementTitleLength);

                b.HasOne<Apya.Platform.Documents.CompliancePackage>()
                 .WithMany()
                 .HasForeignKey(x => x.PackageId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasOne<Apya.Platform.Documents.DocumentType>()
                 .WithMany()
                 .HasForeignKey(x => x.DocumentTypeId)
                 .OnDelete(DeleteBehavior.SetNull);

                // Varsayılan AÇIKÇA InstitutionPackage(1): enum 1'den başlıyor,
                // kolon varsayılanı 0 kalsaydı MEVCUT satırlar geçersiz bir
                // kaynakla doğar ve listede "bilinmeyen kaynak" görünürdü.
                b.Property(x => x.Source)
                 .HasDefaultValue(Apya.Platform.Documents.ComplianceRequirementSource.InstitutionPackage);

                // SourceEntityId'ye FK YOK: göreve bağlı kalem, görev silinse de
                // yaşamalı — kurumun istediği belge görev silindi diye kalkmaz.
                b.HasIndex(x => new { x.PackageId, x.Order });
                b.HasIndex(x => x.SourceEntityId);
            });

            builder.Entity<Apya.Platform.Documents.ComplianceAssignment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ComplianceAssignments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.PeriodCode).HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxPeriodCodeLength);

                b.HasOne<Project>()
                 .WithMany()
                 .HasForeignKey(x => x.ProjectId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Paket host'ta da olabildiği için FK YOK — silme kontrolü servis katmanında.
                b.HasIndex(x => new { x.ProjectId, x.PackageId, x.PeriodCode }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
            });

            builder.Entity<Apya.Platform.Documents.ComplianceItemState>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ComplianceItemStates", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.PeriodCode).HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxPeriodCodeLength);
                b.Property(x => x.WaiveReason).HasMaxLength(Apya.Platform.Documents.ComplianceConsts.MaxWaiveReasonLength);

                b.HasOne<Apya.Platform.Documents.ComplianceAssignment>()
                 .WithMany()
                 .HasForeignKey(x => x.AssignmentId)
                 .OnDelete(DeleteBehavior.Cascade);

                // DocumentFile'a FK YOK: belge silinince karar satırı da anlamsızlaşır ama
                // cascade zinciri (Project → Assignment → State) ile çakışırdı.
                b.HasIndex(x => new { x.AssignmentId, x.RequirementId, x.WorkStepId, x.PeriodCode }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
            });

            /* --- RAPOR / TESLİM PAKETİ (FAZ C) --- */
            builder.Entity<Apya.Platform.Documents.ReportTemplate>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ReportTemplates", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Name).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.ReportingConsts.MaxTemplateNameLength);
                b.Property(x => x.Issuer).HasMaxLength(Apya.Platform.Documents.ComplianceConsts.MaxIssuerLength);

                b.HasIndex(x => new { x.TenantId, x.Order });
            });

            builder.Entity<Apya.Platform.Documents.ReportSection>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ReportSections", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.HasOne<Apya.Platform.Documents.ReportTemplate>()
                 .WithMany()
                 .HasForeignKey(x => x.TemplateId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(x => new { x.TemplateId, x.SectionKey }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
            });

            builder.Entity<Apya.Platform.Documents.DeliveryPackage>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DeliveryPackages", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Name).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.ReportingConsts.MaxPackageNameLength);
                b.Property(x => x.PeriodCode).HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxPeriodCodeLength);
                b.Property(x => x.StoredFileName)
                    .HasMaxLength(Apya.Platform.Documents.ReportingConsts.MaxStoredFileNameLength);

                b.HasOne<Project>()
                 .WithMany()
                 .HasForeignKey(x => x.ProjectId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Şablon host'ta da olabilir → FK yok; ad çözümlemesi servis katmanında.
                b.HasIndex(x => new { x.TenantId, x.ProjectId });
                b.HasIndex(x => x.Status);
            });

            builder.Entity<Apya.Platform.Documents.DeliveryPackageItem>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DeliveryPackageItems", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.AnnexNumber)
                    .HasMaxLength(Apya.Platform.Documents.ReportingConsts.MaxAnnexNumberLength);

                b.HasOne<Apya.Platform.Documents.DeliveryPackage>()
                 .WithMany()
                 .HasForeignKey(x => x.PackageId)
                 .OnDelete(DeleteBehavior.Cascade);

                // DocumentFile'a FK YOK: Project → Package → Item ile Project → DocumentFile
                // iki cascade yolu oluşturur, SQL Server bunu reddeder (bkz. A1 migration notu).
                b.HasIndex(x => new { x.PackageId, x.Order });
                b.HasIndex(x => x.DocumentFileId);
            });

            builder.Entity<Apya.Platform.Documents.ReportRun>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ReportRuns", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.StoredFileName).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.ReportingConsts.MaxStoredFileNameLength);
                b.Property(x => x.PeriodCode).HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxPeriodCodeLength);

                b.HasIndex(x => new { x.TenantId, x.ProjectId, x.Version });
            });

            builder.Entity<Apya.Platform.Documents.ExternalShareLink>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ExternalShareLinks", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.TokenHash).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.ReportingConsts.ShareTokenHashLength);
                b.Property(x => x.Watermark).HasMaxLength(120);

                // Anonim çözümleme yalnız bu indeksle çalışır; token'ın kendisi saklanmaz.
                b.HasIndex(x => x.TokenHash).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
                b.HasIndex(x => new { x.TargetType, x.TargetId });
            });

            builder.Entity<Apya.Platform.Documents.ExternalShareAccessLog>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ExternalShareAccessLogs", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.IpHash).HasMaxLength(64);
                b.Property(x => x.UserAgent).HasMaxLength(400);

                b.HasOne<Apya.Platform.Documents.ExternalShareLink>()
                 .WithMany()
                 .HasForeignKey(x => x.ShareLinkId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(x => new { x.ShareLinkId, x.CreationTime });
            });

            /* --- YÖNETİM: KURAL MOTORU + ALAN İZİNLERİ + ENTEGRASYONLAR (FAZ D) --- */
            builder.Entity<Apya.Platform.Documents.DocumentRule>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentRules", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Name).IsRequired().HasMaxLength(Apya.Platform.Documents.RuleConsts.MaxRuleNameLength);
                b.Property(x => x.Description).HasMaxLength(Apya.Platform.Documents.RuleConsts.MaxDescriptionLength);

                b.HasIndex(x => new { x.TenantId, x.IsEnabled, x.Order });
            });

            builder.Entity<Apya.Platform.Documents.DocumentRuleCondition>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentRuleConditions", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.CompareValue).HasMaxLength(Apya.Platform.Documents.RuleConsts.MaxCompareValueLength);

                b.HasOne<Apya.Platform.Documents.DocumentRule>()
                 .WithMany()
                 .HasForeignKey(x => x.RuleId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(x => new { x.RuleId, x.Order });
            });

            builder.Entity<Apya.Platform.Documents.DocumentRuleAction>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentRuleActions", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Payload).HasMaxLength(Apya.Platform.Documents.RuleConsts.MaxActionPayloadLength);

                b.HasOne<Apya.Platform.Documents.DocumentRule>()
                 .WithMany()
                 .HasForeignKey(x => x.RuleId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(x => new { x.RuleId, x.Order });
            });

            builder.Entity<Apya.Platform.Documents.DocumentRuleRun>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentRuleRuns", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.SampleJson).HasColumnType("text");

                // Kural silinse bile çalıştırma izi kalır → FK YOK (append-only kayıt).
                b.HasIndex(x => new { x.RuleId, x.CreationTime });
            });

            builder.Entity<Apya.Platform.Documents.ReportSchedule>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ReportSchedules", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.LastError)
                    .HasMaxLength(Apya.Platform.Documents.ReportingConsts.MaxScheduleErrorLength);

                b.HasOne<Apya.Platform.Documents.DeliveryPackage>()
                 .WithMany()
                 .HasForeignKey(x => x.DeliveryPackageId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Worker "vadesi gelenleri" bu indeksten okur.
                b.HasIndex(x => new { x.IsEnabled, x.NextRunAt });
            });

            builder.Entity<Apya.Platform.Documents.ReportSubscriber>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ReportSubscribers", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Name).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.ReportingConsts.MaxSubscriberNameLength);
                b.Property(x => x.Email).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.ReportingConsts.MaxSubscriberEmailLength);

                b.HasOne<Apya.Platform.Documents.ReportSchedule>()
                 .WithMany()
                 .HasForeignKey(x => x.ScheduleId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(x => new { x.ScheduleId, x.Email }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
            });

            builder.Entity<Apya.Platform.Documents.DocumentSuggestionDismissal>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentSuggestionDismissals", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.SuggestionKey).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxSuggestionKeyLength);

                // Belge silinince reddetme kararı da anlamsızlaşır.
                b.HasOne<Apya.Platform.Documents.DocumentFile>()
                 .WithMany()
                 .HasForeignKey(x => x.DocumentFileId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Aynı öneri iki kez reddedilemez; okuma da bu indeksten gider.
                b.HasIndex(x => new { x.DocumentFileId, x.SuggestionKey }).IsUnique();
            });

            builder.Entity<Apya.Platform.Documents.DocumentFieldPermission>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentFieldPermissions", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.RoleName).IsRequired().HasMaxLength(Apya.Platform.Documents.RuleConsts.MaxRoleNameLength);

                b.HasOne<Apya.Platform.Documents.DocumentType>()
                 .WithMany()
                 .HasForeignKey(x => x.DocumentTypeId)
                 .OnDelete(DeleteBehavior.Cascade);

                // FieldId için FK YOK: DocumentType → DocumentTypeField → buraya ve
                // DocumentType → buraya iki cascade yolu olur, SQL Server reddeder.
                b.HasIndex(x => new { x.DocumentTypeId, x.FieldId, x.RoleName }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
            });

            builder.Entity<Apya.Platform.Documents.DocumentIntegration>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentIntegrations", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Name).IsRequired().HasMaxLength(Apya.Platform.Documents.RuleConsts.MaxRuleNameLength);
                b.Property(x => x.Target).HasMaxLength(300);
                b.Property(x => x.SettingsJson).HasColumnType("text");

                b.HasIndex(x => new { x.TenantId, x.Kind });
            });

            /* --- EŞLEŞTİRME + RİSK KÜTÜĞÜ (FAZ E) --- */
            builder.Entity<Apya.Platform.Documents.DocumentExpenseMatch>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentExpenseMatches", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.AnnexNumber)
                    .HasMaxLength(Apya.Platform.Documents.MatchingConsts.MaxAnnexNumberLength);

                // DocumentFile ve Expense'e FK YOK: her ikisi de Project'ten cascade
                // aldığı için iki yol oluşur ve SQL Server reddeder (bkz. A1 notu).
                // Bütünlük servis katmanında korunur.
                b.HasIndex(x => new { x.DocumentFileId, x.ExpenseId }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
                b.HasIndex(x => x.ExpenseId);
            });

            builder.Entity<ProjectRisk>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ProjectRisks", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Title).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.MatchingConsts.MaxRiskTitleLength);
                b.Property(x => x.Mitigation)
                    .HasMaxLength(Apya.Platform.Documents.MatchingConsts.MaxRiskTextLength);

                b.HasOne<Project>()
                 .WithMany()
                 .HasForeignKey(x => x.ProjectId)
                 .OnDelete(DeleteBehavior.Cascade);

                // WorkStep'e FK YOK — Project'ten ikinci cascade yolu olurdu.
                b.HasIndex(x => new { x.ProjectId, x.IsClosed });
            });

            /* --- BELGE (DOCUMENT FILE) + META ŞEMA --- */
            builder.Entity<Apya.Platform.Documents.DocumentFile>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentFiles", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.DisplayName).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxDisplayNameLength);
                b.Property(x => x.Currency).HasMaxLength(Apya.Platform.Documents.DocumentConsts.CurrencyLength);
                b.Property(x => x.PeriodCode).HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxPeriodCodeLength);
                b.Property(x => x.ExternalRef).HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxExternalRefLength);
                // Tutar alanı çift provider'da aynı davransın (Postgres numeric ↔ SqlServer decimal(18,2) farkı).
                b.Property(x => x.Amount).HasPrecision(18, 2);

                b.HasOne<Apya.Platform.Documents.Document>()
                 .WithMany()
                 .HasForeignKey(x => x.DocumentId)
                 .OnDelete(DeleteBehavior.Restrict);

                b.HasOne<Apya.Platform.Documents.DocumentType>()
                 .WithMany()
                 .HasForeignKey(x => x.DocumentTypeId)
                 .OnDelete(DeleteBehavior.SetNull);

                b.HasOne<Project>()
                 .WithMany()
                 .HasForeignKey(x => x.ProjectId)
                 .OnDelete(DeleteBehavior.SetNull);

                b.HasOne<ProjectWorkStep>()
                 .WithMany()
                 .HasForeignKey(x => x.WorkStepId)
                 .OnDelete(DeleteBehavior.SetNull);

                // Liste sorgusu daima klasör (+kiracı) kapsamında çalışır.
                b.HasIndex(x => new { x.TenantId, x.DocumentId });
                b.HasIndex(x => new { x.TenantId, x.ProjectId });
                b.HasIndex(x => x.WorkStepId);
                b.HasIndex(x => x.DocumentTypeId);
                b.HasIndex(x => new { x.TenantId, x.PeriodCode });
                b.HasIndex(x => x.ExpiryDate); // "süresi dolanlar" akıllı klasörü
            });

            builder.Entity<Apya.Platform.Documents.DocumentType>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentTypes", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Name).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxTypeNameLength);
                b.Property(x => x.Code).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxTypeCodeLength);
                b.Property(x => x.Icon).HasMaxLength(64);
                b.Property(x => x.FileNamePattern)
                    .HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxFileNamePatternLength);

                // Sistem tipleri TenantId = null; kod kiracı içinde benzersiz olmalı.
                // Soft-delete olduğu için filtresiz unique, silinmiş kaydın kodunu kalıcı bloke ederdi.
                b.HasIndex(x => new { x.TenantId, x.Code }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
            });

            builder.Entity<Apya.Platform.Documents.DocumentTypeField>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentTypeFields", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Key).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxFieldKeyLength);
                b.Property(x => x.Label).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxFieldLabelLength);
                b.Property(x => x.OptionsJson).HasColumnType("text");

                b.HasOne<Apya.Platform.Documents.DocumentType>()
                 .WithMany()
                 .HasForeignKey(x => x.DocumentTypeId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(x => new { x.DocumentTypeId, x.Key }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
            });

            builder.Entity<Apya.Platform.Documents.DocumentFieldValue>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentFieldValues", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.ValueText)
                    .HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxFieldValueTextLength);
                b.Property(x => x.ValueNumber).HasPrecision(18, 2);

                b.HasOne<Apya.Platform.Documents.DocumentFile>()
                 .WithMany()
                 .HasForeignKey(x => x.DocumentFileId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasOne<Apya.Platform.Documents.DocumentTypeField>()
                 .WithMany()
                 .HasForeignKey(x => x.FieldId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Bir belgede bir alan yalnız bir kez değer taşır.
                b.HasIndex(x => new { x.DocumentFileId, x.FieldId }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
            });

            builder.Entity<Apya.Platform.Documents.DocumentTag>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentTags", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Name).IsRequired()
                    .HasMaxLength(Apya.Platform.Documents.DocumentConsts.MaxTagNameLength);

                b.HasIndex(x => new { x.TenantId, x.Name }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
            });

            builder.Entity<Apya.Platform.Documents.DocumentFileTag>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DocumentFileTags", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.HasOne<Apya.Platform.Documents.DocumentFile>()
                 .WithMany()
                 .HasForeignKey(x => x.DocumentFileId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasOne<Apya.Platform.Documents.DocumentTag>()
                 .WithMany()
                 .HasForeignKey(x => x.TagId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Bağlantı artık SOFT-DELETE. Filtre olmasaydı çöp kutusundaki bir
                // belgenin etiketi, aynı etiketin yeniden eklenmesini engellerdi.
                b.HasIndex(x => new { x.DocumentFileId, x.TagId }).IsUnique()
                    .HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
                b.HasIndex(x => x.TagId);
            });

            /* --- PROJE İŞ ADIMI (WORK STEP) --- */
            builder.Entity<ProjectWorkStep>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ProjectWorkSteps", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Name).IsRequired().HasMaxLength(ProjectWorkStepConsts.MaxNameLength);

                // Restrict (Cascade DEĞİL): SQL Server, Project'ten hem WorkStep'e (cascade)
                // hem DocumentFile'a (set null) giden iki yolu "multiple cascade paths" sayıp
                // FK oluşturmayı reddediyor. Project zaten soft-delete olduğu için gerçek
                // cascade pratikte tetiklenmiyor; kısıt güvenli taraf.
                b.HasOne<Project>()
                 .WithMany()
                 .HasForeignKey(x => x.ProjectId)
                 .OnDelete(DeleteBehavior.Restrict);

                b.HasIndex(x => new { x.ProjectId, x.Order });
            });

            /* --- DİNAMİK VARLIKLAR (DYNAMIC ASSETS) YAPILANDIRMASI --- */
            builder.ApplyConfiguration(new AppDocumentConfiguration(isSqlServer));
            builder.ApplyConfiguration(new AppBlockConfiguration());
            builder.ApplyConfiguration(new AppResponseConfiguration());
            builder.ApplyConfiguration(new FormCategoryConfiguration());
            builder.ApplyConfiguration(new ResponseCommentConfiguration());

            /* --- POLİMORFİK BAĞLANTI (ASSET RELATIONS) YAPILANDIRMASI --- */
            builder.ApplyConfiguration(new EntityLinkConfiguration());

            /* --- WEBHOOK (DYNAMIC ASSETS WEBHOOKS) YAPILANDIRMASI --- */
            builder.ApplyConfiguration(new WebhookSubscriptionConfiguration());
            builder.ApplyConfiguration(new WebhookDeliveryLogConfiguration());

            /* --- GERİ BİLDİRİM (FEEDBACK) YAPILANDIRMASI --- */

            // FB-2026-000123 numaraları için sayaç (FeedbackNumberGenerator kullanır).
            // Yalnızca Npgsql: SQLite (test altyapısı) sequence desteklemez, model'e
            // girerse test DB'si hiç oluşamıyor. Testlerde IFeedbackNumberGenerator
            // zaten sahte implementasyonla değiştirilmeli.
            if (Database.ProviderName?.Contains("Npgsql") == true)
            {
                // NOT: Sequence bilinçli olarak EF MODELİNDE TANIMLI DEĞİL.
                // Yalnızca FeedbackNumberGenerator'daki raw SQL (nextval) kullanıyor;
                // modele eklenirse SQLite tabanlı testler "SQLite does not support
                // sequences" ile şema oluşturamıyor. Sequence'ı DB'de oluşturan yer
                // ExtendFeedbackManagement migration'ındaki CreateSequence çağrısıdır.
            }

            builder.Entity<Feedback>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "Feedbacks", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.FeedbackNumber).IsRequired().HasMaxLength(FeedbackConsts.MaxFeedbackNumberLength);
                b.Property(x => x.Subject).IsRequired().HasMaxLength(FeedbackConsts.MaxSubjectLength);
                b.Property(x => x.Body).IsRequired().HasMaxLength(FeedbackConsts.MaxBodyLength);
                b.Property(x => x.PageUrl).HasMaxLength(FeedbackConsts.MaxPageUrlLength);
                b.Property(x => x.PageTitle).HasMaxLength(FeedbackConsts.MaxPageTitleLength);
                b.Property(x => x.UserAgent).HasMaxLength(FeedbackConsts.MaxUserAgentLength);
                b.Property(x => x.ScreenResolution).HasMaxLength(FeedbackConsts.MaxScreenSizeLength);
                b.Property(x => x.AppVersion).HasMaxLength(FeedbackConsts.MaxAppVersionLength);
                b.Property(x => x.SubmittedByUserName).HasMaxLength(FeedbackConsts.MaxUserNameLength);
                b.Property(x => x.ScreenshotFileName).HasMaxLength(FeedbackConsts.MaxFileNameLength);
                b.Property(x => x.AdminTags).HasMaxLength(FeedbackConsts.MaxTagsLength);
                b.Property(x => x.BreadcrumbJson).HasMaxLength(FeedbackConsts.MaxBreadcrumbLength);
                b.Property(x => x.DetailsJson).HasMaxLength(FeedbackConsts.MaxDetailsJsonLength);
                b.Property(x => x.ModuleCode).HasMaxLength(FeedbackConsts.MaxModuleCodeLength);
                b.Property(x => x.ComponentCode).HasMaxLength(FeedbackConsts.MaxComponentCodeLength);
                b.Property(x => x.ActionCode).HasMaxLength(FeedbackConsts.MaxActionCodeLength);
                b.Property(x => x.RelatedEntityType).HasMaxLength(FeedbackConsts.MaxEntityTypeLength);
                b.Property(x => x.AssignedUserName).HasMaxLength(FeedbackConsts.MaxUserNameLength);

                b.HasMany(x => x.Comments)
                 .WithOne()
                 .HasForeignKey(x => x.FeedbackId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Yönetici panelinin ana filtreleri
                b.HasIndex(x => new { x.TenantId, x.Status });
                b.HasIndex(x => x.CreationTime);
                // Sayfa bazlı ısı haritası: "hangi ekran en çok geri bildirim alıyor"
                b.HasIndex(x => x.PageUrl);
                // FB-no ile arama; soft-delete olduğundan filter'lı unique
                b.HasIndex(x => x.FeedbackNumber).IsUnique().HasFilter(isSqlServer ? "[IsDeleted] = 0" : "\"IsDeleted\" = false");
                b.HasIndex(x => x.AssignedUserId);
                b.HasIndex(x => x.ModuleCode);
            });

            builder.Entity<FeedbackAttachment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "FeedbackAttachments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.FileName).IsRequired().HasMaxLength(FeedbackConsts.MaxFileNameLength);
                b.Property(x => x.StoredFileName).IsRequired().HasMaxLength(FeedbackConsts.MaxFileNameLength);
                b.Property(x => x.ContentType).HasMaxLength(FeedbackConsts.MaxContentTypeLength);

                b.HasOne<Feedback>()
                 .WithMany()
                 .HasForeignKey(x => x.FeedbackId)
                 .OnDelete(DeleteBehavior.Cascade);

                b.HasIndex(x => x.FeedbackId);
            });

            builder.Entity<FeedbackActivity>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "FeedbackActivities", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.OldValue).HasMaxLength(FeedbackConsts.MaxActivityValueLength);
                b.Property(x => x.NewValue).HasMaxLength(FeedbackConsts.MaxActivityValueLength);
                b.Property(x => x.Note).HasMaxLength(FeedbackConsts.MaxActivityNoteLength);
                b.Property(x => x.ActorName).HasMaxLength(FeedbackConsts.MaxUserNameLength);

                b.HasOne<Feedback>()
                 .WithMany()
                 .HasForeignKey(x => x.FeedbackId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Zaman çizelgesi hep (FeedbackId, CreationTime) sırasıyla okunur
                b.HasIndex(x => new { x.FeedbackId, x.CreationTime });
            });

            builder.Entity<FeedbackComment>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "FeedbackComments", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Text).IsRequired().HasMaxLength(FeedbackConsts.MaxCommentLength);
                b.Property(x => x.AuthorName).HasMaxLength(FeedbackConsts.MaxUserNameLength);

                b.HasIndex(x => x.FeedbackId);
            });

            /* --- İSTEMCİ HATA TELEMETRİSİ YAPILANDIRMASI --- */
            builder.Entity<ClientError>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ClientErrors", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.Fingerprint).IsRequired().HasMaxLength(ClientErrorConsts.FingerprintLength);
                b.Property(x => x.Message).IsRequired().HasMaxLength(ClientErrorConsts.MaxMessageLength);
                b.Property(x => x.StackTrace).HasMaxLength(ClientErrorConsts.MaxStackTraceLength);
                b.Property(x => x.PageUrl).HasMaxLength(ClientErrorConsts.MaxPageUrlLength);
                b.Property(x => x.UserAgent).HasMaxLength(ClientErrorConsts.MaxUserAgentLength);
                b.Property(x => x.ScreenResolution).HasMaxLength(ClientErrorConsts.MaxScreenSizeLength);
                b.Property(x => x.AppVersion).HasMaxLength(ClientErrorConsts.MaxAppVersionLength);
                b.Property(x => x.BreadcrumbJson).HasMaxLength(ClientErrorConsts.MaxBreadcrumbLength);

                // Tekilleştirme: aynı imzalı hata aynı tenant'ta ikinci satır AÇMAZ.
                // ClientError soft-delete değil, bu yüzden filtreye gerek yok.
                b.HasIndex(x => new { x.TenantId, x.Fingerprint }).IsUnique();

                // Panel sıralamaları + saklama worker'ının tarama sorgusu
                b.HasIndex(x => x.LastSeenAt);
                b.HasIndex(x => new { x.IsResolved, x.OccurrenceCount });
            });

            /* --- SİNYALDEN GÖREVE KÖPRÜSÜ --- */
            builder.Entity<IssueTaskLink>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "IssueTaskLinks", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.SourceKey).IsRequired().HasMaxLength(IssueTaskConsts.MaxSourceKeyLength);
                b.Property(x => x.SourceLabel).HasMaxLength(IssueTaskConsts.MaxSourceLabelLength);

                // Bir kaynak yalnızca BİR görev açar; otomatik kural da bu index'e çarpar.
                // Bağ soft-delete değil, bu yüzden filtreye gerek yok.
                b.HasIndex(x => new { x.SourceType, x.SourceKey }).IsUnique();

                // Görev tarafından bağa gitmek (geri bağ + görev silinince temizlik).
                b.HasIndex(x => x.TaskId);
            });

            /* --- RIZA / KVKK OMURGASI YAPILANDIRMASI --- */
            builder.Entity<Apya.Platform.Consents.ConsentRecord>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "ConsentRecords", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.SubjectId).HasMaxLength(Apya.Platform.Consents.ConsentConsts.MaxSubjectIdLength);
                b.Property(x => x.PolicyVersion).IsRequired().HasMaxLength(Apya.Platform.Consents.ConsentConsts.MaxPolicyVersionLength);
                b.Property(x => x.AcceptedCategories).HasMaxLength(Apya.Platform.Consents.ConsentConsts.MaxAcceptedCategoriesLength);
                b.Property(x => x.IpAddress).HasMaxLength(Apya.Platform.Consents.ConsentConsts.MaxIpAddressLength);
                b.Property(x => x.UserAgent).HasMaxLength(Apya.Platform.Consents.ConsentConsts.MaxUserAgentLength);
                b.Property(x => x.SourceRef).HasMaxLength(Apya.Platform.Consents.ConsentConsts.MaxSourceRefLength);
                // Analiz sorguları: tenant + tür + zaman penceresi.
                b.HasIndex(x => new { x.TenantId, x.Type, x.OccurredAt });
                // Aynı öznenin belirli bir türde son rızasını bulmak için.
                b.HasIndex(x => new { x.TenantId, x.Type, x.SubjectId });
            });

            /* --- DEMO TALEPLERİ YAPILANDIRMASI --- */
            builder.Entity<Apya.Platform.DemoRequests.DemoRequest>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DemoRequests", PlatformConsts.DbSchema);
                b.ConfigureByConvention();
                b.Property(x => x.FullName).IsRequired().HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxFullNameLength);
                b.Property(x => x.CompanyName).IsRequired().HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxCompanyNameLength);
                b.Property(x => x.Email).IsRequired().HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxEmailLength);
                b.Property(x => x.Phone).IsRequired().HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxPhoneLength);
                b.Property(x => x.InterestedModules).HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxInterestedModulesLength);
                b.Property(x => x.Message).HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxMessageLength);
                b.Property(x => x.TargetAudience).HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxTargetAudienceLength);
                b.Property(x => x.ProblemStatement).HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxProblemStatementLength);
                b.Property(x => x.PlannedActivities).HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxPlannedActivitiesLength);
                b.Property(x => x.ExpectedOutcomes).HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxExpectedOutcomesLength);
                b.Property(x => x.AdminNote).HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxAdminNoteLength);
                b.Property(x => x.IpAddress).HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxIpAddressLength);
                b.Property(x => x.UserAgent).HasMaxLength(Apya.Platform.DemoRequests.DemoRequestConsts.MaxUserAgentLength);
                // Panelin varsayılan sorgusu: duruma göre süz, en yeniden eskiye sırala.
                b.HasIndex(x => new { x.Status, x.CreationTime });
                // Kötüye kullanım sayacı: aynı IP adresinin son bir saatteki talepleri.
                b.HasIndex(x => new { x.IpAddress, x.CreationTime });
            });

            builder.Entity<Apya.Platform.Dashboard.DashboardLayout>(b =>
            {
                b.ToTable(PlatformConsts.DbTablePrefix + "DashboardLayouts", PlatformConsts.DbSchema);
                b.ConfigureByConvention();

                b.Property(x => x.ViewKey).IsRequired()
                    .HasMaxLength(Apya.Platform.Dashboard.DashboardConsts.MaxViewKeyLength);
                b.Property(x => x.CardsJson).IsRequired()
                    .HasMaxLength(Apya.Platform.Dashboard.DashboardConsts.MaxCardsJsonLength);

                // Kullanıcı başına görünüm başına tek düzen. DashboardLayout soft-delete
                // DEĞİL (bkz entity notu) → filtresiz tekil indeks güvenli.
                b.HasIndex(x => new { x.UserId, x.ViewKey }).IsUnique();
            });

            // 'text' tipi PostgreSQL'de doğaldır; SQL Server'da kullanımdan kalkmıştır.
            // Postgres modeline (ve snapshot'ına) dokunmadan, YALNIZCA SQL Server modeli
            // inşa edilirken tüm 'text' kolonlarını 'nvarchar(max)'a çeviririz.
            if (isSqlServer)
            {
                foreach (var entityType in builder.Model.GetEntityTypes())
                {
                    foreach (var property in entityType.GetProperties())
                    {
                        if (string.Equals(property.GetColumnType(), "text", System.StringComparison.OrdinalIgnoreCase))
                        {
                            property.SetColumnType("nvarchar(max)");
                        }
                    }
                }
            }
        }
    }
}