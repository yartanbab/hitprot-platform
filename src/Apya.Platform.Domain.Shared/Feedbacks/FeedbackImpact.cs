namespace Apya.Platform.Feedbacks;

/// <summary>
/// İş sürecine etki seviyesi — yönetici atar (Priority'den farkı: Priority "ne zaman
/// ele alınacak", Impact "etkisi ne kadar geniş"). Önceliklendirme puanına girdi olur.
/// </summary>
public enum FeedbackImpact
{
    Low      = 1, // Tek kullanıcıyı etkiliyor / kozmetik
    Moderate = 2, // Bir ekibi veya işlevi etkiliyor
    High     = 3, // Modülü kullanılmaz hale getiriyor / yaygın
    Critical = 4  // Veri kaybı, güvenlik veya tüm tenant'ları etkiliyor
}
