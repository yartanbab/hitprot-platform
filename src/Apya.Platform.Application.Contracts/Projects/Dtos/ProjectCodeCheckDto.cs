namespace Apya.Platform.Projects.Dtos;

/// <summary>
/// "Yeni Proje" formundaki proje kodu alanının sunucu tarafı karşılığı.
/// Kod doluysa <see cref="Suggestion"/> ile tek tıkla kullanılabilecek boş bir kod önerilir.
/// </summary>
public class ProjectCodeCheckDto
{
    /// <summary>Kod hedef kiracıda boşta mı?</summary>
    public bool IsAvailable { get; set; }

    /// <summary>Kod doluyken önerilen boş kod; boştaysa aynı kodun kendisi.</summary>
    public string Suggestion { get; set; } = string.Empty;
}
