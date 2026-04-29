namespace Apya.Platform.Accounting;

/// <summary>
/// Bir hesabın normal bakiye yönü.
/// Posting sonrası bakiye hesabı normal balance ile aynı yönde ise pozitif kabul edilir.
/// </summary>
public enum NormalBalance : byte
{
    Debit = 1,
    Credit = 2
}
