using System.ComponentModel.DataAnnotations;

namespace Apya.Platform.Tenants;

public class CreateTenantExtendedDto
{
    // Temel ABP Tenant Bilgileri
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

    // Uzantı Profil Bilgileri
    public CompanyType CompanyType { get; set; } = CompanyType.Company;

    [StringLength(50)]
    public string TaxNumber { get; set; } = string.Empty;

    [StringLength(128)]
    public string TaxOffice { get; set; } = string.Empty;

    [StringLength(256)]
    public string CorporateEmail { get; set; } = string.Empty;
}
