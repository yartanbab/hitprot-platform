using System.Threading.Tasks;
using Apya.Platform.Features;
using Volo.Abp;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities.Events;
using Volo.Abp.EventBus;
using Volo.Abp.Features;
using Volo.Abp.Identity;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tenants;

/// <summary>
/// Faz 2b: Paket kotası — tenant'ın <see cref="PlatformFeatures.MaxUsers"/> limitini aşan
/// kullanıcı oluşturmayı engeller.
///
/// Bu ABP sürümünde yalnız post-save local entity event'i (EntityCreated) yayınlanıyor; "creating"
/// (pre-save) yok. Event SaveChanges sırasında, transactional UoW COMMIT'inden ÖNCE yayınlanır;
/// burada BusinessException fırlatmak işlemi geri aldırır → insert kalıcı olmaz. Yeni kullanıcı bu
/// noktada DB'ye yazılmış (sayıma dahil) olduğundan eşik `count > max`'tır (max=3 → 4. kullanıcıda
/// count=4 > 3 → bloke; 3. kullanıcıda count=3 → serbest). Host (TenantId null) muaf. Tenant
/// oluşturma sırasındaki ilk admin: o an feature default'u (yüksek) geçerli → engellenmez.
/// </summary>
public class TenantUserLimitHandler
    : ILocalEventHandler<EntityCreatedEventData<IdentityUser>>, ITransientDependency
{
    private readonly IFeatureChecker _featureChecker;
    private readonly IIdentityUserRepository _userRepository;
    private readonly ICurrentTenant _currentTenant;

    public TenantUserLimitHandler(
        IFeatureChecker featureChecker,
        IIdentityUserRepository userRepository,
        ICurrentTenant currentTenant)
    {
        _featureChecker = featureChecker;
        _userRepository = userRepository;
        _currentTenant = currentTenant;
    }

    public async Task HandleEventAsync(EntityCreatedEventData<IdentityUser> eventData)
    {
        var user = eventData.Entity;
        if (user.TenantId == null)
        {
            return; // host kullanıcıları limite tabi değil
        }

        // Feature + sayım, hedef tenant context'inde değerlendirilmeli (çağıran host olabilir).
        using (_currentTenant.Change(user.TenantId))
        {
            var max = await _featureChecker.GetAsync<int>(PlatformFeatures.MaxUsers);
            var currentCount = await _userRepository.GetCountAsync(); // yeni kullanıcı dahil
            if (currentCount > max)
            {
                throw new BusinessException("Platform:Error:MaxUsersReached")
                    .WithData("Max", max);
            }
        }
    }
}
