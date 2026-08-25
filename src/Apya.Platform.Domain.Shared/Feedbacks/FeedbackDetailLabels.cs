namespace Apya.Platform.Feedbacks;

/// <summary>
/// Geri bildirimin türe özel alanlarının (DetailsJson) anahtar → Türkçe etiket eşlemesi.
/// Yönetici paneli ve göreve dönüştürme aynı etiketleri kullansın diye tek yerdedir.
/// </summary>
public static class FeedbackDetailLabels
{
    public static string For(string key) => key switch
    {
        "expected"    => "Beklenen sonuç",
        "actual"      => "Gerçekleşen sonuç",
        "steps"       => "Yeniden oluşturma adımları",
        "frequency"   => "Tekrar sıklığı",
        "problem"     => "Çözülmek istenen problem",
        "solution"    => "Önerilen çözüm",
        "benefit"     => "Sağlayacağı fayda",
        "usage"       => "Kullanım sıklığı",
        _             => key
    };
}
