using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects.Dtos;

public class TaskDto : EntityDto<Guid>
{
   
    public string Title { get; set; }
    public string Description { get; set; }
    public int Status { get; set; }
    public DateTime CreationTime { get; set; }
    public Guid? ProjectId { get; set; }
}