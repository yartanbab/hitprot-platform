namespace Apya.Platform.Consents;

/// <summary>
/// Rıza kaydının konusu. Tek omurga (ConsentRecord) üç farklı rıza türünü taşır:
/// çerez bilgilendirmesi, form KVKK onayı ve AI aktarım onayı.
/// </summary>
public enum ConsentType
{
    /// <summary>Çerez bilgilendirme şeridinin "anladım" onayı (zorunlu çerezler).</summary>
    CookieNotice = 0,

    /// <summary>Genel form dolduranın KVKK aydınlatma onayı (form slug'ı SourceRef'te).</summary>
    FormKvkk = 1,

    /// <summary>Yapay zekâ / yurt dışı aktarım onayı.</summary>
    AiTransfer = 2,

    /// <summary>
    /// Hizmet protokolünün kabulü (clickwrap). Protokolün 9. maddesi bu onayı
    /// yürürlük şartı sayar: zaman damgası + IP ile birlikte hukuki delildir.
    /// </summary>
    ServiceAgreement = 3,

    /// <summary>
    /// Protokolün 6. maddesindeki KVKK veri sorumlusu / veri işleyen karşılıklı
    /// taahhüdü. <see cref="FormKvkk"/>'dan AYRI: o, formu dolduranın aydınlatma
    /// onayıdır; bu ise kurumun sözleşmesel taahhüdüdür ve ikisi farklı anlarda,
    /// farklı metinlerle alınır.
    /// </summary>
    ServiceAgreementKvkk = 4
}
