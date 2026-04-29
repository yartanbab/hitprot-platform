namespace Apya.Platform.Accounting.Services;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.Accounting.Accounts;
using Apya.Platform.Accounting.Journals;
using Volo.Abp;
using Volo.Abp.Domain.Services;

/// <summary>
/// LedgerIntegrityGuard — financial firewall.
/// <para>
/// Bir <see cref="JournalEntry"/> persist edilmeden ÖNCE bu guard'dan geçer.
/// Asla atlanmaz; ledger'a invalid bir entry'nin sızması, bütün read-model'leri
/// ve raporları kalıcı olarak bozar (silent corruption). Guard, fail-fast
/// prensibiyle ilk ihlalde <see cref="BusinessException"/> fırlatır ve
/// işlemi iptal eder.
/// </para>
/// <para>
/// Sorumluluklar:
/// </para>
/// <list type="bullet">
///   <item>Balance equality: ΣDebit = ΣCredit, currency başına.</item>
///   <item>Currency consistency: tüm satırlar entry currency'sinde.</item>
///   <item>Account validity: var olmalı, aktif, tenant uyumlu, currency uyumlu.</item>
///   <item>Duplicate prevention: idempotency key tenant içinde unique.</item>
///   <item>Reversal validity: hedef entry varsa, henüz reversal'i yoksa.</item>
/// </list>
/// <para>
/// Guard side-effect-free — yalnızca repository read'i yapar; persist etmez.
/// </para>
/// </summary>
public sealed class LedgerIntegrityGuard : DomainService
{
    private readonly IAccountRepository _accountRepository;
    private readonly IJournalEntryRepository _journalEntryRepository;

    public LedgerIntegrityGuard(
        IAccountRepository accountRepository,
        IJournalEntryRepository journalEntryRepository)
    {
        _accountRepository = accountRepository;
        _journalEntryRepository = journalEntryRepository;
    }

    public async Task ValidateAsync(
        LedgerPostingContext context,
        CancellationToken cancellationToken = default)
    {
        Check.NotNull(context, nameof(context));

        ValidateLineCardinality(context);
        ValidateBalanceAndCurrency(context);
        await ValidateIdempotencyAsync(context, cancellationToken);
        await ValidateAccountsAsync(context, cancellationToken);
        await ValidateReversalAsync(context, cancellationToken);
    }

    // ============================== Checks ==============================

    private static void ValidateLineCardinality(LedgerPostingContext ctx)
    {
        if (ctx.Lines.Count < 2)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryRequiresAtLeastTwoLines)
                .WithData("Count", ctx.Lines.Count);
        }
        if (ctx.Lines.Count > AccountingConsts.MaxLinesPerEntry)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryTooManyLines)
                .WithData("Count", ctx.Lines.Count)
                .WithData("Max", AccountingConsts.MaxLinesPerEntry);
        }
    }

    private static void ValidateBalanceAndCurrency(LedgerPostingContext ctx)
    {
        decimal debit = 0m;
        decimal credit = 0m;

        foreach (var line in ctx.Lines)
        {
            if (!string.Equals(line.Amount.Currency, ctx.Currency, StringComparison.Ordinal))
            {
                throw new BusinessException(PlatformDomainErrorCodes.JournalEntryCurrencyInconsistent)
                    .WithData("EntryCurrency", ctx.Currency)
                    .WithData("LineCurrency", line.Amount.Currency);
            }

            if (!line.Amount.IsPositive)
            {
                throw new BusinessException(PlatformDomainErrorCodes.JournalEntryLineAmountMustBePositive)
                    .WithData("Amount", line.Amount.Amount);
            }

            if (line.Direction == JournalDirection.Debit)
            {
                debit += line.Amount.Amount;
            }
            else
            {
                credit += line.Amount.Amount;
            }
        }

        if (debit != credit)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryNotBalanced)
                .WithData("Debit", debit)
                .WithData("Credit", credit)
                .WithData("Currency", ctx.Currency);
        }
    }

    private async Task ValidateIdempotencyAsync(
        LedgerPostingContext ctx,
        CancellationToken cancellationToken)
    {
        var exists = await _journalEntryRepository.ExistsByIdempotencyKeyAsync(
            ctx.TenantId, ctx.IdempotencyKey, cancellationToken);

        if (exists)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryDuplicateIdempotencyKey)
                .WithData("IdempotencyKey", ctx.IdempotencyKey)
                .WithData("TenantId", ctx.TenantId ?? Guid.Empty);
        }
    }

    private async Task ValidateAccountsAsync(
        LedgerPostingContext ctx,
        CancellationToken cancellationToken)
    {
        var accountIds = ctx.Lines.Select(l => l.AccountId).Distinct().ToArray();
        var accounts = await _accountRepository.GetManyMapAsync(accountIds, cancellationToken);

        foreach (var line in ctx.Lines)
        {
            if (!accounts.TryGetValue(line.AccountId, out var account))
            {
                throw new BusinessException(PlatformDomainErrorCodes.JournalEntryAccountNotFound)
                    .WithData("AccountId", line.AccountId);
            }

            // Cross-tenant defense — ABP data filter zaten filtreler ama
            // belt-and-suspenders: emin olalım.
            if (account.TenantId != ctx.TenantId)
            {
                throw new BusinessException(PlatformDomainErrorCodes.JournalEntryAccountTenantMismatch)
                    .WithData("AccountId", line.AccountId)
                    .WithData("AccountTenantId", account.TenantId ?? Guid.Empty)
                    .WithData("EntryTenantId", ctx.TenantId ?? Guid.Empty);
            }

            account.EnsureCanReceivePostings();

            if (!string.Equals(account.Currency, line.Amount.Currency, StringComparison.Ordinal))
            {
                throw new BusinessException(PlatformDomainErrorCodes.JournalEntryCurrencyInconsistent)
                    .WithData("AccountId", account.Id)
                    .WithData("AccountCurrency", account.Currency)
                    .WithData("LineCurrency", line.Amount.Currency);
            }
        }
    }

    private async Task ValidateReversalAsync(
        LedgerPostingContext ctx,
        CancellationToken cancellationToken)
    {
        if (!ctx.ReversalOfJournalEntryId.HasValue)
        {
            return;
        }

        var originalId = ctx.ReversalOfJournalEntryId.Value;
        var original = await _journalEntryRepository.FindAsync(originalId, includeDetails: false, cancellationToken);
        if (original is null)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryReversalTargetMissing)
                .WithData("OriginalId", originalId);
        }

        if (original.TenantId != ctx.TenantId)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryAccountTenantMismatch)
                .WithData("OriginalId", originalId);
        }

        var hasReversal = await _journalEntryRepository.HasReversalAsync(originalId, cancellationToken);
        if (hasReversal)
        {
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryReversalAlreadyExists)
                .WithData("OriginalId", originalId);
        }
    }
}
