using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tasks;

public class TaskTimeLogDto : EntityDto<Guid>
{
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; }
    
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    
    public long? SecondsSpent { get; set; }
    public string Note { get; set; }
}
