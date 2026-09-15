namespace Apya.Platform.Grants;

/// <summary>
/// 22b · Talepler ekranındaki satırın kaynağı. "Yanıt bekleyen" sekmesi iki kaydı tek listede
/// gösterir: ikisi de aynı iş (firmaya dönmek), yalnız geldikleri yer farklı.
/// </summary>
public enum GrantRequestKind
{
    /// <summary>Oturumlu firmanın "İlgileniyorum" talebi (<c>GrantInterest</c>, kiracıda).</summary>
    Interest = 0,

    /// <summary>Kamu uygunluk testinden gelen ön değerlendirme talebi (<c>GrantLead</c>, host'ta).</summary>
    Lead = 1
}

/// <summary>
/// 22b · Satırın yanıt durumu. Süre sunucuda hesaplanır; istemci kuralı yeniden türetmez,
/// yalnız bu değere göre cümle kurar.
/// </summary>
public enum GrantResponseState
{
    /// <summary>İlk yanıt verilmedi, süre dolmasına 6 saatten fazla var.</summary>
    Waiting = 0,

    /// <summary>İlk yanıt verilmedi, son 6 saat.</summary>
    DueSoon = 1,

    /// <summary>İlk yanıt verilmedi, süre doldu.</summary>
    Overdue = 2,

    /// <summary>Firmaya dönüldü (incelemeye alındı / arandı), karar bekleniyor.</summary>
    Answered = 3,

    /// <summary>Görüşme saati onaylandı.</summary>
    MeetingPlanned = 4,

    /// <summary>Kayıt kapandı: karara bağlandı, başvuruya döndü, geri çekildi ya da kaçırıldı.</summary>
    Closed = 5
}
