using System;

namespace Apya.Platform.Grants;

/// <summary>
/// 22b · Bir talebe ilk yanıtın son anı: <b>bir iş günü</b>. Firmaya verilen söz "1 iş günü
/// içinde dönüş" olduğu için sayaç da hafta sonunu saymaz — cuma akşamı gelen talep
/// cumartesi "gecikti" görünmez.
///
/// <para>🔴 Resmî tatiller bilinmiyor, sayılmaz: bayram arifesinde gelen talep ertesi gün
/// gecikmiş görünebilir. Tatil takvimi kurulursa tek değişecek yer burası.</para>
///
/// <para>Saf hesap: tarih çağırandan gelir (ARCH-049), DI'sız test edilir.</para>
/// </summary>
public static class GrantResponseDeadline
{
    /// <summary>Bu kadar saat ya da daha az kaldığında satır "yaklaşıyor" sayılır ve üst şeride girer.</summary>
    public const int DueSoonHours = 6;

    public static DateTime For(DateTime createdAt)
    {
        // Hafta sonu gelen talebin saati pazartesi 00:00'da işlemeye başlar.
        var start = createdAt;
        while (IsWeekend(start))
        {
            start = start.Date.AddDays(1);
        }

        // Son an hafta sonuna düşerse hafta sonu kadar ötelenir: cuma 15:00 → pazartesi 15:00.
        var due = start.AddHours(24);
        while (IsWeekend(due))
        {
            due = due.AddDays(1);
        }

        return due;
    }

    /// <summary>Yanıtlanmamış bir talebin süre durumu.</summary>
    public static GrantResponseState StateOf(DateTime due, DateTime now)
    {
        var left = due - now;
        if (left <= TimeSpan.Zero)
        {
            return GrantResponseState.Overdue;
        }

        return left <= TimeSpan.FromHours(DueSoonHours)
            ? GrantResponseState.DueSoon
            : GrantResponseState.Waiting;
    }

    /// <summary>Kalan tam saat (yukarı yuvarlanır: 20 dakika "1 saat kaldı" okunur). Süre dolduysa 0.</summary>
    public static int HoursLeft(DateTime due, DateTime now)
    {
        var left = due - now;
        return left <= TimeSpan.Zero ? 0 : (int)Math.Ceiling(left.TotalHours);
    }

    private static bool IsWeekend(DateTime value)
        => value.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday;
}
