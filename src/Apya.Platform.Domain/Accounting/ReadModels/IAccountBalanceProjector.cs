namespace Apya.Platform.Accounting.ReadModels;

using System;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Projection orchestration — domain'de sözleşme, EF Core/Application
/// katmanında implementasyon. Worker tarafından periyodik çağrılır.
/// </summary>
public interface IAccountBalanceProjector
{
    /// <summary>
    /// LastAppliedSequence'tan itibaren incremental olarak yeni
    /// journal entry'leri projection'a uygular.
    /// </summary>
    Task<int> ProjectIncrementalAsync(
        Guid? tenantId,
        int batchSize = 500,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Tüm tenant projection'ını sıfırdan rebuild eder.
    /// Ledger deterministic olduğundan sonuç her zaman aynı bakiyeyi üretir.
    /// </summary>
    Task RebuildAsync(
        Guid? tenantId,
        CancellationToken cancellationToken = default);
}
