using System;
using System.Threading.Tasks;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using Volo.Abp.Uow;
using Apya.Platform.Grants;

namespace Apya.Platform;

public class PlatformTestDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    // Admin rolüne seed edilen izinler. TANIMLI tüm Platform.* + Ai.* izinlerini
    // kapsamalı; aksi halde yeni tenant admin'i ilgili menü/özelliği göremez.
    // Kaynak: PlatformPermissionDefinitionProvider + AiPermissionDefinitionProvider.
    // (Domain katmanı Application.Contracts'a referans veremediği için string literal.)
    private static readonly string[] AdminPermissions = new[]
    {
        // --- Proje & Görev ---
        "Platform.Projects",
        "Platform.Projects.Create",
        "Platform.Projects.Edit",
        "Platform.Projects.Delete",
        "Platform.Projects.ViewBudget",
        "Platform.Projects.ManageTeam",
        "Platform.Projects.UseAiFeatures",
        "Platform.Tasks",
        "Platform.Tasks.Create",
        "Platform.Tasks.Edit",
        "Platform.Tasks.Delete",
        "Platform.Tasks.Assign",
        "Platform.Tasks.ChangeStatus",
        // --- Hibe ---
        "Platform.Grants",
        "Platform.Grants.Create",
        "Platform.Grants.Edit",
        "Platform.Grants.Delete",
        // --- Finans ---
        "Platform.Incomes",
        "Platform.Incomes.Create",
        "Platform.Incomes.Edit",
        "Platform.Incomes.Delete",
        "Platform.Expenses",
        "Platform.Expenses.Create",
        "Platform.Expenses.Edit",
        "Platform.Expenses.Delete",
        "Platform.Invoices",
        "Platform.Invoices.Create",
        "Platform.Invoices.Edit",
        "Platform.Invoices.Delete",
        "Platform.ExchangeRates",
        "Platform.ExchangeRates.Create",
        "Platform.ExchangeRates.Edit",
        "Platform.ExchangeRates.Delete",
        "Platform.FxRevaluations",
        "Platform.FxRevaluations.Run",
        "Platform.FxRevaluations.Delete",
        "Platform.Reports",
        "Platform.Reports.TrialBalance",
        // --- Cari & Kasa ---
        "Platform.Customers",
        "Platform.Customers.Create",
        "Platform.Customers.Edit",
        "Platform.Customers.Delete",
        "Platform.CashAccounts",
        "Platform.CashAccounts.Create",
        "Platform.CashAccounts.Edit",
        "Platform.CashAccounts.Delete",
        "Platform.CashMovements",
        "Platform.CashMovements.Create",
        "Platform.CashMovements.Edit",
        "Platform.CashMovements.Delete",
        // --- İçerik & Doküman ---
        "Platform.Documents",
        "Platform.Documents.Create",
        "Platform.Documents.Edit",
        "Platform.Documents.Delete",
        "Platform.DynamicAssets",
        "Platform.DynamicAssets.Create",
        "Platform.DynamicAssets.Edit",
        "Platform.DynamicAssets.Delete",
        "Platform.DynamicAssets.Publish",
        "Platform.DynamicAssets.ViewResponses",
        "Platform.DynamicAssets.Export",
        "Platform.DynamicAssets.ManageCategories",
        // --- Sistem & Entegrasyon ---
        "Platform.Notifications",
        "Platform.Notifications.MarkRead",
        "Platform.Notifications.Delete",
        "Platform.Calendars",
        "Platform.Calendars.Connect",
        "Platform.TenantSettings",
        "Platform.TenantSettings.ManageAi",
        // --- ABP yönetim (rol/kullanıcı/izin) ---
        "AbpPermissionManagement.Update",
        "AbpIdentity.Roles",
        "AbpIdentity.Roles.ManagePermissions",
        "AbpIdentity.Users",
        "AbpIdentity.Users.ManagePermissions",
        // --- AI: üretim / taslak / tenant ayarı ---
        "Ai.Generation",
        "Ai.Generation.Request",
        "Ai.Drafts",
        "Ai.Drafts.View",
        "Ai.Drafts.Edit",
        "Ai.Drafts.Approve",
        "Ai.TenantSettings",
        "Ai.TenantSettings.Manage",
        // --- AI Değerlendirme Merkezi ---
        "Ai.Dashboard.View",
        "Ai.Prompts",
        "Ai.Prompts.View",
        "Ai.Prompts.Create",
        "Ai.Prompts.Edit",
        "Ai.Prompts.Delete",
        "Ai.Prompts.Publish",
        "Ai.Evaluations",
        "Ai.Evaluations.View",
        "Ai.Evaluations.Trigger",
        "Ai.Evaluations.Retry",
        "Ai.Results",
        "Ai.Results.View",
        "Ai.Results.Export",
        "Ai.Workflows",
        "Ai.Workflows.Manage",
        "Ai.Providers",
        "Ai.Providers.Manage",
        "Ai.Reports",
        "Ai.Reports.View",
        "Ai.Reports.Export",
        "Ai.UsageLogs.View"
    };

    private readonly IRepository<Grant, Guid> _grantRepository;
    private readonly IGuidGenerator _guidGenerator;
    private readonly IIdentityDataSeeder _identityDataSeeder;
    private readonly ICurrentTenant _currentTenant;
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IUnitOfWorkManager _unitOfWorkManager;

    public PlatformTestDataSeedContributor(
        IRepository<Grant, Guid> grantRepository,
        IGuidGenerator guidGenerator,
        IIdentityDataSeeder identityDataSeeder,
        ICurrentTenant currentTenant,
        IPermissionDataSeeder permissionDataSeeder,
        IUnitOfWorkManager unitOfWorkManager)
    {
        _grantRepository = grantRepository;
        _guidGenerator = guidGenerator;
        _identityDataSeeder = identityDataSeeder;
        _currentTenant = currentTenant;
        _permissionDataSeeder = permissionDataSeeder;
        _unitOfWorkManager = unitOfWorkManager;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        // Seed işlemini KENDİ commit edilen UnitOfWork'ünde çalıştırıyoruz.
        // Aksi halde dış (commit edilmemiş) UoW içinde seed birden fazla geçiş
        // yaparsa, IPermissionDataSeeder henüz kaydedilmemiş satırları göremediği
        // için aynı izinleri tekrar ekler. Host'ta (TenantId NULL) unique index
        // NULL'ları ayrı saydığı için bu fark edilmez; gerçek tenant'ta ise
        // IX_AbpPermissionGrants_TenantId_Name_ProviderName_ProviderKey ihlali
        // (23505) → "müşteri ekle" 500 hatası. requiresNew + Complete ile her geçiş
        // commit edildiğinden ikinci geçiş mevcut grant'ları görüp atlar (idempotent).
        using var uow = _unitOfWorkManager.Begin(requiresNew: true);

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

        await uow.CompleteAsync();
    }
}