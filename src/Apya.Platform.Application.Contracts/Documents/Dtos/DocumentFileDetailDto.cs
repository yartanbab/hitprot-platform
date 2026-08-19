using System.Collections.Generic;

namespace Apya.Platform.Documents;

/// <summary>
/// Sağ detay paneli: liste satırının tamamı + özel meta alanları + versiyon geçmişi.
/// Onay akışı ve e-imza bu fazın kapsamı dışında — panelde yer bırakıldı, DTO'da alan yok.
/// </summary>
public class DocumentFileDetailDto : DocumentFileDto
{
    /// <summary>Belge tipinin şeması ile belgenin değerleri birleştirilmiş hali (boş alanlar da döner).</summary>
    public List<DocumentFieldValueDto> Fields { get; set; } = new();

    public List<DocumentAttachmentDto> Versions { get; set; } = new();
}
