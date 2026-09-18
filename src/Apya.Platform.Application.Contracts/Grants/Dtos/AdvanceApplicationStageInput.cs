using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

public class AdvanceApplicationStageInput
{
    public Guid ApplicationId { get; set; }
    public GrantApplicationStage Stage { get; set; }

    [Range(0, 999_999_999_999.99)]
    public decimal? ApprovedAmount { get; set; }
}
