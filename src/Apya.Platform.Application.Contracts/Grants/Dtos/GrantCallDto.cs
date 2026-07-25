using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

public class GrantCallDto : EntityDto<Guid>
{
    public Guid GrantId { get; set; }
    public string Period { get; set; } = string.Empty;
    public GrantCallStatus Status { get; set; }
    public DateTime? OpenDate { get; set; }
    public DateTime? Deadline { get; set; }
    public decimal? Budget { get; set; }
    public string? Reference { get; set; }
    public string? GrantName { get; set; }
}
