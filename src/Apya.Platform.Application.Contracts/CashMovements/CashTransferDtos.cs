using System;
using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.CashMovements;

public class CreateCashTransferDto
{
    [Required]
    public Guid FromCashAccountId { get; set; }

    [Required]
    public Guid ToCashAccountId { get; set; }

    /// <summary>Gönderen hesabın para biriminde, kaynaktan aynen düşülecek tutar.</summary>
    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    public DateTime? TransferDate { get; set; }

    public string? Description { get; set; }
}

public class CashTransferResultDto
{
    public CashMovementDto OutMovement { get; set; } = null!;
    public CashMovementDto InMovement { get; set; } = null!;

    /// <summary>Alıcı hesapta oluşan tutar (farklı para biriminde kur uygulanmış hali).</summary>
    public decimal ConvertedAmount { get; set; }

    /// <summary>Uygulanan kur; aynı para biriminde null.</summary>
    public decimal? RateApplied { get; set; }
}
