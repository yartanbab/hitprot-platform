using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

public class Project : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public Guid? GrantId { get; set; } // Boş olabilir

    public string Name { get; set; }

    public string Code { get; set; }

    public string Description { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public bool IsApproved { get; set; }

    public Project()
    {
    }

    // DÜZELTİLEN KISIM BURASI: grantId yanına ? ekledik
    public Project(Guid id, Guid? grantId, string name, string code, string description)
    : base(id)
    {
        GrantId = grantId;
        Name = name;
        Code = code;
        Description = description;
    }
}