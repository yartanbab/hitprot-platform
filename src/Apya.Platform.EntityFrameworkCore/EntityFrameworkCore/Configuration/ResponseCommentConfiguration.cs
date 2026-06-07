using Apya.Platform.DynamicAssets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Volo.Abp.EntityFrameworkCore.Modeling;

namespace Apya.Platform.EntityFrameworkCore.Configuration;

public class ResponseCommentConfiguration : IEntityTypeConfiguration<ResponseComment>
{
    public void Configure(EntityTypeBuilder<ResponseComment> builder)
    {
        builder.ToTable(PlatformConsts.DbTablePrefix + "ResponseComments", PlatformConsts.DbSchema);
        builder.ConfigureByConvention();

        builder.Property(x => x.Text)
            .IsRequired()
            .HasMaxLength(ResponseCommentConsts.MaxTextLength);

        builder.HasIndex(x => x.AppResponseId);
    }
}
