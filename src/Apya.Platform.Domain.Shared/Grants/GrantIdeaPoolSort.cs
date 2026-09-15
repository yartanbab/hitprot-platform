namespace Apya.Platform.Grants;

/// <summary>
/// 19a · Fikir Havuzu sıralaması. Tasarımdaki "Eşleşme gücü" çağrı eşleştirmesiyle gelir (tur 20);
/// o güne kadar havuz tarihe ve bütçeye göre sıralanır.
/// </summary>
public enum GrantIdeaPoolSort
{
    /// <summary>En yeni fikir önce.</summary>
    Newest = 0,

    /// <summary>Öngörülen bütçe büyükten küçüğe; bütçesiz fikir en sonda.</summary>
    Budget = 1
}
