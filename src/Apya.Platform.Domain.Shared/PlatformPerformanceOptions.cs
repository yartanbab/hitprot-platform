namespace Apya.Platform;

/// <summary>
/// Performans altyapısı eşikleri. Konfig bölümü: <c>Platform:Performance</c>.
/// Varsayılanlar koddadır; appsettings yalnız override için kullanılır.
/// 0 veya negatif değer ilgili özelliği kapatır.
/// </summary>
public class PlatformPerformanceOptions
{
    public const string SectionName = "Platform:Performance";

    /// <summary>Bu süreyi (ms) aşan HTTP istekleri Warning seviyesinde loglanır.</summary>
    public int SlowRequestThresholdMs { get; set; } = 1000;

    /// <summary>
    /// Bu süreyi (ms) aşan veritabanı komutları Warning seviyesinde loglanır.
    /// Parametre DEĞERLERİ loglanmaz (PII/KVKK).
    /// </summary>
    public int SlowQueryThresholdMs { get; set; } = 500;

    /// <summary>Dashboard istatistik bandının stat-başına cache süresi (saniye).</summary>
    public int DashboardCacheSeconds { get; set; } = 180;
}
