using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

public class GrantApplicationDto : EntityDto<Guid>
{
    public Guid GrantCallId { get; set; }
    public string? Period { get; set; }
    public string? GrantName { get; set; }
    public GrantApplicationStage Stage { get; set; }
    public DateTime AppliedDate { get; set; }
}
