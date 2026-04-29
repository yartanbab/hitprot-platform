namespace Apya.Platform.Accounting.Services;

using System;
using System.Collections.Generic;
using Apya.Platform.Accounting.Journals;

/// <summary>
/// LedgerIntegrityGuard ile JournalEntryManager arasında taşınan,
/// sadece guard'a sunulan minimal bağlam. Aggregate'i guard'a doğrudan
/// vermek yerine readonly bir snapshot taşıyoruz — guard yanlışlıkla
/// state mutasyonu yapamaz, test edilmesi kolay olur.
/// </summary>
public sealed class LedgerPostingContext
{
    public Guid? TenantId { get; }
    public string IdempotencyKey { get; }
    public string Currency { get; }
    public Guid? ReversalOfJournalEntryId { get; }
    public IReadOnlyList<JournalEntryLineDescriptor> Lines { get; }

    public LedgerPostingContext(
        Guid? tenantId,
        string idempotencyKey,
        string currency,
        Guid? reversalOfJournalEntryId,
        IReadOnlyList<JournalEntryLineDescriptor> lines)
    {
        TenantId = tenantId;
        IdempotencyKey = idempotencyKey ?? throw new ArgumentNullException(nameof(idempotencyKey));
        Currency = currency ?? throw new ArgumentNullException(nameof(currency));
        ReversalOfJournalEntryId = reversalOfJournalEntryId;
        Lines = lines ?? throw new ArgumentNullException(nameof(lines));
    }
}
