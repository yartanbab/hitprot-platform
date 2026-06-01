using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EventBus;
using Apya.Platform.Ai.Evaluations;
using Apya.Platform.Notifications;

namespace Apya.Platform.Ai.Workflows;

/// <summary>
/// When an evaluation completes, runs the matching active workflows against the result JSON and
/// dispatches the matched actions. Reuses existing infrastructure for delivery (NotificationManager).
/// Runs in the job's tenant context (the ETO is published inside CurrentTenant.Change).
/// </summary>
public class AiWorkflowTriggerHandler
    : ILocalEventHandler<AiEvaluationStatusChangedEto>,
      ITransientDependency
{
    private readonly IAiWorkflowRepository _workflowRepository;
    private readonly IAiEvaluationRepository _evaluationRepository;
    private readonly IAiWorkflowEvaluator _evaluator;
    private readonly NotificationManager _notificationManager;
    private readonly ILogger<AiWorkflowTriggerHandler> _logger;

    public AiWorkflowTriggerHandler(
        IAiWorkflowRepository workflowRepository,
        IAiEvaluationRepository evaluationRepository,
        IAiWorkflowEvaluator evaluator,
        NotificationManager notificationManager,
        ILogger<AiWorkflowTriggerHandler> logger)
    {
        _workflowRepository = workflowRepository;
        _evaluationRepository = evaluationRepository;
        _evaluator = evaluator;
        _notificationManager = notificationManager;
        _logger = logger;
    }

    public async Task HandleEventAsync(AiEvaluationStatusChangedEto eventData)
    {
        if (eventData.NewStatus != AiEvaluationStatus.Completed)
            return;

        var evaluation = await _evaluationRepository.GetWithResultAsync(eventData.EvaluationId);
        var rawJson = evaluation?.Result?.RawJson;
        if (evaluation is null || string.IsNullOrWhiteSpace(rawJson))
            return;

        var workflows = await _workflowRepository.GetMatchingActiveAsync(evaluation.DocumentId, evaluation.PromptId);
        if (workflows.Count == 0)
            return;

        foreach (var workflow in workflows)
        {
            var actions = _evaluator.Evaluate(rawJson!, workflow.Rules);
            foreach (var action in actions)
                await DispatchAsync(action, workflow, evaluation.Id);
        }
    }

    private async Task DispatchAsync(WorkflowActionMatch action, AiWorkflow workflow, Guid evaluationId)
    {
        switch (action.ActionType)
        {
            case WorkflowActionType.Notify:
                if (Guid.TryParse(action.ActionPayload, out var userId) && userId != Guid.Empty)
                {
                    await _notificationManager.PublishAsync(
                        userId,
                        "AI İş Akışı",
                        $"\"{workflow.Name}\" iş akışı bir değerlendirmeyi tetikledi.",
                        NotificationType.AiWorkflowTriggered,
                        "AiEvaluation",
                        evaluationId);
                }
                else
                {
                    _logger.LogInformation(
                        "Workflow {Workflow}: Notify aksiyonu için geçerli hedef kullanıcı (ActionPayload) yok. Evaluation {Id}.",
                        workflow.Name, evaluationId);
                }
                break;

            default:
                // Webhook / Approve / Tag: full dispatch lands in S5 (webhook subscription + decision override).
                _logger.LogInformation(
                    "Workflow {Workflow}: {Action} aksiyonu tetiklendi (evaluation {Id}). Payload: {Payload}.",
                    workflow.Name, action.ActionType, evaluationId, action.ActionPayload);
                break;
        }
    }
}
