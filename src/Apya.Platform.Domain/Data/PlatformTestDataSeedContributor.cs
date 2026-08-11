using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Apya.Platform.Grants;

namespace Apya.Platform;

public class PlatformTestDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    // NOT: Admin rol izinleri burada SEED EDİLMEZ. Yeni tenant'ın "admin" rolüne tüm izinler
    // zaten ABP'nin kendi seed akışı tarafından veriliyor (yeni tenant'ta ~113 R/admin grant'ı
    // doğrulandı). Burada da ikinci kez vermek, aynı UoW içinde aynı (TenantId, Name, "R",
    // "admin") satırlarını mükerrer ekleyip IX_AbpPermissionGrants_TenantId_Name_ProviderName_
    // ProviderKey (23505) ihlaline → "Yeni Müşteri" 500 hatasına yol açıyordu. Bu yüzden
    // izin-seed kaldırıldı; bu contributor yalnızca örnek Hibe (Grant) verisini ekler.

    /// <summary>
    /// Örnek verinin seed edilmesi için açıkça <c>true</c> yapılması gereken ayar.
    /// Varsayılan KAPALI: DbMigrator production veritabanına karşı çalıştırıldığında
    /// demo hibelerin gerçek veriye karışmaması için fail-safe davranış.
    /// </summary>
    public const string SeedDemoDataConfigKey = "App:SeedDemoData";

    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly IConfiguration _configuration;

    public PlatformTestDataSeedContributor(
        IRepository<Grant, Guid> grantRepository,
        IGuidGenerator guidGenerator,
        IConfiguration configuration)
    {
        _grantRepository = grantRepository;
        _guidGenerator = guidGenerator;
        _configuration = configuration;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        if (!_configuration.GetValue<bool>(SeedDemoDataConfigKey))
        {
            return;
        }

        // Örnek Hibe (Grant) verileri — yalnızca hiç kayıt yoksa ekle (idempotent).
        if (await _grantRepository.GetCountAsync() <= 0)
        {
            await _grantRepository.InsertAsync(new Grant(
                _guidGenerator.Create(),
                "TÜBİTAK 1501",
                "1501",
                1500000m,
                75.0
            ));

            await _grantRepository.InsertAsync(new Grant(
                _guidGenerator.Create(),
                "TÜBİTAK 1507",
                "1507",
                600000m,
                60.0
            ));

            await _grantRepository.InsertAsync(new Grant(
                _guidGenerator.Create(),
                "KOSGEB AR-GE",
                "KOSGEB-ARGE",
                1000000m,
                50.0
            ));

            await _grantRepository.InsertAsync(new Grant(
                _guidGenerator.Create(),
                "Ticaret Bak. KTZ",
                "TB-KTZ",
                25000000m,
                80.0
            ));
        }
    }
}
