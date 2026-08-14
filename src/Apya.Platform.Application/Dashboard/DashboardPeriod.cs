using System;

namespace Apya.Platform.Dashboard;

/// <summary>
/// Bir dashboard sorgusunun çözülmüş tarih penceresi. <see cref="Start"/> dahil,
/// <see cref="EndExclusive"/> hariçtir — sınır günü iki döneme birden düşmez.
/// </summary>
public readonly struct DashboardPeriod
{
    public DateTime Start { get; }
    public DateTime EndExclusive { get; }

    public DashboardPeriod(DateTime start, DateTime endExclusive)
    {
        Start = start;
        EndExclusive = endExclusive;
    }

    public int DayCount => (int)(EndExclusive - Start).TotalDays;

    /// <summary>Delta hesabı için hemen önceki, aynı uzunlukta pencere.</summary>
    public DashboardPeriod Previous() => new(Start.AddDays(-DayCount), Start);

    /// <summary>Haftanın başı — pazartesi (TR takvimi).</summary>
    public static DateTime StartOfWeek(DateTime day)
    {
        var date = day.Date;
        var diff = ((int)date.DayOfWeek + 6) % 7; // Pazartesi = 0
        return date.AddDays(-diff);
    }

    public static DashboardPeriod Resolve(DashboardDateRange range, DateTime now)
    {
        var today = now.Date;
        return range switch
        {
            DashboardDateRange.Week => new DashboardPeriod(StartOfWeek(today), StartOfWeek(today).AddDays(7)),
            DashboardDateRange.Quarter => ResolveQuarter(today),
            _ => ResolveMonth(today)
        };
    }

    private static DashboardPeriod ResolveMonth(DateTime today)
    {
        var start = new DateTime(today.Year, today.Month, 1, 0, 0, 0, today.Kind);
        return new DashboardPeriod(start, start.AddMonths(1));
    }

    private static DashboardPeriod ResolveQuarter(DateTime today)
    {
        var firstMonth = ((today.Month - 1) / 3) * 3 + 1;
        var start = new DateTime(today.Year, firstMonth, 1, 0, 0, 0, today.Kind);
        return new DashboardPeriod(start, start.AddMonths(3));
    }

    /// <summary>
    /// Teslim satırının hafta grubu. Bu hafta / gelecek hafta / ay sonu / sonrası —
    /// sunucuda hesaplanır, UI yalnız çizer.
    /// </summary>
    public static DeliveryGroup GroupFor(DateTime dueDate, DateTime today)
    {
        var thisWeekStart = StartOfWeek(today);
        var due = dueDate.Date;

        if (due < thisWeekStart.AddDays(7)) return DeliveryGroup.ThisWeek;
        if (due < thisWeekStart.AddDays(14)) return DeliveryGroup.NextWeek;

        var monthEnd = new DateTime(today.Year, today.Month, 1, 0, 0, 0, today.Kind).AddMonths(1);
        return due < monthEnd ? DeliveryGroup.EndOfMonth : DeliveryGroup.Later;
    }
}
