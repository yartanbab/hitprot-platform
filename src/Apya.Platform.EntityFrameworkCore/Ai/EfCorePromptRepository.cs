using System;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Ai.Prompts;
using Apya.Platform.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apya.Platform.Ai.Prompts;

/// <summary>
/// EF Core implementation of <see cref="IPromptRepository"/> over the shared host
/// <see cref="PlatformDbContext"/>. Auto-registered by ABP conventional repository discovery.
/// All queries are tenant-scoped automatically via ABP's multi-tenancy data filter.
/// </summary>
public class EfCorePromptRepository
    : EfCoreRepository<PlatformDbContext, Prompt, Guid>,
      IPromptRepository
{
    public EfCorePromptRepository(IDbContextProvider<PlatformDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    public async Task<Prompt?> GetWithVersionsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await dbContext.AiPrompts
            .Include(p => p.Versions)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<Prompt?> FindByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await dbContext.AiPrompts
            .Include(p => p.Versions)
            .FirstOrDefaultAsync(p => p.Code == code, cancellationToken);
    }

    public async Task<bool> CodeExistsAsync(string code, Guid? excludingId = null, CancellationToken cancellationToken = default)
    {
        var dbContext = await GetDbContextAsync();
        return await dbContext.AiPrompts
            .AnyAsync(p => p.Code == code && (excludingId == null || p.Id != excludingId), cancellationToken);
    }
}
