using System;
using Apya.Platform.DynamicAssets;

namespace Apya.Platform.Tasks
{
    /// <summary>Göreve bağlı bir form — sekmedeki liste satırı.</summary>
    public class TaskFormLinkDto
    {
        public Guid Id { get; set; }
        public Guid TaskId { get; set; }
        public Guid DocumentId { get; set; }

        public string Title { get; set; } = string.Empty;

        /// <summary>Formun herkese açık adresi (/f/{slug}). Yayınlanmamış formda boş.</summary>
        public string? Slug { get; set; }

        /// <summary>Form yayında mı — yayınlanmamış forma yanıt toplanamaz.</summary>
        public bool IsPublished { get; set; }

        /// <summary>Misafir bu formu süreli link üzerinden doldurabilir mi.</summary>
        public bool IsGuestFillable { get; set; }

        /// <summary>YALNIZ bu görev bağlamında toplanmış yanıt sayısı.
        /// Formun toplam yanıt sayısı DEĞİL.</summary>
        public int ResponseCount { get; set; }

        public DateTime CreationTime { get; set; }
    }

    /// <summary>Form seçicideki bir aday — göreve bağlanabilecek form.</summary>
    public class TaskFormOptionDto
    {
        public Guid DocumentId { get; set; }
        public string Title { get; set; } = string.Empty;
        public bool IsPublished { get; set; }

        /// <summary>Bu göreve zaten bağlı mı — seçicide tekrar eklenmesin.</summary>
        public bool IsLinked { get; set; }
    }

    /// <summary>Görev bağlamında toplanmış tek yanıt (özet).</summary>
    public class TaskFormResponseDto
    {
        public Guid Id { get; set; }
        public Guid DocumentId { get; set; }
        public DateTime CreationTime { get; set; }

        /// <summary>Dolduran: ekip üyesinin adı, misafirse linkin alıcısı.</summary>
        public string RespondentName { get; set; } = string.Empty;

        /// <summary>Yanıt ekip dışından, süreli link üzerinden geldi.</summary>
        public bool IsGuestSubmission { get; set; }

        public ResponseStatus Status { get; set; }
    }

}
