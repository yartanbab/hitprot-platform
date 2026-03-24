using System;
using Volo.Abp.Application.Dtos;

namespace Apya.Platform.Tenants;

public class TenantProfileDto : FullAuditedEntityDto<Guid>
{
    public Guid TenantId { get; set; }
    public string TenantName { get; set; } = string.Empty;
    public CompanyType CompanyType { get; set; }
    public string TaxNumber { get; set; } = string.Empty;
    public string TaxOffice { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string CorporateEmail { get; set; } = string.Empty;
    public string LegalRepresentativeName { get; set; } = string.Empty;
    public string LegalRepresentativePhone { get; set; } = string.Empty;
    public string OperationalContactName { get; set; } = string.Empty;
    public string OperationalContactPhone { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
