namespace Apya.Platform.Feedbacks;

/// <summary>
/// Geri bildirimin İÇ yaşam döngüsü (yönetici görür). Kullanıcıya gösterilen sadeleşmiş
/// karşılık için <see cref="FeedbackStatusMap"/>. Geçerli geçişler FeedbackManager'da.
/// Sayısal değerler DB'de; mevcutları değiştirme, yenileri sona ekle.
/// </summary>
public enum FeedbackStatus
{
    New           = 1,  // Yeni — henüz incelenmedi
    InReview      = 2,  // İnceleniyor
    Planned       = 3,  // Planlandı — yol haritasına alındı
    Completed     = 4,  // Tamamlandı (henüz yayınlanmamış olabilir)
    Rejected      = 5,  // Reddedildi
    NeedsInfo     = 6,  // Kullanıcıdan ek bilgi bekleniyor
    InDevelopment = 7,  // Geliştirme aşamasında
    Testing       = 8,  // Test aşamasında
    Released      = 9,  // Yayınlandı — kullanıcıya ulaştı
    Duplicate     = 10, // Mükerrer — ana kayıt üzerinden izlenir
    OutOfScope    = 11, // Kapsam dışı
    Archived      = 12  // Arşivlendi
}
