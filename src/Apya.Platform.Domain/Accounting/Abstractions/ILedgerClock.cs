namespace Apya.Platform.Accounting.Abstractions;

using System;

/// <summary>
/// Ledger için zaman kaynağı. <see cref="DateTime.UtcNow"/> doğrudan
/// domain içinde KULLANILMAZ — determinizm, test edilebilirlik ve
/// time-travel debugging için bu abstraction zorunludur.
/// <para>
/// EF Core / Application katmanında <c>SystemLedgerClock</c> implementasyonu
/// kayıt edilir. Test'te <c>FrozenLedgerClock</c> ile sabitlenir.
/// </para>
/// </summary>
public interface ILedgerClock
{
    DateTimeOffset UtcNow { get; }
}
