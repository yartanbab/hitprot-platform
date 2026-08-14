using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Notifications;

public class GetNotificationsInput : PagedResultRequestDto
{
    /// <summary>null = hepsi, true = sadece okunanlar, false = sadece okunmayanlar</summary>
    public bool? IsRead { get; set; }

    /// <summary>null = tüm kategoriler. Bildirim merkezindeki sol ağaç bunu doldurur.</summary>
    public NotificationCategory? Category { get; set; }

    /// <summary>
    /// Verilen aciliyet ve üzeri. "Önemliler" görünümü <c>High</c> ile çağrılır;
    /// tam eşleşme yerine eşik kullanılıyor çünkü kullanıcı kritik olanları da
    /// görmek ister.
    /// </summary>
    public NotificationSeverity? MinSeverity { get; set; }

    /// <summary>Başlık ve gövdede geçen metin.</summary>
    public string? Filter { get; set; }

    /// <summary>Sıralama ölçütü.</summary>
    public NotificationSortMode Sort { get; set; } = NotificationSortMode.Recent;
}

public enum NotificationSortMode
{
    /// <summary>En son olay üstte.</summary>
    Recent     = 0,
    /// <summary>Önce aciliyet, eşitlikte en son olay.</summary>
    Importance = 1
}
