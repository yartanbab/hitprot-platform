namespace Apya.Platform.Dashboard;

/// <summary>Dashboard sorgularının zaman aralığı. Varsayılan <see cref="Month"/>.</summary>
public enum DashboardDateRange
{
    Week = 0,
    Month = 1,
    Quarter = 2
}

/// <summary>
/// Teslim satırının durumu. Kaynak <c>TaskStatus</c> + son tarih:
/// <list type="bullet">
/// <item><see cref="Overdue"/> — DueDate geçmiş, görev kapanmamış</item>
/// <item><see cref="InReview"/> — TaskStatus.InReview (kontrol/test aşamasında)</item>
/// <item><see cref="OnTrack"/> — Todo/InProgress, son tarih bu dönem içinde</item>
/// <item><see cref="Upcoming"/> — son tarih ileri bir dönemde</item>
/// </list>
/// </summary>
public enum DeliveryState
{
    Upcoming = 0,
    OnTrack = 1,
    InReview = 2,
    Overdue = 3
}

/// <summary>Teslim listesinin hafta grupları — sunucuda hesaplanır, UI yalnız çizer.</summary>
public enum DeliveryGroup
{
    ThisWeek = 0,
    NextWeek = 1,
    EndOfMonth = 2,
    Later = 3
}

/// <summary>
/// Proje sağlık durumu. Eşikler mevcut <c>BudgetHealthWidget</c> ile aynı:
/// oran %90+ → <see cref="Risky"/>, %70+ → <see cref="Attention"/>, altı → <see cref="Healthy"/>.
/// </summary>
public enum ProjectHealthState
{
    Healthy = 0,
    Attention = 1,
    Risky = 2
}

/// <summary>
/// Onay kuyruğundaki kaydın türü.
/// <para>
/// NOT: Platformda henüz bir onay iş akışı YOK — <c>Expense</c>'te durum alanı,
/// sipariş (PurchaseOrder) entity'si bulunmuyor. Bu yüzden tek gerçek kaynak
/// taslak faturadır. Onay iş akışı eklenirse buraya Expense/PurchaseOrder üyeleri gelir.
/// </para>
/// </summary>
public enum DashboardApprovalType
{
    Invoice = 0
}

/// <summary>
/// Tıkanma sebebi. Görev <c>DashboardOptions.StaleAfterDays</c> gündür değişmemiş VE:
/// <list type="bullet">
/// <item><see cref="WaitingReview"/> — TaskStatus.InReview'da bekliyor</item>
/// <item><see cref="Dependency"/> — açık bir bağımlılığı var (TaskDependency)</item>
/// <item><see cref="Unassigned"/> — atanan yok</item>
/// </list>
/// Birden fazlası geçerliyse öncelik yukarıdaki sıradadır.
/// </summary>
public enum TaskBlockReason
{
    WaitingReview = 0,
    Dependency = 1,
    Unassigned = 2
}

/// <summary>İstatistik delta'sının yönü. <see cref="Flat"/> = önceki dönemle aynı ya da delta yok.</summary>
public enum DashboardTrend
{
    Flat = 0,
    Up = 1,
    Down = 2
}

/// <summary>İstatistik bandının sekmeleri.</summary>
public enum DashboardStatGroup
{
    Work = 0,
    Finance = 1,
    Grants = 2,
    Communication = 3,
    System = 4
}

/// <summary>
/// Kart kataloğundaki grafik türleri. Her türün kendi <c>minW/minH</c>'si vardır;
/// altına inilirse UI <see cref="NumberTrend"/> fallback'ini çizer.
/// </summary>
public enum DashboardChartType
{
    NumberTrend = 0,
    AreaSpark = 1,
    LineMulti = 2,
    GroupedBar = 3,
    StackedBar = 4,
    FullStacked = 5,
    RankBar = 6,
    Donut = 7,
    Gauge = 8,
    Heatmap = 9,
    Burndown = 10,
    MiniGantt = 11,
    Waterfall = 12,
    RiskMatrix = 13,
    Funnel = 14,
    Bullet = 15
}
