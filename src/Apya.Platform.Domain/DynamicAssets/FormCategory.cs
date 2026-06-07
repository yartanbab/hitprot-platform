using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.DynamicAssets;

/// <summary>
/// Aggregate Root for grouping/organizing forms (AppDocuments) into categories.
/// </summary>
public class FormCategory : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public string Name { get; private set; } = null!;

    /// <summary>Hex color for the category badge (e.g. #6366F1).</summary>
    public string? Color { get; private set; }

    /// <summary>Icon name or emoji shown next to the category.</summary>
    public string? Icon { get; private set; }

    /// <summary>Display order in lists.</summary>
    public int Order { get; private set; }

    public Guid? TenantId { get; set; }

    protected FormCategory()
    {
    }

    public FormCategory(Guid id, string name, string? color = null, string? icon = null, int order = 0)
        : base(id)
    {
        SetName(name);
        Color = color;
        Icon = icon;
        Order = order;
    }

    public void SetName(string name)
    {
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: FormCategoryConsts.MaxNameLength);
    }

    public void SetColor(string? color)
    {
        Color = color is null ? null : Check.Length(color, nameof(color), FormCategoryConsts.MaxColorLength);
    }

    public void SetIcon(string? icon)
    {
        Icon = icon is null ? null : Check.Length(icon, nameof(icon), FormCategoryConsts.MaxIconLength);
    }

    public void SetOrder(int order)
    {
        Order = order;
    }
}
