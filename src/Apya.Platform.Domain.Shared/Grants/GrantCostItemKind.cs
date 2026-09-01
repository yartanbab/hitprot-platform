namespace Apya.Platform.Grants;

/// <summary>
/// Programın desteklediği harcama kalemi (1b · Finansal Yapı · uygun harcama kalemleri).
/// Bir kalem yalnızca <see cref="GrantEligibleCostItem"/> satırı varsa AÇIKTIR; satırı
/// olmayan kalem kapalıdır (ayrı bir "IsEnabled" bayrağı tutulmaz).
/// </summary>
public enum GrantCostItemKind
{
    Personel = 0,
    MakineTechizat = 1,
    Danismanlik = 2,
    YazilimLisans = 3,
    Seyahat = 4,
    SarfMalzeme = 5
}
