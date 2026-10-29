using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Domain.Services;
using Volo.Abp.Identity;
using Volo.Abp.PermissionManagement;

namespace Apya.Platform.Tenants;

/// <summary>
/// Host'un "Hesabına Gir" ile bürüneceği kiracı kullanıcısını seçer. Çağıran, hedef kiracı
/// bağlamında çağırmalıdır.
///
/// <para>Sıra: "root"/"admin" adlı kullanıcı → yönetici rolündeki (statik ya da "admin" adlı)
/// en eski aktif kullanıcı → rol izinlerini yönetebilen bir roldeki en eski aktif kullanıcı →
/// kiracının en eski aktif kullanıcısı. Kiracı kullanıcı ya da rol adını değiştirse, yönetici
/// rolünü silse bile host kiracıya girebilmeli; ad yerine yetkiye bakılmasının nedeni bu.</para>
/// </summary>
public class ImpersonationTargetFinder : DomainService
{
    /// <summary>ABP kimlik tohumlayıcısının her kiracıya kurduğu statik yönetici rolü.</summary>
    public const string AdminRoleName = "admin";

    /// <summary>
    /// Kiracı yöneticisini addan bağımsız tanıyan izin: rol izinlerini yönetebilen kişi
    /// kiracıdaki her yetkiyi dağıtabilir. (IdentityPermissions.Roles.ManagePermissions —
    /// sabit Application.Contracts'ta, Domain'den görünmüyor.)
    /// </summary>
    public const string AdminPermissionName = "AbpIdentity.Roles.ManagePermissions";

    private readonly IdentityUserManager _userManager;
    private readonly IIdentityRoleRepository _roleRepository;
    private readonly IPermissionGrantRepository _permissionGrantRepository;
    private readonly IRepository<IdentityUser, Guid> _userRepository;

    public ImpersonationTargetFinder(
        IdentityUserManager userManager,
        IIdentityRoleRepository roleRepository,
        IPermissionGrantRepository permissionGrantRepository,
        IRepository<IdentityUser, Guid> userRepository)
    {
        _userManager = userManager;
        _roleRepository = roleRepository;
        _permissionGrantRepository = permissionGrantRepository;
        _userRepository = userRepository;
    }

    /// <summary>Bürünülecek kullanıcı; kiracıda hiç aktif kullanıcı yoksa <c>null</c>.</summary>
    public async Task<IdentityUser?> FindAsync()
    {
        var byName = await _userManager.FindByNameAsync("root") ?? await _userManager.FindByNameAsync("admin");
        if (byName != null)
        {
            return byName;
        }

        var roles = await _roleRepository.GetListAsync();

        var adminRoles = roles
            .Where(r => r.IsStatic || r.NormalizedName == AdminRoleName.ToUpperInvariant())
            .ToList();
        var byAdminRole = await FindOldestActiveMemberAsync(adminRoles);
        if (byAdminRole != null)
        {
            return byAdminRole;
        }

        var permissionRoles = new List<IdentityRole>();
        foreach (var role in roles.Except(adminRoles))
        {
            var grant = await _permissionGrantRepository.FindAsync(
                AdminPermissionName, RolePermissionValueProvider.ProviderName, role.Name);
            if (grant != null)
            {
                permissionRoles.Add(role);
            }
        }
        var byPermission = await FindOldestActiveMemberAsync(permissionRoles);
        if (byPermission != null)
        {
            return byPermission;
        }

        var users = await _userRepository.GetQueryableAsync();
        return await AsyncExecuter.FirstOrDefaultAsync(
            users.Where(u => u.IsActive).OrderBy(u => u.CreationTime));
    }

    private async Task<IdentityUser?> FindOldestActiveMemberAsync(List<IdentityRole> roles)
    {
        var members = new List<IdentityUser>();
        foreach (var role in roles)
        {
            members.AddRange(await _userManager.GetUsersInRoleAsync(role.Name));
        }

        return members
            .Where(u => u.IsActive)
            .OrderBy(u => u.CreationTime)
            .FirstOrDefault();
    }
}
