namespace Apya.Platform.Accounting.Events;

using System;
using Volo.Abp.EventBus;

/// <summary>
/// JournalEntryPostedEto — distributed event payload (ETO).
/// <para>
/// AggregateRoot içinde <c>AddDistributedEvent</c> ile fırlatılır;
/// EF Core katmanı SaveChanges sırasında bunu OutboxMessage'a serialize eder.
/// Böylece event publish'i ledger insert'i ile <b>aynı transaction</b> içinde
/// gerçekleşir → at-most-once persisted, at-least-once delivered.
/// </para>
/// <para>
/// ETO POCO'dur — ABP EventBus için record kullanmak fix edilen
/// serialization isteminden ötürü tehlikelidir; klasik immutable class.
/// Sadece primitive ve değişmez değerler içerir; AggregateRoot referansı
/// ASLA event'e koyulmaz.
/// </para>
/// </summary>
[EventName("apya.accounting.journal-entry.posted.v1")]
public sealed class JournalEntryPostedEto
{
    public Guid JournalEntryId { get; }
    public Guid? TenantId { get; }
    public string IdempotencyKey { get; }
    public long Sequence { get; }
    public string EntryNumber { get; }
    public DateTime PostingDate { get; }
    public DateTimeOffset OccurredAt { get; }
    public string Currency { get; }
    public decimal TotalDebitAmount { get; }
    public decimal TotalCreditAmount { get; }
    public Guid? CorrelationId { get; }
    public Guid? ReversalOfJournalEntryId { get; }
    public JournalEntryLineEto[] Lines { get; }

    public JournalEntryPostedEto(
        Guid JournalEntryId,
        Guid? TenantId,
        string IdempotencyKey,
        long Sequence,
        string EntryNumber,
        DateTime PostingDate,
        DateTimeOffset OccurredAt,
        string Currency,
        decimal TotalDebitAmount,
        decimal TotalCreditAmount,
        Guid? CorrelationId,
        Guid? ReversalOfJournalEntryId,
        JournalEntryLineEto[] Lines)
    {
        this.JournalEntryId = JournalEntryId;
        this.TenantId = TenantId;
        this.IdempotencyKey = IdempotencyKey;
        this.Sequence = Sequence;
        this.EntryNumber = EntryNumber;
        this.PostingDate = PostingDate;
        this.OccurredAt = OccurredAt;
        this.Currency = Currency;
        this.TotalDebitAmount = TotalDebitAmount;
        this.TotalCreditAmount = TotalCreditAmount;
        this.CorrelationId = CorrelationId;
        this.ReversalOfJournalEntryId = ReversalOfJournalEntryId;
        this.Lines = Lines;
    }
}
