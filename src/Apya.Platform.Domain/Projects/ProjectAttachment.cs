using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Projects
{
    public class ProjectAttachment : CreationAuditedEntity<Guid>
    {
        public Guid ProjectId { get; set; }
        public string FileName { get; set; }
        public string StoredFileName { get; set; }
        public long FileSize { get; set; }
        public ProjectAttachment() { }
    }
}