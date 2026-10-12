using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Guids;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;
using Volo.Abp.PermissionManagement;
using IdentityRole = Volo.Abp.Identity.IdentityRole;

namespace Apya.Platform.Tenants;

/// <summary>
/// SEC-07 · <see cref="TenantRoleTemplates"/> rollerini bir kiracıda kurar. Kiracı kurulumu
/// (<see cref="TenantProvisioner"/>) ve mevcut kiracılar için tek seferlik telafi
/// (<see cref="TenantRoleTemplateDataSeedContributor"/>) aynı gövdeyi çağırır.
///
/// <para>🔴 Var olana DOKUNMAZ: aynı adda rol zaten varsa atlanır — izinleri de yeniden yazılmaz.
/// Kiracı o rolü kendi kurmuş ya da şablonu bilerek değiştirmiş olabilir.</para>
/// </summary>
public class TenantRoleTemplateSeeder : ITransientDependency
{
    private readonly IdentityRoleManager _roleManager;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly ILookupNormalizer _lookupNormalizer;
    private readonly IPermissionDataSeeder _permissionDataSeeder;
    private readonly TenantPackageManager _packageManager;
    private readonly IGuidGenerator _guidGenerator;
    private readonly ICurrentTenant _currentTenant;

    public TenantRoleTemplateSeeder(
        IdentityRoleManager roleManager,
        IIdentityRoleRepository roleRepository,
        ILookupNormalizer lookupNormalizer,
        IPermissionDataSeeder permissionDataSeeder,
        TenantPackageManager packageManager,
        IGuidGenerator guidGenerator,
        ICurrentTenant currentTenant)
    {
        _roleManager = roleManager;
        _roleRepository = roleRepository;
        _lookupNormalizer = lookupNormalizer;
        _permissionDataSeeder = permissionDataSeeder;
        _packageManager = packageManager;
        _guidGenerator = guidGenerator;
        _currentTenant = currentTenant;
    }

    /// <returns>Bu çağrıda OLUŞTURULAN rollerin adları.</returns>
    public async Task<List<string>> EnsureAsync(Guid tenantId)
    {
        var created = new List<string>();
        var tenantPermissions = await _packageManager.GetTenantPermissionNamesAsync();

        using (_currentTenant.Change(tenantId))
        {
            foreach (var template in TenantRoleTemplates.All)
            {
                var existing = await _roleRepository.FindByNormalizedNameAsync(
                    _lookupNormalizer.NormalizeName(template.Name));
                if (existing != null)
                {
                    continue;
                }

                var role = new IdentityRole(_guidGenerator.Create(), template.Name, tenantId) { IsPublic = true };
                (await _roleManager.CreateAsync(role)).CheckErrors();

                await _permissionDataSeeder.SeedAsync(
                    RolePermissionValueProvider.ProviderName,
                    role.Name,
                    TenantRoleTemplates.Resolve(template, tenantPermissions),
                    tenantId);

                created.Add(role.Name);
            }
        }

        return created;
    }
}
