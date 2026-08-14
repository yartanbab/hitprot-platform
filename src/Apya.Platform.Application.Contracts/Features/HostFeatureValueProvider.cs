using System;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Features;
using Volo.Abp.MultiTenancy;
using Volo.Abp.Validation.StringValues;

namespace Apya.Platform.Features;

/// <summary>
/// Host (root) bağlamında Platform yetenek feature'larının tavanını kaldırır.
///
/// <para>Neden: paket (edition) kavramı yalnız tenant'lar içindir — host hiçbir paket satın almaz.
/// Host'ta tenant feature değeri olmadığı için zincir defaultValue'ya düşüyordu; varsayılanı
/// "false" olan feature'lar (AiAssist, AdvancedReports) root'ta KAPALI görünüyor ve bunlara
/// <c>RequireFeatures</c> ile bağlı tüm izinler root'ta hem yetki ekranından kayboluyor hem de
/// <c>IsGrantedAsync</c> false dönüyordu.</para>
///
/// <para>Zincir TERS sırayla değerlendirilir (son eklenen ilk sorulur, ilk null olmayan kazanır),
/// bu yüzden <see cref="AbpFeatureOptions.ValueProviders"/> listesine EN SONA eklenir —
/// tenant/edition/default'tan önce sorulur. Bkz. PlatformApplicationContractsModule.</para>
///
/// <para>Kapsam bilerek dar: yalnız <see cref="PlatformFeatures.GroupName"/> grubunun toggle
/// feature'ları. Sayısal limitler (MaxUsers/MaxProjects) kendi varsayılanlarıyla kalır, diğer
/// modüllerin feature'larına hiç dokunulmaz.</para>
/// </summary>
public class HostFeatureValueProvider : IFeatureValueProvider, ITransientDependency
{
    public const string ProviderName = "Host";

    public string Name => ProviderName;

    private readonly ICurrentTenant _currentTenant;

    public HostFeatureValueProvider(ICurrentTenant currentTenant)
    {
        _currentTenant = currentTenant;
    }

    public Task<string?> GetOrNullAsync(FeatureDefinition feature)
    {
        // Tenant bağlamı varsa karar paketindir: zincirin geri kalanına dokunma.
        if (_currentTenant.Id != null)
        {
            return Task.FromResult<string?>(null);
        }

        if (!feature.Name.StartsWith(PlatformFeatures.GroupName + ".", StringComparison.Ordinal))
        {
            return Task.FromResult<string?>(null);
        }

        if (feature.ValueType is not ToggleStringValueType)
        {
            return Task.FromResult<string?>(null);
        }

        return Task.FromResult<string?>("true");
    }
}
