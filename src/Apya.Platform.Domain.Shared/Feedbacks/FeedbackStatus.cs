namespace Apya.Platform.Feedbacks;

/// <summary>
/// Geri bildirimin yaşam döngüsü. Geçerli geçişler FeedbackManager'da tanımlı.
/// </summary>
public enum FeedbackStatus
{
    New       = 1, // Yeni — henüz incelenmedi
    InReview  = 2, // İnceleniyor
    Planned   = 3, // Planlandı — yol haritasına alındı
    Completed = 4, // Tamamlandı
    Rejected  = 5  // Reddedildi / kapsam dışı
}
