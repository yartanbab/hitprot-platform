using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Permissions;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.Ai.Permissions;

/// <summary>
/// Tüm AI izinlerini (<c>Ai.*</c> grubu + çekirdekteki <see cref="PlatformPermissions.Projects.UseAiFeatures"/>)
/// hem host'un hem de her kiracının "admin" rolüne verir (SEC-006 + SEC-014).
///
/// Neden gerekli: ABP yeni izinleri var olan rollere OTOMATİK vermez ve paketler yalnız feature +
/// izin TAVANI yazar, GRANT etmez. Bu seeder olmadan AiAssist paketi açık olsa bile hiçbir kullanıcı
/// AI Center'ı veya AI üretimini kullanamaz (yalnız ABAC <c>ai_agent</c> claim'i geçerdi).
///
/// Geniş grant güvenli: efektif erişim <see cref="Apya.Platform.Tenants.PackagePermissionStateChecker"/>
/// (paket izin tavanı — pakette olmayan izin rolde verilse bile IsGranted=false) + AiAssist FEATURE
/// gate'iyle kontrol edilir. Yani AiAssist paketi olmayan kiracı yine AI göremez; host muaftır.
///
/// Host + her kiracı için çalışır (<see cref="DataSeedContext.TenantId"/> ayrımı yapmaz — grant
/// bulunduğu bağlamın "admin" rolüne yazılır). <see cref="IPermissionDataSeeder"/> mevcut grant'ları
/// eler → idempotent. Desen: <see cref="Apya.Platform.Accounts.LoginScreenPermissionDataSeedContributor"/>.
/// </summary>
public class AiPermissionDataSeedContributor : IDataSeedContributor, ITransientDependency
{
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly IPermissionDefinitionManager _permissionDefinitionManager;

    public AiPermissionDataSeedContributor(
        IPermissionDataSeeder permissionDataSeeder,
        IIdentityRoleRepository roleRepository,
        IPermissionDefinitionManager permissionDefinitionManager)
    {
        _permissionDataSeeder = permissionDataSeeder;
        _roleRepository = roleRepository;
        _permissionDefinitionManager = permissionDefinitionManager;
    }

    public async Task SeedAsync(DataSeedContext context)
    {
        var adminRole = await _roleRepository.FindByNormalizedNameAsync("ADMIN");
        if (adminRole == null)
        {
            return;
        }

        var permissions = await GetAiPermissionNamesAsync();

        await _permissionDataSeeder.SeedAsync(
            RolePermissionValueProvider.ProviderName,
            adminRole.Name,
            permissions,
            context.TenantId);
    }

    private async Task<string[]> GetAiPermissionNamesAsync()
    {
        var all = await _permissionDefinitionManager.GetPermissionsAsync();

        return all
            .Select(p => p.Name)
            .Where(name => name.StartsWith(AiPermissions.GroupName + ".")) // "Ai." → tüm AI modülü izinleri
            .Append(PlatformPermissions.Projects.UseAiFeatures)             // AI üretimi çekirdek izni (SEC-014)
            .ToArray();
    }
}
