using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.EntityFrameworkCore;
using Apya.Platform.Tasks;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apya.Platform.Tasks;

public class EfCoreTaskItemRepository
    : EfCoreRepository<PlatformDbContext, TaskItem, Guid>,
      ITaskItemRepository
{
    public EfCoreTaskItemRepository(
        IDbContextProvider<PlatformDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    public async Task BulkMarkDeadlineWarningSentAsync(
        IEnumerable<Guid> taskIds,
        CancellationToken cancellationToken = default)
    {
        var db = await GetDbContextAsync();
        var ids = taskIds.ToList();
        await db.Tasks
            .Where(t => ids.Contains(t.Id))
            .ExecuteUpdateAsync(
                s => s.SetProperty(t => t.IsDeadlineWarningSent, true),
                cancellationToken);
    }
}
