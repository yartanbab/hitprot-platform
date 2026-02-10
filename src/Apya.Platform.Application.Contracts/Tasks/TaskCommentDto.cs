using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks
{
    public class TaskCommentDto : EntityDto<Guid>
    {
        public string Text { get; set; } = string.Empty; // Null olamaz garantisi
        public string AuthorName { get; set; } = "Bilinmeyen"; // Varsayılan değer
        public DateTime CreationTime { get; set; }
    }
}