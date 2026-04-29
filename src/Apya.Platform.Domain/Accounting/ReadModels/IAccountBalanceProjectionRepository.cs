namespace Apya.Platform.Accounting.ReadModels;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

public interface IAccountBalanceProjectionRepository : IRepository<AccountBalanceProjection, Guid>
{
    Task<AccountBalanceProjection?> FindByAccountAsync(
        Guid accountId,
        CancellationToken cancellationToken = default);

    /// <summary>Replay öncesi tenant scope'unu komple temizler — full rebuild senaryosu.</summary>
    Task ResetTenantAsync(Guid? tenantId, CancellationToken cancellationToken = default);

    /// <summary>İncremental projection için son uygulanan sequence'ı döndürür.</summary>
    Task<long> GetMaxAppliedSequenceAsync(
        Guid? tenantId,
        CancellationToken cancellationToken = default);
}
