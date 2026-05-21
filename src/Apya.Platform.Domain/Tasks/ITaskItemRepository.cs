using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Tasks;

public interface ITaskItemRepository : IRepository<TaskItem, Guid>
{
    /// <summary>
    /// Single SQL UPDATE for bulk deadline-warning flag — avoids N+1 per-task UpdateAsync calls.
    /// Executes within the current UoW transaction.
    /// </summary>
    Task BulkMarkDeadlineWarningSentAsync(
        IEnumerable<Guid> taskIds,
        CancellationToken cancellationToken = default);
}
