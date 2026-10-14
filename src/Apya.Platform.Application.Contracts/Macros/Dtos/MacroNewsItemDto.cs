using System;

namespace Apya.Platform.Macros.Dtos;

/// <summary>Haber türü — şeritteki etiket ve "Tüm haberler" süzgeci.</summary>
public enum MacroNewsKind
{
    /// <summary>Başvuruya açık hibe çağrısı.</summary>
    Call = 1,

    /// <summary>Sürüm notu.</summary>
    Platform = 2,

    /// <summary>Kullanıcının başvurusuna karar ya da itiraz sonucu.</summary>
    Result = 3
}

public class MacroNewsItemDto
{
    public MacroNewsKind Kind { get; set; }

    public string Title { get; set; } = string.Empty;

    /// <summary>Tek satırlık özet (sunucuda yerelleştirilmiş).</summary>
    public string Summary { get; set; } = string.Empty;

    /// <summary>Kaynak: çağrıda veren kurum, sürüm notunda sürüm numarası.</summary>
    public string Source { get; set; } = string.Empty;

    public DateTime Date { get; set; }

    /// <summary>Son 7 gün içinde mi ("N yeni" çipi).</summary>
    public bool IsNew { get; set; }

    /// <summary>Uygulama içi hedef (yalnız "/" ile başlayan yol).</summary>
    public string Url { get; set; } = string.Empty;

    /// <summary>Çağrının afiş dosyası; yoksa istemci kuruma göre renk zemini çizer (Poster.js).</summary>
    public string? PosterFileName { get; set; }
}
