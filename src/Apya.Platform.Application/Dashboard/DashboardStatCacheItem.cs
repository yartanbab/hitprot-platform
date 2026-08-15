namespace Apya.Platform.Dashboard;

/// <summary>
/// Dashboard istatistik bandının cache kaydı (bkz. DashboardStatisticsProvider).
/// Değerler tenant-genelidir; ABP IDistributedCache anahtarı CurrentTenant ile
/// otomatik öneklediği için kiracılar arası sızıntı olmaz.
/// </summary>
public class DashboardStatCacheItem
{
    public decimal? Current { get; set; }
    public decimal? Previous { get; set; }
}
