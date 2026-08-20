using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.Documents;

/// <summary>
/// Dokümanlar modülünün yeni alt izinlerini hem host'un hem de her kiracının "admin" rolüne verir.
///
/// Neden gerekli: ABP yeni izinleri var olan rollere OTOMATİK vermez — izin yalnız rol ilk
/// oluşturulurken seed edilir. Bu seeder olmadan, kurulu bir sistemde uygunluk yönetimi, rapor/teslim
/// paketi üretimi, künye düzenleme, toplu işlem, dış paylaşım ve Dokümanlar yönetim ekranı deploy'dan
/// sonra kimseye açık olmaz (AppService'ler <c>[Authorize]</c> ile bu izinleri istiyor → 403).
/// Aynı sınıf eksik: FN-004 (<see cref="Apya.Platform.Consents.ConsentsPermissionDataSeedContributor"/>).
///
/// Host + her kiracı için çalışır (<see cref="DataSeedContext.TenantId"/> ayrımı yapmaz — grant
/// bulunduğu bağlamın "admin" rolüne yazılır); efektif erişimi paket izin tavanı
/// (<see cref="Apya.Platform.Tenants.PackagePermissionStateChecker"/>) sınırlamaya devam eder.
/// <see cref="IPermissionDataSeeder"/> mevcut grant'ları eler → tekrar çalıştırmak güvenli (idempotent).
/// Desen: <see cref="Apya.Platform.Ai.Permissions.AiPermissionDataSeedContributor"/>.
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
