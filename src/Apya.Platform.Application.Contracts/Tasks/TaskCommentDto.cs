using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks
{
    public class TaskCommentDto : EntityDto<Guid>
    {
        public string Text { get; set; } = string.Empty; // Null olamaz garantisi
        public string AuthorName { get; set; } = "Bilinmeyen"; // Varsayılan değer
        public Guid? AuthorId { get; set; }
        public bool IsOwn { get; set; } // Mevcut kullanıcının kendi yorumu mu? (düzenle/sil yetkisi)
        public Guid? ParentCommentId { get; set; } // null ise kök yorum; doluysa yanıt
        public List<TaskCommentDto> Replies { get; set; } = new(); // Instagram tarzı yanıtlar (kök yorumda dolu)
        public DateTime CreationTime { get; set; }
    }
}