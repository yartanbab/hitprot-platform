using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Grants.Dtos;

public class GrantDisbursementTrancheDto : EntityDto<Guid>
{
    public int SequenceNo { get; set; }
    public decimal Amount { get; set; }
    public GrantDisbursementTrancheStatus Status { get; set; }
    public DateTime? DueDate { get; set; }
}
