using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Customers;

namespace Apya.Platform.Web.Pages.Customers;

public class CreateModalModel : AbpPageModel
{
    private readonly ICustomerAppService _customerAppService;

    [BindProperty]
    public CreateUpdateCustomerDto Customer { get; set; } = new();

    public CreateModalModel(ICustomerAppService customerAppService)
    {
        _customerAppService = customerAppService;
    }

    public virtual Task<IActionResult> OnGetAsync()
    {
        return Task.FromResult<IActionResult>(Page());
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _customerAppService.CreateAsync(Customer);
        return NoContent();
    }
}
