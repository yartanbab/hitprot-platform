namespace Apya.Platform.Accounting.ReadModels;

using System;
using Apya.Platform.Accounting.ValueObjects;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

/// <summary>
/// AccountBalanceProjection — bir hesabın güncel debit/credit toplamlarını
/// ve net bakiyesini tutan read-model. <b>Source of truth DEĞİL</b>;
/// kaynak her zaman <c>JournalEntryLine</c>'lardır.
/// <para>
/// Yapılış:
/// </para>
/// <list type="bullet">
///   <item>Dispatcher (ya da projeksiyon worker'ı) JournalEntry sequence'ını
///   takip eder, her yeni entry için <see cref="Apply"/> çağrılır.</item>
///   <item>Cursor: <see cref="LastAppliedSequence"/>. Aynı sequence
///   iki kez uygulanmaz (idempotent projection).</item>
///   <item>Rebuild: bu satır silinir, sequence 0'dan tüm JournalEntry'ler replay
///   edilir; sonuç deterministic olarak aynı bakiyeyi üretir
///   (ledger deterministic'tir).</item>
/// </list>
/// <para>
/// Multi-currency tek hesapta yasaktır (Account.Currency immutable),
/// dolayısıyla projection da tek currency.
/// </para>
/// </summary>
public class AccountBalanceProjection : Entity<Guid>, IMultiTenant
{
    /// <summary>
    /// Id, doğrudan AccountId ile aynıdır — 1:1 ilişki, ayrı surrogate key
    /// gereksiz. Rebuild işlemi sırasında upsert kolaylığı sağlar.
    /// </summary>
    public virtual Guid AccountId => Id;

    public virtual Guid? TenantId { get; private set; }

    public virtual string Currency { get; private set; } = default!;

    public virtual Money TotalDebit { get; private set; } = default!;

    public virtual Money TotalCredit { get; private set; } = default!;

    public virtual NormalBalance NormalBalance { get; private set; }

    public virtual long LastAppliedSequence { get; private set; }

    public virtual DateTimeOffset LastAppliedAt { get; private set; }

    /// <summary>Optimistic concurrency için row-version (DB tarafından yönetilir).</summary>
    public virtual byte[] RowVersion { get; private set; } = Array.Empty<byte>();

    protected AccountBalanceProjection()
    {
    }

    public AccountBalanceProjection(
        Guid accountId,
        Guid? tenantId,
        string currency,
        NormalBalance normalBalance)
        : base(accountId)
    {
        TenantId = tenantId;
        Currency = Check.NotNullOrWhiteSpace(currency, nameof(currency)).ToUpperInvariant();
        NormalBalance = normalBalance;
        TotalDebit = Money.Zero(Currency);
        TotalCredit = Money.Zero(Currency);
    }

    /// <summary>
    /// Bir journal line'ı projeksiyona uygular. Aynı sequence iki kez
    /// uygulanmaz (cursor garantisi).
    /// </summary>
    public void Apply(
        long entrySequence,
        JournalDirection direction,
        Money amount,
        DateTimeOffset appliedAt)
    {
        if (entrySequence <= LastAppliedSequence)
        {
            // Idempotent — replay sırasında zaten görüldüyse skip.
            // Strict-monotonic varsayımıyla "önceki" sequence "görülmüş" demek.
            return;
        }

        if (!string.Equals(amount.Currency, Currency, StringComparison.Ordinal))
        {
            throw new BusinessException(PlatformDomainErrorCodes.MoneyCurrencyMismatch)
                .WithData("Expected", Currency)
                .WithData("Actual", amount.Currency);
        }

        if (direction == JournalDirection.Debit)
        {
            TotalDebit = TotalDebit.Add(amount);
        }
        else
        {
            TotalCredit = TotalCredit.Add(amount);
        }

        LastAppliedSequence = entrySequence;
        LastAppliedAt = appliedAt;
    }

    /// <summary>
    /// Net bakiye normal-balance yönüne göre döndürülür.
    /// Asset/Expense → Debit - Credit; Liability/Equity/Revenue → Credit - Debit.
    /// </summary>
    public Money NetBalance()
    {
        return NormalBalance == NormalBalance.Debit
            ? TotalDebit.Subtract(TotalCredit)
            : TotalCredit.Subtract(TotalDebit);
    }
}
