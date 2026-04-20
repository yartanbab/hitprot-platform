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
            .HasColumnType("nvarchar(max)");

        builder.Property(x => x.ResponseBody)
            .IsRequired(false)
            .HasMaxLength(WebhookConsts.MaxResponseBodyLength);

        builder.Property(x => x.SubscriptionId)
            .IsRequired();

        builder.HasIndex(x => x.SubscriptionId);
        builder.HasIndex(x => new { x.SubscriptionId, x.IsSuccess })
            .HasDatabaseName("IX_AppWebhookDeliveryLogs_SubSuccess");
    }
}
