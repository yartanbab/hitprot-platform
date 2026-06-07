using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Entities.Events;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.EventBus;
using Volo.Abp.Guids;
using Apya.Platform.Ai.Bindings;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.DynamicAssets;

namespace Apya.Platform.Ai.Evaluations;

/// <summary>
/// On every form submission (<c>AppResponse</c> created — ABP raises this automatically), finds the
/// active OnSubmit <see cref="AiFormBinding"/>s for the form, creates a Pending <see cref="AiEvaluation"/>
/// per binding and enqueues the background job. The form-submission code is never touched (same seam
/// the webhook publisher uses).
/// </summary>
public class AiEvaluationTriggerHandler
    : ILocalEventHandler<EntityCreatedEventData<AppResponse>>,
      ITransientDependency
{
    private readonly IRepository<AiFormBinding, Guid> _bindingRepository;
    private readonly IRepository<Prompt, Guid> _promptRepository;
    private readonly IRepository<AiEvaluation, Guid> _evaluationRepository;
    private readonly IBackgroundJobManager _backgroundJobManager;
    private readonly IGuidGenerator _guidGenerator;
    private readonly ILogger<AiEvaluationTriggerHandler> _logger;

    public AiEvaluationTriggerHandler(
        IRepository<AiFormBinding, Guid> bindingRepository,
        IRepository<Prompt, Guid> promptRepository,
        IRepository<AiEvaluation, Guid> evaluationRepository,
        IBackgroundJobManager backgroundJobManager,
        IGuidGenerator guidGenerator,
        ILogger<AiEvaluationTriggerHandler> logger)
    {
        _bindingRepository = bindingRepository;
        _promptRepository = promptRepository;
        _evaluationRepository = evaluationRepository;
        _backgroundJobManager = backgroundJobManager;
        _guidGenerator = guidGenerator;
        _logger = logger;
    }

    public async Task HandleEventAsync(EntityCreatedEventData<AppResponse> eventData)
    {
        var response = eventData.Entity;

        var bindings = await _bindingRepository.GetListAsync(
            b => b.DocumentId == response.DocumentId
                 && b.IsActive
                 && b.TriggerMode == BindingTriggerMode.OnSubmit);

        if (bindings.Count == 0)
            return;

        var queued = 0;
        foreach (var binding in bindings.OrderBy(b => b.Order))
        {
            Guid? versionId;
            if (binding.VersionPolicy == PromptVersionPolicy.Pinned)
            {
                versionId = binding.PinnedVersionId;
            }
            else
            {
                var prompt = await _promptRepository.FindAsync(binding.PromptId);
                versionId = prompt?.ActiveVersionId;
            }

            if (versionId is null)
            {
                _logger.LogWarning(
                    "AI binding {BindingId}: prompt {PromptId} has no published version; evaluation skipped.",
                    binding.Id, binding.PromptId);
                continue;
            }

            var evaluation = new AiEvaluation(
                _guidGenerator.Create(),
                response.DocumentId,
                response.Id,
                binding.PromptId,
                versionId.Value,
                response.TenantId);

            await _evaluationRepository.InsertAsync(evaluation, autoSave: true);

            await _backgroundJobManager.EnqueueAsync(new AiEvaluationJobArgs
            {
                TenantId = response.TenantId,
                EvaluationId = evaluation.Id,
                ResponseId = response.Id,
                DocumentId = response.DocumentId,
                PromptId = binding.PromptId,
                PromptVersionId = versionId.Value
            });
            queued++;
        }

        _logger.LogInformation(
            "Queued {Queued} AI evaluation(s) for response {ResponseId} (document {DocumentId}).",
            queued, response.Id, response.DocumentId);
    }
}
