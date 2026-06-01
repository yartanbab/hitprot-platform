using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Ai.Evaluations;
using Apya.Platform.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apya.Platform.Ai.Evaluations;

/// <summary>
/// EF Core implementation of <see cref="IAiEvaluationRepository"/> over the shared host
/// <see cref="PlatformDbContext"/>. Eager-loads the 1:1 result. Tenant-scoped automatically.
/// </summary>
public class EfCoreAiEvaluationRepository
    : EfCoreRepository<PlatformDbContext, AiEvaluation, Guid>,
      IAiEvaluationRepository
{
    public EfCoreAiEvaluationRepository(IDbContextProvider<PlatformDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    public async Task<AiEvaluation?> GetWithResultAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await dbContext.AiEvaluations
            .Include(e => e.Result)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public async Task<List<AiEvaluation>> GetListWithResultAsync(
        Guid? documentId, AiEvaluationStatus? status, int skipCount, int maxResultCount,
        CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await Filter(dbContext.AiEvaluations.Include(e => e.Result), documentId, status)
            .OrderByDescending(e => e.CreationTime)
            .Skip(skipCount)
            .Take(maxResultCount)
            .ToListAsync(cancellationToken);
    }

    public async Task<long> GetCountAsync(
        Guid? documentId, AiEvaluationStatus? status, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await Filter(dbContext.AiEvaluations, documentId, status).LongCountAsync(cancellationToken);
    }

    private static IQueryable<AiEvaluation> Filter(IQueryable<AiEvaluation> query, Guid? documentId, AiEvaluationStatus? status)
    {
        if (documentId.HasValue) query = query.Where(e => e.DocumentId == documentId.Value);
        if (status.HasValue) query = query.Where(e => e.Status == status.Value);
        return query;
    }
}
