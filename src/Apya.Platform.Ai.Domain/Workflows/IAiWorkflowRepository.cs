using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Ai.Workflows;

public interface IAiWorkflowRepository : IRepository<AiWorkflow, Guid>
{
    Task<AiWorkflow?> GetWithRulesAsync(Guid id, CancellationToken cancellationToken = default);

    Task<List<AiWorkflow>> GetAllWithRulesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Active workflows (with rules) that apply to the given document/prompt:
    /// scope is null (all) or matches the supplied id.
    /// </summary>
    Task<List<AiWorkflow>> GetMatchingActiveAsync(Guid documentId, Guid promptId, CancellationToken cancellationToken = default);
}
