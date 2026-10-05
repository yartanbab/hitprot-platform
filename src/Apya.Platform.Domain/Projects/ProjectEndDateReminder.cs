using System;
using System.Linq;

namespace Apya.Platform.Projects;

/// <summary>
/// 🔴 NTF-05 · Proje bitiş hatırlatmasının eşik kuralı — saf, veri erişimi yok.
///
/// <para>Eşikler 30 / 14 / 3 gün. Bir proje aynı anda yalnız TEK eşiğin içindedir:
/// kalan güne en yakın (en dar) eşik. Bu, özelliğin ilk çalıştığı gün bir geriye dönük
/// yığın üretmesini engeller — bitişine 10 gün kalmış proje "30 gün" ve "14 gün"
/// uyarılarını birlikte almaz, yalnız "14 gün"ü alır; 3 güne inince "3 gün"ü alır.</para>
/// </summary>
public static class ProjectEndDateReminder
{
    /// <summary>Büyükten küçüğe. Yeni eşik eklenirse sıra korunmalı.</summary>
    public static readonly int[] Thresholds = { 30, 14, 3 };

    public static int MaxThreshold => Thresholds[0];

    /// <summary>
    /// Kalan güne göre içinde bulunulan eşik; proje pencerenin dışındaysa <c>null</c>.
    /// Bitişi GEÇMİŞ proje (negatif gün) kapsam dışıdır: bu hatırlatma kapanış HAZIRLIĞI
    /// içindir, gecikmiş kapanış ayrı bir sorudur.
    /// </summary>
    public static int? PickThreshold(int daysRemaining)
    {
        if (daysRemaining < 0 || daysRemaining > MaxThreshold)
        {
            return null;
        }

        // En dar eşik: kalan günü hâlâ kapsayan en küçük değer.
        return Thresholds.Where(t => daysRemaining <= t).Min();
    }

    /// <summary>Tam gün farkı; saat bileşeni yok sayılır (proje gün sonunda biter).</summary>
    public static int DaysRemaining(DateTime endDate, DateTime now)
        => (int)(endDate.Date - now.Date).TotalDays;
}
