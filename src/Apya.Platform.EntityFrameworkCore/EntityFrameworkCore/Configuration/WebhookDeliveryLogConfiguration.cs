using Apya.Platform.DynamicAssets.Webhooks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Apya.Platform.EntityFrameworkCore.Configuration;

public class WebhookDeliveryLogConfiguration : IEntityTypeConfiguration<WebhookDeliveryLog>
{
    public void Configure(EntityTypeBuilder<WebhookDeliveryLog> builder)
    {
        builder.ToTable(PlatformConsts.DbTablePrefix + "WebhookDeliveryLogs", PlatformConsts.DbSchema);
        builder.ConfigureByConvention();

        builder.Property(x => x.Payload)
            .IsRequired()
            .HasColumnType("text");

        builder.Property(x => x.ResponseBody)
            .IsRequired(false)
            .HasMaxLength(WebhookConsts.MaxResponseBodyLength);

        builder.Property(x => x.SubscriptionId)
            .IsRequired();

        builder.HasIndex(x => x.SubscriptionId);
        builder.HasIndex(x => new { x.SubscriptionId, x.IsSuccess })
            .HasDatabaseName("IX_AppWebhookDeliveryLogs_SubSuccess");

        // Kabuğun webhook hata rozeti HER sayfa açılışında "IsSuccess = 0 AND
        // CreationTime >= son 24 saat" sayar; iki mevcut indeksin lideri SubscriptionId
        // olduğu için sınırsız büyüyen log tablosu baştan sona taranıyordu. Eşitlik
        // (IsSuccess) önce, aralık (CreationTime) sonra. Entity IMultiTenant/ISoftDelete
        // değil → ABP süzgeç eklemez, sağlayıcı-nötr düz indeks yeterli.
        builder.HasIndex(x => new { x.IsSuccess, x.CreationTime })
            .HasDatabaseName("IX_AppWebhookDeliveryLogs_IsSuccess_CreationTime");
    }
}
