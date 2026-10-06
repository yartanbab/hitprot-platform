using System;
using System.Linq;

namespace Apya.Platform.Documents;

/// <summary>
/// 🔴 DOC-05 / NTF-07 · Belge geçerlilik hatırlatmasının eşik kuralı — saf, veri erişimi yok.
///
/// <para>Eşikler 30 ve 7 gün; ardından "bugün doluyor / doldu" (0). Bir belge aynı anda
/// yalnız TEK eşiğin içindedir (kalan güne en yakın olan). Bu, özelliğin ilk çalıştığı gün
/// geriye dönük bir yığın üretmesini engeller: bitmesine 5 gün kalmış belge "30 gün" ve
/// "7 gün" uyarılarını birlikte almaz.</para>
///
/// <para>Süresi dolmuş belge yalnız <see cref="ExpiredGraceDays"/> gün boyunca duyurulur.
/// Amaç dolduğu ANI haber vermek; aylar önce dolmuş belgeleri özelliğin açıldığı gün
/// topluca bildirmek değil. Pencerenin birkaç gün olmasının sebebi, tarama o gün
/// çalışmadıysa (uygulama kapalı, kiracı hatası) bildirimin kaybolmaması.</para>
/// </summary>
public static class DocumentFileExpiryReminder
{
    /// <summary>Büyükten küçüğe. Yeni eşik eklenirse sıra korunmalı.</summary>
    public static readonly int[] Thresholds = { 30, 7 };

    /// <summary>"Bugün doluyor / doldu" eşiğinin değeri.</summary>
    public const int Expired = 0;

    public const int ExpiredGraceDays = 7;

    public static int MaxThreshold => Thresholds[0];

    /// <summary>Kalan güne göre içinde bulunulan eşik; belge pencerenin dışındaysa <c>null</c>.</summary>
    public static int? PickThreshold(int daysRemaining)
    {
        if (daysRemaining > MaxThreshold || daysRemaining < -ExpiredGraceDays)
        {
            return null;
        }

        if (daysRemaining <= 0)
        {
            return Expired;
        }

        // En dar eşik: kalan günü hâlâ kapsayan en küçük değer.
        return Thresholds.Where(t => daysRemaining <= t).Min();
    }

    /// <summary>Tam gün farkı; saat bileşeni yok sayılır (belge gün sonuna kadar geçerlidir).</summary>
    public static int DaysRemaining(DateTime expiryDate, DateTime now)
        => (int)(expiryDate.Date - now.Date).TotalDays;
}
