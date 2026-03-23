using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace Apya.Platform.Tenants;

public class TenantProfile : FullAuditedAggregateRoot<Guid>
{
    public Guid TenantId { get; protected set; }

    public CompanyType CompanyType { get; set; }

    public string TaxNumber { get; set; }

    public string TaxOffice { get; set; }

    public string Address { get; set; }

    public string CorporateEmail { get; set; }

    public string LegalRepresentativeName { get; set; }

    public string OperationalContactName { get; set; }

    public string OperationalContactPhone { get; set; }

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
