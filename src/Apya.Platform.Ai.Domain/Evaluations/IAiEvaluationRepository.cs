using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Ai.Evaluations;

public interface IAiEvaluationRepository : IRepository<AiEvaluation, Guid>
{
    /// <summary>Loads an evaluation together with its 1:1 result.</summary>
    Task<AiEvaluation?> GetWithResultAsync(Guid id, CancellationToken cancellationToken = default);

    Task<List<AiEvaluation>> GetListWithResultAsync(
        Guid? documentId,
        AiEvaluationStatus? status,
        int skipCount,
        int maxResultCount,
        CancellationToken cancellationToken = default);

    Task<long> GetCountAsync(
        Guid? documentId,
        AiEvaluationStatus? status,
        CancellationToken cancellationToken = default);

    // --- Dashboard aggregates ---
    Task<Dictionary<AiEvaluationStatus, int>> GetStatusCountsAsync(CancellationToken cancellationToken = default);

    Task<(int Count, double? Average)> GetScoreStatsAsync(CancellationToken cancellationToken = default);

    Task<Dictionary<string, int>> GetRiskDistributionAsync(CancellationToken cancellationToken = default);
}
