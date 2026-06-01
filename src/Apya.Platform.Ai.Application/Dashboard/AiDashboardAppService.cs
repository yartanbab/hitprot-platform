using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apya.Platform.Ai.Evaluations;
using Apya.Platform.Ai.Permissions;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.Ai.Providers;
using Apya.Platform.Ai.Workflows;
using Microsoft.AspNetCore.Authorization;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Ai.Dashboard;

[Authorize(AiPermissions.Dashboard.View)]
public class AiDashboardAppService : ApplicationService, IAiDashboardAppService
{
    private readonly IAiEvaluationRepository _evaluationRepository;
    private readonly IRepository<Prompt, Guid> _promptRepository;
    private readonly IRepository<AiWorkflow, Guid> _workflowRepository;
    private readonly IRepository<AiProviderConfig, Guid> _providerRepository;

    public AiDashboardAppService(
        IAiEvaluationRepository evaluationRepository,
        IRepository<Prompt, Guid> promptRepository,
        IRepository<AiWorkflow, Guid> workflowRepository,
        IRepository<AiProviderConfig, Guid> providerRepository)
    {
        _evaluationRepository = evaluationRepository;
        _promptRepository = promptRepository;
        _workflowRepository = workflowRepository;
        _providerRepository = providerRepository;
    }

    public async Task<AiDashboardDto> GetAsync()
    {
        var statusCounts = await _evaluationRepository.GetStatusCountsAsync();
        var (scoredCount, averageScore) = await _evaluationRepository.GetScoreStatsAsync();
        var riskDistribution = await _evaluationRepository.GetRiskDistributionAsync();

        return new AiDashboardDto
        {
            Pending = statusCounts.GetValueOrDefault(AiEvaluationStatus.Pending),
            Processing = statusCounts.GetValueOrDefault(AiEvaluationStatus.Processing),
            Completed = statusCounts.GetValueOrDefault(AiEvaluationStatus.Completed),
            Failed = statusCounts.GetValueOrDefault(AiEvaluationStatus.Failed),
            TotalEvaluations = statusCounts.Values.Sum(),

            ScoredCount = scoredCount,
            AverageScore = averageScore,

            RiskDistribution = riskDistribution
                .OrderByDescending(kv => kv.Value)
                .Select(kv => new DashboardBucketDto { Label = kv.Key, Count = kv.Value })
                .ToList(),

            PromptCount = (int)await _promptRepository.GetCountAsync(),
            ActiveWorkflowCount = (int)await _workflowRepository.CountAsync(w => w.IsActive),
            ProviderCount = (int)await _providerRepository.GetCountAsync()
        };
    }
}
