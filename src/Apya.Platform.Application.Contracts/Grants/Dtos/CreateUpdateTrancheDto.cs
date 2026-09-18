using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Grants.Dtos;

public class CreateUpdateTrancheDto
{
    [Range(1, int.MaxValue)]
    public int SequenceNo { get; set; }

    [Range(0.01, 999_999_999_999.99)]
    public decimal Amount { get; set; }

    public GrantDisbursementTrancheStatus Status { get; set; }
    public DateTime? DueDate { get; set; }
}
