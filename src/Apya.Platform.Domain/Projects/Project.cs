using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

public class Project : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; } // Proje kime ait?

    public Guid GrantId { get; set; } // Hangi hibeye başvuruluyor?

    public string Name { get; set; } // Proje Adı

    public string Code { get; set; } // Proje Kodu (Örn: PRJ-2026-001)

    public string Description { get; set; } // Proje Özeti

    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public bool IsApproved { get; set; } // Onaylandı mı?

    // EF Core için boş constructor
    public Project()
    {
    }

    public Project(Guid id, Guid grantId, string name, string code, string description)
        : base(id)
    {
        GrantId = grantId;
        Name = name;
        Code = code;
        Description = description;
    }

}