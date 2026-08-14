using System.Threading.Tasks;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.DependencyInjection;
using Volo.Abp.MultiTenancy;
using Volo.Abp.SimpleStateChecking;

namespace Apya.Platform.Tenants;

/// <summary>
/// PAKET İZİN TAVANI. Her izin tanımına global olarak uygulanır: tenant'ın paketinin izin
/// listesinde olmayan izin devre dışıdır — yetki yönetimi ekranında hiç listelenmez ve
/// <c>IsGrantedAsync</c> false döner (rolde verilmiş olsa bile).
///
/// <para>Host (root) muaftır: paket kavramı yalnız tenant'lar içindir. Aynı ilke feature
/// tarafında HostFeatureValueProvider ile kuruludur.</para>
///
/// <para>Sıralama: izin, tanımındaki diğer state checker'ları da geçmek zorundadır —
/// bu sınıf yalnız kısıtlar, hiçbir izni "açmaz".</para>
/// </summary>
public class PackagePermissionStateChecker
    : ISimpleBatchStateChecker<PermissionDefinition>, ITransientDependency
{
    private readonly ICurrentTenant _currentTenant;
    private readonly PackageCeilingStore _ceilingStore;

    public PackagePermissionStateChecker(ICurrentTenant currentTenant, PackageCeilingStore ceilingStore)
    {
        _currentTenant = currentTenant;
        _ceilingStore = ceilingStore;
    }

    public async Task<bool> IsEnabledAsync(SimpleStateCheckerContext<PermissionDefinition> context)
    {
        var tenantId = _currentTenant.Id;
        if (tenantId == null)
        {
            return true;
        }

        var ceiling = await _ceilingStore.GetCeilingOrNullAsync(tenantId.Value);
        return ceiling == null || ceiling.Contains(context.State.Name);
    }

    public async Task<SimpleStateCheckerResult<PermissionDefinition>> IsEnabledAsync(
        SimpleBatchStateCheckerContext<PermissionDefinition> context)
    {
        var result = new SimpleStateCheckerResult<PermissionDefinition>();

        var tenantId = _currentTenant.Id;
        var ceiling = tenantId == null ? null : await _ceilingStore.GetCeilingOrNullAsync(tenantId.Value);

        // Tek cache okumasıyla tüm liste karara bağlanır: yetki ekranı ~90 izni birden sorar.
        foreach (var state in context.States)
        {
            result[state] = ceiling == null || ceiling.Contains(state.Name);
        }

        return result;
    }
}
