using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Apya.Platform.Ai.Drafts;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Providers;
using Apya.Platform.Ai.Tenants;

namespace Apya.Platform.Ai;

public static class AiDbContextModelCreatingExtensions
{
    public static void ConfigureAi(this ModelBuilder builder)
    {
        Check.NotNull(builder, nameof(builder));

        builder.Entity<DraftBatch>(b =>
        {
            b.ToTable(AiPlatformConsts.DbTablePrefix + "DraftBatches", AiPlatformConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.SourceFileName).HasMaxLength(255);
            b.HasIndex(x => new { x.Status, x.TenantId });
            b.HasIndex(x => x.AiRequestId);
        });

        builder.Entity<DraftTaskItem>(b =>
        {
            b.ToTable(AiPlatformConsts.DbTablePrefix + "DraftTasks", AiPlatformConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Title).IsRequired().HasMaxLength(200);
            b.HasIndex(x => x.ImportBatchId);
            b.HasIndex(x => x.DraftBatchId);
            b.HasOne<DraftBatch>().WithMany().HasForeignKey(x => x.DraftBatchId).IsRequired(false).OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<AiRequest>(b =>
        {
            b.ToTable(AiPlatformConsts.DbTablePrefix + "Requests", AiPlatformConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.ProviderName).IsRequired().HasMaxLength(64);
            b.Property(x => x.RequestType).IsRequired().HasMaxLength(64);
            b.Property(x => x.ErrorMessage).HasMaxLength(2000);
            b.HasMany(x => x.Traces).WithOne().HasForeignKey(t => t.AiRequestId).IsRequired();
            b.HasIndex(x => new { x.Status, x.CreationTime });
            b.HasIndex(x => x.CorrelationId);
        });

        builder.Entity<AiDecisionTrace>(b =>
        {
            b.ToTable(AiPlatformConsts.DbTablePrefix + "DecisionTraces", AiPlatformConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.SystemPrompt).HasColumnType("text");
            b.Property(x => x.UserMessage).HasColumnType("text");
            b.Property(x => x.Response).HasColumnType("text");
            b.HasIndex(x => x.AiRequestId);
        });

        builder.Entity<TenantAiSettings>(b =>
        {
            b.ToTable(AiPlatformConsts.DbTablePrefix + "TenantSettings", AiPlatformConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.PreferredProvider).IsRequired().HasMaxLength(64);
            b.Property(x => x.PreferredModel).IsRequired().HasMaxLength(128);
            b.HasIndex(x => x.TenantId).IsUnique();
        });

        // --- AI Değerlendirme Merkezi: Prompt yönetimi (S1) ---
        builder.Entity<PromptCategory>(b =>
        {
            b.ToTable(AiPlatformConsts.DbTablePrefix + "PromptCategories", AiPlatformConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Name).IsRequired().HasMaxLength(PromptConsts.MaxCategoryNameLength);
            b.Property(x => x.Code).IsRequired().HasMaxLength(PromptConsts.MaxCategoryCodeLength);
            b.Property(x => x.Description).HasMaxLength(PromptConsts.MaxDescriptionLength);
            b.HasIndex(x => new { x.TenantId, x.Code }).IsUnique();
            b.HasIndex(x => x.ParentId);
        });

        builder.Entity<Prompt>(b =>
        {
            b.ToTable(AiPlatformConsts.DbTablePrefix + "Prompts", AiPlatformConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Code).IsRequired().HasMaxLength(PromptConsts.MaxCodeLength);
            b.Property(x => x.Name).IsRequired().HasMaxLength(PromptConsts.MaxNameLength);
            b.Property(x => x.Description).HasMaxLength(PromptConsts.MaxDescriptionLength);
            b.HasMany(x => x.Versions).WithOne().HasForeignKey(v => v.PromptId).IsRequired();
            b.HasIndex(x => new { x.TenantId, x.Code }).IsUnique();
            b.HasIndex(x => x.CategoryId);
        });

        builder.Entity<PromptVersion>(b =>
        {
            b.ToTable(AiPlatformConsts.DbTablePrefix + "PromptVersions", AiPlatformConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.SystemPrompt).HasColumnType("text");
            b.Property(x => x.UserPromptTemplate).HasColumnType("text");
            b.Property(x => x.JsonSchema).HasColumnType("text");
            b.Property(x => x.ExpectedOutputSample).HasColumnType("text");
            b.HasIndex(x => new { x.PromptId, x.VersionNo }).IsUnique();
        });

        // --- AI Değerlendirme Merkezi: Provider yapılandırması (S2) ---
        builder.Entity<AiProviderConfig>(b =>
        {
            b.ToTable(AiPlatformConsts.DbTablePrefix + "ProviderConfigs", AiPlatformConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.DisplayName).IsRequired().HasMaxLength(ProviderConsts.MaxDisplayNameLength);
            b.Property(x => x.Model).IsRequired().HasMaxLength(ProviderConsts.MaxModelLength);
            b.Property(x => x.ApiKey).HasColumnType("text");
            b.HasIndex(x => new { x.TenantId, x.Provider });
        });
    }
}
