using System;
using System.Linq;
using Apya.Platform.DataTransfers;
using Shouldly;
using Xunit;

namespace Apya.Platform.Tests.Domain.DataTransfers;

/// <summary>
/// Aktarım şablonu sürümlenir: her değişiklik sürümü bir artırır ve o anki tanımı saklar; önceki
/// sürümlerin tanımı değişmez (geçmiş kayıtları hangi sürümle çalıştıklarını gösterebilsin).
/// </summary>
public class DataTransferTemplate_Tests
{
    private static DataTransferTemplate Create(Guid? tenantId = null) => new(
        Guid.NewGuid(), tenantId, "expenses", DataTransferDirection.Import, "  Banka ekstresi  ", null,
        DataTransferFileFormat.Csv, "{\"v\":1}", Guid.NewGuid());

    [Fact]
    public void Yeni_sablon_birinci_surumle_dogar_ve_tanimi_saklar()
    {
        var template = Create();

        template.Version.ShouldBe(1);
        template.Name.ShouldBe("Banka ekstresi");
        template.TenantId.ShouldBeNull();
        var first = template.Versions.Single();
        first.Version.ShouldBe(1);
        first.DefinitionJson.ShouldBe("{\"v\":1}");
        first.TemplateId.ShouldBe(template.Id);
    }

    [Fact]
    public void Degisiklik_yeni_surum_acar_onceki_surum_degismez()
    {
        var tenantId = Guid.NewGuid();
        var template = Create(tenantId);

        template.Update("Banka ekstresi (yeni)", "Ziraat biçimi", DataTransferFileFormat.Xlsx, "{\"v\":2}", Guid.NewGuid());

        template.Version.ShouldBe(2);
        template.Format.ShouldBe(DataTransferFileFormat.Xlsx);
        template.DefinitionJson.ShouldBe("{\"v\":2}");
        template.Versions.Count.ShouldBe(2);

        var first = template.Versions.Single(v => v.Version == 1);
        first.DefinitionJson.ShouldBe("{\"v\":1}");
        first.Format.ShouldBe(DataTransferFileFormat.Csv);
        first.Name.ShouldBe("Banka ekstresi");

        // Sürüm, şablonun kiracısını taşır: kiracı süzgeci sürüm satırlarında da çalışır.
        template.Versions.ShouldAllBe(v => v.TenantId == tenantId);
    }

    [Fact]
    public void Ad_ve_tanim_bos_olamaz()
    {
        var template = Create();

        Should.Throw<ArgumentException>(() => template.Update(" ", null, DataTransferFileFormat.Csv, "{}", Guid.NewGuid()));
        Should.Throw<ArgumentException>(() => template.Update("Ad", null, DataTransferFileFormat.Csv, " ", Guid.NewGuid()));
        template.Version.ShouldBe(1);
    }
}
