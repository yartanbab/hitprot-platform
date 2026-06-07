using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Workflows.Dtos;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.Ai.Workflows;

[Authorize(AiPermissions.Workflows.Default)]
public class AiWorkflowAppService : ApplicationService, IAiWorkflowAppService
{
    private readonly IAiWorkflowRepository _workflowRepository;

    public AiWorkflowAppService(IAiWorkflowRepository workflowRepository)
    {
        _workflowRepository = workflowRepository;
    }

    public async Task<List<AiWorkflowDto>> GetListAsync()
    {
        var workflows = await _workflowRepository.GetAllWithRulesAsync();
        return workflows.OrderBy(w => w.Name).Select(MapToDto).ToList();
    }

    public async Task<AiWorkflowDetailDto> GetAsync(Guid id)
    {
        var workflow = await _workflowRepository.GetWithRulesAsync(id)
            ?? throw new EntityNotFoundException(typeof(AiWorkflow), id);
        return MapToDetail(workflow);
    }

    [Authorize(AiPermissions.Workflows.Manage)]
    public async Task<AiWorkflowDto> CreateAsync(CreateUpdateAiWorkflowDto input)
    {
        var workflow = new AiWorkflow(
            GuidGenerator.Create(), input.Name, input.DocumentId, input.PromptId, CurrentTenant.Id);
        if (!input.IsActive) workflow.Deactivate();

        await _workflowRepository.InsertAsync(workflow, autoSave: true);
        return MapToDto(workflow);
    }

    [Authorize(AiPermissions.Workflows.Manage)]
    public async Task<AiWorkflowDto> UpdateAsync(Guid id, CreateUpdateAiWorkflowDto input)
    {
        var workflow = await _workflowRepository.GetWithRulesAsync(id)
            ?? throw new EntityNotFoundException(typeof(AiWorkflow), id);

        workflow.SetName(input.Name);
        workflow.SetScope(input.DocumentId, input.PromptId);
        if (input.IsActive) workflow.Activate(); else workflow.Deactivate();

        await _workflowRepository.UpdateAsync(workflow, autoSave: true);
        return MapToDto(workflow);
    }

    [Authorize(AiPermissions.Workflows.Manage)]
    public async Task DeleteAsync(Guid id)
    {
        await _workflowRepository.DeleteAsync(id);
    }

    [Authorize(AiPermissions.Workflows.Manage)]
    public async Task<AiWorkflowRuleDto> AddRuleAsync(Guid id, CreateWorkflowRuleDto input)
    {
        var workflow = await _workflowRepository.GetWithRulesAsync(id)
            ?? throw new EntityNotFoundException(typeof(AiWorkflow), id);

        var rule = workflow.AddRule(
            GuidGenerator.Create(), input.JsonPath, input.Operator, input.CompareValue, input.ActionType, input.ActionPayload);

        await _workflowRepository.UpdateAsync(workflow, autoSave: true);
        return MapRule(rule);
    }

    [Authorize(AiPermissions.Workflows.Manage)]
    public async Task RemoveRuleAsync(Guid id, Guid ruleId)
    {
        var workflow = await _workflowRepository.GetWithRulesAsync(id)
            ?? throw new EntityNotFoundException(typeof(AiWorkflow), id);

        workflow.RemoveRule(ruleId);
        await _workflowRepository.UpdateAsync(workflow, autoSave: true);
    }

    private static AiWorkflowDto MapToDto(AiWorkflow w) => new()
    {
        Id = w.Id,
        Name = w.Name,
        DocumentId = w.DocumentId,
        PromptId = w.PromptId,
        IsActive = w.IsActive,
        RuleCount = w.Rules.Count
    };

    private static AiWorkflowDetailDto MapToDetail(AiWorkflow w) => new()
    {
        Id = w.Id,
        Name = w.Name,
        DocumentId = w.DocumentId,
        PromptId = w.PromptId,
        IsActive = w.IsActive,
        RuleCount = w.Rules.Count,
        Rules = w.Rules.OrderBy(r => r.Order).Select(MapRule).ToList()
    };

    private static AiWorkflowRuleDto MapRule(AiWorkflowRule r) => new()
    {
        Id = r.Id,
        Order = r.Order,
        JsonPath = r.JsonPath,
        Operator = r.Operator,
        CompareValue = r.CompareValue,
        ActionType = r.ActionType,
        ActionPayload = r.ActionPayload
    };
}
