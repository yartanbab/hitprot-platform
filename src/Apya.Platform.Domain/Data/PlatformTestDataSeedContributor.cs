using System;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Apya.Platform.Grants;

namespace Apya.Platform;

public class PlatformTestDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly IIdentityDataSeeder _identityDataSeeder;
    private readonly ICurrentTenant _currentTenant;

    public PlatformTestDataSeedContributor(
        IRepository<Grant, Guid> grantRepository,
        IGuidGenerator guidGenerator,
        IIdentityDataSeeder identityDataSeeder,
        ICurrentTenant currentTenant)
    {
        _grantRepository = grantRepository;
        _guidGenerator = guidGenerator;
        _identityDataSeeder = identityDataSeeder;
        _currentTenant = currentTenant;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        // 1. Hibe (Grant) Verilerini Ekle
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

        // 2. Admin Kullanıcısını Ekle (SIRALAMA DÜZELTİLDİ)
        // Doğru Sıra: (Email, Password, TenantId, UserName)
        await _identityDataSeeder.SeedAsync(
            "admin@apya.com",    // 1. Email (E-posta formatında olmalı)
            "1q2w3E*",           // 2. Şifre
            _currentTenant.Id,   // 3. Tenant (Kiracı)
            "admin"              // 4. Kullanıcı Adı
        );
    }
}