using System;

namespace Apya.Platform.Projects;

/// <summary>
/// PRJ-08 · Gösterge ilerlemesi — tek kural, tek yer (liste, rapor ve bildirim aynı hesabı kullanır).
/// </summary>
public static class ProjectIndicatorProgress
{
    /// <summary>
    /// Başlangıçtan hedefe gidilen yolun yüzdesi (0-100). Aşağı YUVARLANIR: %99,6 "tamam" sayılmaz.
    /// Azaltma hedefinde (hedef &lt; başlangıç) aynı formül doğru çalışır.
    /// </summary>
    public static int Percent(decimal baseline, decimal target, decimal current)
    {
        var span = target - baseline;
        if (span == 0)
        {
            return current == target ? 100 : 0;
        }

        var ratio = Math.Clamp((current - baseline) / span, 0m, 1m);
        return (int)Math.Floor(ratio * 100m);
    }

    public static ProjectIndicatorStatus Status(int percent, DateTime? targetDate, DateTime today)
    {
        if (percent >= 100)
        {
            return ProjectIndicatorStatus.Completed;
        }

        return targetDate.HasValue && targetDate.Value.Date < today.Date
            ? ProjectIndicatorStatus.Behind
            : ProjectIndicatorStatus.OnTrack;
    }
}
