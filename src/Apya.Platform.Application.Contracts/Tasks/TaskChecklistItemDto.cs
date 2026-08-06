using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks
{
    public class TaskChecklistItemDto : CreationAuditedEntityDto<Guid>
    {
        public string Text { get; set; } = string.Empty;
        public bool IsDone { get; set; }
    }
}
