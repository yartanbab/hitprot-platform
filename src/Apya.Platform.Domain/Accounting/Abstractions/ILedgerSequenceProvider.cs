namespace Apya.Platform.Accounting.Abstractions;

using System;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Tenant başına monotonic, gap-free sıra numarası üretir.
/// <para>
/// Implementasyon stratejileri (EF Core katmanında):
/// </para>
/// <list type="bullet">
///   <item>PostgreSQL: <c>CREATE SEQUENCE</c> per tenant + <c>nextval()</c> (en temiz).</item>
///   <item>SQL Server: dedicated <c>SEQUENCE</c> objesi veya <c>HiLo</c> + locking.</item>
///   <item>Generic: <c>LedgerSequenceCounter</c> tablosu (TenantId, NextValue) + <c>SELECT ... FOR UPDATE</c>.</item>
/// </list>
/// <para>
/// Bu sıra; deterministic ordering, replay/projection cursor ve audit için kritik.
/// IdempotencyKey ile karıştırılmaz: idempotency = aynı işlem 2 kez gelirse 1 kez işlenir;
/// sequence = işlemler arası total ordering verir.
/// </para>
/// </summary>
public interface ILedgerSequenceProvider
{
    /// <summary>
    /// Tenant için bir sonraki ledger sequence numarasını üretir.
    /// Aynı transaction içinde çağrılmalıdır — outer transaction abort olursa
    /// gap kalabilir; bu kabul edilebilir bir durum (gap-tolerant ordering).
    /// </summary>
    /// <param name="tenantId">Tenant identifier (host için <c>null</c>).</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>Strict-monotonic 64-bit sequence değeri.</returns>
    Task<long> NextAsync(Guid? tenantId, CancellationToken cancellationToken = default);
}
