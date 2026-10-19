namespace Apya.Platform.Tasks;

/// <summary>
/// Görev ekranlarında kişi adı — TEK kural. Görev listesinin "Atanan" sütunu (AutoMapper
/// AssigneeName eşlemesi) ve görev detayı zaten ad + soyad gösteriyordu; atanan seçicileri
/// ve yorum yazarı ise kullanıcı adını ("calisan1", "admin") basıyordu (QA-05, QA-21).
/// </summary>
public static class TaskPersonName
{
    /// <summary>Ad + soyad; ikisi de boşsa kullanıcı adı.</summary>
    public static string Of(string? name, string? surname, string? userName)
    {
        var full = $"{name} {surname}".Trim();
        return full.Length > 0 ? full : userName ?? string.Empty;
    }

    /// <summary>Seçici etiketi: "Ad Soyad (kullanıcı adı)" — aynı adlı iki kişi ayrılsın, hızlı
    /// satırdaki "@kullanıcıadı" da eşleşmeye devam etsin. Ad yoksa yalnız kullanıcı adı.</summary>
    public static string Label(string? name, string? surname, string? userName)
    {
        var full = $"{name} {surname}".Trim();
        if (full.Length == 0) return userName ?? string.Empty;
        return string.IsNullOrWhiteSpace(userName) ? full : $"{full} ({userName})";
    }
}
