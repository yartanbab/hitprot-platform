namespace Apya.Platform.Accounting.Accounts;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Volo.Abp.Domain.Repositories;

public interface IAccountRepository : IRepository<Account, Guid>
{
    Task<Account?> FindByCodeAsync(
        Guid? tenantId,
        string code,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Bir set Id'yi tek seferde getirir. Guard çağrısı sırasında
    /// N+1 önlemek için kullanılır.
    /// </summary>
    Task<IReadOnlyDictionary<Guid, Account>> GetManyMapAsync(
        IReadOnlyCollection<Guid> ids,
        CancellationToken cancellationToken = default);
}
