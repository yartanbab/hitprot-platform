using System.Collections.Generic;
using System.Linq;
using Apya.Platform.Dashboard.Dtos;

namespace Apya.Platform.Dashboard;

/// <summary>
/// Görünüm başına yerleşik kart düzeni. Kullanıcının kaydettiği düzen yoksa bu döner
/// ve <c>DashboardLayoutDto.IsDefault</c> true işaretlenir.
/// <para>
/// Izgara birimi: 12 kolon × 64px satır (react-grid-layout ile aynı).
/// </para>
/// </summary>
public static class DashboardDefaultLayouts
{
    public const string ProjectManagement = "project-management";
    public const string Finance = "finance";
    public const string Today = "today";
    public const string Grants = "grants";

    public const string DefaultViewKey = ProjectManagement;

    private static readonly Dictionary<string, List<DashboardCardDto>> Layouts = new()
    {
        [ProjectManagement] = new()
        {
            Card("summary-strip",     DashboardChartType.NumberTrend, 0, 0, 12, 2),
            // Teslimler / Proje sağlığı 7/5: tasarımın 1.55fr:1fr oranına en yakın
            // 12-kolon tamsayısı (eski 8/4 = 2:1 fazla genişti). Kart kataloğundaki
            // varsayılan boyutlarla (deliveries w7 / project-health w5) da hizalı.
            Card("deliveries",        DashboardChartType.RankBar,     0, 2,  7, 6),
            Card("project-health",    DashboardChartType.Bullet,      7, 2,  5, 6),
            Card("approvals",         DashboardChartType.RankBar,     0, 8,  4, 5),
            Card("blockers",          DashboardChartType.RankBar,     4, 8,  4, 5),
            Card("ai-suggestions",    DashboardChartType.NumberTrend, 8, 8,  4, 5),
            Card("income-expense",    DashboardChartType.GroupedBar,  0, 13, 4, 5),
            Card("delivery-heatmap",  DashboardChartType.Heatmap,     4, 13, 4, 5),
            Card("project-phases",    DashboardChartType.MiniGantt,   8, 13, 4, 5),
            Card("statistics-band",   DashboardChartType.NumberTrend, 0, 18, 12, 5)
        },
        [Finance] = new()
        {
            Card("summary-strip",     DashboardChartType.NumberTrend, 0, 0, 12, 2),
            Card("income-expense",    DashboardChartType.GroupedBar,  0, 2,  8, 6),
            Card("approvals",         DashboardChartType.RankBar,     8, 2,  4, 6),
            Card("project-health",    DashboardChartType.Bullet,      0, 8,  6, 5),
            Card("statistics-band",   DashboardChartType.NumberTrend, 6, 8,  6, 5)
        },
        [Today] = new()
        {
            Card("summary-strip",     DashboardChartType.NumberTrend, 0, 0, 12, 2),
            Card("deliveries",        DashboardChartType.RankBar,     0, 2,  8, 7),
            Card("blockers",          DashboardChartType.RankBar,     8, 2,  4, 7),
            Card("approvals",         DashboardChartType.RankBar,     0, 9,  6, 5),
            Card("ai-suggestions",    DashboardChartType.NumberTrend, 6, 9,  6, 5)
        },
        [Grants] = new()
        {
            Card("summary-strip",     DashboardChartType.NumberTrend, 0, 0, 12, 2),
            Card("deliveries",        DashboardChartType.RankBar,     0, 2,  7, 6),
            Card("delivery-heatmap",  DashboardChartType.Heatmap,     7, 2,  5, 6),
            Card("statistics-band",   DashboardChartType.NumberTrend, 0, 8, 12, 5)
        }
    };

    public static bool IsKnown(string viewKey) => Layouts.ContainsKey(viewKey);

    /// <summary>Bilinmeyen anahtar gelirse varsayılan görünüm döner — çağıran zaten normalize eder.</summary>
    public static List<DashboardCardDto> For(string viewKey)
    {
        var source = Layouts.TryGetValue(viewKey, out var cards) ? cards : Layouts[DefaultViewKey];

        // Kopya döndür — çağıran listeyi değiştirirse sabit tanım bozulmasın.
        return source.Select(c => new DashboardCardDto
        {
            CardKey = c.CardKey,
            ChartType = c.ChartType,
            X = c.X,
            Y = c.Y,
            W = c.W,
            H = c.H
        }).ToList();
    }

    private static DashboardCardDto Card(string key, DashboardChartType type, int x, int y, int w, int h)
        => new() { CardKey = key, ChartType = type, X = x, Y = y, W = w, H = h };
}
