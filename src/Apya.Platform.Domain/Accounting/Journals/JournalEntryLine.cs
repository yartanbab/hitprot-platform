namespace Apya.Platform.Accounting.Journals;

using System;
using Apya.Platform.Accounting.Abstractions;
using Apya.Platform.Accounting.ValueObjects;
using Volo.Abp;
using Volo.Abp.Domain.Entities;
using Volo.Abp.MultiTenancy;

/// <summary>
/// JournalEntryLine — JournalEntry aggregate'inin parçası.
/// <para>
/// Tek başına aggregate root DEĞİL — yaşam döngüsü JournalEntry'nin
/// içindedir. Asla tek başına repository üzerinden değiştirilmemelidir.
/// </para>
/// <para>
/// Constructor seviyesinde tüm domain kuralları enforce edilir:
/// </para>
/// <list type="bullet">
///   <item>Amount strictly positive olmak zorunda — Debit ya da Credit
///   yön bilgisini <see cref="Direction"/> taşır, miktar değil.</item>
///   <item>Currency, parent JournalEntry currency'sine eşit olmalıdır
///   (validation parent constructor'ında yapılır).</item>
///   <item>AccountId boş olamaz; account aktif olmalı (guard kontrol eder).</item>
/// </list>
/// <para>
/// <see cref="IAppendOnly"/> implement eder — interceptor güncelleme/silme'yi
/// yakalayıp <c>AppendOnlyViolationException</c> fırlatır.
/// </para>
/// </summary>
public class JournalEntryLine : Entity<Guid>, IMultiTenant, IAppendOnly
{
    public virtual Guid? TenantId { get; private set; }

    public virtual Guid JournalEntryId { get; private set; }

    /// <summary>
    /// Aggregate içinde satır sırası (deterministic ordering).
    /// 1-based, gap-free.
    /// </summary>
    public virtual short LineNumber { get; private set; }

    public virtual Guid AccountId { get; private set; }

    public virtual JournalDirection Direction { get; private set; }

    public virtual Money Amount { get; private set; } = default!;

    public virtual string? Memo { get; private set; }

    /// <summary>
    /// Karşı taraf referansı (counterparty) — opsiyonel. Tipik olarak
    /// invoice'taki vendor/customer Id'si. Ledger çekirdeği bunun
    /// semantiğini bilmez, sadece taşır.
    /// </summary>
    public virtual Guid? CounterpartyId { get; private set; }

    /// <summary>EF Core için.</summary>
    protected JournalEntryLine()
    {
    }

    internal JournalEntryLine(
        Guid id,
        Guid? tenantId,
        Guid journalEntryId,
        short lineNumber,
        Guid accountId,
        JournalDirection direction,
        Money amount,
        string? memo,
        Guid? counterpartyId)
        : base(id)
    {
        if (journalEntryId == Guid.Empty)
        {
            throw new ArgumentException("JournalEntryId cannot be empty.", nameof(journalEntryId));
        }
        if (accountId == Guid.Empty)
        {
            throw new ArgumentException("AccountId cannot be empty.", nameof(accountId));
        }
        if (lineNumber <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(lineNumber), lineNumber,
                "LineNumber must be 1-based positive integer.");
        }
        if (amount is null)
        {
            throw new ArgumentNullException(nameof(amount));
        }
        if (!amount.IsPositive)
        {
            // Yön bilgisi Direction'da; tutar her zaman pozitif olmalı.
            throw new BusinessException(PlatformDomainErrorCodes.JournalEntryLineAmountMustBePositive)
                .WithData("Amount", amount.Amount)
                .WithData("Currency", amount.Currency);
        }

        TenantId = tenantId;
        JournalEntryId = journalEntryId;
        LineNumber = lineNumber;
        AccountId = accountId;
        Direction = direction;
        Amount = amount;
        Memo = memo?.Trim();
        CounterpartyId = counterpartyId;
    }
}
