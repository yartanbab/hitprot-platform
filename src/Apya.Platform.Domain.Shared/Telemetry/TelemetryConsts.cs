namespace Apya.Platform.Telemetry;

public static class TelemetryConsts
{
    /// <summary>İstemcinin tek seferde gönderebileceği en fazla davranış izi olayı.</summary>
    public const int MaxBreadcrumbEvents = 25;

    /// <summary>Saklama süresi alt/üst sınırı — ayardan gelen değer bu aralığa kırpılır.</summary>
    public const int MinRetentionDays = 7;
    public const int MaxRetentionDays = 3650;

    /// <summary>Bir temizlik turunda silinecek en fazla kayıt (uzun kilit ve şişkin transaction'ı önler).</summary>
    public const int RetentionBatchSize = 5000;

    /// <summary>
    /// Bir çağrının "yavaş" sayıldığı süre (ms). Ortalama tek bir uç değerle bozulur;
    /// bu eşiği aşan çağrı SAYISI daha sağlam bir yavaşlık göstergesidir.
    /// Otomasyon adımında ayara taşınacak, bu değer varsayılanı olacak.
    /// </summary>
    public const int DefaultSlowEndpointThresholdMs = 1000;

    /// <summary>
    /// Yavaş uç listesine girebilmek için gereken en az çağrı sayısı — tek kez çağrılmış
    /// bir uç, soğuk başlangıç yüzünden listeyi kapatmasın.
    /// </summary>
    public const int DefaultEndpointMinCallCount = 5;

    /// <summary>
    /// Tek sorguda okunacak en fazla uç grubu (normalizasyon ÖNCESİ ham yol sayısı).
    /// Gruplama SQL'de yapıldığı için bu satır değil GRUP tavanıdır; eski 200.000
    /// satırlık bellek taramasının yerini alır.
    /// <para>
    /// 🔴 Tavana dayanıldığında kesme sırası ÖNEMLİ: çağrı sayısına göre sıralayıp
    /// kesmek, kimlik taşıyan yolları (her biri 1-2 çağrı) sistematik olarak eler —
    /// yani tam da normalize edilip toplanacak olanları. Bu yüzden sorgular yola göre
    /// KARARLI sıralanır, sayıya göre değil.
    /// </para>
    /// </summary>
    public const int MaxEndpointGroupsScanned = 50_000;
}
