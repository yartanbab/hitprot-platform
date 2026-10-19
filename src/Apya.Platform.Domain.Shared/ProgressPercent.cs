using System;

namespace Apya.Platform;

/// <summary>
/// QA-36 · Ekrandaki ilerleme yüzdesinin TEK yuvarlama kuralı (görev ilerlemesi, gösterge ilerlemesi): en yakın
/// tama, yarım yukarı (2/3 → %67). İki istisna yanıltmamak için: iş bitmeden %100 gösterilmez (199/200 → %99),
/// iş başlamışken %0 gösterilmez (1/300 → %1).
/// </summary>
public static class ProgressPercent
{
    public static int Of(decimal ratio)
    {
        ratio = Math.Clamp(ratio, 0m, 1m);
        var percent = (int)Math.Round(ratio * 100m, MidpointRounding.AwayFromZero);
        if (percent == 100 && ratio < 1m) { return 99; }
        if (percent == 0 && ratio > 0m) { return 1; }
        return percent;
    }
}
