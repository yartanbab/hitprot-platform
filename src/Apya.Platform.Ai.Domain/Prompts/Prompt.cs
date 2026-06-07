using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Prompts;

/// <summary>
/// Aggregate Root for a managed AI prompt. Owns its <see cref="PromptVersion"/> history and enforces
/// the invariant that at most one version is <see cref="PromptVersionStatus.Published"/> at a time
/// (the one referenced by <see cref="ActiveVersionId"/>). All mutation goes through domain methods.
/// </summary>
public class Prompt : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    /// <summary>Stable, tenant-unique business key (e.g. "credit-risk-eval").</summary>
    public string Code { get; private set; } = null!;

    public string Name { get; private set; } = null!;

    public string? Description { get; private set; }

    public Guid? CategoryId { get; private set; }

    /// <summary>The currently published version used by new evaluations; null until first publish.</summary>
    public Guid? ActiveVersionId { get; private set; }

    /// <summary>Soft on/off switch independent of version publishing.</summary>
    public bool IsActive { get; private set; }

    private readonly List<PromptVersion> _versions = new();
    public IReadOnlyList<PromptVersion> Versions => _versions.AsReadOnly();

    protected Prompt() { }

    public Prompt(
        Guid id,
        string code,
        string name,
        string? description = null,
        Guid? categoryId = null,
        Guid? tenantId = null) : base(id)
    {
        SetCode(code);
        SetName(name);
        Description = description;
        CategoryId = categoryId;
        TenantId = tenantId;
        IsActive = true;
    }

    public void SetCode(string code) =>
        Code = Check.NotNullOrWhiteSpace(code, nameof(code), maxLength: PromptConsts.MaxCodeLength);

    public void SetName(string name) =>
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: PromptConsts.MaxNameLength);

    public void SetDescription(string? description)
    {
        if (description?.Length > PromptConsts.MaxDescriptionLength)
            description = description.Substring(0, PromptConsts.MaxDescriptionLength);
        Description = description;
    }

    public void SetCategory(Guid? categoryId) => CategoryId = categoryId;

    public void Activate() => IsActive = true;

    public void Deactivate() => IsActive = false;

    /// <summary>Adds a new Draft version with the next sequential version number.</summary>
    public PromptVersion AddVersion(
        Guid versionId,
        string systemPrompt,
        string userPromptTemplate,
        string? jsonSchema = null,
        string? expectedOutputSample = null)
    {
        var nextNo = _versions.Count == 0 ? 1 : _versions.Max(v => v.VersionNo) + 1;
        var version = new PromptVersion(
            versionId, Id, nextNo, systemPrompt, userPromptTemplate, jsonSchema, expectedOutputSample);
        _versions.Add(version);
        return version;
    }

    /// <summary>
    /// Publishes the given version and archives any previously published version,
    /// then points <see cref="ActiveVersionId"/> at it. <paramref name="now"/> is supplied by the
    /// application layer (Clock.Now) to keep the domain free of ambient time.
    /// </summary>
    public void PublishVersion(Guid versionId, DateTime now)
    {
        var target = _versions.FirstOrDefault(v => v.Id == versionId)
            ?? throw new BusinessException(PlatformDomainErrorCodes.PromptVersionNotFound);

        foreach (var published in _versions.Where(v => v.Status == PromptVersionStatus.Published))
            published.Archive();

        target.Publish(now);
        ActiveVersionId = target.Id;
    }

    public PromptVersion GetActiveVersion()
    {
        if (ActiveVersionId is null)
            throw new BusinessException(PlatformDomainErrorCodes.PromptNoPublishedVersion)
                .WithData("Code", Code);

        return _versions.First(v => v.Id == ActiveVersionId.Value);
    }
}
