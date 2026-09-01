using System;
using System.ComponentModel.DataAnnotations;
using Apya.Platform.Tasks;

namespace Apya.Platform.Tasks
{
    public class CreateUpdateTaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; } = DateTime.Today; // DTO katmanı: IClock inject edilemez, Date-only yeterli

        public DateTime? DueDate { get; set; }

        public TaskStatus Status { get; set; } = TaskStatus.Todo;

        /// <summary>
        /// Faz 2/kanban paritesi: görev özel bir kanban kolonuna atanacaksa kolon Id'si.
        /// Doluysa görev o kolona bağlanır (Status değişmez); null ise görev Status'a
        /// göre sistem kolonunda görünür. Modal "Durum/Kolon" dropdown'ı buradan beslenir.
        /// </summary>
        public Guid? BoardColumnId { get; set; }

        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public Guid? ProjectId { get; set; }

        public Guid? AssigneeId { get; set; }
        public Guid? ParentTaskId { get; set; }
        public bool IsPrivate { get; set; }

        // --- Planlama (görev detayı) ---
        [Range(0, 9999.99, ErrorMessage = "Tahmini süre 0 ile 9999,99 saat arasında olmalıdır.")]
        public decimal? EstimatedHours { get; set; }

        /// <summary>
        /// Bütçe kalemi bağı; boş bırakılırsa görev bütçesizdir. Doluysa aynı
        /// kalemdeki görev planlarının toplamı kalemi aşamaz (sunucuda doğrulanır).
        /// </summary>
        public Guid? BudgetLineId { get; set; }

        public decimal? PlannedAmount { get; set; }

        [StringLength(64)]
        public string? TaskType { get; set; }

        [StringLength(32)]
        public string? Sprint { get; set; }
        public System.Collections.Generic.List<Guid> PredecessorIds { get; set; } = new();

        /// <summary>
        /// Select2 tags:true widget'ından gelen serbest-metin etiket isimleri (get-or-create).
        /// Nullable: non-nullable bırakılırsa (Nullable enable projede aktif) asp-for tag helper'ı
        /// istemci tarafında otomatik "data-val-required" ekliyor — hiç etiket seçilmeyen HER
        /// görevde autosave sessizce (jQuery validate engelliyor) tamamen başarısız oluyordu.
        /// </summary>
        public System.Collections.Generic.List<string>? TagNames { get; set; } = new();
    }
}