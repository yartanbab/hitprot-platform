using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Tasks
{
    /// <summary>
    /// Belge güncelleme girdisi.
    ///
    /// 🔴 Ayrı bir DTO olması ŞART, düz `(string title, string content)` parametreleri
    /// DEĞİL: ABP'nin otomatik API'si basit tipli parametreleri QUERY STRING'e koyar.
    /// Belge gövdesi kilobaytlarca HTML olabildiği için istek URL'i sınırı aşar ve
    /// sunucu 414 döner — hata ancak uzun bir belge kaydedilince ortaya çıkar,
    /// kısa denemelerde görünmez. Karmaşık tip gövdeden (body) bağlanır.
    /// </summary>
    public class UpdateTaskDocumentDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        /// <summary>Zengin metin gövdesi (HTML). Boş belge için null/boş gelebilir.</summary>
        public string? Content { get; set; }
    }
}
