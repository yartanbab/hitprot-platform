namespace Apya.Platform.Feedbacks;

/// <summary>Geri bildirimin türü — kullanıcı formda seçer.</summary>
public enum FeedbackType
{
    Bug        = 1, // Hata bildirimi
    Suggestion = 2, // Öneri / yeni özellik isteği
    Question   = 3, // Soru / anlaşılmayan nokta
    Praise     = 4  // Beğeni / olumlu geri bildirim
}
