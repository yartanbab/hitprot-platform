using Apya.Platform.DynamicAssets.Webhooks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Apya.Platform.EntityFrameworkCore.Configuration;

public class WebhookSubscriptionConfiguration : IEntityTypeConfiguration<WebhookSubscription>
{
    public void Configure(EntityTypeBuilder<WebhookSubscription> builder)
    {
        builder.ToTable(PlatformConsts.DbTablePrefix + "WebhookSubscriptions", PlatformConsts.DbSchema);
        builder.ConfigureByConvention();

        builder.Property(x => x.TargetUrl)
            .IsRequired()
            .HasMaxLength(WebhookConsts.MaxTargetUrlLength);

        builder.Property(x => x.Secret)
            .IsRequired()
            .HasMaxLength(WebhookConsts.MaxSecretLength);

        builder.Property(x => x.DocumentId)
            .IsRequired();

        builder.HasIndex(x => x.DocumentId);
        builder.HasIndex(x => new { x.DocumentId, x.IsActive })
            .HasDatabaseName("IX_AppWebhookSubscriptions_DocActive");
    }
}
