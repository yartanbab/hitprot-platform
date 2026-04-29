namespace Apya.Platform.Accounting.Journals;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

public interface IJournalEntryRepository : IRepository<JournalEntry, Guid>
{
    /// <summary>
    /// Idempotency check — repository, unique constraint'i bilen tek yer.
    /// Insert öncesi pre-check yapılır; race olursa unique violation
    /// caller'a 409 olarak yansır.
    /// </summary>
    Task<bool> ExistsByIdempotencyKeyAsync(
        Guid? tenantId,
        string idempotencyKey,
        CancellationToken cancellationToken = default);

    Task<JournalEntry?> FindByIdempotencyKeyAsync(
        Guid? tenantId,
        string idempotencyKey,
        CancellationToken cancellationToken = default);

    Task<bool> HasReversalAsync(
        Guid originalJournalEntryId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Sequence cursor'una göre sıralı olarak okur — read-model rebuild
    /// ve replay için temel API.
    /// </summary>
    Task<IReadOnlyList<JournalEntry>> GetBySequenceRangeAsync(
        Guid? tenantId,
        long fromSequenceExclusive,
        int batchSize,
        CancellationToken cancellationToken = default);
}
