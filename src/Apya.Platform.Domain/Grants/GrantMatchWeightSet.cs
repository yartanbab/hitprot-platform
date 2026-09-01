using System.Collections.Generic;

namespace Apya.Platform.Grants;

/// <summary>
/// 4b · Skorlama ayarlarının kalıcı olmayan taşıyıcısı. <see cref="GrantMatchWeight"/>
/// satırından üretilir; satır yoksa <see cref="Default"/> kullanılır.
///
/// <para><b>Varsayılan, mevcut davranışın BİREBİR aynısıdır:</b> tüm çarpanlar 1.0 iken
/// ağırlıklı ortalama düz ortalamaya eşittir, ölçek cezası ve "veri yoksa boyutu atla"
/// kuralları da bugünkü hâliyle açıktır. Yeni boyutlar (TRL, Ar-Ge personeli) yalnız iki
/// tarafta da veri varsa devreye girer.</para>
/// </summary>
public sealed class GrantMatchWeightSet
{
    public static GrantMatchWeightSet Default => new();

    private readonly Dictionary<GrantMatchDimension, double> _multipliers = new()
    {
        [GrantMatchDimension.Sector] = 1.0,
        [GrantMatchDimension.TechnicalMaturity] = 1.0,
        [GrantMatchDimension.RdStaff] = 1.0,
        [GrantMatchDimension.Region] = 1.0,
        [GrantMatchDimension.ProjectHistory] = 1.0,
        [GrantMatchDimension.Keyword] = 1.0
    };

    /// <summary>Ölçek uyuşmazlığında skoru %30'a düşür (bugünkü davranış).</summary>
    public bool SizePenaltyEnabled { get; set; } = true;

    /// <summary>Veri yoksa boyutu atla, ceza verme (bugünkü davranış).</summary>
    public bool SkipMissingDimensions { get; set; } = true;

    public double this[GrantMatchDimension dimension]
    {
        get => _multipliers[dimension];
        set => _multipliers[dimension] = value < 0 ? 0 : value;
    }

    /// <summary>Çarpanı 0 olan boyut skora hiç girmez ("kapalı").</summary>
    public bool IsEnabled(GrantMatchDimension dimension) => _multipliers[dimension] > 0;
}
