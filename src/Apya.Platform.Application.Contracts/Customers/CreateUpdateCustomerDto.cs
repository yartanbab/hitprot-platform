using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Customers;

public class CreateUpdateCustomerDto
{
    [Required]
    [StringLength(CustomerConsts.MaxNameLength)]
    public string Name { get; set; } = null!;

    [StringLength(CustomerConsts.MaxTaxNumberLength)]
    public string? TaxNumber { get; set; }

    [StringLength(CustomerConsts.MaxTaxOfficeLength)]
    public string? TaxOffice { get; set; }

    [StringLength(CustomerConsts.MaxAddressLength)]
    public string? Address { get; set; }

    [StringLength(CustomerConsts.MaxPhoneLength)]
    public string? Phone { get; set; }

    [EmailAddress]
    [StringLength(CustomerConsts.MaxEmailLength)]
    public string? Email { get; set; }

    [StringLength(CustomerConsts.MaxNotesLength)]
    public string? Notes { get; set; }

    public bool IsActive { get; set; } = true;
}
