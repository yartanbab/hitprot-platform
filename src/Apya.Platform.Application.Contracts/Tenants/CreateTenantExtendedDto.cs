using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Tenants;

public class CreateTenantExtendedDto
{
    [Required]
    [StringLength(64)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(256)]
    public string AdminEmailAddress { get; set; } = string.Empty;

    [Required]
    [StringLength(128)]
    public string AdminPassword { get; set; } = string.Empty;

    public CompanyType CompanyType { get; set; } = CompanyType.Company;

    [StringLength(50)]
    public string TaxNumber { get; set; } = string.Empty;

    [StringLength(128)]
    public string TaxOffice { get; set; } = string.Empty;

    [StringLength(256)]
    public string CorporateEmail { get; set; } = string.Empty;

    [StringLength(500)]
    public string Address { get; set; } = string.Empty;

    [StringLength(128)]
    public string LegalRepresentativeName { get; set; } = string.Empty;

    [StringLength(32)]
    public string LegalRepresentativePhone { get; set; } = string.Empty;

    [StringLength(128)]
    public string OperationalContactName { get; set; } = string.Empty;

    [StringLength(32)]
    public string OperationalContactPhone { get; set; } = string.Empty;
}
