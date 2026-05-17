using System;
using Volo.Abp.Domain.Entities;

namespace Apya.Platform.FxRevaluations;

/// <summary>APYA-138: Bir değerleme snapshot'ının kasa-bazlı satırı.</summary>
public class FxRevaluationLine : Entity<Guid>
{
    public Guid SnapshotId { get; set; }
    public Guid CashAccountId { get; set; }
    public string CashAccountName { get; set; } = null!;
    public string Currency { get; set; } = null!;
    public decimal Balance { get; set; }
    public decimal? Rate { get; set; }
    public decimal TryValue { get; set; }

    protected FxRevaluationLine() { }

    public FxRevaluationLine(
        Guid id, Guid cashAccountId, string cashAccountName,
        string currency, decimal balance, decimal? rate, decimal tryValue) : base(id)
    {
        CashAccountId = cashAccountId;
        CashAccountName = cashAccountName;
        Currency = currency;
        Balance = balance;
        Rate = rate;
        TryValue = tryValue;
    }
}
