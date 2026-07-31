namespace Apya.Platform.Feedbacks;

/// <summary>Geri bildirimin türü — kullanıcı formda seçer. Sayısal değerler DB'de; değiştirme.</summary>
public enum FeedbackType
{
    Bug            = 1, // Hata bildirimi
    Suggestion     = 2, // Öneri / yeni özellik isteği
    Question       = 3, // Soru / anlaşılmayan nokta
    Praise         = 4, // Beğeni / olumlu geri bildirim
    UsabilityIssue = 5, // Kullanım zorluğu
    MissingContent = 6, // Eksik veya anlaşılmayan içerik
    Performance    = 7, // Performans problemi
    UxDesign       = 8, // Tasarım ve kullanıcı deneyimi
    Other          = 9  // Diğer
}
