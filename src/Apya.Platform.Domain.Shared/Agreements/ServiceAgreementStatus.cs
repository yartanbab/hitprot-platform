namespace Apya.Platform.Agreements;

/// <summary>
/// Sözleşmenin yürürlük durumu.
/// <para>
/// "Taslak" durumu YOKTUR: kayıt, protokol onaylandığı anda doğar. Protokolün 9. maddesi
/// onayı yürürlük şartı saydığı için onaylanmamış bir sözleşme kaydı, olmayan bir belgeyi
/// var göstermekten başka işe yaramazdı.
/// </para>
/// </summary>
public enum ServiceAgreementStatus
{
    /// <summary>Onaylandı ve yürürlükte (protokol Madde 8: onay tarihinden itibaren 1 yıl).</summary>
    Active = 1,

    /// <summary>Süre doldu, yenilenmedi.</summary>
    Expired = 2,

    /// <summary>Taraflardan biri 15 gün önceden bildirerek feshetti (Madde 8).</summary>
    Terminated = 3
}
