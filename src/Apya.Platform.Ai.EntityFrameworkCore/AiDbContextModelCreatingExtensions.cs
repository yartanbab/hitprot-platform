using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Apya.Platform.Ai.Drafts;

namespace Apya.Platform.Ai;

public static class AiDbContextModelCreatingExtensions
{
    public static void ConfigureAi(this ModelBuilder builder)
    {
        Check.NotNull(builder, nameof(builder));

        builder.Entity<DraftTaskItem>(b =>
        {
            b.ToTable(AiPlatformConsts.DbTablePrefix + "DraftTasks", AiPlatformConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Title).IsRequired().HasMaxLength(200);
            b.HasIndex(x => x.ImportBatchId);
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
    }
}
