using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Tenants;

public class TenantProfile : FullAuditedAggregateRoot<Guid>
{
    public Guid TenantId { get; protected set; }

    public CompanyType CompanyType { get; set; }

    public string TaxNumber { get; set; } = string.Empty;

    public string TaxOffice { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string CorporateEmail { get; set; } = string.Empty;

    public string LegalRepresentativeName { get; set; } = string.Empty;
    public string LegalRepresentativePhone { get; set; } = string.Empty;

    public string OperationalContactName { get; set; } = string.Empty;
    public string OperationalContactPhone { get; set; } = string.Empty;

    protected TenantProfile()
    {
    }

    public TenantProfile(
        Guid id, 
        Guid tenantId, 
        CompanyType companyType, 
        string taxNumber, 
        string corporateEmail) 
        : base(id)
    {
        TenantId = tenantId;
        CompanyType = companyType;
        TaxNumber = taxNumber;
        CorporateEmail = corporateEmail;
    }
}
