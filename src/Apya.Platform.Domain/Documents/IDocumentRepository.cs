using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

namespace Apya.Platform.Documents;

public interface IDocumentRepository : IRepository<Document, Guid>
{
    /// <summary>
    /// Single SQL UPDATE for bulk expiry-warning flag — avoids N+1 per-document UpdateAsync calls.
    /// Executes within the current UoW transaction.
    /// </summary>
    Task BulkMarkExpiryWarningSentAsync(
        IEnumerable<Guid> documentIds,
        CancellationToken cancellationToken = default);
}
