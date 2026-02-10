using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Projects.Dtos;

public class ProjectTaskDto : EntityDto<Guid>
{
    public Guid ProjectId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }

    // EKSİK OLAN KISIM BURASIYDI 👇
    public int Status { get; set; }

    public DateTime CreationTime { get; set; }
}