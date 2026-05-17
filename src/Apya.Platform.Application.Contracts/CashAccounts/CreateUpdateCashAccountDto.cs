using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.CashAccounts;

public class CreateUpdateCashAccountDto
{
    [Required]
    [StringLength(CashAccountConsts.MaxNameLength)]
    public string Name { get; set; } = null!;

    public CashAccountType Type { get; set; } = CashAccountType.Cash;

    [Required]
    [StringLength(CashAccountConsts.CurrencyLength, MinimumLength = CashAccountConsts.CurrencyLength)]
    public string Currency { get; set; } = "TRY";

    public decimal OpeningBalance { get; set; }

    [StringLength(CashAccountConsts.MaxDescriptionLength)]
    public string? Description { get; set; }

    public bool IsActive { get; set; } = true;
}
