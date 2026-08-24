using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.Documents;

/// <summary>
/// Dokümanlar modülünün yeni alt izinlerini HOST'un "admin" rolüne verir.
///
/// Neden gerekli: ABP yeni izinleri var olan rollere OTOMATİK vermez — izin yalnız rol ilk
/// oluşturulurken seed edilir. Bu seeder olmadan, kurulu bir sistemde uygunluk yönetimi, rapor/teslim
/// paketi üretimi, künye düzenleme, toplu işlem, dış paylaşım ve Dokümanlar yönetim ekranı deploy'dan
/// sonra host yöneticisine açık olmaz (AppService'ler <c>[Authorize]</c> ile bu izinleri istiyor → 403).
/// Aynı sınıf eksik: FN-004 (<see cref="Apya.Platform.Consents.ConsentsPermissionDataSeedContributor"/>).
///
/// YALNIZ HOST bağlamında çalışır (<see cref="DataSeedContext.TenantId"/> == null). Kiracı bağlamında
/// ÇALIŞTIRILMAZ: yeni kiracı oluşturulurken ABP'nin kimlik tohumlayıcısı taze "admin" rolüne tüm
/// Both-tarafı izinleri (feature/paket'ten BAĞIMSIZ — bu 6 izin dahil) zaten verir; ikinci kez vermek
/// aynı UoW'da mükerrer grant üretip "Yeni Müşteri" 500'üne yol açardı (ayrıntı <see cref="SeedAsync"/>
/// içindeki notta). Aynı tuzak ve aynı host-only guard:
/// <see cref="Apya.Platform.Accounts.LoginScreenPermissionDataSeedContributor"/>,
/// <see cref="Apya.Platform.Consents.ConsentsPermissionDataSeedContributor"/>,
/// <see cref="Apya.Platform.Ai.Permissions.AiPermissionDataSeedContributor"/> ve
/// <see cref="Apya.Platform.PlatformTestDataSeedContributor"/> notu. Efektif erişimi paket izin tavanı
/// (<see cref="Apya.Platform.Tenants.PackagePermissionStateChecker"/>) sınırlamaya devam eder.
/// <see cref="IPermissionDataSeeder"/> mevcut grant'ları eler → tekrar çalıştırmak güvenli (idempotent).
/// </summary>
public class DocumentsPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IIdentityRoleRepository _roleRepository;

    public DocumentsPermissionDataSeedContributor(
        IPermissionDataSeeder permissionDataSeeder,
        IIdentityRoleRepository roleRepository)
    {
        _permissionDataSeeder = permissionDataSeeder;
        _roleRepository = roleRepository;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        // YALNIZ HOST: kiracı bağlamında çalıştırma. Yeni kiracı oluşturulurken
        // (TenantProfileAppService.CreateTenantWithProfileAsync — tek sahip transactional UoW)
        // ABP'nin kimlik tohumlayıcısı taze "admin" rolüne tüm Both-tarafı izinleri (feature/paket'ten
        // BAĞIMSIZ — bu 6 izin dahil) zaten verir. Aynı UoW'da ikinci kez vermek — IPermissionDataSeeder'ın
        // de-dup sorgusu henüz commit edilmemiş ABP grant'larını göremediği için — mükerrer
        // (TenantId, Name, "R", "admin") satırı üretir → IX_AbpPermissionGrants_TenantId_Name_
        // ProviderName_ProviderKey ihlali (PostgreSql 23505 / SqlServer 2627) → "Yeni Müşteri" 500.
        if (context.TenantId != null)
        {
            return;
        }

        var adminRole = await _roleRepository.FindByNormalizedNameAsync("ADMIN");
        if (adminRole == null)
        {
            return;
        }

        await _permissionDataSeeder.SeedAsync(
            RolePermissionValueProvider.ProviderName,
            adminRole.Name,
            new[]
            {
                PlatformPermissions.Documents.ManageMeta,
                PlatformPermissions.Documents.BulkOperations,
                PlatformPermissions.Documents.ManageCompliance,
                PlatformPermissions.Documents.GenerateReports,
                PlatformPermissions.Documents.ShareExternally,
                PlatformPermissions.Documents.Administer
            },
            context.TenantId);
    }
}
