using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks
{
    public class TaskChecklistItemDto : CreationAuditedEntityDto<Guid>
    {
        /// <summary>Bağlı görev — proje kapsamı görünümü görev başına gruplarken
        /// kullanır (PR-2b). BOŞ ise madde doğrudan PROJEYE bağlıdır (PR-3a
        /// hiyerarşik kapsam: proje-seviyesi madde).</summary>
        public Guid? TaskId { get; set; }

        public string Text { get; set; } = string.Empty;
        public bool IsDone { get; set; }
    }
}
