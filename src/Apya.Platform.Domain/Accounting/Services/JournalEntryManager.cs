namespace Apya.Platform.Accounting.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Accounting.Abstractions;
using Apya.Platform.Accounting.Journals;
using Apya.Platform.Accounting.ValueObjects;
using Volo.Abp;
using Volo.Abp.Domain.Services;
using Volo.Abp.MultiTenancy;

/// <summary>
/// JournalEntryManager — JournalEntry üretiminin TEK kapısı.
/// <para>
/// Aggregate constructor <c>internal</c> olduğu için manager dışında
/// JournalEntry üretilemez. Bu sayede:
/// </para>
/// <list type="bullet">
///   <item>Sequence her zaman <see cref="ILedgerSequenceProvider"/>'dan alınır
///   (hard-coded değer veya manual ID atama imkansız).</item>
///   <item>LedgerIntegrityGuard her zaman çalışır.</item>
///   <item>OccurredAt sadece <see cref="ILedgerClock"/> üzerinden gelir,
///   <c>DateTime.UtcNow</c> gibi non-deterministic kaynak kullanılmaz.</item>
///   <item>Guid generation ABP'nin <c>IGuidGenerator</c>'ından gelir
///   (sequential GUID — index fragmentation kaçınılır).</item>
/// </list>
/// <para>
/// Manager idempotency'i iki kademede uygular:
/// </para>
/// <list type="number">
///   <item>Guard pre-check (race-free olmasa da hızlı 409 döndürür).</item>
///   <item>Repository Insert sırasında DB unique constraint
///   (<c>UX_JournalEntry_Tenant_IdempotencyKey</c>). Race olursa unique
///   violation yakalanıp <see cref="JournalEntryAlreadyPostedResult"/>
///   olarak döner.</item>
/// </list>
/// </summary>
public sealed class JournalEntryManager : DomainService
{
    private readonly IJournalEntryRepository _journalEntryRepository;
    private readonly LedgerIntegrityGuard _integrityGuard;
    private readonly ILedgerSequenceProvider _sequenceProvider;
    private readonly ILedgerClock _clock;
    private readonly ICurrentTenant _currentTenant;

    public JournalEntryManager(
        IJournalEntryRepository journalEntryRepository,
        LedgerIntegrityGuard integrityGuard,
        ILedgerSequenceProvider sequenceProvider,
        ILedgerClock clock,
        ICurrentTenant currentTenant)
    {
        _journalEntryRepository = journalEntryRepository;
        _integrityGuard = integrityGuard;
        _sequenceProvider = sequenceProvider;
        _clock = clock;
        _currentTenant = currentTenant;
    }

    public async Task<JournalEntry> PostAsync(
        string idempotencyKey,
        string entryNumber,
        DateTime postingDate,
        string currency,
        string description,
        IReadOnlyList<JournalEntryLineDescriptor> lines,
        Guid? correlationId = null,
        CancellationToken cancellationToken = default)
    {
        Check.NotNullOrWhiteSpace(idempotencyKey, nameof(idempotencyKey));
        Check.NotNullOrWhiteSpace(entryNumber, nameof(entryNumber));
        Check.NotNullOrWhiteSpace(currency, nameof(currency));
        Check.NotNullOrWhiteSpace(description, nameof(description));
        Check.NotNull(lines, nameof(lines));

        var tenantId = _currentTenant.Id;

        var context = new LedgerPostingContext(
            tenantId: tenantId,
            idempotencyKey: idempotencyKey,
            currency: currency,
            reversalOfJournalEntryId: null,
            lines: lines);

        await _integrityGuard.ValidateAsync(context, cancellationToken);

        var sequence = await _sequenceProvider.NextAsync(tenantId, cancellationToken);

        var entry = new JournalEntry(
            id: GuidGenerator.Create(),
            tenantId: tenantId,
            idempotencyKey: idempotencyKey,
            sequence: sequence,
            entryNumber: entryNumber,
            postingDate: postingDate,
            occurredAt: _clock.UtcNow,
            description: description,
            currency: currency,
            correlationId: correlationId,
            reversalOfJournalEntryId: null,
            lineDescriptors: lines,
            lineIdGenerator: () => GuidGenerator.Create());

        return entry;
    }

    /// <summary>
    /// Reversal entry üretir — orijinal entry'nin satırlarındaki yön
    /// (Debit ↔ Credit) ters çevrilerek yeni bir entry post edilir.
    /// Orijinal asla mutasyona uğramaz; reversal yeni bir append'tir.
    /// </summary>
    public async Task<JournalEntry> ReverseAsync(
        Guid originalJournalEntryId,
        string idempotencyKey,
        string entryNumber,
        DateTime postingDate,
        string description,
        Guid? correlationId = null,
        CancellationToken cancellationToken = default)
    {
        Check.NotNullOrWhiteSpace(idempotencyKey, nameof(idempotencyKey));
        Check.NotNullOrWhiteSpace(entryNumber, nameof(entryNumber));
        Check.NotNullOrWhiteSpace(description, nameof(description));

        var tenantId = _currentTenant.Id;

        var original = await _journalEntryRepository.GetAsync(
            originalJournalEntryId, includeDetails: true, cancellationToken);

        if (original.TenantId != tenantId)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryAccountTenantMismatch)
                .WithData("OriginalId", originalJournalEntryId);
        }

        var reversedLines = original.Lines
            .OrderBy(l => l.LineNumber)
            .Select(l => new JournalEntryLineDescriptor(
                accountId: l.AccountId,
                direction: l.Direction == JournalDirection.Debit
                    ? JournalDirection.Credit
                    : JournalDirection.Debit,
                amount: new Money(l.Amount.Amount, l.Amount.Currency),
                memo: l.Memo,
                counterpartyId: l.CounterpartyId))
            .ToArray();

        var context = new LedgerPostingContext(
            tenantId: tenantId,
            idempotencyKey: idempotencyKey,
            currency: original.Currency,
            reversalOfJournalEntryId: originalJournalEntryId,
            lines: reversedLines);

        await _integrityGuard.ValidateAsync(context, cancellationToken);

        var sequence = await _sequenceProvider.NextAsync(tenantId, cancellationToken);

        return new JournalEntry(
            id: GuidGenerator.Create(),
            tenantId: tenantId,
            idempotencyKey: idempotencyKey,
            sequence: sequence,
            entryNumber: entryNumber,
            postingDate: postingDate,
            occurredAt: _clock.UtcNow,
            description: description,
            currency: original.Currency,
            correlationId: correlationId ?? original.CorrelationId,
            reversalOfJournalEntryId: originalJournalEntryId,
            lineDescriptors: reversedLines,
            lineIdGenerator: () => GuidGenerator.Create());
    }
}
