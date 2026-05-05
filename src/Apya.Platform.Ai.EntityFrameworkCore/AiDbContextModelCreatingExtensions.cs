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
    }
}
