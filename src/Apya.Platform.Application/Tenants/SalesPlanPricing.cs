using System.Globalization;
using System.Threading.Tasks;
using Apya.Platform.Settings;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Settings;

namespace Apya.Platform.Tenants;

/// <summary>
/// Satış paketlerinin yıllık liste bedeli (TL, KDV hariç) — protokol Madde 3.
///
/// <para>Bedeller host ayarında durur (<see cref="PlatformSettings.Pricing"/>) ve
/// <c>/PackageManagement</c> ekranından düzenlenir. Tek okuma noktası burasıdır:
/// ayarın adını üç ayrı yerde yazmak, birinde yazım hatası olduğunda sessizce sıfır
/// döndürürdü.</para>
///
/// <para><b>Tanımsız bedel <c>null</c> döner, 0 DEĞİL.</b> Ayrım önemli: 0 TL geçerli
/// bir bedel olabilir (bedelsiz anlaşma), "tanımlı değil" ise ekranda ve sözleşmede
/// farklı davranış gerektirir — sözleşmeye rakam yazmak yerine "taraflarca ayrıca
/// belirlenecektir" denir.</para>
/// </summary>
public class SalesPlanPricing : ITransientDependency
{
    private readonly ISettingProvider _settingProvider;

    public SalesPlanPricing(ISettingProvider settingProvider)
    {
        _settingProvider = settingProvider;
    }

    /// <summary>Paketin liste bedeli; tanımlı değilse <c>null</c>.</summary>
    public async Task<decimal?> GetPriceOrNullAsync(SalesPlan plan)
    {
        var raw = await _settingProvider.GetOrNullAsync(SettingNameOf(plan));

        if (string.IsNullOrWhiteSpace(raw))
        {
            return null;
        }

        // 🔴 InvariantCulture ŞART: ayar değeri "12000.50" olarak saklanır. tr-TR ile
        // ayrıştırılsaydı nokta binlik ayracı sayılır ve bedel bin kat saparak sözleşmeye
        // geçerdi — aynı tuzağın form tarafındaki karşılığı __Invariant işaretçisidir.
        if (!decimal.TryParse(raw, NumberStyles.Number, CultureInfo.InvariantCulture, out var price))
        {
            return null;
        }

        return price > 0 ? price : null;
    }

    public static string SettingNameOf(SalesPlan plan) => plan switch
    {
        SalesPlan.Standard => PlatformSettings.Pricing.StandardPlan,
        SalesPlan.Corporate => PlatformSettings.Pricing.CorporatePlan,
        SalesPlan.Joint => PlatformSettings.Pricing.JointPlan,
        _ => PlatformSettings.Pricing.StandardPlan
    };
}
