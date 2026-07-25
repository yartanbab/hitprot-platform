using System;

namespace Apya.Platform.Grants.Dtos;

public class CreateUpdateTrancheDto
{
    public int SequenceNo { get; set; }
    public decimal Amount { get; set; }
    public GrantDisbursementTrancheStatus Status { get; set; }
    public DateTime? DueDate { get; set; }
}
