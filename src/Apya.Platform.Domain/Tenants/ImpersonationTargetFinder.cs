using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Domain.Services;
using Volo.Abp.Identity;

namespace Apya.Platform.Tenants;

/// <summary>
/// Host'un "Hesabına Gir" ile bürüneceği kiracı kullanıcısını seçer. Çağıran, hedef kiracı
/// bağlamında çağırmalıdır.
///
/// <para>Önce "root", sonra "admin" adlı kullanıcı aranır. Kiracı yöneticisi kullanıcı adını
/// değiştirmiş ya da "admin"i silmişse kiracıya hiç girilemiyordu; bu durumda "admin"
/// rolündeki en eski aktif kullanıcı seçilir.</para>
/// </summary>
public class ImpersonationTargetFinder : DomainService
{
    /// <summary>ABP kimlik tohumlayıcısının her kiracıya kurduğu statik yönetici rolü.</summary>
    public const string AdminRoleName = "admin";

    private readonly IdentityUserManager _userManager;

    public ImpersonationTargetFinder(IdentityUserManager userManager)
    {
        _userManager = userManager;
    }

    /// <summary>Bürünülecek kullanıcı; uygun kimse yoksa <c>null</c>.</summary>
    public async Task<IdentityUser?> FindAsync()
    {
        var byName = await _userManager.FindByNameAsync("root") ?? await _userManager.FindByNameAsync("admin");
        if (byName != null)
        {
            return byName;
        }

        var admins = await _userManager.GetUsersInRoleAsync(AdminRoleName);
        return admins
            .Where(u => u.IsActive)
            .OrderBy(u => u.CreationTime)
            .FirstOrDefault();
    }
}
