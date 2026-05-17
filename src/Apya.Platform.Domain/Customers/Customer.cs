using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Customers;

/// <summary>
/// Cari (Müşteri) Aggregate Root.
/// Tenant-scoped; bir müşteri 1-N proje sahibi olabilir (APYA-132).
/// </summary>
public class Customer : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Name { get; set; } = null!;

    public string? TaxNumber { get; set; }
    public string? TaxOffice { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Notes { get; set; }

    public bool IsActive { get; set; } = true;

    protected Customer() { }

    public Customer(Guid id, string name, Guid? tenantId = null) : base(id)
    {
        TenantId = tenantId;
        SetName(name);
    }

    public void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new BusinessException(PlatformDomainErrorCodes.CustomerNameRequired);
        if (name.Length > CustomerConsts.MaxNameLength)
            throw new BusinessException(PlatformDomainErrorCodes.CustomerFieldTooLong)
                .WithData("Field", nameof(Name))
                .WithData("MaxLength", CustomerConsts.MaxNameLength);
        Name = name.Trim();
    }

    public void Activate() => IsActive = true;
    public void Deactivate() => IsActive = false;
}
