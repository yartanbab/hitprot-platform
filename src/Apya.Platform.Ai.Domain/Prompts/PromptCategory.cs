using System;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Prompts;

/// <summary>
/// Aggregate Root for organizing prompts into a (optionally hierarchical) taxonomy.
/// </summary>
public class PromptCategory : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    public string Name { get; private set; } = null!;

    public string Code { get; private set; } = null!;

    public Guid? ParentId { get; private set; }

    public string? Description { get; private set; }

    protected PromptCategory() { }

    public PromptCategory(
        Guid id,
        string name,
        string code,
        Guid? parentId = null,
        string? description = null,
        Guid? tenantId = null) : base(id)
    {
        SetName(name);
        SetCode(code);
        SetParent(parentId);
        Description = description;
        TenantId = tenantId;
    }

    public void SetName(string name) =>
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: PromptConsts.MaxCategoryNameLength);

    public void SetCode(string code) =>
        Code = Check.NotNullOrWhiteSpace(code, nameof(code), maxLength: PromptConsts.MaxCategoryCodeLength);

    public void SetParent(Guid? parentId)
    {
        if (parentId.HasValue && parentId.Value == Id)
            throw new BusinessException(PlatformDomainErrorCodes.PromptCategorySelfReference);

        ParentId = parentId;
    }

    public void SetDescription(string? description) => Description = description;
}
