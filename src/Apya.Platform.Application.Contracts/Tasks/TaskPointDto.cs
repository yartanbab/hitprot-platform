using System;

namespace Apya.Platform.Tasks
{
    /// <summary>
    /// Takvim ve Gösterge Paneli görünümlerinin ihtiyaç duyduğu YALIN görev satırı.
    ///
    /// Neden ayrı DTO: <c>GetListAsync</c> her çağrıda altı zenginleştirme turu
    /// koşuyor (pano kolonu adı, etiketler, favoriler, alt görev sayaçları, proje
    /// adları, kart meta'sı) ve AutoMapper ile tam TaskDto üretiyor. Bu iki görünüm
    /// bunların HİÇBİRİNİ kullanmıyor; 1000 satırda fark saniyelerle ölçülüyordu.
    /// Burası tek sorgu, tek projeksiyon.
    /// </summary>
    public class TaskPointDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;

        /// <summary>Tenant içi artan sıra; kullanıcıya "GRV-17" olarak gösterilir.</summary>
        public int Number { get; set; }

        public TaskStatus Status { get; set; }
        public TaskPriority Priority { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? DueDate { get; set; }

        public string? AssigneeName { get; set; }
    }
}
