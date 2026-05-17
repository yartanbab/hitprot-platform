using Volo.Abp.Application.Dtos;

namespace Apya.Platform.CashAccounts;

public class GetCashAccountsInput : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
    public CashAccountType? Type { get; set; }
    public bool? IsActive { get; set; }
}
