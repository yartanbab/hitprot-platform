using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Customers;

public class GetCustomersInput : PagedAndSortedResultRequestDto
{
    public string? Filter { get; set; }
    public bool? IsActive { get; set; }
}
