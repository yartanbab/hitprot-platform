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

        /// <summary>Maddenin projesi — görev maddesinde GÖREVİN projesi,
        /// proje-seviyesi maddede kendi ProjectId'si. Çapraz-proje kip
        /// (/Tasks Panolar) proje başına gruplarken kullanır; yalnız proje
        /// kapsamı uçları doldurur, görev detayı ucunda boş kalır.</summary>
        public Guid? ProjectId { get; set; }

        public string Text { get; set; } = string.Empty;
        public bool IsDone { get; set; }
    }
}
