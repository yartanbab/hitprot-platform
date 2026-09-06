using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Threading;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Shouldly;
using Volo.Abp;
using Volo.Abp.Guids;
using Xunit;

namespace Apya.Platform.EntityFrameworkCore;

/// <summary>
/// Sıralı GUID tipi sağlayıcıya göre AÇIKÇA seçilmeli (bkz. PlatformEntityFrameworkCoreModule).
/// <para>
/// PostgreSql ve SqlServer ABP modüllerinin ikisi de koşulsuz bağlı; ikisi de tipi "null ise
/// ata" mantığıyla set ettiği için önce çalışan PostgreSql kazanıyor ve SQL Server'da damga
/// GUID'in BAŞINA yazılıyordu. SQL Server uniqueidentifier'ı SON 6 bayttan karşılaştırdığı
/// için 179 tablonun kümelenmiş anahtarı rastgele doğuyordu (ölçüldü 2026-09-04: AppTasks'ta
/// Id↔CreationTime sıralama örtüşmesi %0, sayfa doluluğu %65).
/// </para>
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class SequentialGuid_SqlServer_Tests : PlatformEntityFrameworkCoreTestBase
{
    protected override void SetAbpApplicationCreationOptions(AbpApplicationCreationOptions options)
    {
        base.SetAbpApplicationCreationOptions(options);

        // Veritabanı kod içinden (SQLite in-memory) yapılandırıldığı için yalnız
        // sağlayıcı bayrağını vermek yeterli; bağlantı dizisi aranmaz.
        options.Services.ReplaceConfiguration(new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Database:Provider"] = "SqlServer"
            })
            .Build());
    }

    [Fact]
    public void SqlServer_icin_damga_GUIDin_sonuna_yazilir()
    {
        var options = GetRequiredService<IOptions<AbpSequentialGuidGeneratorOptions>>().Value;

        options.DefaultSequentialGuidType.ShouldBe(SequentialGuidType.SequentialAtEnd);
    }

    [Fact]
    public void Uretilen_GUIDler_SQL_Server_karsilastirmasinda_artar()
    {
        var generator = GetRequiredService<IGuidGenerator>();

        // SqlGuid.CompareTo, SQL Server'ın uniqueidentifier sıralamasını (son 6 bayt önce)
        // birebir uygular. Damga milisaniye çözünürlüklü; aynı milisaniyede üretilen iki
        // GUID'in sırası rastgeledir, o yüzden üretimler arasına küçük bekleme konur.
        var previous = new SqlGuid(generator.Create());
        for (var i = 0; i < 20; i++)
        {
            Thread.Sleep(2);
            var next = new SqlGuid(generator.Create());

            next.CompareTo(previous).ShouldBeGreaterThan(0);
            previous = next;
        }
    }
}

/// <summary>
/// Aynı kapı — PostgreSQL (bayrak yokken varsayılan). Postgres uuid'i baştan bayt-bayt
/// karşılaştırır; orada doğru olan SequentialAsString'dir. Bu test koşulsuz SequentialAtEnd
/// yazılmasını engeller.
/// </summary>
[Collection(PlatformTestConsts.CollectionDefinitionName)]
public class SequentialGuid_PostgreSql_Tests : PlatformEntityFrameworkCoreTestBase
{
    [Fact]
    public void PostgreSql_icin_damga_GUIDin_basina_yazilir()
    {
        var options = GetRequiredService<IOptions<AbpSequentialGuidGeneratorOptions>>().Value;

        options.DefaultSequentialGuidType.ShouldBe(SequentialGuidType.SequentialAsString);
    }

    [Fact]
    public void Uretilen_GUIDler_metin_karsilastirmasinda_artar()
    {
        var generator = GetRequiredService<IGuidGenerator>();

        var previous = generator.Create().ToString("N");
        for (var i = 0; i < 20; i++)
        {
            Thread.Sleep(2);
            var next = generator.Create().ToString("N");

            string.CompareOrdinal(next, previous).ShouldBeGreaterThan(0);
            previous = next;
        }
    }
}
