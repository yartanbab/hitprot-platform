using System;
using System.Collections.Generic;

namespace Apya.Platform.Calendars;

/// <summary>
/// Takvimde tek bir gün öğesi — kaynağı ne olursa olsun aynı şekil.
/// Ekran bu tipten başka bir şey tanımaz; kaynağa özel alanlar (tutar, proje, yük)
/// null bırakılır.
/// </summary>
public class CalendarItemDto
{
    /// <summary>İstemci tarafı benzersiz anahtar: "{kaynak}:{id}". Farklı kaynaklardaki
    /// aynı Guid'ler çakışmasın diye kaynak öneki taşır.</summary>
    public string Key { get; set; } = string.Empty;

    public CalendarSourceType Source { get; set; }

    public Guid SourceId { get; set; }

    public string Title { get; set; } = string.Empty;

    /// <summary>Öğenin takvimdeki günü (saat bileşeni sıfırlanmıştır).</summary>
    public DateTime Date { get; set; }

    /// <summary>
    /// Saatli öğelerde başlangıç/bitiş — YALNIZ dış takvim etkinliklerinde dolar.
    /// APYA öğeleri gün bazlıdır ve hafta görünümünde saat ızgarasına inmez, üstteki
    /// son tarih şeridinde durur.
    /// </summary>
    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public bool IsAllDay { get; set; }

    public CalendarRiskLevel Risk { get; set; }

    /// <summary>Tamamlanmış/ödenmiş öğe — risk hesabına girmez, üstü çizili gösterilir.</summary>
    public bool IsDone { get; set; }

    /// <summary>İkinci satır: proje, müşteri, kasa adı gibi bağlam.</summary>
    public string? Subtitle { get; set; }

    public Guid? AssigneeId { get; set; }

    public string? AssigneeName { get; set; }

    public decimal? Amount { get; set; }

    public string? Currency { get; set; }

    /// <summary>Gün yükü hesabına giren saat (yalnız görevlerde, tahmini süre).</summary>
    public decimal? LoadHours { get; set; }

    /// <summary>Öğenin kendi ekranına derin bağlantı.</summary>
    public string? Href { get; set; }

    /// <summary>
    /// Tarihi takvimden değiştirilebilir mi? Fatura/gider/gelir vadeleri ve hibe son
    /// tarihleri muhasebe/kurum kaydıdır — takvimden sürüklenerek taşınmaz.
    /// </summary>
    public bool CanReschedule { get; set; }
}

/// <summary>Kaynak rayındaki satır: sayaç + izin durumu.</summary>
public class CalendarSourceSummaryDto
{
    public CalendarSourceType Source { get; set; }

    /// <summary>Sorgulanan aralıkta bulunan öğe sayısı. İzin yoksa 0.</summary>
    public int Count { get; set; }

    /// <summary>Kullanıcının bu kaynağı görme izni var mı? Yoksa ray satırı hiç çizilmez.</summary>
    public bool IsAvailable { get; set; }

    public string RequiredPermission { get; set; } = string.Empty;
}

/// <summary>Bir tarih aralığı için takvimin tüm verisi — tek çağrıda.</summary>
public class CalendarFeedDto
{
    public DateTime From { get; set; }

    public DateTime To { get; set; }

    public List<CalendarItemDto> Items { get; set; } = new();

    public List<CalendarSourceSummaryDto> Sources { get; set; } = new();

    /// <summary>Kullanıcının günlük kapasitesi (saat). Kapalıysa null — kapasite çubuğu çizilmez.</summary>
    public decimal? DailyCapacityHours { get; set; }

    /// <summary>Bir kaynak üst sınıra dayandıysa true — ekran "tümü gösterilmiyor" uyarısı verir.</summary>
    public bool IsTruncated { get; set; }
}

public class GetCalendarFeedInput
{
    /// <summary>Aralık başlangıcı (dahil).</summary>
    public DateTime From { get; set; }

    /// <summary>Aralık bitişi (dahil).</summary>
    public DateTime To { get; set; }

    /// <summary>Boş/null = izin verilen tüm kaynaklar.</summary>
    public List<CalendarSourceType>? Sources { get; set; }

    /// <summary>Yalnız bu kişiye atanmış görevler.</summary>
    public Guid? AssigneeId { get; set; }

    /// <summary>Yalnız bu projeye bağlı öğeler.</summary>
    public Guid? ProjectId { get; set; }
}

/// <summary>Takvimden bir öğeyi başka güne taşımak için.</summary>
public class RescheduleCalendarItemInput
{
    public CalendarSourceType Source { get; set; }

    public Guid SourceId { get; set; }

    /// <summary>Öğenin taşınacağı gün (saat bileşeni yok sayılır).</summary>
    public DateTime NewDate { get; set; }
}

/// <summary>Takvimden bir öğeyi kapatmak için.</summary>
public class CompleteCalendarItemInput
{
    public CalendarSourceType Source { get; set; }

    public Guid SourceId { get; set; }
}

/// <summary>Bağlı bir dış takvim hesabının o turdaki durumu (ray satırı).</summary>
public class ExternalCalendarStatusDto
{
    public Guid AccountId { get; set; }

    public CalendarProviderType Provider { get; set; }

    public string Email { get; set; } = string.Empty;

    public int EventCount { get; set; }

    /// <summary>Null = sağlıklı. Doluysa ray satırı hata durumuna düşer ve
    /// "yeniden bağla" gösterilir; takvimin kalanı çalışmaya devam eder.</summary>
    public string? Error { get; set; }
}

/// <summary>
/// Dış takvim etkinlikleri — iç feed'den AYRI uç.
/// <para>
/// Neden ayrı: dış çağrı yavaş ve kırılgandır (ağ, süresi dolmuş yetki). Aynı
/// isteğe koyulsaydı bir bozuk hesap tüm takvimi bekletir ya da düşürürdü;
/// ayrı olduğu için görevler anında gelir, dış etkinlikler geldiğinde eklenir.
/// </para>
/// </summary>
public class CalendarExternalEventsDto
{
    public List<CalendarItemDto> Items { get; set; } = new();

    public List<ExternalCalendarStatusDto> Accounts { get; set; } = new();
}
