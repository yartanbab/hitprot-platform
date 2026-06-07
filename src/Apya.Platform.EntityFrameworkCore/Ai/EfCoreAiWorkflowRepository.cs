using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Ai.Workflows;
using Apya.Platform.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apya.Platform.Ai.Workflows;

public class EfCoreAiWorkflowRepository
    : EfCoreRepository<PlatformDbContext, AiWorkflow, Guid>,
      IAiWorkflowRepository
{
    public EfCoreAiWorkflowRepository(IDbContextProvider<PlatformDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    public async Task<AiWorkflow?> GetWithRulesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await dbContext.AiWorkflows.Include(w => w.Rules).FirstOrDefaultAsync(w => w.Id == id, cancellationToken);
    }

    public async Task<List<AiWorkflow>> GetAllWithRulesAsync(CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await dbContext.AiWorkflows.Include(w => w.Rules).ToListAsync(cancellationToken);
    }

    public async Task<List<AiWorkflow>> GetMatchingActiveAsync(Guid documentId, Guid promptId, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await dbContext.AiWorkflows
            .Include(w => w.Rules)
            .Where(w => w.IsActive
                        && (w.DocumentId == null || w.DocumentId == documentId)
                        && (w.PromptId == null || w.PromptId == promptId))
            .ToListAsync(cancellationToken);
    }
}
