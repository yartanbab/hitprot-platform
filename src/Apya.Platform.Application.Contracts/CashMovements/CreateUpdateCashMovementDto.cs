using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.CashMovements;

public class CreateUpdateCashMovementDto
{
    [Required]
    public Guid CashAccountId { get; set; }

    public CashMovementDirection Direction { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    public DateTime MovementDate { get; set; } = DateTime.Today;

    [StringLength(CashMovementConsts.MaxDescriptionLength)]
    public string? Description { get; set; }
}
