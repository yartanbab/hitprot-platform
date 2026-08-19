using Apya.Platform.DynamicAssets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Apya.Platform.EntityFrameworkCore.Configuration;

public class AppDocumentConfiguration : IEntityTypeConfiguration<AppDocument>
{
    /// <summary>
    /// Filtreli indeks sözdizimi sağlayıcıya göre değişir (köşeli parantez vs çift tırnak),
    /// bu bilgi <c>PlatformDbContext.OnModelCreating</c>'den geçirilir.
    /// </summary>
    private readonly bool _isSqlServer;

    public AppDocumentConfiguration(bool isSqlServer)
    {
        _isSqlServer = isSqlServer;
    }

    public void Configure(EntityTypeBuilder<AppDocument> builder)
    {
        builder.ToTable(PlatformConsts.DbTablePrefix + "Documents_Dynamic", PlatformConsts.DbSchema);
        builder.ConfigureByConvention();

        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(AppDocumentConsts.MaxTitleLength);

        builder.Property(x => x.Slug)
            .IsRequired()
            .HasMaxLength(AppDocumentConsts.MaxSlugLength);

        builder.Property(x => x.Status)
            .IsRequired();

        builder.Property(x => x.Description)
            .IsRequired(false)
            .HasMaxLength(AppDocumentConsts.MaxDescriptionLength);

        // JSON columns (Postgres text; promote to jsonb in a follow-up if indexed search is needed)
        builder.Property(x => x.ThemeJson)
            .IsRequired(false)
            .HasColumnType("text");

        builder.Property(x => x.PublishSettingsJson)
            .IsRequired(false)
            .HasColumnType("text");

        // Slug KİRACI BAZINDA tekildir. Önceden yalnız Slug üzerinde tekildi, yani iki
        // farklı kiracı aynı slug'ı ("iletisim-formu") seçemiyordu. Oysa slug araması
        // (EfCoreAppDocumentRepository.GetBySlugWithBlocksAsync) ABP'nin çok-kiracı
        // süzgecine tabi bir sorgudur — çözümleme zaten kiracı kapsamlıdır, dolayısıyla
        // global tekillik gereğinden fazla kısıtlayıcıydı.
        builder.HasIndex(x => new { x.TenantId, x.Slug }).IsUnique();

        // Host (TenantId NULL) satırları yukarıdaki indeksin kapsamı dışında kalır:
        // SQL Server nullable kolonlu tekil indekse otomatik "IS NOT NULL" filtresi ekler,
        // Postgres'te ise NULL'lar birbirinden farklı sayılır. Host tarafındaki tekillik
        // bu ayrı filtreli indeksle korunur (fatura numarasındaki desenin aynısı).
        builder.HasIndex(x => x.Slug)
            .IsUnique()
            .HasDatabaseName("IX_AppDocuments_Dynamic_Slug_Host")
            .HasFilter(_isSqlServer ? "[TenantId] IS NULL" : "\"TenantId\" IS NULL");
        builder.HasIndex(x => x.ParentTemplateId);
        builder.HasIndex(x => x.IsTemplate);
        builder.HasIndex(x => new { x.TenantId, x.Status });
        builder.HasIndex(x => x.CategoryId);

        // Blocks — owned collection with FK
        builder.HasMany(x => x.Blocks)
            .WithOne()
            .HasForeignKey(x => x.AppDocumentId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // Metadata for the backing field
        builder.Navigation(x => x.Blocks)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
