using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks
{
    /// <summary>
    /// Göreve bağlı zengin metin belgesi. Liste ve düzenleme AYNI DTO'yu kullanır;
    /// listede <see cref="Content"/> boş bırakılır (uzun gövdeler listeyi şişirmesin,
    /// bkz. ITaskAppService.GetDocumentsAsync).
    /// </summary>
    public class TaskDocumentDto : FullAuditedEntityDto<Guid>
    {
        public Guid TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Content { get; set; }

        /// <summary>Son düzenleyenin görünen adı; hiç düzenlenmemişse oluşturan.</summary>
        public string EditorName { get; set; } = string.Empty;

        /// <summary>Gövdenin metin uzunluğu — liste satırında "boş belge" ayrımı için
        /// (Content listede gelmediğinden istemci bunu kendisi hesaplayamaz).</summary>
        public int ContentLength { get; set; }
    }
}
