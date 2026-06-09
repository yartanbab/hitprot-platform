using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Projects;

/// <summary>
/// Kanban board kolonu (proje bazında). Faz 2: configure edilebilir kanban.
/// - Sistem (varsayılan) kolonlar: <see cref="StatusValue"/> dolu (TaskStatus int), <see cref="IsSystem"/>=true.
///   Görevler bu kolonlarda Status üzerinden render edilir (TaskItem.BoardColumnId boş).
/// - Kullanıcı tanımlı kolonlar: StatusValue=null, IsSystem=false. Görevler TaskItem.BoardColumnId ile bağlanır.
/// </summary>
public class BoardColumn : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }
    public Guid ProjectId { get; private set; }
    public string Name { get; private set; } = null!;
    public string ColorClass { get; private set; } = "secondary"; // Bootstrap renk anahtarı
    public int Order { get; private set; }

    /// <summary>Sistem kolonu için TaskStatus tamsayı değeri; kullanıcı kolonunda null.</summary>
    public int? StatusValue { get; private set; }

    /// <summary>Varsayılan kolon (silinemez/yeniden adlandırılamaz değil ama korunur).</summary>
    public bool IsSystem { get; private set; }

    protected BoardColumn() { }

    public BoardColumn(
        Guid id, Guid projectId, string name, int order,
        string colorClass = "secondary", int? statusValue = null,
        bool isSystem = false, Guid? tenantId = null) : base(id)
    {
        ProjectId = projectId;
        SetName(name);
        Order = order;
        ColorClass = string.IsNullOrWhiteSpace(colorClass) ? "secondary" : colorClass;
        StatusValue = statusValue;
        IsSystem = isSystem;
        TenantId = tenantId;
    }

    public void SetName(string name)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: 64).Trim();
    }

    public void SetColor(string colorClass)
    {
        if (!string.IsNullOrWhiteSpace(colorClass)) ColorClass = colorClass.Trim();
    }

    public void SetOrder(int order) => Order = order;

    public void Update(string name, string colorClass)
    {
        SetName(name);
        SetColor(colorClass);
    }
}
