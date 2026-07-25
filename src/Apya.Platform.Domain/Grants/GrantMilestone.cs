using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>Bir başvurunun milestone/son tarihi (Faz C). Host tarafından yönetilir.</summary>
public class GrantMilestone : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public Guid GrantApplicationId { get; private set; }
    public string Title { get; private set; } = null!;
    public DateTime? DueDate { get; private set; }
    public bool IsCompleted { get; private set; }

    protected GrantMilestone() { }

    public GrantMilestone(Guid id, Guid? tenantId, Guid grantApplicationId, string title, DateTime? dueDate) : base(id)
    {
        TenantId = tenantId;
        GrantApplicationId = grantApplicationId;
        Title = Check.NotNullOrWhiteSpace(title, nameof(title), maxLength: 128).Trim();
        DueDate = dueDate;
        IsCompleted = false;
    }

    public void Update(string title, DateTime? dueDate, bool isCompleted)
    {
        Title = Check.NotNullOrWhiteSpace(title, nameof(title), maxLength: 128).Trim();
        DueDate = dueDate;
        IsCompleted = isCompleted;
    }

    public void Complete() => IsCompleted = true;
}
