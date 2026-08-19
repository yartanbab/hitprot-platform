namespace Apya.Platform.Calendars;

/// <summary>
/// Takvim öğesinin risk düzeyi. Tasarım kuralı: renk YALNIZ risk için kullanılır —
/// normal öğeler nötr görünür, risk renk + desen + ikon olmak üzere üç kanaldan anlatılır.
/// </summary>
public enum CalendarRiskLevel
{
    /// <summary>Risk yok — nötr gösterim.</summary>
    None = 0,

    /// <summary>Bugün son gün (amber).</summary>
    DueToday = 1,

    /// <summary>Tarihi geçmiş ve hâlâ açık (kırmızı).</summary>
    Overdue = 2
}
