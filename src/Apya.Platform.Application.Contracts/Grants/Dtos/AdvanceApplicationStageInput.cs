using System;

namespace Apya.Platform.Grants.Dtos;

public class AdvanceApplicationStageInput
{
    public Guid ApplicationId { get; set; }
    public GrantApplicationStage Stage { get; set; }
    public decimal? ApprovedAmount { get; set; }
}
