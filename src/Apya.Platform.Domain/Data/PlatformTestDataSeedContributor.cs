using System;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Apya.Platform.Grants;

namespace Apya.Platform;

public class PlatformTestDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private static readonly string[] AdminPermissions = new[]
    {
        "Platform.Projects",
        "Platform.Projects.Create",
        "Platform.Projects.Edit",
        "Platform.Projects.Delete",
        "Platform.Projects.ViewBudget",
        "Platform.Projects.ManageTeam",
        "Platform.Tasks",
        "Platform.Tasks.Create",
        "Platform.Tasks.Edit",
        "Platform.Tasks.Delete",
        "Platform.Tasks.Assign",
        "Platform.Tasks.ChangeStatus",
        "Platform.Documents",
        "Platform.Documents.Create",
        "Platform.Documents.Edit",
        "Platform.Documents.Delete",
        "Platform.Notifications",
        "Platform.Notifications.MarkRead",
        "Platform.Notifications.Delete",
        "Platform.Calendars",
        "Platform.Calendars.Connect",
        "AbpPermissionManagement.Update",
        "AbpIdentity.Roles.ManagePermissions",
        "AbpIdentity.Users.ManagePermissions",
        "AbpIdentity.Roles",
        "AbpIdentity.Users",
        "Ai.Generation",
        "Ai.Generation.Request",
        "Ai.Drafts",
        "Ai.Drafts.View",
        "Ai.Drafts.Edit",
        "Ai.Drafts.Approve",
        "Ai.TenantSettings",
        "Ai.TenantSettings.Manage"
    };

    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly IIdentityDataSeeder _identityDataSeeder;
    private readonly ICurrentTenant _currentTenant;
    private readonly IPermissionDataSeeder _permissionDataSeeder;

    public PlatformTestDataSeedContributor(
        IRepository<Grant, Guid> grantRepository,
        IGuidGenerator guidGenerator,
        IIdentityDataSeeder identityDataSeeder,
        ICurrentTenant currentTenant,
        IPermissionDataSeeder permissionDataSeeder)
    {
        _grantRepository = grantRepository;
        _guidGenerator = guidGenerator;
        _identityDataSeeder = identityDataSeeder;
        _currentTenant = currentTenant;
        _permissionDataSeeder = permissionDataSeeder;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        await _permissionDataSeeder.SeedAsync(
            "R",
            "admin",
            AdminPermissions,
            context.TenantId);

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
        // DbMigrator Seed işleminde ConnectionString hatasına yol açtığı için 
        // ABP'nin dahili Identity Data Seeder'ına bırakıyoruz.
        /*
        await _identityDataSeeder.SeedAsync(
            "admin@apya.com",    // 1. Email (E-posta formatında olmalı)
            "1q2w3E*",           // 2. Şifre
            _currentTenant.Id,   // 3. Tenant (Kiracı)
            "admin"              // 4. Kullanıcı Adı
        );
        */
    }
}