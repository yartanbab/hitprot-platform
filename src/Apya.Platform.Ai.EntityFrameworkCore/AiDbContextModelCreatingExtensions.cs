using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Apya.Platform.Ai.Drafts;
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
            b.Property(x => x.SystemPrompt).HasColumnType("nvarchar(max)");
            b.Property(x => x.UserMessage).HasColumnType("nvarchar(max)");
            b.Property(x => x.Response).HasColumnType("nvarchar(max)");
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
    }
}
