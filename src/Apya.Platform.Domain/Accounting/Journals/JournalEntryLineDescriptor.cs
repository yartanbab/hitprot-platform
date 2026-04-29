namespace Apya.Platform.Accounting.Journals;

using System;
using Apya.Platform.Accounting.ValueObjects;

/// <summary>
/// Construction-time DTO — JournalEntry oluşturulurken dışarıdan satır
/// kompozisyonunu taşır. Public setter'lı entity yaratmamak için kullanılır
/// (anti-anemic). EF Core ile mapping'i yoktur, persist edilmez.
/// </summary>
public sealed class JournalEntryLineDescriptor
{
    public Guid AccountId { get; }
    public JournalDirection Direction { get; }
    public Money Amount { get; }
    public string? Memo { get; }
    public Guid? CounterpartyId { get; }

    public JournalEntryLineDescriptor(
        Guid accountId,
        JournalDirection direction,
        Money amount,
        string? memo = null,
        Guid? counterpartyId = null)
    {
        if (accountId == Guid.Empty)
        {
            throw new ArgumentException("AccountId cannot be empty.", nameof(accountId));
        }
        if (amount is null)
        {
            throw new ArgumentNullException(nameof(amount));
        }
        AccountId = accountId;
        Direction = direction;
        Amount = amount;
        Memo = memo;
        CounterpartyId = counterpartyId;
    }
}
