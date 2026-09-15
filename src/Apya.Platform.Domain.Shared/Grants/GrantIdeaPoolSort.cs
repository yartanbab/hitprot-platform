namespace Apya.Platform.Grants;

/// <summary>
/// 19a · Fikir Havuzu sıralaması. "Eşleşme gücü" tur 20 ile geldi ve ekranın varsayılanıdır.
/// </summary>
public enum GrantIdeaPoolSort
{
    /// <summary>En yeni fikir önce.</summary>
    Newest = 0,

    /// <summary>Öngörülen bütçe büyükten küçüğe; bütçesiz fikir en sonda.</summary>
    Budget = 1,

    /// <summary>20a · Açık çağrılarla en güçlü eşleşme önce; eşleşmesiz fikir en sonda (kendi içinde en yeni).</summary>
    Match = 2
}
