using Apya.Platform.Feedbacks;

namespace Apya.Platform.Web.Feedbacks;

/// <summary>
/// Geri bildirim enum'larının Türkçe karşılıkları — tek yerde. Razor sayfaları ve
/// Excel çıktısı buradan okur; enum adları hiçbir yerde doğrudan UI'da gösterilmez.
/// </summary>
public static class FeedbackLabels
{
    public static string Status(FeedbackStatus s) => s switch
    {
        FeedbackStatus.New           => "Yeni",
        FeedbackStatus.InReview      => "İnceleniyor",
        FeedbackStatus.NeedsInfo     => "Ek bilgi bekleniyor",
        FeedbackStatus.Planned       => "Planlandı",
        FeedbackStatus.InDevelopment => "Geliştirmede",
        FeedbackStatus.Testing       => "Testte",
        FeedbackStatus.Completed     => "Tamamlandı",
        FeedbackStatus.Released      => "Yayınlandı",
        FeedbackStatus.Rejected      => "Reddedildi",
        FeedbackStatus.Duplicate     => "Mükerrer",
        FeedbackStatus.OutOfScope    => "Kapsam dışı",
        FeedbackStatus.Archived      => "Arşivlendi",
        _                            => s.ToString()
    };

    public static string UserStatus(FeedbackUserStatus s) => s switch
    {
        FeedbackUserStatus.Received   => "Alındı",
        FeedbackUserStatus.InReview   => "İnceleniyor",
        FeedbackUserStatus.NeedsInfo  => "Bilgi bekleniyor",
        FeedbackUserStatus.Planned    => "Planlandı",
        FeedbackUserStatus.InProgress => "Geliştiriliyor",
        FeedbackUserStatus.Completed  => "Tamamlandı",
        FeedbackUserStatus.Released   => "Yayınlandı",
        FeedbackUserStatus.Closed     => "Kapatıldı",
        _                             => s.ToString()
    };

    public static string Type(FeedbackType t) => t switch
    {
        FeedbackType.Bug            => "Hata",
        FeedbackType.Suggestion     => "Öneri",
        FeedbackType.Question       => "Soru",
        FeedbackType.Praise         => "Beğeni",
        FeedbackType.UsabilityIssue => "Kullanım zorluğu",
        FeedbackType.MissingContent => "Eksik içerik",
        FeedbackType.Performance    => "Performans",
        FeedbackType.UxDesign       => "Tasarım / UX",
        FeedbackType.Other          => "Diğer",
        _                           => t.ToString()
    };

    public static string Priority(FeedbackPriority p) => p switch
    {
        FeedbackPriority.Low      => "Düşük",
        FeedbackPriority.Normal   => "Normal",
        FeedbackPriority.High     => "Yüksek",
        FeedbackPriority.Critical => "Kritik",
        _                         => p.ToString()
    };

    public static string Impact(FeedbackImpact i) => i switch
    {
        FeedbackImpact.Low      => "Düşük",
        FeedbackImpact.Moderate => "Orta",
        FeedbackImpact.High     => "Yüksek",
        FeedbackImpact.Critical => "Kritik",
        _                       => i.ToString()
    };

    public static string Activity(FeedbackActivityType t) => t switch
    {
        FeedbackActivityType.Created         => "Oluşturuldu",
        FeedbackActivityType.StatusChanged   => "Durum değişti",
        FeedbackActivityType.PriorityChanged => "Öncelik değişti",
        FeedbackActivityType.ImpactChanged   => "Etki değişti",
        FeedbackActivityType.Assigned        => "Atama değişti",
        FeedbackActivityType.CommentAdded    => "Yorum eklendi",
        FeedbackActivityType.AttachmentAdded => "Dosya eklendi",
        FeedbackActivityType.TagsChanged     => "Etiketler değişti",
        FeedbackActivityType.UserCommented   => "Kullanıcı yorum yazdı",
        _                                    => t.ToString()
    };

    /// <summary>Durum rozetinin renk sınıfı — renk TEK BAŞINA anlam taşımaz, metinle birlikte kullanılır.</summary>
    public static string StatusChipClass(FeedbackStatus s) => s switch
    {
        FeedbackStatus.New                                     => "apya-chip-accent",
        FeedbackStatus.NeedsInfo                               => "apya-chip-warning",
        FeedbackStatus.Completed or FeedbackStatus.Released     => "apya-chip-success",
        FeedbackStatus.Rejected or FeedbackStatus.OutOfScope
            or FeedbackStatus.Duplicate or FeedbackStatus.Archived => "apya-chip-neutral",
        _                                                       => "apya-chip-info"
    };
}
