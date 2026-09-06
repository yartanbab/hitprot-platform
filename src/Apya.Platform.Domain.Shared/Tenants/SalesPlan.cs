namespace Apya.Platform.Tenants;

/// <summary>
/// SATIŞ paketi — protokolün 3. maddesindeki katalog. <see cref="PackageCode"/> ile
/// BİLEREK ayrı tutulur: <c>PackageCode</c> teknik feature/limit setidir, bu ise
/// müşteriye satılan ürün adıdır ve ikisi birebir örtüşmez.
/// <para>
/// Somut ayrışma <see cref="Joint"/>'te görülür: ortak paket tek bir feature seti
/// değil, İKİ ayrı kiracıdır. Tek enum kullansaydık ya kataloğa teknik olmayan bir
/// değer sokmak ya da protokoldeki ürünü gizlemek gerekirdi.
/// </para>
/// <para>
/// Satış paketi → teknik paket eşlemesi hesap açılışında (Faz 2) yapılır; kayıt
/// talebi yalnız müşterinin SEÇTİĞİ ürünü taşır.
/// </para>
/// </summary>
public enum SalesPlan
{
    /// <summary>Standart Paket — 1 kurum / 2 kullanıcı / 2 proje.</summary>
    Standard = 1,

    /// <summary>Kurumsal Paket — 1 kurum / 10 kullanıcı / 5 proje. AI hibe eşleştirme dahil.</summary>
    Corporate = 2,

    /// <summary>Ortak Paket Sistemi — 2 kurum / 4 kullanıcı / 2+2 proje, konsorsiyum yönetimi.</summary>
    Joint = 3
}
