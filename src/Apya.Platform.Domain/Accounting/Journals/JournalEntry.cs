namespace Apya.Platform.Accounting.Journals;

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Apya.Platform.Accounting.Abstractions;
using Apya.Platform.Accounting.Events;
using Apya.Platform.Accounting.ValueObjects;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Entities.Auditing;
using Volo.Abp.MultiTenancy;

/// <summary>
/// JournalEntry — double-entry ledger'ın kalbi. Aggregate Root.
/// <para>
/// Sözleşmeler:
/// </para>
/// <list type="bullet">
///   <item><b>Append-only</b>: bir kez post edildikten sonra hiçbir alanı değişmez.
///   <see cref="IAppendOnly"/> marker'ı sayesinde EF Core interceptor
///   modify/delete'i bloke eder.</item>
///   <item><b>Idempotent</b>: <see cref="IdempotencyKey"/> tenant içinde
///   uniquedir. Aynı key ile retry gelirse repository duplicate insert'i
///   unique-constraint ile reddeder ve manager bunu "already posted" olarak
///   ele alır.</item>
///   <item><b>Concurrency safe</b>: <see cref="ConcurrencyStamp"/> her insert'te
///   üretilir. Read-model projektörleri ve dış consumerlar için
///   "bu entry'yi gördüm" cursor'u olarak kullanılır.</item>
///   <item><b>Deterministic ordering</b>: <see cref="Sequence"/> tenant başına
///   strict-monotonic. Replay/cursor için tek doğruluk kaynağı.</item>
///   <item><b>Currency-consistent</b>: tüm satırlar entry currency'siyle aynı.</item>
///   <item><b>Reversal-only</b>: hatalı bir entry düzeltilemez; karşıt
///   yönlü yeni bir entry post edilir ve <see cref="ReversalOfJournalEntryId"/>
///   orijinal entry'ye işaret eder.</item>
/// </list>
/// <para>
/// <see cref="CreationAuditedAggregateRoot{TKey}"/> kullanılır:
/// CreatedAt + CreatorId yeter, ModifiedAt/IsDeleted alanları
/// append-only semantiğine aykırıdır.
/// </para>
/// <para>
/// Construction <c>internal</c> — sadece <c>JournalEntryManager</c> üretir;
/// böylece guard ve sequence garantili olarak uygulanır.
/// </para>
/// </summary>
public class JournalEntry : CreationAuditedAggregateRoot<Guid>, IMultiTenant, IAppendOnly
{
    public virtual Guid? TenantId { get; private set; }

    /// <summary>
    /// Tenant içinde unique. Çağıran istemcinin işlem kimliği —
    /// genellikle "{operationType}:{businessId}" formatında
    /// (ör. "InvoicePosted:7e3...").
    /// </summary>
    public virtual string IdempotencyKey { get; private set; } = default!;

    /// <summary>
    /// Insert anında üretilen Guid. Optimistic concurrency için kullanılır
    /// ve read model'larda "bu kayıt değişti mi" cursor'u gibi davranır.
    /// JournalEntry append-only olduğu için klasik anlamda
    /// "concurrency-on-update" değil; daha çok "row-version" identity'si.
    /// </summary>
    public virtual Guid ConcurrencyStamp { get; private set; }

    /// <summary>
    /// Tenant başına strict-monotonic. <see cref="ILedgerSequenceProvider"/>
    /// tarafından üretilir. Projeksiyon ve replay için kullanılır.
    /// </summary>
    public virtual long Sequence { get; private set; }

    /// <summary>
    /// İnsan-okur entry numarası (ör. "JE-2026-000142"). Opsiyonel;
    /// formatlamayı uygulama katmanı yapar.
    /// </summary>
    public virtual string EntryNumber { get; private set; } = default!;

    /// <summary>
    /// İşlemin muhasebe-anlamındaki tarihi (UTC midnight). Bu tarih
    /// bilgisi yıl-sonu kapanışı, dönem raporları için kullanılır.
    /// </summary>
    public virtual DateTime PostingDate { get; private set; }

    /// <summary>
    /// Sistemin entry'yi kaydettiği gerçek zaman (UTC + offset).
    /// </summary>
    public virtual DateTimeOffset OccurredAt { get; private set; }

    public virtual string Description { get; private set; } = default!;

    public virtual string Currency { get; private set; } = default!;

    /// <summary>
    /// Birden fazla aggregate'i kapsayan iş akışlarında ortak izleme Id'si
    /// (saga, distributed trace).
    /// </summary>
    public virtual Guid? CorrelationId { get; private set; }

    /// <summary>
    /// Bu entry başka bir entry'nin reversal'i ise orijinal entry'nin Id'si.
    /// Append-only kuralı gereği orijinal değiştirilmez; ters yönlü yeni
    /// entry post edilir.
    /// </summary>
    public virtual Guid? ReversalOfJournalEntryId { get; private set; }

    public virtual Money TotalDebit { get; private set; } = default!;
    public virtual Money TotalCredit { get; private set; } = default!;

    private readonly List<JournalEntryLine> _lines = new();

    public virtual IReadOnlyCollection<JournalEntryLine> Lines
        => new ReadOnlyCollection<JournalEntryLine>(_lines);

    public bool IsReversal => ReversalOfJournalEntryId.HasValue;

    /// <summary>EF Core için.</summary>
    protected JournalEntry()
    {
    }

    /// <summary>
    /// Sadece <c>JournalEntryManager</c> tarafından çağrılır.
    /// Guard'a tabi tutulmadan oluşturulan bir <see cref="JournalEntry"/>
    /// asla persist edilmemelidir; manager bu garantiyi verir.
    /// </summary>
    internal JournalEntry(
        Guid id,
        Guid? tenantId,
        string idempotencyKey,
        long sequence,
        string entryNumber,
        DateTime postingDate,
        DateTimeOffset occurredAt,
        string description,
        string currency,
        Guid? correlationId,
        Guid? reversalOfJournalEntryId,
        IReadOnlyList<JournalEntryLineDescriptor> lineDescriptors,
        Func<Guid> lineIdGenerator)
        : base(id)
    {
        if (lineIdGenerator is null)
        {
            throw new ArgumentNullException(nameof(lineIdGenerator));
        }

        TenantId = tenantId;
        SetIdempotencyKey(idempotencyKey);
        SetSequence(sequence);
        SetEntryNumber(entryNumber);
        SetPostingDate(postingDate);
        OccurredAt = occurredAt;
        SetDescription(description);
        Currency = ValidateCurrency(currency);
        CorrelationId = correlationId;
        SetReversalReference(reversalOfJournalEntryId, currentId: id);
        ConcurrencyStamp = Guid.NewGuid();

        BuildLines(lineDescriptors, lineIdGenerator);

        // Domain event — distributed event olarak fırlatılır,
        // EF Core layer SaveChanges ile aynı transaction'da OutboxMessage'a yazar.
        AddDistributedEvent(new JournalEntryPostedEto(
            JournalEntryId: Id,
            TenantId: TenantId,
            IdempotencyKey: IdempotencyKey,
            Sequence: Sequence,
            EntryNumber: EntryNumber,
            PostingDate: PostingDate,
            OccurredAt: OccurredAt,
            Currency: Currency,
            TotalDebitAmount: TotalDebit.Amount,
            TotalCreditAmount: TotalCredit.Amount,
            CorrelationId: CorrelationId,
            ReversalOfJournalEntryId: ReversalOfJournalEntryId,
            Lines: _lines.Select(l => new JournalEntryLineEto(
                LineId: l.Id,
                LineNumber: l.LineNumber,
                AccountId: l.AccountId,
                Direction: l.Direction,
                Amount: l.Amount.Amount,
                Currency: l.Amount.Currency,
                Memo: l.Memo,
                CounterpartyId: l.CounterpartyId
            )).ToArray()
        ));
    }

    // ============================== Internals ==============================

    private void BuildLines(
        IReadOnlyList<JournalEntryLineDescriptor> descriptors,
        Func<Guid> lineIdGenerator)
    {
        if (descriptors is null || descriptors.Count == 0)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryRequiresAtLeastTwoLines);
        }

        if (descriptors.Count < 2)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryRequiresAtLeastTwoLines)
                .WithData("Count", descriptors.Count);
        }

        if (descriptors.Count > AccountingConsts.MaxLinesPerEntry)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryTooManyLines)
                .WithData("Count", descriptors.Count)
                .WithData("Max", AccountingConsts.MaxLinesPerEntry);
        }

        var debit = Money.Zero(Currency);
        var credit = Money.Zero(Currency);

        // Deterministic ordering — caller'dan gelen sıra korunur.
        // 1-based, gap-free.
        for (var i = 0; i < descriptors.Count; i++)
        {
            var descriptor = descriptors[i];

            if (!string.Equals(descriptor.Amount.Currency, Currency, StringComparison.Ordinal))
            {
                throw new BusinessException(PlatformDomainErrorCodes.JournalEntryCurrencyInconsistent)
                    .WithData("EntryCurrency", Currency)
                    .WithData("LineCurrency", descriptor.Amount.Currency)
                    .WithData("LineNumber", i + 1);
            }

            var line = new JournalEntryLine(
                id: lineIdGenerator(),
                tenantId: TenantId,
                journalEntryId: Id,
                lineNumber: (short)(i + 1),
                accountId: descriptor.AccountId,
                direction: descriptor.Direction,
                amount: descriptor.Amount,
                memo: descriptor.Memo,
                counterpartyId: descriptor.CounterpartyId);

            _lines.Add(line);

            if (descriptor.Direction == JournalDirection.Debit)
            {
                debit = debit.Add(descriptor.Amount);
            }
            else
            {
                credit = credit.Add(descriptor.Amount);
            }
        }

        // Zero-sum invariant — burada hard-fail.
        // LedgerIntegrityGuard de aynı kontrolü yapar; burada hem
        // defensive hem de fail-fast olarak duruyoruz (constructor entity'yi
        // invalid state'le doğdurmaz).
        if (debit.Amount != credit.Amount)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryNotBalanced)
                .WithData("Debit", debit.Amount)
                .WithData("Credit", credit.Amount)
                .WithData("Currency", Currency);
        }

        TotalDebit = debit;
        TotalCredit = credit;
    }

    private void SetIdempotencyKey(string idempotencyKey)
    {
        if (string.IsNullOrWhiteSpace(idempotencyKey))
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryIdempotencyKeyRequired);
        }
        if (idempotencyKey.Length > AccountingConsts.IdempotencyKeyMaxLength)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryIdempotencyKeyRequired)
                .WithData("Length", idempotencyKey.Length)
                .WithData("MaxLength", AccountingConsts.IdempotencyKeyMaxLength);
        }
        IdempotencyKey = idempotencyKey.Trim();
    }

    private void SetSequence(long sequence)
    {
        if (sequence <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(sequence), sequence,
                "Sequence must be positive (provided by ILedgerSequenceProvider).");
        }
        Sequence = sequence;
    }

    private void SetEntryNumber(string entryNumber)
    {
        if (string.IsNullOrWhiteSpace(entryNumber))
        {
            throw new ArgumentException("EntryNumber required.", nameof(entryNumber));
        }
        EntryNumber = entryNumber.Trim();
    }

    private void SetPostingDate(DateTime postingDate)
    {
        if (postingDate == default)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryPostingDateInvalid);
        }
        // PostingDate UTC midnight olarak normalize edilir — dönem raporları için.
        PostingDate = DateTime.SpecifyKind(postingDate.Date, DateTimeKind.Utc);
    }

    private void SetDescription(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryDescriptionRequired);
        }
        Description = description.Trim();
    }

    private void SetReversalReference(Guid? reversalOf, Guid currentId)
    {
        if (reversalOf.HasValue && reversalOf.Value == currentId)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryReversalSelfReference);
        }
        ReversalOfJournalEntryId = reversalOf;
    }

    private static string ValidateCurrency(string currency)
    {
        if (string.IsNullOrWhiteSpace(currency) ||
            currency.Length != AccountingConsts.CurrencyCodeLength)
        {
            throw new BusinessException(PlatformDomainErrorCodes.MoneyCurrencyInvalid)
                .WithData("Currency", currency ?? "<null>");
        }
        return currency.ToUpperInvariant();
    }
}
