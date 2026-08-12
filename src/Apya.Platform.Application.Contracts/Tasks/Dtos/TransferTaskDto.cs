using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Tasks.Dtos
{
    /// <summary>Görev detayı "projeler arası taşı/kopyala" diyaloğunun girdisi.</summary>
    public class TransferTaskDto
    {
        /// <summary>Move: ilk hedefe taşınır, kalanlara kopya. Copy: hepsine kopya.</summary>
        public TaskTransferMode Mode { get; set; } = TaskTransferMode.Move;

        [Required]
        [MinLength(1, ErrorMessage = "En az bir hedef proje seçmelisiniz.")]
        public List<Guid> TargetProjectIds { get; set; } = new();

        public TransferTaskIncludeDto Include { get; set; } = new();
    }

    /// <summary>"Neler taşınsın?" anahtarları. Varsayılanlar tasarımla birebir:
    /// açık = subtasks/checklist/files/keepAssignee/keepLinks, kapalı = comments/shiftDates.</summary>
    public class TransferTaskIncludeDto
    {
        public bool Subtasks { get; set; } = true;
        public bool Checklist { get; set; } = true;
        public bool Comments { get; set; }
        public bool Files { get; set; } = true;
        public bool KeepAssignee { get; set; } = true;
        public bool KeepLinks { get; set; } = true;
        public bool ShiftDates { get; set; }
    }

    /// <summary>Transfer sonucu — arayüzdeki bildirim metnini kurmak için.</summary>
    public class TransferTaskResultDto
    {
        /// <summary>Move kipinde görevin taşındığı proje; Copy kipinde null.</summary>
        public Guid? MovedToProjectId { get; set; }

        /// <summary>Oluşturulan kopyaların id'leri (taşınan görev dahil değil).</summary>
        public List<Guid> CreatedTaskIds { get; set; } = new();
    }
}
