namespace Apya.Platform.Accounting.Outbox;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

public interface IOutboxMessageRepository : IRepository<OutboxMessage, Guid>
{
    /// <summary>
    /// Pending kayıtları sequence sırasına göre kilitleyerek okur
    /// (PostgreSQL: <c>FOR UPDATE SKIP LOCKED</c>; SQL Server: <c>READPAST</c>).
    /// Bu sayede paralel dispatcher'lar aynı satırı çekmez.
    /// </summary>
    Task<IReadOnlyList<OutboxMessage>> LeasePendingBatchAsync(
        Guid? tenantId,
        int batchSize,
        DateTimeOffset now,
        CancellationToken cancellationToken = default);
}
