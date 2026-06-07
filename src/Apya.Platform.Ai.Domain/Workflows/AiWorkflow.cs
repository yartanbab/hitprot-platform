using System;
using System.Collections.Generic;
using System.Linq;
using Volo.Abp;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

namespace Apya.Platform.Ai.Workflows;

/// <summary>
/// Aggregate Root: an ordered set of rules evaluated against an AI evaluation result. Optionally
/// scoped to a specific form (<see cref="DocumentId"/>) and/or prompt (<see cref="PromptId"/>);
/// null scope means "applies to all". Matched rules dispatch actions (notify/webhook/approve/tag).
/// </summary>
public class AiWorkflow : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; private set; }
    public string Name { get; private set; } = null!;
    public Guid? DocumentId { get; private set; }
    public Guid? PromptId { get; private set; }
    public bool IsActive { get; private set; }

    private readonly List<AiWorkflowRule> _rules = new();
    public IReadOnlyList<AiWorkflowRule> Rules => _rules.AsReadOnly();

    protected AiWorkflow() { }

    public AiWorkflow(
        Guid id,
        string name,
        Guid? documentId = null,
        Guid? promptId = null,
        Guid? tenantId = null) : base(id)
    {
        SetName(name);
        DocumentId = documentId;
        PromptId = promptId;
        TenantId = tenantId;
        IsActive = true;
    }

    public void SetName(string name) =>
        Name = Check.NotNullOrWhiteSpace(name, nameof(name), maxLength: WorkflowConsts.MaxNameLength);

    public void SetScope(Guid? documentId, Guid? promptId)
    {
        DocumentId = documentId;
        PromptId = promptId;
    }

    public void Activate() => IsActive = true;
    public void Deactivate() => IsActive = false;

    public AiWorkflowRule AddRule(
        Guid ruleId,
        string jsonPath,
        RuleOperator @operator,
        string compareValue,
        WorkflowActionType actionType,
        string? actionPayload = null,
        int? order = null)
    {
        var ruleOrder = order ?? (_rules.Count == 0 ? 0 : _rules.Max(r => r.Order) + 1);
        var rule = new AiWorkflowRule(ruleId, Id, ruleOrder, jsonPath, @operator, compareValue, actionType, actionPayload);
        _rules.Add(rule);
        return rule;
    }

    public void ClearRules() => _rules.Clear();

    public void RemoveRule(Guid ruleId)
    {
        var rule = _rules.FirstOrDefault(r => r.Id == ruleId);
        if (rule != null)
            _rules.Remove(rule);
    }
}
