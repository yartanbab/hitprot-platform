namespace Apya.Platform.Accounting.Events;

using System;

/// <summary>
/// Distributed event içinde taşınan satır verisi. POCO.
/// </summary>
public sealed class JournalEntryLineEto
{
    public Guid LineId { get; }
    public short LineNumber { get; }
    public Guid AccountId { get; }
    public JournalDirection Direction { get; }
    public decimal Amount { get; }
    public string Currency { get; }
    public string? Memo { get; }
    public Guid? CounterpartyId { get; }

    public JournalEntryLineEto(
        Guid LineId,
        short LineNumber,
        Guid AccountId,
        JournalDirection Direction,
        decimal Amount,
        string Currency,
        string? Memo,
        Guid? CounterpartyId)
    {
        this.LineId = LineId;
        this.LineNumber = LineNumber;
        this.AccountId = AccountId;
        this.Direction = Direction;
        this.Amount = Amount;
        this.Currency = Currency;
        this.Memo = Memo;
        this.CounterpartyId = CounterpartyId;
    }
}
