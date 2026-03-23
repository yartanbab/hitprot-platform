using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Documents;

public class Document : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    /// <summary>
    /// Eğer doküman belirli bir projeye (veya Ar-Ge'ye) aitse
    /// </summary>
    public Guid? ProjectId { get; set; }

    /// <summary>
    /// İç içe hiyerarşi kurmak için (Notion misali alt sayfalar)
    /// </summary>
    public Guid? ParentDocumentId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// İkon veya emoji (ör: 🔥, 📄)
    /// </summary>
    public string? Icon { get; set; }

    public Document()
    {
    }

    public Document(Guid id, Guid? tenantId, string title, string content, Guid? projectId = null, Guid? parentDocumentId = null, string? icon = null)
        : base(id)
    {
        TenantId = tenantId;
        Title = title;
        Content = content;
        ProjectId = projectId;
        ParentDocumentId = parentDocumentId;
        Icon = icon;
    }
}
