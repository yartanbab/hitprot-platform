using System;
using System.Collections.Generic;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Grants;

/// <summary>
/// 3b · Çağrı bazlı aşama şablonu. Host katalog verisidir (host'ta TenantId null) ve
/// programlar arasında YENİDEN KULLANILIR — bir program <see cref="Grant.StageTemplateId"/>
/// ile bir şablona bağlanır. 2c panosunun sütunları bu şablonun adımlarından gelecek.
/// </summary>
public class GrantStageTemplate : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }
    public string Name { get; private set; } = null!;
    public string? Description { get; set; }

    /// <summary>Programa şablon seçilmediğinde önerilen şablon. En fazla biri işaretlidir.</summary>
    public bool IsDefault { get; set; }

    public ICollection<GrantStageTemplateStep> Steps { get; set; } = new List<GrantStageTemplateStep>();

    protected GrantStageTemplate() { }

    public GrantStageTemplate(Guid id, string name) : base(id)
    {
        SetName(name);
    }

    public void SetName(string name)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 96).Trim();
    }
}
