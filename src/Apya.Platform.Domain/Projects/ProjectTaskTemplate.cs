using System;
using System.Collections.Generic;

namespace Apya.Platform.Projects;

/// <summary>
/// Yeni proje kurulurken açılabilen hazır görev takvimi. Hibe ve etkinlik
/// projelerinin ilk görevleri her seferinde elle yazılıyordu; kategoriye bağlı
/// bu liste onları proje aralığına yayarak oluşturur.
///
/// "Diğer / Genel" için takvim YOKTUR — o kategoride hangi görevlerin geleceği
/// önceden bilinemez.
/// </summary>
public static class ProjectTaskTemplate
{
    /// <summary>
    /// Şablondaki tek görev. <paramref name="Position"/> görevin proje aralığındaki
    /// yeri: 0 = başlangıç günü, 1 = bitiş günü.
    /// </summary>
    public readonly record struct Item(string Title, double Position);

    private static readonly IReadOnlyList<Item> Grant = new List<Item>
    {
        new("Başvuru dosyasını tamamla", 0.00),
        new("Ara rapor", 0.35),
        new("Harcama belgelerini topla", 0.55),
        new("Ödeme talebi", 0.70),
        new("Sonuç raporu", 0.90),
        new("Kapanış ve arşivleme", 1.00)
    };

    private static readonly IReadOnlyList<Item> Event = new List<Item>
    {
        new("Tedarikçi onayı", 0.15),
        new("Katılım formu", 0.35),
        new("Stant tasarımı", 0.55),
        new("Lojistik", 0.80),
        new("Etkinlik sonrası rapor", 1.00)
    };

    private static readonly IReadOnlyList<Item> None = Array.Empty<Item>();

    /// <summary>Kategorinin görev takvimi; takvimi olmayan kategoride boş liste.</summary>
    public static IReadOnlyList<Item> For(ProjectCategory category) => category switch
    {
        ProjectCategory.GrantProject => Grant,
        ProjectCategory.Event => Event,
        _ => None
    };

    /// <summary>
    /// Görevin bitiş tarihi: proje aralığına oransal yerleştirme.
    /// Aralık yoksa ya da tek günlükse tüm görevler başlangıç gününe düşer.
    /// </summary>
    public static DateTime DueDateFor(Item item, DateTime startDate, DateTime endDate)
    {
        var totalDays = (endDate.Date - startDate.Date).TotalDays;
        if (totalDays <= 0)
        {
            return startDate.Date;
        }

        return startDate.Date.AddDays(Math.Round(totalDays * item.Position));
    }
}
