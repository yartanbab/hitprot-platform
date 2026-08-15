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
    AiTransfer = 2
}
