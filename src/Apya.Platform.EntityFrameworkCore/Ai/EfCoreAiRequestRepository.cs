using System;
using Apya.Platform.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apya.Platform.Ai;

/// <summary>
/// EF Core implementation of <see cref="IAiRequestRepository"/> over the shared host
/// <see cref="PlatformDbContext"/>. Auto-registered by ABP conventional repository discovery.
/// All queries are tenant-scoped automatically via ABP's multi-tenancy data filter.
/// </summary>
public class EfCoreAiRequestRepository
    : EfCoreRepository<PlatformDbContext, AiRequest, Guid>,
      IAiRequestRepository
{
    public EfCoreAiRequestRepository(IDbContextProvider<PlatformDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }
}
