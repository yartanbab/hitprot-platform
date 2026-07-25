using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Apya.Platform.EntityFrameworkCore;
using Apya.Platform.Documents;
using Microsoft.EntityFrameworkCore;
using Volo.Abp.Domain.Repositories.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore;

namespace Apya.Platform.Documents;

public class EfCoreDocumentRepository
    : EfCoreRepository<PlatformDbContext, Document, Guid>,
      IDocumentRepository
{
    public EfCoreDocumentRepository(
        IDbContextProvider<PlatformDbContext> dbContextProvider)
        : base(dbContextProvider)
    {
    }

    public async Task BulkMarkExpiryWarningSentAsync(
        IEnumerable<Guid> documentIds,
        CancellationToken cancellationToken = default)
    {
        var db = await GetDbContextAsync();
        var ids = documentIds.ToList();
        await db.Documents
            .Where(d => ids.Contains(d.Id))
            .ExecuteUpdateAsync(
                s => s.SetProperty(d => d.IsExpiryWarningSent, true),
                cancellationToken);
    }
}
