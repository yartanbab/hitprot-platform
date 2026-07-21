namespace Apya.Platform.Web.Pages.Shared;

/// <summary>
/// _EmptyState partial'ının modeli — boş liste/veri durumları için
/// ortak görünüm (ikon + başlık + isteğe bağlı açıklama).
/// </summary>
public class EmptyStateModel
{
    /// <summary>Font Awesome ikon adı (örn. "fa-comments").</summary>
    public string Icon { get; set; } = "fa-inbox";

    /// <summary>Kısa başlık (örn. "Henüz yorum yapılmamış.").</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>İsteğe bağlı açıklama/yönlendirme satırı.</summary>
    public string? Description { get; set; }

    /// <summary>JS'in bulup kaldırdığı placeholder'lar için element id'si.</summary>
    public string? Id { get; set; }

    /// <summary>Ek CSS class'ları (örn. JS'in aradığı marker class).</summary>
    public string? CssClass { get; set; }
}
