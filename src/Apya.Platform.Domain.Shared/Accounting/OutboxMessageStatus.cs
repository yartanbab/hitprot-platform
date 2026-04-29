namespace Apya.Platform.Accounting;

/// <summary>
/// Outbox kayıtlarının yaşam döngüsü.
/// Pending → Dispatched (mutlu yol) ya da
/// Pending → Failed → Pending (retry) → Dispatched.
/// </summary>
public enum OutboxMessageStatus : byte
{
    Pending = 0,
    Dispatched = 1,
    Failed = 2,
    Abandoned = 3
}
