using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;
using Apya.Platform.Customers;

namespace Apya.Platform.Web.Pages.Customers;

public class EditModalModel : AbpPageModel
{
    private readonly ICustomerAppService _customerAppService;

    [HiddenInput]
    [BindProperty]
    public Guid CustomerId { get; set; }

    [BindProperty]
    public CreateUpdateCustomerDto Customer { get; set; } = new();

    public EditModalModel(ICustomerAppService customerAppService)
    {
        _customerAppService = customerAppService;
    }

    public virtual async Task<IActionResult> OnGetAsync(Guid id)
    {
        CustomerId = id;
        var dto = await _customerAppService.GetAsync(id);

        Customer.Name = dto.Name;
        Customer.TaxNumber = dto.TaxNumber;
        Customer.TaxOffice = dto.TaxOffice;
        Customer.Address = dto.Address;
        Customer.Phone = dto.Phone;
        Customer.Email = dto.Email;
        Customer.Notes = dto.Notes;
        Customer.IsActive = dto.IsActive;

        return Page();
    }

    public virtual async Task<IActionResult> OnPostAsync()
    {
        ValidateModel();
        await _customerAppService.UpdateAsync(CustomerId, Customer);
        return NoContent();
    }
}
