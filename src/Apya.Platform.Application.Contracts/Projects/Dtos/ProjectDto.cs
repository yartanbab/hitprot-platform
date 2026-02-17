using System; // Guid ve DateTime için gerekli
using Volo.Abp.Application.Dtos; // AuditedEntityDto için gerekli

namespace Apya.Platform.Projects.Dtos;

public class ProjectDto : AuditedEntityDto<Guid>
{
    public Guid? GrantId { get; set; }
    public Guid? TenantId { get; set; } // ABP otomatik eşler
    public string TenantName { get; set; } = string.Empty; // Ekranda göstereceğimiz isim

    //public Guid? CustomerId { get; set; }

    public string Name { get; set; }

    public string Code { get; set; }

    public string Description { get; set; } = string.Empty;

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsApproved { get; set; }
}
