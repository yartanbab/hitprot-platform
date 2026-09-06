namespace Apya.Platform.Tenants;

/// <summary>
/// Satış paketi ile teknik paket arasındaki köprü.
///
/// <para><b>Adlar burada Türkçe ve SABİT.</b> Yerelleştirme sözlüğünden okunmazlar çünkü tek
/// tüketicileri sözleşme metnidir: protokol Türkçe bir hukuki belgedir ve içindeki paket adı,
/// arayüz dili değişse bile değişmemelidir. Ekranda görünen etiketler ayrıca
/// <c>RegistrationRequest:Plan:*</c> anahtarlarından gelir.</para>
/// </summary>
public static class SalesPlanCatalog
{
    public static string DisplayName(SalesPlan plan) => plan switch
    {
        SalesPlan.Standard => "Standart Paket",
        SalesPlan.Corporate => "Kurumsal Paket",
        SalesPlan.Joint => "Ortak Paket Sistemi",
        _ => plan.ToString()
    };

    /// <summary>
    /// Satış paketinin karşılığı olan teknik paket (feature/limit seti).
    ///
    /// <para>🔴 <b>KOTALAR PROTOKOLLE ÖRTÜŞMÜYOR.</b> Protokol Standart'ı 2 kullanıcı / 2 proje
    /// olarak satar; <c>PackageDefinitions.Standard</c> ise 10 kullanıcı / 25 proje verir
    /// (Kurumsal ↔ <c>Premium</c>: 10/5'e karşı 50/200). Yani müşteriye söz verilenden FAZLASI
    /// açılıyor — eksik açmaktan iyidir, ama kasıtlı değildir.</para>
    ///
    /// <para><c>PackageDefinitions</c>'ı protokole çekmek, o paketteki MEVCUT kiracıları geriye
    /// dönük daraltır (10 kullanıcılı bir müşteri 2'ye düşer). Bu yüzden burada yalnız eşleme
    /// yapılıyor; kotaların düzeltilmesi canlı veriye bakılarak verilecek AYRI bir karardır.</para>
    ///
    /// <para><see cref="SalesPlan.Joint"/> iki ayrı kiracıdır; bu eşleme onlardan HER BİRİNİN
    /// paketini verir. İkinci kurumu sistem kendiliğinden açmaz —
    /// bkz. <see cref="RequiresSecondTenant"/>.</para>
    /// </summary>
    public static PackageCode ToPackageCode(SalesPlan plan) => plan switch
    {
        SalesPlan.Standard => PackageCode.Standard,
        SalesPlan.Corporate => PackageCode.Premium,
        SalesPlan.Joint => PackageCode.Standard,
        _ => PackageCode.Basic
    };

    /// <summary>
    /// Bu paket birden fazla kiracı gerektiriyor mu? Ortak Paket'te ikinci kurumu host ELLE
    /// açar: konsorsiyum eşleştirmesi (hangi iki tüzel kişilik, hangi projeler ortak) bugün
    /// sistemde modellenmiş değil, otomatik açmak yarım bir kurulum bırakırdı.
    /// </summary>
    public static bool RequiresSecondTenant(SalesPlan plan) => plan == SalesPlan.Joint;
}
