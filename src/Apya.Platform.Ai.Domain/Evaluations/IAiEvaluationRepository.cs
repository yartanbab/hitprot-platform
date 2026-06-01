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
}
