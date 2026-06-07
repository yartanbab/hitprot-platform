using System;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Bindings;

/// <summary>
/// Links a form (<c>AppDocument</c>) to a <c>Prompt</c> so that submitted responses are evaluated by
/// AI. Decision D2: a dedicated binding (not a generic EntityLink) because it carries ordering, an
/// active flag, the trigger mode and the version policy. Cross-context references are by id only.
/// </summary>
public class AiFormBinding : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }

    /// <summary>The form (App.AppDocuments) this binding watches.</summary>
    public Guid DocumentId { get; private set; }

    public Guid PromptId { get; private set; }

    public BindingTriggerMode TriggerMode { get; private set; }

    public PromptVersionPolicy VersionPolicy { get; private set; }

    /// <summary>Only used when <see cref="VersionPolicy"/> is <see cref="PromptVersionPolicy.Pinned"/>.</summary>
    public Guid? PinnedVersionId { get; private set; }

    public int Order { get; private set; }

    public bool IsActive { get; private set; }

    protected AiFormBinding() { }

    public AiFormBinding(
        Guid id,
        Guid documentId,
        Guid promptId,
        BindingTriggerMode triggerMode = BindingTriggerMode.OnSubmit,
        int order = 0,
        Guid? tenantId = null) : base(id)
    {
        DocumentId = documentId;
        PromptId = promptId;
        TriggerMode = triggerMode;
        Order = order;
        TenantId = tenantId;
        VersionPolicy = PromptVersionPolicy.Active;
        IsActive = true;
    }

    public void SetTriggerMode(BindingTriggerMode mode) => TriggerMode = mode;

    public void UsePinnedVersion(Guid versionId)
    {
        VersionPolicy = PromptVersionPolicy.Pinned;
        PinnedVersionId = versionId;
    }

    public void UseActiveVersion()
    {
        VersionPolicy = PromptVersionPolicy.Active;
        PinnedVersionId = null;
    }

    public void SetOrder(int order) => Order = order;

    public void Activate() => IsActive = true;

    public void Deactivate() => IsActive = false;
}
