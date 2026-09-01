using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks
{
    public class TaskDto : AuditedEntityDto<Guid>
    {
        /// <summary>Tenant içi artan görev sırası (entity'den).</summary>
        public int Number { get; set; }

        /// <summary>Kullanıcıya gösterilen görev kodu — "GRV-17". Number'dan türetilir,
        /// DB'de saklanmaz.</summary>
        public string Code => Number > 0 ? $"GRV-{Number}" : "GRV-—";

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // --- Planlama ---
        public decimal? EstimatedHours { get; set; }

        /// <summary>Görevin bağlı olduğu bütçe kalemi (görev detayı → Finans sekmesi).</summary>
        public Guid? BudgetLineId { get; set; }
        public string? BudgetLineName { get; set; }

        /// <summary>Göreve ayrılan tutar. "Taahhüt" alanı BİLEREK yok — arkasında varlık yok.</summary>
        public decimal? PlannedAmount { get; set; }

        /// <summary>Kalemin kalanı — görev planı girilirken "ne kadar yer var" sorusunun cevabı.</summary>
        public decimal? BudgetLineRemaining { get; set; }
        public string? TaskType { get; set; }
        public string? Sprint { get; set; }

        /// <summary>Toplam kayıtlı süre (saat) — TaskTimeLog'lardan hesaplanır.</summary>
        public decimal SpentHours { get; set; }

        /// <summary>Mevcut kullanıcı bu görevi takip ediyor mu (TaskWatcher join'inden).</summary>
        public bool IsWatched { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedDate { get; set; }

        public Apya.Platform.Tasks.TaskStatus Status { get; set; }
        public Apya.Platform.Tasks.TaskPriority Priority { get; set; }

        /// <summary>Faz 4b: iptal nedeni — panodaki İptal kolonunda kartta görünür.</summary>
        public string? CancelReason { get; set; }

        /// <summary>Faz 4b: iptal tarihi.</summary>
        public DateTime? CancelledDate { get; set; }

        public Guid? AssigneeId { get; set; }
        public string? AssigneeName { get; set; }
        public Guid? ParentTaskId { get; set; }
        public string? ParentTaskTitle { get; set; }

        /// <summary>Bu görevin alt görev sayısı — liste satırındaki aç/kapa chevron'u
        /// ve "2/5" rozeti bunu kullanır. Kullanıcının göremediği gizli alt görevler
        /// (APYA-22) sayılmaz, aksi halde varlıkları chevron üzerinden sızardı.
        /// YALNIZ GetList doldurur; GetAsync alt görevleri <see cref="SubTasks"/> ile
        /// zaten tam döndürdüğü için orada 0 kalır.</summary>
        public int SubTaskCount { get; set; }

        /// <summary>Tamamlanmış alt görev sayısı — rozetin payı ("2/5" içindeki 2).</summary>
        public int CompletedSubTaskCount { get; set; }

        /// <summary>Faz 7: kanban kartındaki yorum rozeti. Comments listesi YALNIZ
        /// GetAsync'te dolduğu için liste tarafında sayı ayrı taşınır.</summary>
        public int CommentCount { get; set; }

        /// <summary>Faz 7: kanban kartındaki ek rozeti (aynı gerekçe).</summary>
        public int AttachmentCount { get; set; }

        /// <summary>Faz 7: bu görevi bekleten AÇIK öncüllerin kodları ("GRV-12").
        /// Boşsa görev engelli değildir. Kapanmış öncüller sayılmaz.</summary>
        public List<string> BlockedByCodes { get; set; } = new List<string>();

        public Guid? ProjectId { get; set; }
        public string? ProjectName { get; set; }

        /// <summary>Faz 2: Kullanıcı tanımlı kanban kolonu üyeliği (boşsa Status'a göre render).</summary>
        public Guid? BoardColumnId { get; set; }

        /// <summary>Özel kolondaysa kolon adı (liste "Durum" sütunu + dropdown için). Sistem kolonunda boş.</summary>
        public string? BoardColumnName { get; set; }

        public bool IsPrivate { get; set; }

        /// <summary>Mevcut kullanıcının bu görevi favorilediği mi (TaskFavorite join'inden hesaplanır).</summary>
        public bool IsFavorite { get; set; }

        /// <summary>Göreve bağlı giderler (yalnızca Expenses izni olan kullanıcıya doldurulur).</summary>
        public List<TaskFinanceLineDto> Expenses { get; set; } = new List<TaskFinanceLineDto>();
        /// <summary>Göreve bağlı gelirler (yalnızca Incomes izni olan kullanıcıya doldurulur).</summary>
        public List<TaskFinanceLineDto> Incomes { get; set; } = new List<TaskFinanceLineDto>();

        public List<TaskDto> SubTasks { get; set; } = new List<TaskDto>();
        public List<TaskCommentDto> Comments { get; set; } = new List<TaskCommentDto>();
        public List<TaskAttachmentDto> Attachments { get; set; } = new List<TaskAttachmentDto>();
        public List<Guid> PredecessorIds { get; set; } = new List<Guid>();
        public List<TagDto> Tags { get; set; } = new List<TagDto>();
    }
}