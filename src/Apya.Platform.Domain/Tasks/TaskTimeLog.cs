using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Tasks;

public class TaskTimeLog : FullAuditedEntity<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }
    
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    
    // Saniye cinsinden harcanan süre (Kolay hesaplama için)
    public long? SecondsSpent { get; set; }
    
    public string Note { get; set; }

    public TaskTimeLog() { }

    public TaskTimeLog(Guid id, Guid taskId, Guid userId, DateTime startTime, string note = null) : base(id)
    {
        TaskId = taskId;
        UserId = userId;
        StartTime = startTime;
        Note = note;
    }
}
