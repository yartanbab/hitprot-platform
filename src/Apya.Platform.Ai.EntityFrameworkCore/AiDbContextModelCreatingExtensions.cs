using Microsoft.EntityFrameworkCore;
using Volo.Abp;

namespace Apya.Platform.Ai;

public static class AiDbContextModelCreatingExtensions
{
    public static void ConfigureAi(this ModelBuilder builder)
    {
        Check.NotNull(builder, nameof(builder));

        // 109.3'te DraftBatch / AiRequest / DraftItem entity mapping'leri burada eklenecek.
        // 109.1 sadece module + extension method iskeletini açar; tablo yapısı değişmez.
    }
}
